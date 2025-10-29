// src/lib/datetime.ts
export function formatDateTime(iso: string, locale = "pt-BR") {
  const d = new Date(iso);
  return d.toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
}

export function isLessThanHourFromNow(iso: string) {
  return new Date(iso).getTime() - Date.now() < 60 * 60 * 1000;
}

export function formatTime(iso: string, locale = "pt-BR") {
  const d = new Date(iso);
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}