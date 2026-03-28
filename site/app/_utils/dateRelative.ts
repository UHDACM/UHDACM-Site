const MS_PER_DAY = 86_400_000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysUntil(iso: string, now: Date = new Date()): number | null {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = startOfDay(target).getTime() - startOfDay(now).getTime();
  return Math.round(diffMs / MS_PER_DAY);
}

export function isUpcoming(iso: string, now: Date = new Date()): boolean {
  const days = daysUntil(iso, now);
  return days !== null && days >= 0;
}

export function formatRelativeUpcoming(
  iso: string,
  now: Date = new Date(),
): string | null {
  const days = daysUntil(iso, now);
  if (days === null || days < 0) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 28) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "In 1 week" : `In ${weeks} weeks`;
  }
  if (days < 60) return "Next month";
  const months = Math.round(days / 30);
  return `In ${months} months`;
}
