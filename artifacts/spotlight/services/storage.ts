import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID = "local";

function key(suffix: string): string {
  return `${USER_ID}:${suffix}`;
}

export interface UserProfile {
  userId: string;
  name: string;
  grade: string;
  goalDate: string;
  onboardingComplete: boolean;
  createdAt: string;
  reminderEnabled?: boolean;
  reminderHour?: number;
  reminderMinute?: number;
}

export interface ScoreEntry {
  id: string;
  categoryId: string;
  score: number;
  tips: string[];
  exerciseId: string;
  exerciseName: string;
  timestamp: string;
}

export interface TodayData {
  date: string;
  warmupId: string | null;
  warmupComplete: boolean;
  completedExerciseIds: string[];
  selectedCategoryId: string | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
}

function todayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(key("profile"));
  return raw ? JSON.parse(raw) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(key("profile"), JSON.stringify(profile));
}

export async function getScores(): Promise<ScoreEntry[]> {
  const raw = await AsyncStorage.getItem(key("scores"));
  return raw ? JSON.parse(raw) : [];
}

export async function addScore(entry: ScoreEntry): Promise<void> {
  const scores = await getScores();
  scores.push(entry);
  await AsyncStorage.setItem(key("scores"), JSON.stringify(scores));
}

export async function getTodayData(): Promise<TodayData> {
  const today = todayDateStr();
  const raw = await AsyncStorage.getItem(key("today"));
  if (raw) {
    const data: TodayData = JSON.parse(raw);
    if (data.date === today) return data;
  }
  const fresh: TodayData = {
    date: today,
    warmupId: null,
    warmupComplete: false,
    completedExerciseIds: [],
    selectedCategoryId: null,
  };
  await AsyncStorage.setItem(key("today"), JSON.stringify(fresh));
  return fresh;
}

export async function saveTodayData(data: TodayData): Promise<void> {
  await AsyncStorage.setItem(key("today"), JSON.stringify(data));
}

export async function getStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(key("streak"));
  return raw
    ? JSON.parse(raw)
    : { currentStreak: 0, longestStreak: 0, lastCompletionDate: null };
}

export async function updateStreak(): Promise<StreakData> {
  const streak = await getStreak();
  const today = todayDateStr();
  if (streak.lastCompletionDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    streak.lastCompletionDate === yStr ? streak.currentStreak + 1 : 1;
  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streak.longestStreak),
    lastCompletionDate: today,
  };
  await AsyncStorage.setItem(key("streak"), JSON.stringify(updated));
  return updated;
}

export async function saveOnboardingResults(
  results: { categoryId: string; score: number; tips: string[] }[]
): Promise<void> {
  await AsyncStorage.setItem(key("onboarding_results"), JSON.stringify(results));
}

export async function getOnboardingResults(): Promise<
  { categoryId: string; score: number; tips: string[] }[]
> {
  const raw = await AsyncStorage.getItem(key("onboarding_results"));
  return raw ? JSON.parse(raw) : [];
}

export async function clearAll(): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const ourKeys = allKeys.filter((k) => k.startsWith(`${USER_ID}:`));
  await AsyncStorage.multiRemove(ourKeys);
}

export interface SceneFeedback {
  scene: string;
  feedback: string;
}

export interface MonologueSession {
  id: string;
  timestamp: string;
  overallScore: number;
  accuracyScore: number;
  expressionScore: number;
  pacingScore: number;
  emotionScore: number;
  tips: string[];
  sceneFeedback: SceneFeedback[];
}

export interface MonologueEntry {
  id: string;
  title: string;
  character: string;
  script: string;
  createdAt: string;
  lastPracticed: string | null;
  bestScore: number | null;
  sessions: MonologueSession[];
}

export async function getMonologues(): Promise<MonologueEntry[]> {
  const raw = await AsyncStorage.getItem(key("monologues"));
  return raw ? JSON.parse(raw) : [];
}

export async function saveMonologue(entry: MonologueEntry): Promise<void> {
  const all = await getMonologues();
  const idx = all.findIndex((m) => m.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  await AsyncStorage.setItem(key("monologues"), JSON.stringify(all));
}

export async function deleteMonologue(id: string): Promise<void> {
  const all = await getMonologues();
  await AsyncStorage.setItem(
    key("monologues"),
    JSON.stringify(all.filter((m) => m.id !== id))
  );
}

export async function addMonologueSession(
  monologueId: string,
  session: MonologueSession
): Promise<MonologueEntry | null> {
  const all = await getMonologues();
  const idx = all.findIndex((m) => m.id === monologueId);
  if (idx < 0) return null;
  const entry = { ...all[idx] };
  entry.sessions = [...(entry.sessions ?? []), session];
  entry.lastPracticed = session.timestamp;
  entry.bestScore =
    entry.bestScore === null
      ? session.overallScore
      : Math.max(entry.bestScore, session.overallScore);
  all[idx] = entry;
  await AsyncStorage.setItem(key("monologues"), JSON.stringify(all));
  return entry;
}
