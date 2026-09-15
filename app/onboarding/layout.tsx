import { redirect } from "next/navigation";
import { requireUserOrRedirect } from "@/lib/auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUserOrRedirect();

  // A user who has already generated a roadmap should never see the
  // questionnaire again just by visiting /onboarding (e.g. from the
  // landing page's "Get Started Now" link, which always points here).
  if (user.isOnboarded) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
