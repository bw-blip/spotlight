export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleDailyReminder(
  _hour: number,
  _minute: number
): Promise<void> {}

export async function refreshDailyReminders(
  _hour: number,
  _minute: number
): Promise<void> {}

export async function cancelDailyReminder(): Promise<void> {}

export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMin = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMin} ${period}`;
}
