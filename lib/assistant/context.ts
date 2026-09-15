import { requireUser } from "@/lib/auth";
import { getActiveRoadmap } from "@/lib/dal/roadmap";
import { getDashboardMetrics } from "@/lib/dal/metrics";

export interface AssistantContext {
  /** Plain-text block injected into the system prompt. */
  summary: string;
}

/**
 * Builds the assistant's grounding context entirely server-side, from the
 * same Data Access Layer functions that power the dashboard. The client
 * never supplies this data - it cannot claim a different track, progress,
 * or roadmap than what is actually in the database for the signed-in user.
 */
export async function getAssistantContext(): Promise<AssistantContext> {
  const user = await requireUser();
  const [roadmapData, metrics] = await Promise.all([
    getActiveRoadmap(),
    getDashboardMetrics(),
  ]);

  const lines: string[] = [];

  lines.push(`- Name: ${user.name ?? "Learner"}`);
  lines.push(`- Target track: ${user.track ?? "Not yet chosen"}`);

  if (!roadmapData) {
    lines.push(
      "- No active roadmap yet. The learner has not completed onboarding. " +
        "If they ask about their roadmap, tell them to finish onboarding at " +
        "/onboarding to generate one - do not invent modules."
    );
    return { summary: lines.join("\n") };
  }

  const { roadmap, nodes, stats } = roadmapData;
  const completionPct = Math.round((stats.completedNodes / Math.max(1, stats.totalNodes)) * 100);

  lines.push(
    `- Active roadmap: "${roadmap.title}" (${stats.completedNodes}/${stats.totalNodes} modules complete, ${completionPct}%)`
  );

  const inProgress = nodes.filter((n) => n.computedStatus.status === "in_progress");
  const available = nodes.filter((n) => n.computedStatus.status === "available");
  const completed = nodes.filter((n) => n.computedStatus.status === "completed");

  if (inProgress.length > 0) {
    lines.push(`- Currently in progress: ${inProgress.map((n) => n.title).join(", ")}`);
  }
  if (available.length > 0) {
    lines.push(`- Unlocked and ready to start: ${available.slice(0, 6).map((n) => n.title).join(", ")}`);
  }
  if (completed.length > 0) {
    lines.push(`- Already completed: ${completed.map((n) => n.title).join(", ")}`);
  }

  lines.push(`- Learning pace: ${metrics.paceLabel} (${metrics.paceSubtext})`);
  lines.push(`- Current streak: ${metrics.streakDays} day(s)`);
  lines.push(`- Hours learned in the last 30 days: ${metrics.totalHoursLearned}h`);

  return { summary: lines.join("\n") };
}
