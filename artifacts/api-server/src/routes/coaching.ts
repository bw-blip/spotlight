import { Router, Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, unlink, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
const execFileAsync = promisify(execFile);

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment before trying again." },
});

const scoreBodySchema = z.object({
  audioBase64: z.string().optional().default(""),
  videoBase64: z.string().optional().default(""),
  mediaType: z.enum(["audio", "video"]).optional().default("audio"),
  category: z.string().min(1).max(50),
  grade: z.string().max(50).optional(),
  exerciseName: z.string().min(1).max(200),
  exercisePrompt: z.string().min(1).max(1000),
});

function validateBody(req: Request, res: Response, next: NextFunction) {
  const result = scoreBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    return;
  }
  req.body = result.data;
  next();
}

async function probeVideoDuration(videoPath: string): Promise<number> {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      videoPath,
    ], { timeout: 8000 });
    const duration = parseFloat(stdout.trim());
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  } catch {
    return 0;
  }
}

async function extractVideoFrames(videoBase64: string, numFrames = 4): Promise<string[]> {
  const tmpDir = await mkdtemp(join(tmpdir(), "spotlight-frames-"));
  const videoPath = join(tmpDir, "input.mp4");

  try {
    const buffer = Buffer.from(videoBase64, "base64");
    await writeFile(videoPath, buffer);

    // Probe the actual clip duration so frames are sampled across the full recording
    const duration = await probeVideoDuration(videoPath);

    const frames: string[] = [];

    if (duration > 0) {
      // Sample at evenly distributed timestamps: skip first/last 5% to avoid
      // blank or motion-blurred bookend frames
      const margin = Math.min(duration * 0.05, 0.5);
      const usable = duration - margin * 2;
      const step = usable / (numFrames - 1 || 1);

      for (let i = 0; i < numFrames; i++) {
        const timestamp = margin + i * step;
        const framePath = join(tmpDir, `frame${String(i + 1).padStart(2, "0")}.jpg`);
        try {
          await execFileAsync("ffmpeg", [
            "-ss", String(timestamp),
            "-i", videoPath,
            "-vframes", "1",
            "-vf", "scale=480:-1",
            "-q:v", "3",
            "-y",
            framePath,
          ], { timeout: 8000 });
          const frameData = await readFile(framePath);
          frames.push(frameData.toString("base64"));
          await unlink(framePath).catch(() => {});
        } catch {
          // skip this timestamp on failure
        }
      }
    } else {
      // Duration unknown — fall back to evenly-spaced frame-number sampling
      const framePattern = join(tmpDir, "frame%02d.jpg");
      await execFileAsync("ffmpeg", [
        "-i", videoPath,
        "-vf", `select=not(mod(n\\,${Math.max(1, Math.floor(30 / numFrames))})),scale=480:-1`,
        "-vframes", String(numFrames),
        "-q:v", "3",
        "-f", "image2",
        framePattern,
      ], { timeout: 15000 });

      for (let i = 1; i <= numFrames; i++) {
        const framePath = join(tmpDir, `frame${String(i).padStart(2, "0")}.jpg`);
        try {
          const frameData = await readFile(framePath);
          frames.push(frameData.toString("base64"));
          await unlink(framePath).catch(() => {});
        } catch {
          // frame may not exist if video is shorter than expected
        }
      }
    }

    return frames;
  } catch (err) {
    console.warn("[coaching] Frame extraction failed:", err instanceof Error ? err.message : err);
    return [];
  } finally {
    try {
      await unlink(videoPath).catch(() => {});
      const { rmdir } = await import("fs/promises");
      await rmdir(tmpDir).catch(() => {});
    } catch {
      // ignore cleanup errors
    }
  }
}

router.post("/score", limiter, validateBody, async (req: Request, res: Response) => {
  const { audioBase64, videoBase64, mediaType, category, grade, exerciseName, exercisePrompt } = req.body as z.infer<typeof scoreBodySchema>;

  let transcript = "";

  const useVideo = mediaType === "video" && videoBase64.length > 200;
  const useAudio = !useVideo && audioBase64.length > 200;

  if (useVideo || useAudio) {
    try {
      const rawBase64 = useVideo ? videoBase64 : audioBase64;
      const mimeType = useVideo ? "video/mp4" : "audio/mp4";
      const fileName = useVideo ? "recording.mp4" : "recording.m4a";

      const buffer = Buffer.from(rawBase64, "base64");
      const blob = new Blob([buffer], { type: mimeType });
      const mediaFile = new File([blob], fileName, { type: mimeType });

      const transcription = await openai.audio.transcriptions.create({
        file: mediaFile as Parameters<
          typeof openai.audio.transcriptions.create
        >[0]["file"],
        model: "gpt-4o-mini-transcribe",
        response_format: "json",
      });
      transcript = transcription.text ?? "";
    } catch (transcriptErr) {
      console.warn("[coaching] Transcription failed:", transcriptErr instanceof Error ? transcriptErr.message : transcriptErr);
    }
  }

  // Extract video frames for visual analysis when a video is provided
  let videoFrames: string[] = [];
  if (useVideo) {
    videoFrames = await extractVideoFrames(videoBase64, 4);
    if (videoFrames.length > 0) {
      console.info(`[coaching] Extracted ${videoFrames.length} frames for visual analysis`);
    }
  }

  const gradeStr = grade ?? "middle school student";
  const transcriptNote = transcript
    ? `The student said/performed: "${transcript.slice(0, 800)}"`
    : "No audio transcript available — please give encouraging, contextual feedback.";

  const hasVisualData = videoFrames.length > 0;

  const systemPrompt = hasVisualData
    ? `You are an encouraging performing arts coach for a ${gradeStr}. Score their ${category} performance on a scale of 1-10 appropriate for their age and grade level — do NOT compare to professional performers. You have been given frames from their video recording showing their physical performance. Analyze their posture, gestures, body language, facial expressions, and stage presence from the visual frames. Be warm, specific, and motivating. Reference specific physical observations in your tips (e.g., posture, arm placement, facial expression, movement quality). Return ONLY valid JSON with no markdown, no code blocks.`
    : `You are an encouraging performing arts coach for a ${gradeStr}. Score their ${category} performance on a scale of 1-10 appropriate for their age and grade level — do NOT compare to professional performers. Be warm, specific, and motivating. Return ONLY valid JSON with no markdown, no code blocks.`;

  const visualInstruction = hasVisualData
    ? `\n\nIMPORTANT: Reference specific visual observations from the frames in your tips — mention posture, gesture, body language, facial expression, or movement details you can actually see. For example: "Your arms were crossed during the emotional moment — try opening them to show vulnerability" or "Your posture was strong, but try relaxing your shoulders to look more natural."`
    : "";

  const userPromptText = `Exercise: "${exerciseName}".\nThe exercise asks: ${exercisePrompt}.\n${transcriptNote}${visualInstruction}\n\nReturn JSON: {"score": <number 1-10>, "tips": ["specific tip 1", "specific tip 2", "encouraging tip 3"]}`;

  try {
    type ContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } };

    const userContent: ContentPart[] = hasVisualData
      ? [
          ...videoFrames.map<ContentPart>((frameBase64) => ({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${frameBase64}`,
              detail: "low",
            },
          })),
          { type: "text", text: userPromptText },
        ]
      : [{ type: "text", text: userPromptText }];

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 400,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    let parsed: { score: number; tips: string[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[coaching] Failed to parse AI response JSON:", content);
      res.status(502).json({ error: "AI returned an unexpected response format. Please try again." });
      return;
    }

    res.json({
      score: Math.min(10, Math.max(1, Number(parsed.score) || 5)),
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : ["Great effort!", "Keep practicing!", "Every session makes you stronger!"],
    });
  } catch (err) {
    console.error("[coaching] Scoring failed:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Scoring service unavailable. Please check your connection and try again." });
  }
});

const monologueBodySchema = z.object({
  audioBase64: z.string().optional().default(""),
  script: z.string().min(1).max(5000),
  title: z.string().min(1).max(200),
  character: z.string().max(100).optional().default(""),
  grade: z.string().max(50).optional(),
});

function validateMonologueBody(req: Request, res: Response, next: NextFunction) {
  const result = monologueBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    return;
  }
  req.body = result.data;
  next();
}

router.post("/monologue", limiter, validateMonologueBody, async (req: Request, res: Response) => {
  const { audioBase64, script, title, character, grade } = req.body as z.infer<typeof monologueBodySchema>;

  let transcript = "";

  if (audioBase64.length > 200) {
    try {
      const buffer = Buffer.from(audioBase64, "base64");
      const blob = new Blob([buffer], { type: "audio/mp4" });
      const mediaFile = new File([blob], "recording.m4a", { type: "audio/mp4" });

      const transcription = await openai.audio.transcriptions.create({
        file: mediaFile as Parameters<typeof openai.audio.transcriptions.create>[0]["file"],
        model: "gpt-4o-mini-transcribe",
        response_format: "json",
      });
      transcript = transcription.text ?? "";
    } catch (transcriptErr) {
      console.warn("[coaching/monologue] Transcription failed:", transcriptErr instanceof Error ? transcriptErr.message : transcriptErr);
    }
  }

  const gradeStr = grade ?? "middle school student";
  const characterStr = character ? ` playing ${character}` : "";
  const transcriptNote = transcript
    ? `The student performed: "${transcript}"`
    : "No audio transcript available — please give encouraging, contextual feedback based on the script alone.";

  const monologueResponseSchema = z.object({
    overallScore: z.number(),
    accuracyScore: z.number(),
    expressionScore: z.number(),
    pacingScore: z.number(),
    emotionScore: z.number(),
    tips: z.array(z.string()),
    sceneFeedback: z.array(z.object({ scene: z.string(), feedback: z.string() })),
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 900,
      messages: [
        {
          role: "system",
          content: `You are an encouraging performing arts coach for a ${gradeStr}${characterStr}. Evaluate their monologue performance for a school audition. Be warm, specific, and motivating. Score on a 1-10 scale appropriate for their age — do NOT compare to professional performers. Return ONLY valid JSON with no markdown, no code blocks.`,
        },
        {
          role: "user",
          content: `Monologue title: "${title}"${character ? `, character: "${character}"` : ""}.\n\nOriginal script (full text):\n"""${script}"""\n\n${transcriptNote}\n\nReturn JSON:\n{"overallScore": <1-10>, "accuracyScore": <1-10>, "expressionScore": <1-10>, "pacingScore": <1-10>, "emotionScore": <1-10>, "tips": ["specific tip 1", "specific tip 2", "encouraging tip 3"], "sceneFeedback": [{"scene": "<brief scene label>", "feedback": "<1-2 sentence specific feedback>"}, {"scene": "<brief scene label>", "feedback": "<1-2 sentence specific feedback>"}, {"scene": "<brief scene label>", "feedback": "<1-2 sentence specific feedback>"}]}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();

    let rawParsed: unknown;
    try {
      rawParsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[coaching/monologue] Failed to parse AI response JSON:", content);
      res.status(502).json({ error: "AI returned an unexpected response format. Please try again." });
      return;
    }

    const parseResult = monologueResponseSchema.safeParse(rawParsed);
    if (!parseResult.success) {
      console.error("[coaching/monologue] AI response failed schema validation:", parseResult.error.flatten());
      res.status(502).json({ error: "AI returned an unexpected response format. Please try again." });
      return;
    }

    const parsed = parseResult.data;
    const clamp = (n: number) => Math.min(10, Math.max(1, Number(n) || 5));

    res.json({
      overallScore: clamp(parsed.overallScore),
      accuracyScore: clamp(parsed.accuracyScore),
      expressionScore: clamp(parsed.expressionScore),
      pacingScore: clamp(parsed.pacingScore),
      emotionScore: clamp(parsed.emotionScore),
      tips: parsed.tips.slice(0, 3).length > 0 ? parsed.tips.slice(0, 3) : ["Great effort!", "Keep practicing!", "Every run-through makes you stronger!"],
      sceneFeedback: parsed.sceneFeedback.slice(0, 5),
    });
  } catch (err) {
    console.error("[coaching/monologue] Failed:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Monologue coaching service unavailable. Please check your connection and try again." });
  }
});

export default router;
