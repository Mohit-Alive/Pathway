import { AppShell } from "@/components/shell/AppShell";
import { requireUserOrRedirect } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserOrRedirect();
  return <AppShell>{children}</AppShell>;
}
