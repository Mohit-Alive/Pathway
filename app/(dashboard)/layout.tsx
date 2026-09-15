import { AppShell } from '@/components/shell/AppShell';

// TODO(auth phase): gate this layout with auth.protect() + requireUser()
// once the DB-backed user/roadmap schema lands. Collections stays empty
// (hides the sidebar section, per the empty-state rule) until then.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
