import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewConsultaClient from "./NewConsultaClient";

function parseJwt(token: string | undefined | null) {
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

export default async function NovaConsultaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get?.("token")?.value;

  if (!token) redirect("/login");

  const user = parseJwt(token);
  const isPaciente =
    user &&
    (user.role === "PACIENTE" ||
      (Array.isArray(user.authorities) &&
        user.authorities.includes("ROLE_PACIENTE")));
  if (!isPaciente) redirect("/login");

  return <NewConsultaClient />;
}
