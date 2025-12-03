import MedicoShell from "./MedicoShell";

export default function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MedicoShell>{children}</MedicoShell>;
}
