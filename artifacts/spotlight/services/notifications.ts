import * as Notifications from "expo-notifications";

const MOTIVATIONS = [
  "Your stage is waiting! Let's practice today.",
  "Every great performer started where you are. Keep going!",
  "15 minutes of practice = a stronger audition tomorrow!",
  "Your audition is getting closer. Time to shine!",
  "Today's practice is tomorrow's confidence. Let's go!",
  "The best performers practice even when they don't feel like it.",
  "You've got this! Show up for yourself today.",
  "One practice session closer to getting that role!",
  "Warm up your voice and light up the stage — practice awaits!",
  "Champions don't skip practice days. You've got this!",
  "Your future self will thank you for practicing today.",
  "A little practice each day adds up to a lot of confidence.",
  "The spotlight is yours — go claim it!",
  "Keep that streak alive! Practice time!",
  "Even a 10-minute session builds a stronger performer.",
  "Your voice is your instrument — tune it today!",
];

function motivationForDay(dayIndex: number): string {
  return MOTIVATIONS[dayIndex % MOTIVATIONS.length];
}

const DAYS_AHEAD = 64;

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  // Determine the first trigger: today at the given time, or tomorrow if that has already passed
  const firstTrigger = new Date(now);
  firstTrigger.setHours(hour, minute, 0, 0);
  if (firstTrigger <= now) {
    firstTrigger.setDate(firstTrigger.getDate() + 1);
  }

  // Base all subsequent dates off firstTrigger to guarantee one notification per day
  const schedulePromises: Promise<string>[] = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const trigger = new Date(firstTrigger);
    trigger.setDate(firstTrigger.getDate() + i);

    schedulePromises.push(
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to practice, star! ⭐",
          body: motivationForDay(i),
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: trigger,
        } satisfies Notifications.DateTriggerInput,
      })
    );
  }

  await Promise.all(schedulePromises);
}

/**
 * Called on app foreground to replenish the rolling 64-day notification window.
 * Reschedules when fewer than 30 days remain so reminders continue indefinitely
 * as long as the user opens the app at least once every ~34 days.
 * Errors are intentionally not thrown — a failed refresh is non-critical.
 */
export async function refreshDailyReminders(
  hour: number,
  minute: number
): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  // Replenish when fewer than 30 days remain in the window
  if (scheduled.length < 30) {
    await scheduleDailyReminder(hour, minute);
  }
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMin = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMin} ${period}`;
}
