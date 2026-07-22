import type {TripStatus} from '@/features/trips/types/trip';

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function enumerateDates(startDate: string, endDate: string): string[] {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const dates: string[] = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    dates.push(toIsoDate(cursor));
  }
  return dates;
}

export function getTripStatus(
  startDate: string,
  endDate: string,
  now = new Date()
): TripStatus {
  const today = toIsoDate(now);
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'past';
  return 'active';
}

export function differenceInCalendarDays(
  targetDate: string,
  from = new Date()
): number {
  const target = new Date(`${targetDate}T12:00:00`);
  const source = new Date(`${toIsoDate(from)}T12:00:00`);
  return Math.max(
    0,
    Math.round((target.getTime() - source.getTime()) / 86_400_000)
  );
}
