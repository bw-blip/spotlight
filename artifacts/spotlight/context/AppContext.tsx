import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  UserProfile,
  ScoreEntry,
  TodayData,
  StreakData,
  getProfile,
  saveProfile,
  getScores,
  addScore,
  getTodayData,
  saveTodayData,
  getStreak,
  updateStreak,
} from "@/services/storage";
import { refreshDailyReminders } from "@/services/notifications";

interface AppContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  scores: ScoreEntry[];
  todayData: TodayData | null;
  streak: StreakData;
  refreshProfile: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  addScoreEntry: (entry: ScoreEntry) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeWarmup: (warmupId: string) => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => Promise<void>;
  getLatestScoreForCategory: (categoryId: string) => number | null;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [todayData, setTodayData] = useState<TodayData | null>(null);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
  });
  const profileRef = useRef<UserProfile | null>(null);

  // Keep ref in sync so the AppState listener always has the latest profile
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Replenish the rolling notification window each time the app comes to foreground
  useEffect(() => {
    function handleAppStateChange(nextState: AppStateStatus) {
      if (nextState === "active") {
        const p = profileRef.current;
        if (p?.reminderEnabled && p.reminderHour != null && p.reminderMinute != null) {
          refreshDailyReminders(p.reminderHour, p.reminderMinute).catch(() => {});
        }
      }
    }
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, []);

  const refreshAll = useCallback(async () => {
    const [p, s, t, st] = await Promise.all([
      getProfile(),
      getScores(),
      getTodayData(),
      getStreak(),
    ]);
    setProfile(p);
    setScores(s);
    setTodayData(t);
    setStreak(st);
  }, []);

  const refreshProfile = useCallback(async () => {
    const p = await getProfile();
    setProfile(p);
  }, []);

  useEffect(() => {
    refreshAll().finally(() => setIsLoading(false));
  }, [refreshAll]);

  const updateProfile = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
    setProfile(p);
  }, []);

  const addScoreEntry = useCallback(async (entry: ScoreEntry) => {
    await addScore(entry);
    setScores((prev) => [...prev, entry]);
  }, []);

  const completeExercise = useCallback(
    async (exerciseId: string) => {
      if (!todayData) return;
      if (todayData.completedExerciseIds.includes(exerciseId)) return;
      const updated: TodayData = {
        ...todayData,
        completedExerciseIds: [...todayData.completedExerciseIds, exerciseId],
      };
      await saveTodayData(updated);
      setTodayData(updated);
      const newStreak = await updateStreak();
      setStreak(newStreak);
    },
    [todayData]
  );

  const completeWarmup = useCallback(
    async (warmupId: string) => {
      if (!todayData) return;
      const updated: TodayData = {
        ...todayData,
        warmupId,
        warmupComplete: true,
      };
      await saveTodayData(updated);
      setTodayData(updated);
    },
    [todayData]
  );

  const setSelectedCategory = useCallback(
    async (categoryId: string | null) => {
      if (!todayData) return;
      const updated: TodayData = { ...todayData, selectedCategoryId: categoryId };
      await saveTodayData(updated);
      setTodayData(updated);
    },
    [todayData]
  );

  const getLatestScoreForCategory = useCallback(
    (categoryId: string): number | null => {
      const categoryScores = scores
        .filter((s) => s.categoryId === categoryId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      return categoryScores.length > 0 ? categoryScores[0].score : null;
    },
    [scores]
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoading,
        scores,
        todayData,
        streak,
        refreshProfile,
        updateProfile,
        addScoreEntry,
        completeExercise,
        completeWarmup,
        setSelectedCategory,
        getLatestScoreForCategory,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
