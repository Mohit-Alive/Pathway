import { cache } from "react";
import { getOptionalUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db/client";
import {
  roadmaps,
  roadmapNodes,
  nodeProgress,
  dailyActivity,
  quizAttempts,
  userCourseProgress,
} from "@/lib/db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { getActiveRoadmap } from "./roadmap";
import { format, subDays } from "date-fns";

export interface DashboardMetrics {
  userTrack: string;
  paceIndex: number;
  paceLabel: string;
  paceSubtext: string;
  totalHoursLearned: number;
  completedModulesCount: number;
  totalModulesCount: number;
  streakDays: number;
  weeklyProgress: { day: string; hours: number; planned: number }[];
  todaysPlan: { time: string; title: string; category: string; duration: string }[];
  modulesNeedingAttention: {
    id: string;
    title: string;
    category: string;
    riskScore: number;
    reason: string;
  }[];
  skillMix: { name: string; hours: number; percentage: number; color: string }[];
  recommendedNext: { title: string; category: string; hours: number; tags: string[] }[];
}

export interface ProgressMetrics {
  overallCompletionPercentage: number;
  totalHoursSpent: number;
  totalModulesCompleted: number;
  averageQuizScore: string; // e.g. "92%" or "—"
  streakDays: number;
  activeDaysLast7: number;
  weeklyBuckets: { week: string; hours: number; targetHours: number }[];
  categoryBreakdown: { category: string; completed: number; total: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#3b82f6",
  Backend: "#10b981",
  Database: "#8b5cf6",
  DevOps: "#f59e0b",
  JavaScript: "#f7df1e",
  Core: "#6366f1",
  Tools: "#ec4899",
};

/**
 * Single derivation layer for Dashboard metrics.
 */
export const getDashboardMetrics = cache(async (): Promise<DashboardMetrics> => {
  const user = await requireUser();
  const roadmapData = await getActiveRoadmap();

  // Fetch last 30 days of daily activity
  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const activityRows = await db
    .select()
    .from(dailyActivity)
    .where(and(eq(dailyActivity.userId, user.id), gte(dailyActivity.date, thirtyDaysAgo)))
    .orderBy(desc(dailyActivity.date));

  let totalHoursLearned = 0;
  let streakDays = 0;
  for (const row of activityRows) {
    totalHoursLearned += row.hoursSpent;
  }
  if (activityRows.length > 0) {
    streakDays = activityRows[0].streakCount;
  }

  // Calculate Pace Index
  let paceIndex = 100;
  let paceLabel = "On Track";
  let paceSubtext = "Meeting weekly target budget";

  if (roadmapData && roadmapData.roadmap) {
    const targetWeeklyHours = Math.round(roadmapData.roadmap.budgetHours / roadmapData.roadmap.plannedWeeks);
    const actualWeeklyHours = totalHoursLearned; // Simple 30d window
    if (targetWeeklyHours > 0) {
      paceIndex = Math.min(150, Math.round((actualWeeklyHours / targetWeeklyHours) * 100));
      if (totalHoursLearned === 0) {
        paceIndex = 100;
        paceLabel = "Plan Readiness";
        paceSubtext = "Ready to start your first module";
      } else if (paceIndex < 70) {
        paceLabel = "Behind Pace";
        paceSubtext = `${targetWeeklyHours - Math.round(actualWeeklyHours)}h behind weekly target`;
      }
    }
  }

  // Build weekly progress chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, "yyyy-MM-dd");
  });

  const activityMap = new Map<string, number>();
  for (const r of activityRows) {
    activityMap.set(r.date, r.hoursSpent);
  }

  const plannedPerDay = roadmapData?.roadmap
    ? Number((roadmapData.roadmap.budgetHours / (roadmapData.roadmap.plannedWeeks * 5)).toFixed(1))
    : 2.0;

  const weeklyProgress = last7Days.map((dateStr) => {
    const dayLabel = format(new Date(dateStr), "EEE");
    const hours = activityMap.get(dateStr) ?? 0;
    return {
      day: dayLabel,
      hours: Number(hours.toFixed(1)),
      planned: plannedPerDay,
    };
  });

  // Recommended Next & Modules Needing Attention
  const availableNodes = roadmapData?.nodes.filter((n) => n.computedStatus.status === "available") ?? [];
  const inProgressNodes = roadmapData?.nodes.filter((n) => n.computedStatus.status === "in_progress") ?? [];

  const recommendedNext = availableNodes.slice(0, 3).map((n) => ({
    title: n.title,
    category: n.category,
    hours: n.estimatedHours,
    tags: n.tags,
  }));

  const modulesNeedingAttention = inProgressNodes.slice(0, 3).map((n) => ({
    id: n.id,
    title: n.title,
    category: n.category,
    riskScore: 85,
    reason: "In progress - continue learning",
  }));

  if (modulesNeedingAttention.length === 0 && availableNodes.length > 0) {
    modulesNeedingAttention.push({
      id: availableNodes[0].id,
      title: availableNodes[0].title,
      category: availableNodes[0].category,
      riskScore: 60,
      reason: "Prerequisites completed - ready to unlock",
    });
  }

  // Today's Plan from available / in_progress nodes
  const todaysPlan = (inProgressNodes.length > 0 ? inProgressNodes : availableNodes)
    .slice(0, 3)
    .map((n, i) => {
      const times = ["09:00 AM", "02:00 PM", "05:00 PM"];
      return {
        time: times[i] ?? "08:00 PM",
        title: n.title,
        category: n.category,
        duration: `${n.estimatedHours}h`,
      };
    });

  // Skill Mix calculation
  const categoryHours = new Map<string, number>();
  let totalSkillHours = 0;

  if (roadmapData) {
    for (const n of roadmapData.nodes) {
      const cat = n.category || "General";
      categoryHours.set(cat, (categoryHours.get(cat) ?? 0) + n.estimatedHours);
      totalSkillHours += n.estimatedHours;
    }
  }

  const skillMix = Array.from(categoryHours.entries()).map(([name, hours]) => ({
    name,
    hours,
    percentage: totalSkillHours > 0 ? Math.round((hours / totalSkillHours) * 100) : 0,
    color: CATEGORY_COLORS[name] ?? "#64748b",
  }));

  return {
    userTrack: user.track || roadmapData?.roadmap?.track || "Computer Science",
    paceIndex,
    paceLabel,
    paceSubtext,
    totalHoursLearned: Number(totalHoursLearned.toFixed(1)),
    completedModulesCount: roadmapData?.stats.completedNodes ?? 0,
    totalModulesCount: roadmapData?.stats.totalNodes ?? 0,
    streakDays,
    weeklyProgress,
    todaysPlan,
    modulesNeedingAttention,
    skillMix,
    recommendedNext,
  };
});

/**
 * Derivation layer for Progress page metrics.
 */
export const getProgressMetrics = cache(async (): Promise<ProgressMetrics> => {
  const user = await requireUser();
  const roadmapData = await getActiveRoadmap();

  // Average Quiz Score
  const quizAttemptsList = await db
    .select({ score: quizAttempts.score, total: quizAttempts.totalQuestions })
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, user.id));

  let averageQuizScore = "—";
  if (quizAttemptsList.length > 0) {
    let totalScorePct = 0;
    for (const q of quizAttemptsList) {
      totalScorePct += (q.score / Math.max(1, q.total)) * 100;
    }
    averageQuizScore = `${Math.round(totalScorePct / quizAttemptsList.length)}%`;
  }

  // Daily activity records
  const activityRows = await db
    .select()
    .from(dailyActivity)
    .where(eq(dailyActivity.userId, user.id))
    .orderBy(desc(dailyActivity.date));

  let totalHoursSpent = 0;
  let activeDaysLast7 = 0;

  const sevenDaysAgoStr = format(subDays(new Date(), 7), "yyyy-MM-dd");
  for (const r of activityRows) {
    totalHoursSpent += r.hoursSpent;
    if (r.date >= sevenDaysAgoStr && r.hoursSpent > 0) {
      activeDaysLast7++;
    }
  }

  const streakDays = activityRows[0]?.streakCount ?? 0;

  // Overall Completion %
  const completedNodes = roadmapData?.stats.completedNodes ?? 0;
  const totalNodes = roadmapData?.stats.totalNodes ?? 1;
  const overallCompletionPercentage = Math.round((completedNodes / totalNodes) * 100);

  // Category Breakdown
  const catMap = new Map<string, { completed: number; total: number }>();
  if (roadmapData) {
    for (const n of roadmapData.nodes) {
      const cat = n.category || "General";
      const entry = catMap.get(cat) ?? { completed: 0, total: 0 };
      entry.total++;
      if (n.computedStatus.status === "completed") {
        entry.completed++;
      }
      catMap.set(cat, entry);
    }
  }

  const categoryBreakdown = Array.from(catMap.entries()).map(([category, counts]) => ({
    category,
    completed: counts.completed,
    total: counts.total,
  }));

  // 4 weekly buckets
  const weeklyBuckets = [
    { week: "Week 1", hours: Number((totalHoursSpent * 0.25).toFixed(1)), targetHours: 10 },
    { week: "Week 2", hours: Number((totalHoursSpent * 0.25).toFixed(1)), targetHours: 10 },
    { week: "Week 3", hours: Number((totalHoursSpent * 0.25).toFixed(1)), targetHours: 10 },
    { week: "Week 4", hours: Number((totalHoursSpent * 0.25).toFixed(1)), targetHours: 10 },
  ];

  return {
    overallCompletionPercentage,
    totalHoursSpent: Number(totalHoursSpent.toFixed(1)),
    totalModulesCompleted: completedNodes,
    averageQuizScore,
    streakDays,
    activeDaysLast7,
    weeklyBuckets,
    categoryBreakdown,
  };
});
