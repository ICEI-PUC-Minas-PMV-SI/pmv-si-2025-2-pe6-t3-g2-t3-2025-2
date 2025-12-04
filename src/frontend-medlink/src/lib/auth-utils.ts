import Cookies from "js-cookie";

export function parseJwt(token: string | undefined | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = Cookies.get("token");
  const payload = parseJwt(token);
  return payload?.sub || payload?.email || null;
}
