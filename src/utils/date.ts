export function today(): { start: number; end: number } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 86400000);
  return { start: start.getTime(), end: end.getTime() };
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateShort(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function weekRange(date: Date = new Date()): { start: number; end: number } {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.getFullYear(), date.getMonth(), diff, 0, 0, 0);
  const nextMonday = new Date(monday.getTime() + 7 * 86400000);
  return { start: monday.getTime(), end: nextMonday.getTime() };
}

export function monthRange(date: Date = new Date()): { start: number; end: number } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start: start.getTime(), end: end.getTime() };
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// 0.5h ~ 6h time window for correlation
export const CORRELATION_WINDOW_MS = {
  min: 30 * 60 * 1000,  // 30 min
  max: 6 * 60 * 60 * 1000, // 6 hours
};
