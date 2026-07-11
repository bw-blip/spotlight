export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  assessmentPrompt: string;
  assessmentInstructions: string;
}

export interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  instructions: string;
  duration: number;
  difficulty: 1 | 2 | 3;
  assessmentPrompt: string;
}

export interface Warmup {
  id: string;
  name: string;
  description: string;
  type: "vocal" | "physical" | "mental";
  duration: number;
  instructions: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "acting",
    name: "Acting",
    icon: "film-outline",
    color: "#FF6B6B",
    description: "Bring characters to life with truth and emotion",
    assessmentPrompt:
      "React as if you just won the lead role in the school play — be surprised, emotional, and in character!",
    assessmentInstructions:
      "Pretend you just received amazing news. React with full emotion for 30 seconds.",
  },
  {
    id: "singing",
    name: "Singing",
    icon: "musical-notes-outline",
    color: "#A78BFA",
    description: "Express your story through song and melody",
    assessmentPrompt:
      "Sing any verse of a song you love — give it your full voice and expression!",
    assessmentInstructions:
      "Sing a verse of any song you know. Focus on expression and enjoyment.",
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: "mic-outline",
    color: "#34D399",
    description: "Speak with clarity, power, and intention",
    assessmentPrompt:
      'Say this sentence 3 times clearly: "She sells seashells by the seashore on a stormy summer Saturday."',
    assessmentInstructions:
      'Repeat this tongue twister 3 times: "She sells seashells by the seashore on a stormy summer Saturday."',
  },
  {
    id: "movement",
    name: "Movement",
    icon: "body-outline",
    color: "#FB923C",
    description: "Command the stage with presence and physicality",
    assessmentPrompt:
      "Walk across the room as if you own the stage — confident, purposeful, and magnetic!",
    assessmentInstructions:
      "Stand up and walk across the room twice as your most confident self. Describe what you did.",
  },
  {
    id: "confidence",
    name: "Confidence",
    icon: "star-outline",
    color: "#F472B6",
    description: "Own your power and believe in your talent",
    assessmentPrompt:
      "Tell me in 30 seconds why YOU deserve the lead role in your school play!",
    assessmentInstructions:
      "Speak for 30 seconds about why you deserve the lead role. Be bold and confident!",
  },
];

export const EXERCISES: Exercise[] = [
  // ─── ACTING (40 exercises) ───────────────────────────────────────
  {
    id: "act_mirror",
    categoryId: "acting",
    name: "Emotion Mirror",
    description: "Match emotions in real-time",
    instructions:
      "Stand in front of a mirror. Call out 5 emotions (happy, surprised, scared, angry, sad) and fully express each one — face AND body. Hold each for 10 seconds.",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Show me all 5 emotions in sequence — fully commit!",
  },
  {
    id: "act_gibberish",
    categoryId: "acting",
    name: "Gibberish Monologue",
    description: "Emotion without words",
    instructions:
      "Choose a strong emotion. Tell a story in made-up gibberish — your voice and body must carry all the meaning. No real words allowed.",
    duration: 3,
    difficulty: 2,
    assessmentPrompt: "Tell me a dramatic story in gibberish for 30 seconds.",
  },
  {
    id: "act_hotspot",
    categoryId: "acting",
    name: "Hot Seat",
    description: "Become your character",
    instructions:
      "Think of a character you love. Sit and answer AS that character: Where do you live? What do you want? What scares you? What makes you laugh?",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Answer as your chosen character: Where do you live? What do you want most?",
  },
  {
    id: "act_status",
    categoryId: "acting",
    name: "Status Game",
    description: "Master status through physicality",
    instructions:
      "Walk as someone with very LOW status (nervous, small). Then shift to VERY HIGH status (confident, expansive). Notice every difference in your body.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Show me low-status walking, then high-status. Describe the physical differences.",
  },
  {
    id: "act_objective",
    categoryId: "acting",
    name: "Objective Work",
    description: "Play your goal, not your emotion",
    instructions:
      "Choose an objective: 'convince someone to give you extra allowance.' Say the same sentence 5 times, changing your tactic each time to really win them over.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Try to convince me to give you extra allowance using 3 different tactics.",
  },
  {
    id: "act_moment_before",
    categoryId: "acting",
    name: "The Moment Before",
    description: "What just happened?",
    instructions:
      "Before your first line, create what your character did immediately before entering. Spend 30 seconds living that backstory, then say your first line.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Tell me your character's backstory, then deliver their opening line.",
  },
  {
    id: "act_sensory",
    categoryId: "acting",
    name: "Sensory World",
    description: "Build a real imaginary place",
    instructions:
      "Close your eyes. Imagine a beach. Describe aloud everything you see, hear, smell, feel, and taste. Make it completely real.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Describe being on a beach using all 5 senses as vividly as possible.",
  },
  {
    id: "act_intention_switch",
    categoryId: "acting",
    name: "Intention Switch",
    description: "Same words, opposite meaning",
    instructions:
      'Say "I thought you\'d be here" four ways: with love, with anger, with fear, with sarcasm. Fully commit — each should feel completely different.',
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      'Say "I thought you\'d be here" with love, anger, fear, and sarcasm.',
  },
  {
    id: "act_monologue",
    categoryId: "acting",
    name: "Monologue Sprint",
    description: "Speed through a monologue",
    instructions:
      "Choose any monologue. Say it as fast as possible (every word clear). Then say it in slow motion, finding every emotion. Contrast is the teacher.",
    duration: 6,
    difficulty: 2,
    assessmentPrompt: "Perform a monologue — really commit emotionally.",
  },
  {
    id: "act_animal",
    categoryId: "acting",
    name: "Animal Basis",
    description: "Find your animal",
    instructions:
      "Choose an animal. Move exactly like it for 2 minutes — posture, movement, sound. Then slowly transform into a human who carries that animal's essence.",
    duration: 7,
    difficulty: 3,
    assessmentPrompt:
      "Move like your chosen animal, then transform it into a human character.",
  },
  {
    id: "act_scene_study",
    categoryId: "acting",
    name: "Scene Study",
    description: "Work through a scene beat by beat",
    instructions:
      "Choose any short scene (even from a movie or book). Identify 3 emotional 'beats' or shifts. Perform the scene, pausing at each beat to name what changed.",
    duration: 8,
    difficulty: 3,
    assessmentPrompt:
      "Perform a short scene and name 3 emotional beats where something shifts.",
  },
  {
    id: "act_yes_and",
    categoryId: "acting",
    name: "Yes, And!",
    description: "Accept and build — core improv rule",
    instructions:
      "Improvise a scene with yourself: make a statement, then say 'Yes, and...' and add to it. Keep going for 2 minutes, never blocking or denying what you established.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt:
      "Do a 2-minute solo improv using 'Yes, And' — keep building on each idea.",
  },
  {
    id: "act_magic_if",
    categoryId: "acting",
    name: "Stanislavski's Magic If",
    description: "'What if I were in this situation?'",
    instructions:
      "Choose a dramatic situation you've never experienced (a fire alarm, winning a championship, meeting your hero). Ask 'What if this were real for me?' and physically respond as yourself.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "React to 'What if you just heard you won a full scholarship?' with full authenticity.",
  },
  {
    id: "act_emotional_truth",
    categoryId: "acting",
    name: "Emotional Truth",
    description: "Real feelings on stage",
    instructions:
      "Think of a time you felt genuinely happy about something. Sit with that memory for 30 seconds and let it wash over you. Then speak 5 sentences AS YOURSELF about it, not acting — just feeling.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Share a real memory that made you genuinely happy — just be yourself, no performing.",
  },
  {
    id: "act_super_objective",
    categoryId: "acting",
    name: "Super Objective",
    description: "The character's deepest want",
    instructions:
      "Choose any character. Ask: 'What does this person want more than anything in life?' Write it as a simple sentence starting with 'To...' Then improvise 2 minutes of life driven by that single want.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt:
      "State your character's super objective and improvise a scene driven by it.",
  },
  {
    id: "act_relationship",
    categoryId: "acting",
    name: "Relationship Mapping",
    description: "Who is this person to you?",
    instructions:
      "Imagine a character is your best friend. Now imagine the same character is your enemy. Speak the same sentence to each version — feel how your body, voice, and eye contact change completely.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Say 'You're the only one I can trust' to a best friend, then an enemy.",
  },
  {
    id: "act_playing_opposite",
    categoryId: "acting",
    name: "Playing Against Type",
    description: "Cast yourself against character",
    instructions:
      "Think of a character who is the opposite of you. Play them completely. If you're shy, be brazen. If you're loud, be whisper-quiet and dangerous. Commit to the transformation.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Play a character who is your complete opposite. What did you discover?",
  },
  {
    id: "act_inner_voice",
    categoryId: "acting",
    name: "Inner Voice",
    description: "Speaking subconscious thoughts",
    instructions:
      "Read any sentence, then immediately say aloud what you think the character is ACTUALLY thinking underneath those words. The inner voice often contradicts the spoken word.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt:
      "Say 'I'm fine' out loud, then say the character's true inner thought.",
  },
  {
    id: "act_tempo_rhythm",
    categoryId: "acting",
    name: "Tempo & Rhythm",
    description: "Vary the pace of your scene",
    instructions:
      "Perform a speech or monologue at 3 very different tempos. Which one serves the story best? Notice how tempo creates different emotions for the audience.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Perform a speech at slow, medium, and very fast tempo. Describe the difference.",
  },
  {
    id: "act_subtext",
    categoryId: "acting",
    name: "Subtext Scene",
    description: "Say one thing, mean another",
    instructions:
      "Two characters love each other but are pretending to talk about the weather. Script: 'Nice weather today.' 'It really is.' 'I hope it lasts.' Perform it as if it's the most romantic conversation in history.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      "Perform a mundane conversation as if it's secretly about love or loss.",
  },
  {
    id: "act_relaxation",
    categoryId: "acting",
    name: "Stage Relaxation",
    description: "Tension-free performance state",
    instructions:
      "Lie on the floor. Breathe slowly. Scan your body for tension — release your jaw, shoulders, hands, and feet. After 2 minutes, stand up and notice how much more present you feel. Perform from this place.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt:
      "After relaxing your whole body, speak 5 sentences from that calm, open state.",
  },
  {
    id: "act_imagination",
    categoryId: "acting",
    name: "Imagination Exercise",
    description: "Create a vivid fantasy",
    instructions:
      "Imagine a completely invented world — what does the sky look like? Who lives there? What do they want? Spend 3 minutes inhabiting this world physically and verbally.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Describe an imaginary world in vivid detail — make me see it.",
  },
  {
    id: "act_transformation",
    categoryId: "acting",
    name: "Character Transformation",
    description: "Shift from one character to another",
    instructions:
      "Begin as Character A (timid, nervous). Midway through a monologue, shift completely into Character B (bold, fearless). The transition should feel like watching someone change before your eyes.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Transform from a timid character to a bold one mid-speech.",
  },
  {
    id: "act_storytelling",
    categoryId: "acting",
    name: "Storytelling Arc",
    description: "Beginning, middle, and emotional end",
    instructions:
      "Tell a 2-minute story with a clear arc: a character wants something (beginning), faces an obstacle (middle), and either gets it or doesn't (end). Use your full voice and physicality.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Tell a 2-minute story with a clear beginning, middle, and end.",
  },
  {
    id: "act_physicalization",
    categoryId: "acting",
    name: "Physical Character",
    description: "How does your character move through life?",
    instructions:
      "Create a character defined entirely by 3 physical traits: a specific walk, a recurring gesture, and an unusual posture. Sustain all three for 3 minutes while improvising who this person is.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Show me a character defined by 3 specific physical traits.",
  },
  {
    id: "act_given_circumstances",
    categoryId: "acting",
    name: "Given Circumstances",
    description: "Who, what, where, why, when",
    instructions:
      "Map out a scene's given circumstances: Who are you? Who are you talking to? Where are you? What time is it? What just happened? What do you want? Then improvise the scene with ALL of that alive.",
    duration: 6,
    difficulty: 2,
    assessmentPrompt:
      "Improvise a scene after mapping out all 5 given circumstances.",
  },
  {
    id: "act_concentration",
    categoryId: "acting",
    name: "Focus Through Distraction",
    description: "Maintain concentration under pressure",
    instructions:
      "Perform a speech or scene. While performing, make noise, pace, or introduce imaginary distractions — and keep performing with full commitment regardless.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Perform a speech while I (imaginary) make distracting noises. Stay in the scene!",
  },
  {
    id: "act_playing_action",
    categoryId: "acting",
    name: "Playing an Action",
    description: "Use verbs, not emotions",
    instructions:
      "Actors play ACTIONS, not emotions. Choose a scene and assign a physical verb to your character (to seduce, to wound, to comfort, to warn). Perform the scene DOING that verb to your imaginary scene partner.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Perform a scene using the action 'to warn' — not just talking, but truly warning.",
  },
  {
    id: "act_improv_emotion",
    categoryId: "acting",
    name: "Emotion Roulette",
    description: "Change emotion every 30 seconds",
    instructions:
      "Deliver a monologue but switch to a new emotion every 30 seconds: joy → grief → rage → terror → love. No warning. No transition. Just switch and commit.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      "Perform a monologue switching emotions every 30 seconds — commit fully to each.",
  },
  {
    id: "act_fourth_wall",
    categoryId: "acting",
    name: "Breaking the Fourth Wall",
    description: "Direct audience address",
    instructions:
      "Choose a moment when your character talks directly to the audience — interrupting the scene to share a secret, a joke, or an observation. Practice making this feel bold and intentional, not like a mistake.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      "Step out of your scene and talk directly to me (the audience) for 30 seconds.",
  },
  {
    id: "act_cold_reading",
    categoryId: "acting",
    name: "Cold Reading",
    description: "Perform text you've never seen before",
    instructions:
      "Find any unfamiliar paragraph — a news article, a recipe, an instruction manual. Read it aloud as if it's the most dramatic scene ever written. Find the character, the stakes, the emotion.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      "Read this as if it's a dramatic monologue: 'To boil water, fill a pot...' — make it thrilling.",
  },
  {
    id: "act_scene_restart",
    categoryId: "acting",
    name: "The Restart",
    description: "5 completely different ways",
    instructions:
      "Take a 2-line exchange. Perform it 5 times: (1) as a comedy, (2) as a horror film, (3) as a fairy tale, (4) as a silent film (exaggerated), (5) your authentic interpretation.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt:
      "Perform 'Hello, friend.' / 'Hi, it's been a while.' in 5 completely different genres.",
  },
  {
    id: "act_villain",
    categoryId: "acting",
    name: "Playing the Villain",
    description: "Exploring moral complexity",
    instructions:
      "Great villains don't think they're evil — they think they're RIGHT. Choose a villain. Argue their case as if they're the hero of the story. Find their logic and justify their actions.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Argue why your villain is actually the hero. Make me almost agree with them.",
  },
  {
    id: "act_romantic_scene",
    categoryId: "acting",
    name: "Vulnerable Moment",
    description: "Tender, open acting",
    instructions:
      "Vulnerability is a superpower on stage. Speak a letter to someone you care about — make it genuine, specific, and personal. Don't perform. Just mean every word.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Speak a heartfelt letter to someone important to you — real and specific.",
  },
  {
    id: "act_comedic_timing",
    categoryId: "acting",
    name: "Comic Timing",
    description: "The pause before the punchline",
    instructions:
      "Tell 3 short jokes or funny stories. For each one, practice the exact placement of the pause before the punchline. One beat too early or late kills comedy. Find the perfect moment.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Tell a short joke and nail the timing — especially the pause before the punchline.",
  },
  {
    id: "act_physical_comedy",
    categoryId: "acting",
    name: "Physical Comedy",
    description: "Timing and physicality",
    instructions:
      "Physical comedy is about contrast — big and small, fast and slow, expected and unexpected. Practice a double-take, a slow burn, and a pratfall (safely). Then combine all 3 in one scene.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Show me a double-take, a slow burn reaction, and one moment of physical comedy.",
  },
  {
    id: "act_monologue_shakespeare",
    categoryId: "acting",
    name: "Shakespeare Monologue",
    description: "Classic text with modern truth",
    instructions:
      "Choose any Shakespeare speech (even just 4-6 lines). First, translate it into modern English. Then perform the original, but carry your modern understanding. Find the real human underneath the old words.",
    duration: 7,
    difficulty: 3,
    assessmentPrompt:
      "Translate a Shakespeare line to modern English, then perform the original with that understanding.",
  },
  {
    id: "act_self_tape",
    categoryId: "acting",
    name: "Self-Tape Technique",
    description: "Acting for the camera",
    instructions:
      "Record yourself performing a monologue or short scene as if for a film audition. Keep your eye line just above the camera. Let your thoughts live on your face. Stillness is power on camera.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Perform a short piece as if for a camera audition — still, present, and truthful.",
  },
  {
    id: "act_connection",
    categoryId: "acting",
    name: "True Connection",
    description: "Really listening to your partner",
    instructions:
      "Acting is reacting. Listen to an imaginary scene partner saying something upsetting to you. Let it land. Let it affect you before you respond. The pause between listening and responding is where the magic lives.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt:
      "Listen to an imaginary partner say something hurtful. Let it affect you, then respond.",
  },
  {
    id: "act_text_analysis",
    categoryId: "acting",
    name: "Text Analysis",
    description: "Mining the script for clues",
    instructions:
      "Take any 4 lines of dialogue. Answer for each: What does the character literally say? What do they actually mean? What do they want the other person to DO? What are they afraid to say?",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Analyze 4 lines: what's said, what's meant, what's wanted, what's feared.",
  },
  {
    id: "act_audition_piece",
    categoryId: "acting",
    name: "Polish Your Audition Piece",
    description: "The full performance",
    instructions:
      "Perform your actual audition piece from start to finish — slate your name first, perform, then take a bow. Do it as if it's the real audition. No stopping, no correcting. This is a performance.",
    duration: 8,
    difficulty: 3,
    assessmentPrompt:
      "Perform your audition piece from start to finish with full commitment.",
  },

  // ─── SINGING (40 exercises) ───────────────────────────────────────
  {
    id: "sing_lip_trills",
    categoryId: "singing",
    name: "Lip Trill Scales",
    description: "Warm up your whole voice",
    instructions:
      "Relax your lips completely. Blow air through them to create a motorboat sound. On this sound, glide up and down through your range. Do 5 times.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Do lip trill scales up and down your range 5 times.",
  },
  {
    id: "sing_sirens",
    categoryId: "singing",
    name: "Siren Glides",
    description: "Connect your full range",
    instructions:
      "Say 'weeee' and glide from your lowest to highest note without stopping. Like a siren. Do 5 glides up AND down. Keep the sound consistent.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Sing siren glides — smooth, continuous, low to high and back.",
  },
  {
    id: "sing_vowels",
    categoryId: "singing",
    name: "Pure Vowel Practice",
    description: "Shape your sound clearly",
    instructions:
      "On one comfortable note, sing AY — EE — AH — OH — OO slowly. Feel each vowel change your mouth shape. Repeat on 5 different notes, going higher.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing AY-EE-AH-OH-OO on 3 different notes. Make each vowel pure.",
  },
  {
    id: "sing_dynamics",
    categoryId: "singing",
    name: "Dynamic Journey",
    description: "Piano to fortissimo",
    instructions:
      "Choose any phrase. Sing it at a tiny whisper, then medium, then full power. Keep the same pitch and tone quality at every volume.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing a phrase soft → medium → full volume.",
  },
  {
    id: "sing_resonance",
    categoryId: "singing",
    name: "Resonance Hum",
    description: "Feel where your voice lives",
    instructions:
      "Hum 'mmmm' on a comfortable note. Notice vibrations in your lips, nose, chest. Try shifting the feeling between face and chest.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Hum and describe where you feel the vibrations.",
  },
  {
    id: "sing_phrase",
    categoryId: "singing",
    name: "Phrase Shaping",
    description: "Tell a story with dynamics",
    instructions:
      "Pick a song phrase. Sing with crescendo (louder) first half, decrescendo (softer) second half. Then reverse. Each version should feel like a different story.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a phrase with a crescendo, then decrescendo.",
  },
  {
    id: "sing_text",
    categoryId: "singing",
    name: "Lyric Intention",
    description: "Mean every word",
    instructions:
      "Speak a song verse as a monologue — really mean every word. Then sing it with the same meaning. Notice how singing with intention transforms your voice.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt: "Speak a song verse dramatically, then sing it with the same emotion.",
  },
  {
    id: "sing_belt",
    categoryId: "singing",
    name: "Belt Practice",
    description: "Find your powerful voice",
    instructions:
      "On 'nyah' (like you're teasing), sing up a major scale from middle range. This activates your mix/belt voice. Keep the bright, forward quality even on high notes.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing 'nyah' up a scale — find the bright, powerful sound!",
  },
  {
    id: "sing_sustain",
    categoryId: "singing",
    name: "Breath Sustain",
    description: "Maximize your breath",
    instructions:
      "Take a full breath, then sing 'ahh' on one note as long as you can. Count the seconds. Rest 30 seconds. Do 3 times. Try to improve your time.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing one sustained note as long as you can. How many seconds?",
  },
  {
    id: "sing_dramatic",
    categoryId: "singing",
    name: "Dramatic Performance",
    description: "Full commitment to a song",
    instructions:
      "Choose a song that moves you. Sing it with your entire body and soul — face, gesture, movement. Forget perfect and focus on feeling every word.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a song with FULL dramatic commitment — go all in!",
  },
  {
    id: "sing_scale_major",
    categoryId: "singing",
    name: "Major Scale Singing",
    description: "Do-Re-Mi in your voice",
    instructions:
      "Sing a major scale (Do-Re-Mi-Fa-Sol-La-Ti-Do) on the syllable 'mah'. Go up 5 keys from your starting note. Each scale, focus on smooth, even tone.",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Sing a major scale on 'mah' starting on 3 different notes.",
  },
  {
    id: "sing_arpeggio",
    categoryId: "singing",
    name: "Arpeggio Practice",
    description: "Broken chord patterns",
    instructions:
      "Sing a broken chord (1-3-5-8 of a major scale) on 'bah'. Go up one key each time. Arpeggios build agility and range. Keep each note crisp.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing arpeggios on 'bah' on 4 different starting notes.",
  },
  {
    id: "sing_staccato",
    categoryId: "singing",
    name: "Staccato Drill",
    description: "Crisp, separated notes",
    instructions:
      "Sing a major scale with each note separated and precise — 'bah-bah-bah-bah-bah-bah-bah-bah'. Think of each note as a bouncing ball. Crisp, light, controlled.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing a staccato scale on 'bah' — crisp and bouncy.",
  },
  {
    id: "sing_legato",
    categoryId: "singing",
    name: "Legato Line",
    description: "Smooth connected phrases",
    instructions:
      "Sing a scale on 'loo' with every note connected — absolutely no gap between notes. Think of it like drawing a smooth line in the air. Legato is the opposite of staccato.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing a legato scale on 'loo' — completely connected, no gaps.",
  },
  {
    id: "sing_vibrato",
    categoryId: "singing",
    name: "Vibrato Control",
    description: "Start and stop vibrato intentionally",
    instructions:
      "Sing a long note. Begin with a straight tone, then add a gentle vibrato (waver), then return to straight tone. Do this 5 times. This gives you control over your vibrato.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a long note: straight → vibrato → straight again.",
  },
  {
    id: "sing_sight_reading",
    categoryId: "singing",
    name: "Sight Singing",
    description: "Learn a melody on the spot",
    instructions:
      "Hum any melody you've never sung before — something from a commercial, an unfamiliar song, a melody you make up on the spot. Don't worry about perfection; focus on following your ear.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Improvise a short 8-bar melody and hum it with confidence.",
  },
  {
    id: "sing_mix_voice",
    categoryId: "singing",
    name: "Mix Voice Exploration",
    description: "Blend chest and head voice",
    instructions:
      "On 'mum', slide from a low note (chest voice) to a high note (head voice) without cracking. The goal is a smooth blend — the 'mix' is where both registers meet.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Slide from low to high on 'mum' without a break or crack.",
  },
  {
    id: "sing_diction_song",
    categoryId: "singing",
    name: "Diction Song",
    description: "Over-articulate every consonant",
    instructions:
      "Sing any song phrase with EXAGGERATED consonants — every B, P, T, D, K, G must pop. It will sound over-the-top in practice, but on stage it will sound perfectly clear.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing a phrase with exaggerated crisp consonants.",
  },
  {
    id: "sing_chest_voice",
    categoryId: "singing",
    name: "Chest Voice Power",
    description: "Strengthen your lower register",
    instructions:
      "On 'gah', sing down a major scale from your middle range. Feel the vibration in your chest — that's your chest voice. It should feel warm and powerful, not strained.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing down a scale on 'gah' — feel the chest resonance.",
  },
  {
    id: "sing_falsetto",
    categoryId: "singing",
    name: "Falsetto Exploration",
    description: "Discover your upper register",
    instructions:
      "On 'ooh', sing gently into your highest notes — the light, airy register above your normal range. Don't push. Let it float. Falsetto is a skill, not a weakness.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing gently up into falsetto on 'ooh' — keep it light and free.",
  },
  {
    id: "sing_harmony",
    categoryId: "singing",
    name: "Harmony Awareness",
    description: "Sing alongside a recording",
    instructions:
      "Play any song you know. Instead of singing the melody, sing a harmony — 3 or 4 notes above the original. Training your ear to find harmonies is an advanced skill worth developing.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a simple harmony 3 notes above a melody you hum.",
  },
  {
    id: "sing_musical_theater",
    categoryId: "singing",
    name: "Musical Theater Style",
    description: "Big, storytelling singing",
    instructions:
      "Musical theater singing tells a story. Sing any song as if the audience MUST understand every single word and feel every emotion. Use your face, gestures, and full voice.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Sing a song in full musical theater style — storytelling, emotion, and clarity.",
  },
  {
    id: "sing_pop_style",
    categoryId: "singing",
    name: "Contemporary Pop Style",
    description: "Modern vocal approach",
    instructions:
      "Pop singing is intimate and conversational. Sing any song as if you're singing directly to one person — close, personal, connected. Drop the 'performance' and just communicate.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing a pop song intimately, as if just for one person.",
  },
  {
    id: "sing_acapella",
    categoryId: "singing",
    name: "A Cappella Singing",
    description: "Unaccompanied and self-correcting",
    instructions:
      "Sing a full verse of any song without any backing music. You are the only instrument. Stay in tune, maintain your tempo, and commit fully — this is harder than it sounds.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a full verse of any song completely unaccompanied.",
  },
  {
    id: "sing_breath_mechanics",
    categoryId: "singing",
    name: "Breath Mechanics",
    description: "Belly breathing for singers",
    instructions:
      "Place your hands on your belly. Take a slow breath — your belly should expand, not your chest. Exhale slowly on 'sss'. Do this 5 times. Belly breathing is the foundation of singing.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Demonstrate belly breathing 5 times and explain what you feel.",
  },
  {
    id: "sing_singing_posture",
    categoryId: "singing",
    name: "Singing Posture",
    description: "Alignment and its effect on voice",
    instructions:
      "Stand against a wall: heels, calves, lower back, upper back, and head should all lightly touch. Step away from the wall and maintain this alignment while singing. Notice the difference in your sound.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Find ideal singing posture and sing a phrase from that alignment.",
  },
  {
    id: "sing_memorize_song",
    categoryId: "singing",
    name: "Song Memorization",
    description: "Connect lyrics to music memory",
    instructions:
      "Speak the lyrics of your audition song 5 times without music. Then sing them 5 times. Connect the words to specific memories or images. The more personal the association, the easier to remember.",
    duration: 6,
    difficulty: 2,
    assessmentPrompt: "Perform your audition song from full memory — no looking at lyrics.",
  },
  {
    id: "sing_audition_song",
    categoryId: "singing",
    name: "Audition Song Practice",
    description: "Your 32-bar cut",
    instructions:
      "Most musical theater auditions ask for a 16-32 bar cut of a song. Find the most impressive 30 seconds of your song. Start with your slate ('My name is... and I'll be performing...'), then perform.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Slate your name and perform your 32-bar audition cut from start to finish.",
  },
  {
    id: "sing_pitch_matching",
    categoryId: "singing",
    name: "Pitch Matching",
    description: "Train your ear",
    instructions:
      "Hum a note. Now match it — exactly. Hum another random note and match that one. Do this 10 times. Ear training is the most underrated vocal skill.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Hum 5 notes and match each one precisely.",
  },
  {
    id: "sing_intonation",
    categoryId: "singing",
    name: "Intonation Work",
    description: "Staying in tune throughout",
    instructions:
      "Sustain a single note on 'ahh' for 15 seconds. Does it drift sharp or flat at the end? Practice holding it perfectly steady. Intonation means your pitch is always exactly right.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Hold one note for 15 seconds — stay perfectly in tune throughout.",
  },
  {
    id: "sing_character_song",
    categoryId: "singing",
    name: "Character Song",
    description: "Who is singing this and why?",
    instructions:
      "Before singing, answer: Who is singing? To whom? What just happened that made this moment arise? Why does this character NEED to sing right now? Now sing with all of that alive in you.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt: "Answer: who, to whom, why now — then sing with that context fully alive.",
  },
  {
    id: "sing_performance_review",
    categoryId: "singing",
    name: "Self Review",
    description: "Record, listen, and grow",
    instructions:
      "Record yourself singing a verse of your song. Listen back. Identify 2 things that are great and 2 things to improve. Write them down. Then sing it again applying what you learned.",
    duration: 8,
    difficulty: 2,
    assessmentPrompt: "Sing a verse, then name 2 strengths and 2 areas to improve.",
  },
  {
    id: "sing_riff",
    categoryId: "singing",
    name: "Riffing Practice",
    description: "Ornaments and vocal runs",
    instructions:
      "On 'wee', slide rapidly up and down between 3 notes. Do this 10 times, getting faster. A vocal riff is a quick, decorative set of notes. Keep it clean, not sloppy.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Perform a vocal run on 'wee' between at least 4 notes.",
  },
  {
    id: "sing_power_note",
    categoryId: "singing",
    name: "Building to a Power Note",
    description: "The climactic high note",
    instructions:
      "Sing a phrase that builds and builds. Increase volume AND emotion as you approach the climactic note. When you hit it, COMMIT — don't hold back.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing a phrase building to a powerful climactic high note.",
  },
  {
    id: "sing_warmup_sequence",
    categoryId: "singing",
    name: "Full Singer's Warmup",
    description: "Complete 10-minute warmup",
    instructions:
      "Work through this sequence: (1) Lip trills 1 min (2) Sirens 1 min (3) Vowel scales 2 min (4) 'mah' scales 2 min (5) Arpeggio runs 2 min (6) Run your audition song 2 min.",
    duration: 10,
    difficulty: 2,
    assessmentPrompt: "Describe and briefly demo your favorite part of your warmup routine.",
  },
  {
    id: "sing_emotion_song",
    categoryId: "singing",
    name: "Emotional Color",
    description: "Singing with specific emotional intent",
    instructions:
      "Sing the same phrase 5 times with 5 completely different emotions: longing, joy, rage, tenderness, despair. Your voice and face must fully embody each one.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Sing one phrase with 5 different emotions — make each one distinctly different.",
  },
  {
    id: "sing_open_throat",
    categoryId: "singing",
    name: "Open Throat Singing",
    description: "Yawn-sigh for openness",
    instructions:
      "Induce a yawn (feel your throat open). As you exhale, let a gentle tone emerge. This is an open throat. Try to sing a scale with this same open, spacious feeling.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Open your throat with a yawn, then sing a scale from that openness.",
  },
  {
    id: "sing_connected_breath",
    categoryId: "singing",
    name: "Connected Breath",
    description: "Breath support through long phrases",
    instructions:
      "Sing a long phrase on ONE breath. The goal isn't to rush — it's to use your breath efficiently. Practice 'saving' your breath by exhaling slowly and steadily.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing a long phrase on one controlled breath — efficient and steady.",
  },
  {
    id: "sing_final_consonants",
    categoryId: "singing",
    name: "Final Consonants",
    description: "Crisp endings to words",
    instructions:
      "In singing, final consonants (T, D, N, S) are often swallowed. Sing a phrase and SNAP every final consonant at the exact end of the note. 'Ligh-T', 'Han-D', 'nigh-T'.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Sing a verse focusing on snapping every final consonant.",
  },
  {
    id: "sing_call_response",
    categoryId: "singing",
    name: "Call & Response",
    description: "Alternating musical dialogue",
    instructions:
      "Sing a 4-bar phrase as the 'call'. Then immediately sing a 4-bar 'response' that answers it musically. The response should feel like a complete reply — same energy, different melody. Do this 4 times, varying the emotion each round.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Sing a 4-bar call, then answer it with a 4-bar musical response.",
  },

  // ─── SPEAKING (40 exercises) ──────────────────────────────────────
  {
    id: "speak_twisters",
    categoryId: "speaking",
    name: "Tongue Twister Circuit",
    description: "Sharpen your articulation",
    instructions:
      "Say each twister 5× fast then once perfectly slow: (1) Red leather, yellow leather (2) Unique New York (3) She sells seashells (4) Toy boat.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt:
      "Say 'Red leather, yellow leather' 5 times fast, then perfectly slow.",
  },
  {
    id: "speak_projection",
    categoryId: "speaking",
    name: "Back Wall Projection",
    description: "Fill the room with your voice",
    instructions:
      "Speak to an imaginary back wall 30 meters away — not by shouting, but by directing your voice forward with full breath support. Read any sentence 3 times, increasing your reach.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt:
      "Speak as if projecting to the back of a huge theater — full voice, no shouting.",
  },
  {
    id: "speak_rate",
    categoryId: "speaking",
    name: "Rate Control",
    description: "Own your pace",
    instructions:
      "Read any passage at triple speed, then half speed, then natural rate. Notice how rate changes emotion and meaning. Slow = gravity. Fast = excitement.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Read a sentence at triple speed, half speed, then natural rate.",
  },
  {
    id: "speak_resonance",
    categoryId: "speaking",
    name: "Resonant Reading",
    description: "Add warmth to your voice",
    instructions:
      "Hum 10 seconds to warm up your resonators. Then read a passage keeping that warm hum alive in your voice — full, rich, resonant. Think of your whole face as a speaker.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Read a passage with full resonance — warm, rich, filling the room.",
  },
  {
    id: "speak_pause",
    categoryId: "speaking",
    name: "The Power of Pause",
    description: "Silence is your friend",
    instructions:
      "Before the most important word in 3 sentences, pause 3 full seconds. This feels awkward but is incredibly powerful. The audience leans in during silence.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt:
      "Speak 3 sentences using a dramatic pause before the key word each time.",
  },
  {
    id: "speak_inflection",
    categoryId: "speaking",
    name: "Inflection Rescue",
    description: "Banish monotone forever",
    instructions:
      "Read a passage in completely flat monotone. Then read it with EVERY sentence a different shape — rising, falling, arching. Find the natural music in the words.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Read a passage first monotone, then with wild expressive inflection.",
  },
  {
    id: "speak_operative",
    categoryId: "speaking",
    name: "Operative Words",
    description: "Stress what matters",
    instructions:
      "Say 'I never said she stole my money' 7 times, stressing a DIFFERENT word each time. Notice how the entire meaning changes. This is a fundamental acting and speaking tool.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Say 'I never said she stole my money' stressing each word differently.",
  },
  {
    id: "speak_character_voice",
    categoryId: "speaking",
    name: "Character Voices",
    description: "Transform your voice",
    instructions:
      "Create 3 distinct voices: (1) an ancient wise grandparent (2) an excited 5-year-old (3) a mysterious villain. Use each to say: 'The show begins at seven tonight.'",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Say a sentence in 3 completely different character voices.",
  },
  {
    id: "speak_breath_phrase",
    categoryId: "speaking",
    name: "Breath Phrase",
    description: "Control through long sentences",
    instructions:
      "On ONE breath, say as much of this as you can clearly: 'The quick brown fox jumps over the lazy dog while the bright blue butterfly dances in the warm summer breeze beneath the golden afternoon sun.' Push your limit!",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak one very long sentence on a single controlled breath.",
  },
  {
    id: "speak_monologue_reading",
    categoryId: "speaking",
    name: "Expressive Reading",
    description: "Bring text to life",
    instructions:
      "Choose any text — a poem, a book passage, song lyrics. Read aloud with full theatrical commitment. Use your voice to paint every image and feel every emotion.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Read or recite any text with full dramatic expression.",
  },
  {
    id: "speak_shakespeare_scan",
    categoryId: "speaking",
    name: "Shakespeare Scansion",
    description: "Iambic pentameter rhythm",
    instructions:
      "Iambic pentameter has 10 beats per line: da-DUM da-DUM da-DUM da-DUM da-DUM. Tap your knee on each DUM. Try: 'To BE or NOT to BE, that IS the QUES-tion.' Speak it naturally while honoring the rhythm.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt:
      "Speak 'To be or not to be' in iambic rhythm — tap the stressed syllables.",
  },
  {
    id: "speak_news_anchor",
    categoryId: "speaking",
    name: "News Anchor Delivery",
    description: "Clear, authoritative broadcast style",
    instructions:
      "Read any paragraph as if it's breaking news on national television. Speak clearly, authoritatively, at an even pace. No rushing. No stumbling. Every word counts.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Read a passage in a clear, authoritative news anchor style.",
  },
  {
    id: "speak_poetry",
    categoryId: "speaking",
    name: "Poetry Recitation",
    description: "Memorize and perform",
    instructions:
      "Memorize any short poem (at least 4 lines). Perform it with the emotion, imagery, and rhythm that the words demand. Don't just recite — make the listener feel it.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Perform any poem from memory with full expression.",
  },
  {
    id: "speak_open_throat_speak",
    categoryId: "speaking",
    name: "Open Throat Speaking",
    description: "Yawn and speak",
    instructions:
      "Induce a yawn and feel how your throat opens. Now maintain that open feeling while speaking. Your voice will immediately become richer, fuller, and more resonant.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Open your throat with a yawn, then speak 5 sentences from that openness.",
  },
  {
    id: "speak_call_response",
    categoryId: "speaking",
    name: "Call and Response",
    description: "Question-answer phrasing",
    instructions:
      "Speak a statement as a question (rising tone), then answer it with authority (falling tone). Do 5 pairs. This trains you to use tone intentionally to shape meaning.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak 3 question/answer pairs — clearly different tones for each.",
  },
  {
    id: "speak_dialect",
    categoryId: "speaking",
    name: "Dialect Exploration",
    description: "Try different accents",
    instructions:
      "Try 3 different accents or dialects (Southern US, British RP, Australian). Say 'Good evening, I'd like to order some tea and biscuits.' Don't worry about perfection — explore the music of each.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Say a sentence in 3 distinctly different accents.",
  },
  {
    id: "speak_sight_reading_sp",
    categoryId: "speaking",
    name: "Sight Reading",
    description: "Read unfamiliar text fluently",
    instructions:
      "Find any text you've never seen. Read it aloud immediately, at a natural pace, with expression. The skill of sight-reading is essential for cold-reading auditions.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Read an unfamiliar passage fluently with expression on the first try.",
  },
  {
    id: "speak_memorization",
    categoryId: "speaking",
    name: "Memorization",
    description: "Learn and deliver from memory",
    instructions:
      "Memorize 8 lines of any speech or monologue. Speak them from memory, with full expression. The words should feel like YOUR words, not something you're trying to remember.",
    duration: 6,
    difficulty: 2,
    assessmentPrompt: "Deliver 8 lines from memory with full performance commitment.",
  },
  {
    id: "speak_storytelling_sp",
    categoryId: "speaking",
    name: "Oral Storytelling",
    description: "Tell a story using voice alone",
    instructions:
      "Tell a 2-minute story using only your voice — no gestures. Use volume, pace, tone, and pause to create characters, settings, and emotions. Your voice is your complete toolkit.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Tell a 2-minute story using only vocal variation, no gestures.",
  },
  {
    id: "speak_persuasion",
    categoryId: "speaking",
    name: "Persuasion Drill",
    description: "Argue convincingly",
    instructions:
      "Choose a position (any — even one you disagree with). Argue it as convincingly as possible for 90 seconds. Use evidence, passion, and vocal variety. Great persuaders make you feel.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt: "Argue a position for 90 seconds — try to genuinely convince me.",
  },
  {
    id: "speak_descriptive",
    categoryId: "speaking",
    name: "Descriptive Speech",
    description: "Make me see what you see",
    instructions:
      "Describe a room or location in such vivid detail that a listener could draw it. Use all five senses. Be specific: not 'a window' but 'a cracked window with a spider web in the lower left corner.'",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Describe a room in such detail I could draw it from your words.",
  },
  {
    id: "speak_comedic_sp",
    categoryId: "speaking",
    name: "Comedic Monologue",
    description: "Find the funny",
    instructions:
      "Tell a funny story about yourself or invent a comedic character. Comedy needs specificity, timing, and commitment. Say it straight — don't try to be funny, just tell the truth with excellent timing.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Tell a funny story or comedic monologue — use timing, not mugging.",
  },
  {
    id: "speak_dramatic_sp",
    categoryId: "speaking",
    name: "Dramatic Monologue",
    description: "Heightened emotional delivery",
    instructions:
      "Deliver a dramatic speech at your highest emotional level. Don't hold back. The exercise is to practice accessing heightened states — grief, fury, desperation. Commit completely.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Deliver a dramatic speech at your highest emotional intensity.",
  },
  {
    id: "speak_whisper",
    categoryId: "speaking",
    name: "Intentional Whisper",
    description: "Dramatic effect of soft speech",
    instructions:
      "Practice a whisper that still reaches the back of the room — not by getting louder, but by making every consonant crisp and using forward placement. A stage whisper is heard everywhere.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Whisper a dramatic secret clearly enough that it carries across the room.",
  },
  {
    id: "speak_volume_journey",
    categoryId: "speaking",
    name: "Volume Journey",
    description: "Whisper to shout in one speech",
    instructions:
      "Deliver a short speech that begins in a barely-audible whisper and gradually builds to your strongest full voice — all in one continuous, intentional journey. No sudden jumps.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak a passage that builds gradually from a whisper to full power.",
  },
  {
    id: "speak_with_gesture",
    categoryId: "speaking",
    name: "Speech with Gesture",
    description: "Pair deliberate movement with words",
    instructions:
      "Choose 5 sentences. For each, decide ONE gesture that adds meaning to the words — not random movement, but a gesture that literally shows what you're saying. Practice until each gesture feels natural.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Speak 5 sentences, each with one deliberate, meaningful gesture.",
  },
  {
    id: "speak_voice_warmup_full",
    categoryId: "speaking",
    name: "Full Voice Warmup",
    description: "Complete speaking warmup sequence",
    instructions:
      "Work through: (1) Jaw massage 30s (2) Lip trills 30s (3) Tongue stretch 30s (4) Yawn-sigh 3x (5) Vowel sounds AH-EE-OO 1 min (6) Projection exercise 1 min (7) Tongue twisters 1 min.",
    duration: 6,
    difficulty: 1,
    assessmentPrompt: "Lead me through a 3-minute voice warmup from start to finish.",
  },
  {
    id: "speak_connect_text",
    categoryId: "speaking",
    name: "Connecting Text to Meaning",
    description: "Don't just say words",
    instructions:
      "Read a passage twice. First time, just say the words. Second time, think about the image or feeling behind EVERY word before you say it. You'll hear a complete transformation.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Read a passage twice: once mechanical, once with full meaning behind every word.",
  },
  {
    id: "speak_nasal_resonance",
    categoryId: "speaking",
    name: "Nasal Resonance",
    description: "Bright, forward sound placement",
    instructions:
      "Say 'NNNN' and feel the buzz in your nose. Now say 'mmmm-AH' — try to keep the brightness of the 'N' in the 'AH'. This forward placement cuts through theater noise.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Say 'NNNN' then transition to 'AH' keeping the forward nasal brightness.",
  },
  {
    id: "speak_complete_thought",
    categoryId: "speaking",
    name: "Complete Thought",
    description: "Never lose the end of a sentence",
    instructions:
      "The end of a sentence is where the meaning is. Read 5 sentences, purposefully sustaining your energy and volume ALL THE WAY to the final word. Don't trail off. Complete every thought.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Read 5 sentences, keeping full energy all the way to the last word.",
  },
  {
    id: "speak_lip_articulation",
    categoryId: "speaking",
    name: "Lip Articulation Drill",
    description: "Precise lip movement for clarity",
    instructions:
      "Say 'p-b-p-b-p-b-p-b' as fast as possible for 10 seconds. Then 'm-w-m-w-m-w'. Then say 'She was a woman who watched whales.' These drills awaken your lips for crisp articulation.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Do the p-b and m-w drills, then say 'She was a woman who watched whales.'",
  },
  {
    id: "speak_audition_monologue",
    categoryId: "speaking",
    name: "Audition Monologue",
    description: "Your complete piece, polished",
    instructions:
      "Perform your complete audition monologue or speech from start to finish. Slate your name first. Then give the performance of your life — as if the casting director is in the room right now.",
    duration: 8,
    difficulty: 3,
    assessmentPrompt: "Slate your name and deliver your audition monologue in full.",
  },
  {
    id: "speak_pitch_range",
    categoryId: "speaking",
    name: "Pitch Range Exploration",
    description: "Discover your vocal range in speech",
    instructions:
      "Speak a sentence at the lowest pitch you can manage without strain, then at a comfortable medium, then as high as feels natural in your speaking voice. Notice how pitch changes perceived authority (low) and energy (high).",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak a sentence at low, medium, and high pitch — describe what each conveys.",
  },
  {
    id: "speak_emotional_delivery",
    categoryId: "speaking",
    name: "Emotional Authenticity",
    description: "Real feeling in spoken words",
    instructions:
      "Speak about something you genuinely care about for 90 seconds — a person, a dream, something that made you proud. Don't perform. Just speak truly. Authentic emotional delivery is one of the most powerful speaking skills.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak honestly for 90 seconds about something you genuinely care about.",
  },
  {
    id: "speak_posture_voice",
    categoryId: "speaking",
    name: "Posture and Voice",
    description: "How your body shapes your voice",
    instructions:
      "Speak a paragraph while hunched over, chin to chest. Then stand perfectly tall and repeat it. Notice the dramatic difference in vocal resonance, confidence, and authority. Your posture IS your voice.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Speak a passage hunched over, then tall. Describe what changes.",
  },
  {
    id: "speak_impromptu",
    categoryId: "speaking",
    name: "Impromptu Speaking",
    description: "Think on your feet",
    instructions:
      "Pick any random object nearby. Speak about it for 2 minutes without stopping — its history, its future, what it would say if it could talk, why it's the most important object in the room. Impromptu speaking builds both confidence and versatility.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt: "Pick an object and speak about it for 2 minutes without stopping.",
  },
  {
    id: "speak_diction_precision",
    categoryId: "speaking",
    name: "Diction Precision Drill",
    description: "Perfect every consonant",
    instructions:
      "Say this slowly and perfectly: 'Around the rough and rugged rock the ragged rascal ran.' Now say it 5 times faster each round. Final round: full speed with every consonant crystal clear. Precision at speed is the goal.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Say the ragged rascal tongue twister 5 times at increasing speeds.",
  },
  {
    id: "speak_breath_ladder",
    categoryId: "speaking",
    name: "Breath Ladder",
    description: "Build breath support progressively",
    instructions:
      "Count aloud on one breath: 1... 1-2... 1-2-3... going further each time without taking another breath. Go as high as you can. This builds the breath control that gives speakers power through long sentences.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Count on one breath — start at 1 and see how high you can go.",
  },
  {
    id: "speak_contrast",
    categoryId: "speaking",
    name: "Contrast Technique",
    description: "Before and after — the power of comparison",
    instructions:
      "Write a short 3-sentence speech. Make the first sentence describe the BEFORE (dark, difficult), the second the TURNING POINT, and the third the AFTER (bright, hopeful). Use your voice to embody each shift. Contrast is the engine of compelling speeches.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Deliver a 3-part speech using before, turning point, and after contrast.",
  },
  {
    id: "speak_camera_presence",
    categoryId: "speaking",
    name: "Camera Presence",
    description: "Speak directly to one person",
    instructions:
      "Look directly at one point (your camera or a spot on the wall). Speak as if there is one specific person there who needs to hear what you're saying. Great speakers make every person in the audience feel they are speaking directly to them.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak a 60-second message directly to camera as if to your best friend.",
  },
  {
    id: "speak_text_transformation",
    categoryId: "speaking",
    name: "Text Transformation",
    description: "Read any text as dramatic prose",
    instructions:
      "Take the most boring text you can find (a cereal box, a manual, a weather report). Transform it into a dramatic spoken word performance — find the rhythm, the emotion, the stakes. A great speaker can make anything compelling.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt: "Read something mundane as if it's the most dramatic speech ever written.",
  },

  // ─── MOVEMENT (40 exercises) ──────────────────────────────────────
  {
    id: "move_neutral",
    categoryId: "movement",
    name: "Neutral Walk",
    description: "Start from stillness",
    instructions:
      "Walk with no attitude, emotion, or intention — completely neutral. Notice every habit (slouching, nervous arms, looking at feet) and release them.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Walk in neutral — no personality, no habits. Describe what you notice.",
  },
  {
    id: "move_space",
    categoryId: "movement",
    name: "Space Fill",
    description: "Own every corner",
    instructions:
      "Move through your space visiting EVERY corner and area. Vary your speed, level, and direction constantly. Never let the center hold you too long.",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Fill the whole space — change speed and level constantly.",
  },
  {
    id: "move_levels",
    categoryId: "movement",
    name: "Level Changes",
    description: "High, medium, and low",
    instructions:
      "Tell a simple story using three levels: reaching high, walking normally, crouching low. Transition smoothly and with purpose between all three.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Tell a story moving through all three levels: high, medium, and low.",
  },
  {
    id: "move_gesture",
    categoryId: "movement",
    name: "Purposeful Gestures",
    description: "Eliminate nervous movement",
    instructions:
      "Stay completely still for 2 minutes. Then speak, adding ONE deliberate gesture per sentence that adds meaning. Every movement must be intentional.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Speak 30 seconds using only intentional gestures — no fidgeting.",
  },
  {
    id: "move_entrance",
    categoryId: "movement",
    name: "The Power Entrance",
    description: "Make every entry count",
    instructions:
      "Practice 5 entrances: (1) as the star (2) terrified (3) hiding something (4) in a hurry (5) owning the place. Each tells a story before you speak.",
    duration: 6,
    difficulty: 2,
    assessmentPrompt: "Show me 3 character entrances — the star, the nervous one, the hurried one.",
  },
  {
    id: "move_stillness",
    categoryId: "movement",
    name: "Mastering Stillness",
    description: "Power without movement",
    instructions:
      "Stand completely still for 2 full minutes. No shuffling, no adjusting, no habits. Just presence. Stillness on stage communicates power.",
    duration: 3,
    difficulty: 2,
    assessmentPrompt: "Stand completely still for 60 seconds. Describe the challenge.",
  },
  {
    id: "move_character_walks",
    categoryId: "movement",
    name: "Character Walks",
    description: "Every person moves differently",
    instructions:
      "Create distinct walks for: a tired wizard, an excited puppy, a nervous spy, a queen, a toddler. Feel how personality lives in every step.",
    duration: 7,
    difficulty: 3,
    assessmentPrompt: "Show me 3 distinct character walks — make them clearly different.",
  },
  {
    id: "move_physical_story",
    categoryId: "movement",
    name: "Silent Story",
    description: "No words, all body",
    instructions:
      "Tell the story of waking up late — through movement alone. Wake up, realize you're late, rush, get ready, run out, arrive just in time. No words.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Tell a short story using ONLY your body — no words.",
  },
  {
    id: "move_isolation",
    categoryId: "movement",
    name: "Body Isolation",
    description: "Control each part separately",
    instructions:
      "Move ONLY your head (body still). Then ONLY your shoulders. Then ONLY your hips. Then ONLY your hands. Isolation is key for stage presence and dance.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Isolate head, shoulders, hips, and hands — move only that part each time.",
  },
  {
    id: "move_open_position",
    categoryId: "movement",
    name: "Open Position Practice",
    description: "Always face the audience",
    instructions:
      "Imagine an audience in front of you. Have a conversation to your right, then left, making sure your body and face always open toward the audience. Never fully turn your back.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Have an imaginary conversation while keeping your body open to the audience.",
  },
  {
    id: "move_laban_efforts",
    categoryId: "movement",
    name: "Laban Effort Qualities",
    description: "8 ways to move",
    instructions:
      "Practice these 8 Laban effort qualities with your whole body: PUNCH (sudden, strong, direct), PRESS (sustained, strong, direct), FLICK (sudden, light, flexible), SLASH (sudden, strong, flexible), DAB (sudden, light, direct), GLIDE (sustained, light, direct), FLOAT (sustained, light, flexible), WRING (sustained, strong, flexible).",
    duration: 7,
    difficulty: 3,
    assessmentPrompt: "Show me PUNCH, FLOAT, and GLIDE as full-body Laban efforts.",
  },
  {
    id: "move_floor_work",
    categoryId: "movement",
    name: "Floor Work",
    description: "Working at the lowest level",
    instructions:
      "Lie on the floor. Roll slowly. Find pathways across the floor using only your back, sides, and belly. Then slowly rise to standing. Floor work expands your physical range.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Move from lying on the floor to standing using slow, controlled movement.",
  },
  {
    id: "move_jumping",
    categoryId: "movement",
    name: "Elevation",
    description: "Jumps and leaps with control",
    instructions:
      "Practice 5 kinds of jumps: (1) two feet to two feet (2) two feet to one foot (3) one foot to two feet (4) one foot to same foot (skip) (5) one foot to other foot (leap). Land softly — bent knees!",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show me 3 kinds of jumps — land softly and with control.",
  },
  {
    id: "move_breath_move",
    categoryId: "movement",
    name: "Breath and Movement",
    description: "Coordinate breath with physical action",
    instructions:
      "Breathe in while raising your arms. Breathe out as they fall. Now breathe in while your whole spine lifts, out as it collapses. Let breath drive every movement for 3 minutes.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Move for 2 minutes driven entirely by your breath — inhale lifts, exhale falls.",
  },
  {
    id: "move_tension_release",
    categoryId: "movement",
    name: "Tension and Release",
    description: "Contract and release muscle groups",
    instructions:
      "Squeeze your whole body as tightly as possible for 5 seconds. Then release EVERYTHING at once. Notice the difference. Repeat with individual body parts: fists, shoulders, face, legs.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Tense your whole body for 5 seconds, then release. Describe the sensation.",
  },
  {
    id: "move_tempo_shift",
    categoryId: "movement",
    name: "Movement Tempo",
    description: "Fast and slow physical storytelling",
    instructions:
      "Move through your space at 10% of normal speed — feel every microsecond. Then shift to 300% speed — chaotic energy. Then find exactly the right tempo for a specific character.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show me ultra-slow movement, then ultra-fast, then the right tempo for your character.",
  },
  {
    id: "move_weight_shift",
    categoryId: "movement",
    name: "Weight Shift",
    description: "Rock between feet to find center",
    instructions:
      "Stand with feet shoulder-width apart. Slowly shift all your weight to the right foot, then all to the left, then find perfect balance in the center. Do this 10 times. Your center is your power source.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Shift your weight right, left, and find your perfect centered balance.",
  },
  {
    id: "move_peripheral",
    categoryId: "movement",
    name: "Peripheral Awareness",
    description: "Sense the whole space",
    instructions:
      "Walk through your space. Keep your eyes looking straight ahead, but notice EVERYTHING in your peripheral vision — the edges, the depth, the light. Stay present to the entire room.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Walk and describe what you see in your peripheral vision without turning your head.",
  },
  {
    id: "move_cross_stage",
    categoryId: "movement",
    name: "Stage Cross",
    description: "Walk across with purpose and presence",
    instructions:
      "Walk from one side of the room to the other. Your cross should have: a reason (you're going somewhere), a tempo (deliberate), and presence (the audience watches you). Do 5 different crosses.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Cross the stage 3 times with 3 completely different purposes and energies.",
  },
  {
    id: "move_tableau",
    categoryId: "movement",
    name: "Stage Tableau",
    description: "Frozen image that tells a story",
    instructions:
      "Create a frozen physical image (statue) that tells a specific story without movement. Try: 'fear', 'triumph', 'grief', 'joy'. Hold each 10 seconds. Every body part contributes to the story.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Create frozen tableaux for: fear, triumph, and grief. Hold each 10 seconds.",
  },
  {
    id: "move_physical_objective",
    categoryId: "movement",
    name: "Physical Objective",
    description: "Achieve a goal through movement only",
    instructions:
      "Without speaking, use only movement to convey: 'I need help' then 'I'm hiding something important' then 'I'm extremely proud of what I just did.' Make each intention unmistakable.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Communicate 3 different objectives using only movement — no words or sounds.",
  },
  {
    id: "move_contemporary",
    categoryId: "movement",
    name: "Contemporary Movement",
    description: "Fluid, pedestrian movement",
    instructions:
      "Contemporary dance often begins with ordinary movement. Walk, sit, stand, pick something up — but make each action deliberate, beautiful, and aware. Every gesture becomes choreography.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Perform everyday actions (walk, sit, stand) with full awareness and intention.",
  },
  {
    id: "move_musical_theater_move",
    categoryId: "movement",
    name: "Musical Theater Movement",
    description: "Stylized, precise, expressive",
    instructions:
      "Musical theater movement is heightened reality. Practice these: Jazz hands (fully spread, jazz energy), A formal bow from the waist, An exaggerated comedic trip and recovery, A sweeping romantic gesture. Each should be bold.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Perform jazz hands, a bow, a comedic trip, and a romantic gesture.",
  },
  {
    id: "move_mask_work",
    categoryId: "movement",
    name: "Mask Work",
    description: "Amplify physical expression",
    instructions:
      "Imagine you're wearing a mask that completely covers your face. The audience cannot see your face — you must communicate EVERYTHING through your body: posture, gesture, head angle, and movement.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Communicate 3 emotions with NO facial expression — body only.",
  },
  {
    id: "move_body_architecture",
    categoryId: "movement",
    name: "Body Architecture",
    description: "Create shapes and lines",
    instructions:
      "Your body creates shapes in space. Practice: long angular shapes, curved shapes, symmetrical shapes, asymmetrical shapes. Then find a shape that represents your character.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Show me an angular shape, a curved shape, and your character's body shape.",
  },
  {
    id: "move_spatial_relationship",
    categoryId: "movement",
    name: "Spatial Relationships",
    description: "Near/far, high/low dynamics",
    instructions:
      "Practice using distance as an acting tool. Move very close to an imaginary person for an intimate secret. Move far away for anger or fear. High for authority, low for submission.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show how distance and level change the meaning of an interaction.",
  },
  {
    id: "move_transformation_move",
    categoryId: "movement",
    name: "Physical Transformation",
    description: "Change character through movement",
    instructions:
      "Begin as one character (e.g., an anxious teenager). Mid-movement, slowly transform into a completely different character (e.g., a wise elder). Let the transformation be physical first.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Physically transform from one character to another through pure movement.",
  },
  {
    id: "move_leading_center",
    categoryId: "movement",
    name: "Center-Led Movement",
    description: "Initiate from your core",
    instructions:
      "Imagine all movement originates from your belly button. Walk led by your belly. Turn led by your center. Reach led by your core. This creates powerful, connected stage movement.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Walk and move for 60 seconds with all movement leading from your belly center.",
  },
  {
    id: "move_stage_fight",
    categoryId: "movement",
    name: "Stage Combat Safety",
    description: "Slow-motion reaction work",
    instructions:
      "Stage combat is about the REACTION, not the hit. Practice: an imaginary punch in slow motion (react before the contact), a slow-motion fall, and a slow-motion push. Safety and storytelling are the priorities.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show a slow-motion punch reaction, a fall, and a push — safely and clearly.",
  },
  {
    id: "move_ending_pose",
    categoryId: "movement",
    name: "The Definitive Ending",
    description: "Land your final position with power",
    instructions:
      "Every scene, dance, or performance must end definitively. Practice 5 different strong endings: a firm stillness, a collapse, a triumphant pose, a turn and freeze, and a slow fade to stillness. Endings are as important as beginnings.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show me 3 distinctly different strong physical endings.",
  },
  {
    id: "move_texture",
    categoryId: "movement",
    name: "Texture Exploration",
    description: "Move through different imaginary substances",
    instructions:
      "Move as if you're: (1) wading through deep water (2) moving through thick honey (3) dancing in a strong wind (4) floating in zero gravity. Let each substance change your entire body.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Move through water, honey, and wind — make each substance completely different.",
  },
  {
    id: "move_eye_contact_move",
    categoryId: "movement",
    name: "Eye Focus in Movement",
    description: "Connect with space while moving",
    instructions:
      "As you move through your space, make deliberate eye contact with specific points — the window, a photo, an exit. Each glance tells a story. The eyes lead the head; the head leads the body.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Move through the space with deliberate eye focus — let each glance mean something.",
  },
  {
    id: "move_partnering",
    categoryId: "movement",
    name: "Shadow and Lead",
    description: "Trust and physical partnership",
    instructions:
      "Choose a partner (or imagine one). Person A moves freely; Person B mirrors every movement like a shadow. After 90 seconds, switch without stopping. Notice how quickly your movement intuition develops.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Mirror an imaginary partner for 60 seconds, then lead for 60 seconds.",
  },
  {
    id: "move_impulse",
    categoryId: "movement",
    name: "Impulse and Reaction",
    description: "Responding physically without thinking",
    instructions:
      "Stand still. When you feel an impulse to move — any impulse — follow it immediately without thinking. Don't plan, don't perform. Let your body lead. The impulse can be tiny (a finger twitch) or large (a full spin). Stay present and reactive.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Move for 2 minutes following only genuine physical impulses — no planning.",
  },
  {
    id: "move_counting_rhythm",
    categoryId: "movement",
    name: "Counting Rhythms",
    description: "Movement in musical time",
    instructions:
      "Count aloud: 1-2-3-4, 1-2-3-4. Move in exactly that rhythm — a new clear movement on each count. Then try 1-2-3, 1-2-3 (waltz). Then a syncopated 1-AND-2-AND. Moving to counts is essential for musical theater.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Move in 4/4 time for 30 seconds, then 3/4 time for 30 seconds.",
  },
  {
    id: "move_warm_cool",
    categoryId: "movement",
    name: "Temperature in Movement",
    description: "Hot urgency vs cool precision",
    instructions:
      "Move as if you are extremely HOT — urgent, expansive, passionate, fast. Then move as if you are COLD — contracted, careful, precise, slow. Both extremes are useful performance tools. Find where your character lives on this spectrum.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Show hot, urgent movement for 30 seconds, then cold, precise movement.",
  },
  {
    id: "move_choreography_memory",
    categoryId: "movement",
    name: "Movement Sequence Memory",
    description: "Learn and retain a physical sequence",
    instructions:
      "Create a 16-count movement sequence: 4 counts for each of 4 different movements. Practice it 5 times. Then perform it from memory without counting aloud. Repeating until it's in your muscle memory is how choreography works.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt: "Create a 16-count movement sequence and perform it from muscle memory.",
  },
  {
    id: "move_animal_deep",
    categoryId: "movement",
    name: "Deep Animal Study",
    description: "Extended animal transformation",
    instructions:
      "Choose a different animal from your first animal study. Spend 5 full minutes ONLY as this animal — move, breathe, look, react as it would. No half-measures. Then write one word that captures its essence, and carry that word into your human movement.",
    duration: 7,
    difficulty: 3,
    assessmentPrompt: "Spend 3 minutes fully as your animal, then name the one quality you're keeping.",
  },
  {
    id: "move_resonance_body",
    categoryId: "movement",
    name: "Body as Resonator",
    description: "Feel sound vibrations in your body",
    instructions:
      "Hum a low, steady note. Place your hands on different parts of your body — chest, belly, back, head. Feel where the vibrations are strongest. Now move from each of those places. Your voice lives in your body.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Hum and find 3 body parts that vibrate. Describe what you feel.",
  },
  {
    id: "move_spiral",
    categoryId: "movement",
    name: "Spiral and Unwind",
    description: "Rotational movement through the spine",
    instructions:
      "Begin standing. Start a slow spiral — twist your head, then shoulders, then chest, then waist — until you're fully wound. Then slowly unwind in reverse. Do this 5 times, getting larger each time. Spirals create beautiful stage movement.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Spiral your whole body slowly, then unwind — 5 times with increasing size.",
  },

  // ─── CONFIDENCE (40 exercises) ────────────────────────────────────
  {
    id: "conf_power_pose",
    categoryId: "confidence",
    name: "Power Pose",
    description: "Stand like the star you are",
    instructions:
      "Stand feet wider than shoulder-width apart, hands on hips, chin up, shoulders back. Hold 2 full minutes. This actually increases confidence hormones.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Hold a power pose for 60 seconds. How did it feel?",
  },
  {
    id: "conf_affirmations",
    categoryId: "confidence",
    name: "Performing Arts Affirmations",
    description: "Speak your success into existence",
    instructions:
      "Say each 3 times with total conviction: 'I am a talented performer.' 'My voice deserves to be heard.' 'I belong on this stage.' 'Every day I grow stronger.' 'I will earn this role.'",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Say 3 powerful affirmations about your talent — mean every word!",
  },
  {
    id: "conf_visualization",
    categoryId: "confidence",
    name: "Audition Visualization",
    description: "See your success first",
    instructions:
      "Close your eyes. Visualize your audition in complete detail — walking in confidently, performing flawlessly, hearing applause, being told you got the part. The brain can't fully tell the difference from reality.",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Describe your perfect audition from walking in to hearing you got the part.",
  },
  {
    id: "conf_mistake_recovery",
    categoryId: "confidence",
    name: "Mistake Recovery",
    description: "Turn errors into confidence",
    instructions:
      "Intentionally make a 'mistake' in a speech or song — forget a word, wrong note. Then immediately recover without apologizing or showing panic. Practice until it feels natural.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Perform something, intentionally make a mistake, then recover confidently.",
  },
  {
    id: "conf_pitch",
    categoryId: "confidence",
    name: "The 30-Second Pitch",
    description: "Make them believe in you",
    instructions:
      "In 30 seconds, convince an imaginary casting director you're PERFECT for the lead. You cannot be humble — be compelling, specific, and absolutely confident.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Pitch yourself for the lead role in 30 seconds — be bold and specific.",
  },
  {
    id: "conf_bow",
    categoryId: "confidence",
    name: "Accepting the Applause",
    description: "Receive praise gracefully",
    instructions:
      "Practice a bow: step forward, look at the audience with a genuine smile, bow at the waist, hold 2 seconds, rise, make eye contact, smile again. Repeat 5 times until it feels joyful.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Take a full bow and receive applause. Look confident and grateful.",
  },
  {
    id: "conf_stage_fright",
    categoryId: "confidence",
    name: "Stage Fright Toolkit",
    description: "Transform nerves into energy",
    instructions:
      "Practice 3 calming techniques: (1) 4-7-8 breathing (in 4, hold 7, out 8) — 3 cycles (2) Shake out vigorously for 30s (3) Smile for 60s even if it feels fake. These actually work!",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Do 4-7-8 breathing 3 times, then shake out. How do you feel?",
  },
  {
    id: "conf_risk",
    categoryId: "confidence",
    name: "Creative Risk",
    description: "Dare to be different",
    instructions:
      "Perform a 4-line verse 3 completely unexpected ways — one very risky, one very gentle, one very physical. Good performers fail bravely. Take the risk.",
    duration: 6,
    difficulty: 3,
    assessmentPrompt: "Perform a short verse in 3 wildly different ways — take a real risk!",
  },
  {
    id: "conf_mock_audition",
    categoryId: "confidence",
    name: "Mock Audition",
    description: "The real thing in practice",
    instructions:
      "Full simulation: walk to center, introduce yourself, perform your piece, thank the imaginary panel, walk out. Do this entire sequence without stopping. It's the only way to prepare.",
    duration: 8,
    difficulty: 3,
    assessmentPrompt: "Do a full mock audition: intro, performance, thank you, exit.",
  },
  {
    id: "conf_gratitude",
    categoryId: "confidence",
    name: "Performer's Gratitude",
    description: "Ground yourself in joy",
    instructions:
      "Speak aloud 5 specific things you're grateful for in your performing journey: a skill you've grown in, a mentor, a performance you're proud of, a moment of joy on stage, your own courage.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Share 5 specific things you are grateful for in your performing arts journey.",
  },
  {
    id: "conf_positive_self_talk",
    categoryId: "confidence",
    name: "Positive Self-Talk",
    description: "Replace doubt with affirmation",
    instructions:
      "Write down 3 negative thoughts you have about performing. For each, create a powerful counter-thought. Say the counter-thoughts aloud 3 times each with increasing conviction.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Name a self-doubt, then say its counter-affirmation 3 times with growing power.",
  },
  {
    id: "conf_failure_log",
    categoryId: "confidence",
    name: "Failure Celebration",
    description: "Celebrate learning moments",
    instructions:
      "Think of 5 times you 'failed' at something performance-related. For each one, name what you learned from it. Failures are the training ground of greatness. Say: 'I failed at ___ and I learned ___.'",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Share 2 performance 'failures' and what they taught you.",
  },
  {
    id: "conf_courage",
    categoryId: "confidence",
    name: "Act of Courage",
    description: "Do one thing that scares you",
    instructions:
      "Perform something you've been afraid to try — a song in a higher key, a dramatic speech, a silly physical character. The only rule: don't play it safe. Name what scared you and do it anyway.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Name something that scares you to perform, then perform it.",
  },
  {
    id: "conf_eye_contact2",
    categoryId: "confidence",
    name: "Sustained Eye Contact",
    description: "Hold a gaze with confidence",
    instructions:
      "Find a spot on the wall at eye level. Hold a soft but unwavering gaze for 90 seconds — like you're looking at someone with warm confidence. Eye contact is one of the most powerful tools a performer has.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Hold strong, soft eye contact with me (a point on the wall) for 60 seconds.",
  },
  {
    id: "conf_public_commitment",
    categoryId: "confidence",
    name: "Full Commitment",
    description: "100% all in, no holding back",
    instructions:
      "Choose a completely ridiculous task — be a robot, act like a penguin, narrate your breakfast dramatically. Do it with TOTAL commitment and zero self-consciousness. Commitment is the cure for embarrassment.",
    duration: 3,
    difficulty: 2,
    assessmentPrompt: "Narrate what you had for breakfast as if it's the most dramatic event in history.",
  },
  {
    id: "conf_inner_critic",
    categoryId: "confidence",
    name: "Name Your Inner Critic",
    description: "See it clearly, then dismiss it",
    instructions:
      "Give your inner critic a ridiculous name and a funny voice. Say aloud 3 things it usually tells you. Then say in your most confident voice: 'Thank you [Name], I've got this.' This tool is used by professional performers.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Name your inner critic, share what it says, then confidently dismiss it.",
  },
  {
    id: "conf_acceptance",
    categoryId: "confidence",
    name: "Accepting a Compliment",
    description: "Receive praise without deflecting",
    instructions:
      "Most of us deflect compliments ('Oh, it was nothing!'). Practice saying only 'Thank you, I worked really hard on that' — and nothing else. No deflecting. No false modesty. Receive the compliment fully.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Receive 3 compliments about your performing. Say only 'Thank you' and mean it.",
  },
  {
    id: "conf_comparison_trap",
    categoryId: "confidence",
    name: "Comparison Cleanse",
    description: "Focus on YOUR journey",
    instructions:
      "Name 3 performers you've compared yourself to unfavorably. Then say aloud: '[Name] is on their journey. I am on mine. My path is unique and valid.' Comparison is the thief of confidence.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Name a performer you've compared yourself to, then claim your own unique path.",
  },
  {
    id: "conf_celebration",
    categoryId: "confidence",
    name: "Celebrate Small Wins",
    description: "Honor every achievement",
    instructions:
      "List 5 tiny performing wins from this week — you hit a note, you remembered a line, you made someone laugh. For each one, physically celebrate: pump your fist, say 'YES!', give yourself a round of applause.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Name 5 small wins from your practice this week and celebrate each one.",
  },
  {
    id: "conf_breathe_perform",
    categoryId: "confidence",
    name: "Pre-Performance Breathing",
    description: "Calming techniques for before you go on",
    instructions:
      "Practice box breathing: breathe in 4 counts, hold 4, out 4, hold 4. Do 5 rounds. This activates your parasympathetic nervous system and reduces performance anxiety. Use it backstage.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Lead me through 5 rounds of box breathing. Describe how you feel after.",
  },
  {
    id: "conf_centering",
    categoryId: "confidence",
    name: "Centering Ritual",
    description: "Your 3-minute pre-show routine",
    instructions:
      "Create YOUR personal pre-performance ritual: breathe, shake out, say your affirmation, do your power pose, take one slow breath in and walk in. Practice it until it becomes automatic.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Walk me through your personal pre-show ritual from start to finish.",
  },
  {
    id: "conf_mantra",
    categoryId: "confidence",
    name: "Personal Mantra",
    description: "Create your performance mantra",
    instructions:
      "Your mantra is a short sentence that captures your performance identity. Examples: 'I am ready. I am enough. I am the show.' Create yours. Say it 10 times with growing intensity.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Create your personal performance mantra and say it 10 times with growing power.",
  },
  {
    id: "conf_body_language",
    categoryId: "confidence",
    name: "Power Body Language",
    description: "How posture creates confidence",
    instructions:
      "Stand with a curved, collapsed posture for 30 seconds. Notice how you feel. Now shift to an expansive, open posture for 30 seconds. Notice the difference. Posture is performance.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Show collapsed posture vs expansive posture. Describe how each feels.",
  },
  {
    id: "conf_bold_choice",
    categoryId: "confidence",
    name: "Bold Artistic Choice",
    description: "Make a committed, unexpected choice",
    instructions:
      "Take any line of text. Make the most unexpected possible interpretation — if the obvious choice is 'happy', try 'devastated'. Commit completely. Bold choices are remembered. Safe choices are forgotten.",
    duration: 4,
    difficulty: 3,
    assessmentPrompt: "Take a simple line and perform it in the most unexpected way possible.",
  },
  {
    id: "conf_resilience",
    categoryId: "confidence",
    name: "Resilience Practice",
    description: "Bounce back stronger",
    instructions:
      "Think of a difficult performing moment (nerves, forgot lines, harsh feedback). Describe it, then answer: What did I do right? What did I learn? How am I stronger now? Resilience is a skill.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Share a difficult moment and what it taught you about your resilience.",
  },
  {
    id: "conf_self_compassion",
    categoryId: "confidence",
    name: "Self-Compassion",
    description: "Treat yourself as a dear friend",
    instructions:
      "Imagine your best friend failed an audition. What would you say to them? Now say EXACTLY those same words to yourself. Self-compassion is not weakness — it is the foundation of resilience.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Speak to yourself as you would to a dear friend who just failed an audition.",
  },
  {
    id: "conf_ownership",
    categoryId: "confidence",
    name: "Take Up Space",
    description: "Physically own a room",
    instructions:
      "Stand in the center of your space. Spread your arms wide. Take a deep breath. Say 'This stage is mine.' Then walk slowly around the entire perimeter, touching every wall, claiming every inch.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Physically claim the room — arms wide, walk the perimeter, say 'This stage is mine.'",
  },
  {
    id: "conf_audience_connection",
    categoryId: "confidence",
    name: "Audience Connection",
    description: "Project energy toward the audience",
    instructions:
      "Imagine 100 people sitting in front of you. Feel the energy between you and them — it goes BOTH ways. Send energy out to them with your eyes, your presence, your intention. This is what separates good performers from great ones.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Perform a short piece connecting with an imaginary full house.",
  },
  {
    id: "conf_joy",
    categoryId: "confidence",
    name: "Rediscover Your Joy",
    description: "Remember why you love this",
    instructions:
      "Think of the moment you first fell in love with performing. Describe it out loud. Reconnect to that feeling — the joy, the excitement, the magic. THIS is why you do it. Perform from that place.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Describe why you love performing — your first memory or greatest joy.",
  },
  {
    id: "conf_identity",
    categoryId: "confidence",
    name: "Performer Identity",
    description: "Own who you are",
    instructions:
      "Complete these sentences aloud 3 times each: 'I am a performer.' 'My voice matters.' 'I belong on this stage.' 'The world needs my art.' Identity is built through repetition.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "Say 'I am a performer — the world needs my art' with total conviction.",
  },
  {
    id: "conf_growth_mindset",
    categoryId: "confidence",
    name: "Growth Mindset",
    description: "Yet is a superpower",
    instructions:
      "Change these phrases: 'I can't sing high notes' becomes 'I can't sing high notes YET.' 'I always forget my lines' becomes 'I'm still developing my memorization skills.' Add YET to every limitation.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Name 3 things you can't do yet and reframe each with a growth mindset.",
  },
  {
    id: "conf_purpose",
    categoryId: "confidence",
    name: "Performance Purpose",
    description: "Reconnect to your why",
    instructions:
      "Answer aloud: WHY do you perform? Not 'because I like it' but deeper — what does performing give you that nothing else does? What do you want to give to audiences? Purpose is the deepest source of confidence.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Answer: Why do you truly perform? What do you want to give to your audience?",
  },
  {
    id: "conf_anxiety_toolkit",
    categoryId: "confidence",
    name: "Anxiety Toolkit",
    description: "5 techniques for performance anxiety",
    instructions:
      "Practice all 5 in sequence: (1) Name it — 'I feel nervous and that's okay.' (2) Breathe — 4-7-8 breath. (3) Move — shake it out for 30 seconds. (4) Ground — feel your feet on the floor. (5) Reframe — 'This is excitement, not fear.' These work in real auditions.",
    duration: 5,
    difficulty: 1,
    assessmentPrompt: "Walk me through all 5 anxiety-management steps from your toolkit.",
  },
  {
    id: "conf_rest_strength",
    categoryId: "confidence",
    name: "Rest as Strength",
    description: "Honor rest as part of practice",
    instructions:
      "Performers often feel guilty resting. But rest IS training — your brain consolidates learning during sleep, and your voice heals during silence. For 3 minutes, simply sit quietly and breathe. Then name one thing your body needs right now.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Sit in intentional rest for 2 minutes. What does your body need right now?",
  },
  {
    id: "conf_challenge_seeker",
    categoryId: "confidence",
    name: "Challenge Seeker",
    description: "Actively seek feedback and difficulty",
    instructions:
      "Great performers don't avoid hard feedback — they seek it. Think of the most challenging aspect of your upcoming audition. Now deliberately practice THAT thing, not the easy parts. Name it, do it, and note what you learned.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Name the hardest part of your audition, then practice exactly that thing.",
  },
  {
    id: "conf_creative_courage",
    categoryId: "confidence",
    name: "Creative Courage",
    description: "Try something you've never done",
    instructions:
      "Choose something in your performance you've always been afraid to try — a higher note, a bolder physical choice, a moment of total stillness, a risk. Do it now. Creative courage is the difference between a good performance and an unforgettable one.",
    duration: 5,
    difficulty: 3,
    assessmentPrompt: "Name something you've never dared to try in performance, then do it.",
  },
  {
    id: "conf_storytelling_self",
    categoryId: "confidence",
    name: "Your Performer Story",
    description: "Own your journey",
    instructions:
      "Tell the story of your performing arts journey in 2 minutes: when did it start? What were your early experiences? What's the best moment so far? Where are you going? Your story is your brand — know it and own it.",
    duration: 4,
    difficulty: 2,
    assessmentPrompt: "Tell your performing arts story from the beginning to right now — 2 minutes.",
  },
  {
    id: "conf_accountability",
    categoryId: "confidence",
    name: "Accountability Commitment",
    description: "Make a promise and keep it",
    instructions:
      "State aloud a specific practice goal for the next 3 days: 'I commit to practicing [specific skill] for [specific time] every day until [audition date].' Then say: 'I am someone who keeps their commitments to themselves.' Mean both.",
    duration: 3,
    difficulty: 1,
    assessmentPrompt: "State your 3-day specific practice commitment out loud. Then own it.",
  },
  {
    id: "conf_progress_review",
    categoryId: "confidence",
    name: "Progress Reflection",
    description: "See how far you've come",
    instructions:
      "Think back to where you started. Compare your current skills to when you began. Name 3 specific, concrete ways you have improved. Growth is always happening, even when it's invisible. Naming it makes it real.",
    duration: 4,
    difficulty: 1,
    assessmentPrompt: "Name 3 specific skills where you are noticeably better than when you started.",
  },
  {
    id: "conf_pre_show_ritual",
    categoryId: "confidence",
    name: "Pre-Show Ritual",
    description: "Build your complete audition day routine",
    instructions:
      "Design your complete audition-day routine: morning warmup, what you eat, how you travel, what music you listen to, what you say to yourself backstage. A consistent ritual signals your brain that it's time to perform at your peak.",
    duration: 5,
    difficulty: 2,
    assessmentPrompt: "Walk me through your complete audition day from waking up to walking on stage.",
  },
];

export const WARMUPS: Warmup[] = [
  {
    id: "wu_shake",
    name: "Full Body Shake",
    description: "Release tension everywhere",
    type: "physical",
    duration: 2,
    instructions:
      "Shake your right hand, then left, then both arms, then your legs, then your whole body at once. Do this for 30 seconds then stop and feel the buzz.",
  },
  {
    id: "wu_neck",
    name: "Neck & Shoulder Release",
    description: "Loosen your upper body",
    type: "physical",
    duration: 2,
    instructions:
      "Slowly roll your neck left and right (never all the way back). Do 4 slow circles each direction. Then roll your shoulders: 8 forward, 8 backward.",
  },
  {
    id: "wu_spine",
    name: "Spinal Roll",
    description: "Mobilize your spine",
    type: "physical",
    duration: 2,
    instructions:
      "Stand tall. Nod your chin to your chest, then slowly let your upper back round forward, then middle back, lower back, until you're hanging like a rag doll. Then uncurl slowly upward.",
  },
  {
    id: "wu_jaw",
    name: "Jaw Massage",
    description: "Release jaw tension",
    type: "vocal",
    duration: 2,
    instructions:
      "Place your fingertips on your jaw muscles. Make gentle circular massaging motions for 30 seconds. Then let your jaw drop open gently — feel the weight of it.",
  },
  {
    id: "wu_yawn",
    name: "Yawn & Sigh",
    description: "Open your throat",
    type: "vocal",
    duration: 2,
    instructions:
      "Induce a big yawn — feel how your throat opens. As you exhale, let out a long, luxurious sigh. Do this 3 times. This is one of the best ways to open your vocal instrument.",
  },
  {
    id: "wu_lip_trill_wu",
    name: "Lip Trills",
    description: "Wake up your voice gently",
    type: "vocal",
    duration: 3,
    instructions:
      "Relax your lips and blow air through them to create a motorboat sound. Keep this going on a comfortable pitch for 30 seconds. Then slide up and down in pitch.",
  },
  {
    id: "wu_tongue",
    name: "Tongue Workout",
    description: "Sharpen your articulation",
    type: "vocal",
    duration: 2,
    instructions:
      "Stick your tongue out as far as it will go and wiggle it left, right, up, down. Then make circles. Then say 'la la la la la' very fast for 10 seconds.",
  },
  {
    id: "wu_hum",
    name: "Mmm Hum",
    description: "Find facial resonance",
    type: "vocal",
    duration: 2,
    instructions:
      "Gently hum 'mmmm' on a comfortable note. Feel the buzz in your lips. Slowly let the pitch glide upward, keeping the hum consistent. Then glide back down.",
  },
  {
    id: "wu_raspberry",
    name: "Raspberry Run",
    description: "Energize your breath",
    type: "vocal",
    duration: 2,
    instructions:
      "Blow a long raspberry on one breath. How long can you sustain it? Try 3 times, improving each time.",
  },
  {
    id: "wu_ha",
    name: "HA Explosions",
    description: "Activate your breath support",
    type: "vocal",
    duration: 2,
    instructions:
      "Say 'HA!' from your belly — sharp and explosive. Do 10 of them. Then say 'ha ha ha ha ha' in a rapid stream. This wakes up your diaphragm.",
  },
  {
    id: "wu_breath",
    name: "Centered Breath",
    description: "Calm and ground yourself",
    type: "mental",
    duration: 3,
    instructions:
      "Breathe in slowly for 4 counts. Hold for 4 counts. Exhale slowly for 8 counts. Repeat 3 times. Place one hand on your belly and feel it rise and fall.",
  },
  {
    id: "wu_body_scan",
    name: "Body Scan",
    description: "Connect mind and body",
    type: "mental",
    duration: 3,
    instructions:
      "Close your eyes. Mentally scan from head to toes. Wherever you notice tension, breathe into it and let it go. End by squeezing every muscle, then releasing everything at once.",
  },
  {
    id: "wu_word_assoc",
    name: "Theatre Word Association",
    description: "Warm up your creative mind",
    type: "mental",
    duration: 2,
    instructions:
      "Say a performing arts word (stage). Then immediately say another connected word (lights). Then another (applause). Keep going as fast as you can for 60 seconds.",
  },
  {
    id: "wu_color_breath",
    name: "Color Breathing",
    description: "Visualize your calm",
    type: "mental",
    duration: 3,
    instructions:
      "Choose your favorite color. Breathe in and imagine filling your lungs with that color — calming and warm. Breathe out and imagine gray stress leaving. Do 8 breaths.",
  },
  {
    id: "wu_freeze",
    name: "Shake & Freeze",
    description: "Release and center",
    type: "physical",
    duration: 2,
    instructions:
      "Shake your entire body vigorously for 10 seconds — everything loose. Then FREEZE completely still. Feel the contrast between chaos and stillness. Repeat 3 times.",
  },
  {
    id: "wu_star_jumps",
    name: "Star Jumps",
    description: "Get your energy up",
    type: "physical",
    duration: 2,
    instructions:
      "Do 15 star jumps. Then plant your feet and take one big breath in. Notice how your body is now awake and buzzing — that's the energy you want on stage.",
  },
  {
    id: "wu_hip_circles",
    name: "Hip Circles",
    description: "Loosen your center",
    type: "physical",
    duration: 2,
    instructions:
      "Hands on hips. Make big, slow circles — 8 each direction. Then figure-eights. This loosens the center of your body which is the source of all movement.",
  },
  {
    id: "wu_wrists_ankles",
    name: "Joint Circles",
    description: "Loosen the extremities",
    type: "physical",
    duration: 2,
    instructions:
      "Circle both wrists 8 times each direction. Then both ankles 8 times each direction. Pick up each foot and shake it. This releases tension in your extremities.",
  },
  {
    id: "wu_march",
    name: "High Knee March",
    description: "Wake up your whole body",
    type: "physical",
    duration: 2,
    instructions:
      "March in place lifting your knees as high as they'll go. Pump your arms. Do this for 30 seconds. Then stop and stand in neutral. Feel how alive your body is.",
  },
  {
    id: "wu_mirror_self",
    name: "Mirror Check",
    description: "See what the audience sees",
    type: "mental",
    duration: 2,
    instructions:
      "Stand in front of a mirror. Look at yourself — really look. Notice your posture, expression, presence. Adjust: shoulders back, chin level, soft smile, eyes bright.",
  },
  {
    id: "wu_vowel_flow",
    name: "Vowel Flow",
    description: "Smooth your vocal pathway",
    type: "vocal",
    duration: 3,
    instructions:
      "On one breath, slowly move through: AH... EH... EE... OH... OO. Do it on a single pitch. Feel how each vowel reshapes your mouth. Do 5 different pitches.",
  },
  {
    id: "wu_siren_wu",
    name: "Morning Siren",
    description: "Wake up your full range",
    type: "vocal",
    duration: 2,
    instructions:
      "On 'wheee' glide smoothly from your lowest comfortable note all the way to your highest and back down. Do this 5 times. Keep it fluid.",
  },
  {
    id: "wu_gibberish_wu",
    name: "Gibberish Warmup",
    description: "Loosen your impulses",
    type: "mental",
    duration: 2,
    instructions:
      "Have a complete conversation with yourself in total gibberish. Ask a question in gibberish. Answer it. Get excited. Get sad. Use all your acting impulses but no real words.",
  },
  {
    id: "wu_status_walk",
    name: "Status Walk",
    description: "Find your power",
    type: "physical",
    duration: 2,
    instructions:
      "Walk as a 1 out of 10 status (tiny, invisible). Then shift instantly to a 10 (the most important person in the world). Then find a comfortable 7 — confident but approachable.",
  },
  {
    id: "wu_eye_focus",
    name: "Eye Focus",
    description: "Train your stage eye",
    type: "mental",
    duration: 2,
    instructions:
      "Find a point on the wall. Hold your gaze there for 30 seconds — soft but focused, like you're thinking deeply. This is 'stage eye' — present, alive, and connected.",
  },
  {
    id: "wu_twist",
    name: "Spinal Twist",
    description: "Open your torso",
    type: "physical",
    duration: 2,
    instructions:
      "Stand feet shoulder-width apart. Let arms hang loose. Twist your torso gently left and right, letting arms swing naturally. Gradually increase the range. 20 twists each direction.",
  },
  {
    id: "wu_humming_scale",
    name: "Humming Scales",
    description: "Gentle vocal warmup",
    type: "vocal",
    duration: 3,
    instructions:
      "Hum a major scale up (do-re-mi-fa-sol-la-ti-do), then back down. Start comfortable and low. After 3 scales, move the start note up a half step. Do 5 total scales.",
  },
  {
    id: "wu_intention_wu",
    name: "Intention Setting",
    description: "Focus your practice",
    type: "mental",
    duration: 2,
    instructions:
      "Answer aloud: What is ONE thing you want to improve today? Why does performing matter to you? Say your audition date out loud. Picture yourself there. You are ready.",
  },
  {
    id: "wu_face",
    name: "Face Workout",
    description: "Loosen your expressions",
    type: "physical",
    duration: 2,
    instructions:
      "Scrunch your entire face tight for 5 seconds, then release. Open your mouth and eyes as wide as possible for 5 seconds, release. Chew like you're eating a massive, delicious imaginary sandwich.",
  },
  {
    id: "wu_chest_opening",
    name: "Chest Opening",
    description: "Open your voice and presence",
    type: "physical",
    duration: 2,
    instructions:
      "Clasp hands behind your back. Squeeze shoulder blades together and lift your chest toward the ceiling. Hold 10 seconds. Release. Repeat 3 times. Performers need open chests.",
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getExercisesForCategory(categoryId: string): Exercise[] {
  return EXERCISES.filter((e) => e.categoryId === categoryId);
}

export function getDailyWarmup(dayOffset: number = 0): Warmup {
  const today = new Date();
  const dayNumber =
    Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) + dayOffset;
  return WARMUPS[dayNumber % WARMUPS.length];
}

export function getDailyExercises(categoryId: string, count: number = 4): Exercise[] {
  const categoryExercises = getExercisesForCategory(categoryId);
  const today = new Date();
  const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const shuffled = [...categoryExercises];
  let seed = dayNumber + categoryId.charCodeAt(0);
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
