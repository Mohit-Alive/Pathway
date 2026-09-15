import { requireUserOrRedirect } from "@/lib/auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserOrRedirect();
  return <>{children}</>;
}
