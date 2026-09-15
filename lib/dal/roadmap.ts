import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/client";
import {
  roadmaps,
  roadmapNodes,
  nodePrerequisites,
  nodeProgress,
  type Roadmap,
  type RoadmapNode,
} from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { computeNodeStatuses, type ComputedNodeStatus } from "@/lib/roadmap/status";
import { withDbRetry } from "@/lib/db/retry";

export interface RoadmapWithGraph {
  roadmap: Roadmap;
  nodes: (RoadmapNode & { computedStatus: ComputedNodeStatus })[];
  edges: { id: string; source: string; target: string }[];
  stats: {
    totalNodes: number;
    completedNodes: number;
    inProgressNodes: number;
    availableNodes: number;
    lockedNodes: number;
    totalHours: number;
    completedHours: number;
  };
}

export async function getActiveRoadmap(): Promise<RoadmapWithGraph | null> {
  const user = await requireUser();

  const userRoadmaps = await withDbRetry(() =>
    db
      .select()
      .from(roadmaps)
      .where(and(eq(roadmaps.userId, user.id), eq(roadmaps.isActive, true)))
      .limit(1)
  );

  if (userRoadmaps.length === 0) {
    return null;
  }

  const roadmap = userRoadmaps[0];

  const nodes = await withDbRetry(() =>
    db.select().from(roadmapNodes).where(eq(roadmapNodes.roadmapId, roadmap.id))
  );

  if (nodes.length === 0) {
    return {
      roadmap,
      nodes: [],
      edges: [],
      stats: {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        availableNodes: 0,
        lockedNodes: 0,
        totalHours: 0,
        completedHours: 0,
      },
    };
  }

  const nodeIds = nodes.map((n) => n.id);

  const prereqs = await withDbRetry(() =>
    db.select().from(nodePrerequisites).where(eq(nodePrerequisites.roadmapId, roadmap.id))
  );

  const progressList = await withDbRetry(() =>
    db
      .select()
      .from(nodeProgress)
      .where(and(eq(nodeProgress.userId, user.id), inArray(nodeProgress.nodeId, nodeIds)))
  );

  const computedStatuses = computeNodeStatuses(
    nodes.map((n) => ({ id: n.id, nodeId: n.nodeId })),
    prereqs.map((p) => ({ nodeId: p.nodeId, prerequisiteNodeId: p.prerequisiteNodeId })),
    progressList.map((p) => ({ nodeId: p.nodeId, status: p.status }))
  );

  let completedNodes = 0;
  let inProgressNodes = 0;
  let availableNodes = 0;
  let lockedNodes = 0;
  let totalHours = 0;
  let completedHours = 0;

  const nodesWithStatus = nodes.map((node) => {
    const computed = computedStatuses.get(node.id) ?? {
      nodeId: node.id,
      status: "locked",
      isUnlocked: false,
      prerequisitesCompleted: false,
    };

    totalHours += node.estimatedHours;

    if (computed.status === "completed") {
      completedNodes++;
      completedHours += node.estimatedHours;
    } else if (computed.status === "in_progress") {
      inProgressNodes++;
    } else if (computed.status === "available") {
      availableNodes++;
    } else {
      lockedNodes++;
    }

    return {
      ...node,
      computedStatus: computed,
    };
  });

  const edges = prereqs.map((p) => ({
    id: `e-${p.prerequisiteNodeId}-${p.nodeId}`,
    source: p.prerequisiteNodeId,
    target: p.nodeId,
  }));

  return {
    roadmap,
    nodes: nodesWithStatus,
    edges,
    stats: {
      totalNodes: nodes.length,
      completedNodes,
      inProgressNodes,
      availableNodes,
      lockedNodes,
      totalHours,
      completedHours,
    },
  };
}

export async function updateNodeProgress(
  nodeId: string,
  newStatus: "in_progress" | "completed"
) {
  const user = await requireUser();

  // Verify node belongs to active roadmap of user
  const targetNode = await withDbRetry(() =>
    db
      .select({
        id: roadmapNodes.id,
        roadmapId: roadmapNodes.roadmapId,
        estimatedHours: roadmapNodes.estimatedHours,
      })
      .from(roadmapNodes)
      .innerJoin(roadmaps, eq(roadmapNodes.roadmapId, roadmaps.id))
      .where(
        and(
          eq(roadmapNodes.id, nodeId),
          eq(roadmaps.userId, user.id),
          eq(roadmaps.isActive, true)
        )
      )
      .limit(1)
  );

  if (targetNode.length === 0) {
    throw new Error("Node not found or not authorized.");
  }

  const now = new Date();

  await db
    .insert(nodeProgress)
    .values({
      userId: user.id,
      nodeId,
      status: newStatus,
      startedAt: newStatus === "in_progress" ? now : undefined,
      completedAt: newStatus === "completed" ? now : undefined,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [nodeProgress.userId, nodeProgress.nodeId],
      set: {
        status: newStatus,
        completedAt: newStatus === "completed" ? now : undefined,
        updatedAt: now,
      },
    });

  return { success: true };
}
