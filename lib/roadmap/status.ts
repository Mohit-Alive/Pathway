export type NodeStatus = "completed" | "in_progress" | "available" | "locked";

export interface GraphNodeInput {
  id: string; // node uuid
  nodeId: string; // node string slug e.g. "node_1"
}

export interface GraphEdgeInput {
  nodeId: string; // target node uuid
  prerequisiteNodeId: string; // source node uuid
}

export interface NodeProgressInput {
  nodeId: string; // node uuid
  status: string; // "completed" | "in_progress"
}

export interface ComputedNodeStatus {
  nodeId: string;
  status: NodeStatus;
  isUnlocked: boolean;
  prerequisitesCompleted: boolean;
}

/**
 * Pure function to derive status for all nodes in a roadmap graph.
 * Node status is never stored as a database column to eliminate data drift.
 */
export function computeNodeStatuses(
  nodes: GraphNodeInput[],
  prerequisites: GraphEdgeInput[],
  progressList: NodeProgressInput[]
): Map<string, ComputedNodeStatus> {
  const progressMap = new Map<string, string>();
  for (const p of progressList) {
    progressMap.set(p.nodeId, p.status);
  }

  // Build incoming prerequisites map: targetNodeId -> array of prerequisiteNodeIds
  const prereqMap = new Map<string, string[]>();
  for (const edge of prerequisites) {
    const list = prereqMap.get(edge.nodeId) ?? [];
    list.push(edge.prerequisiteNodeId);
    prereqMap.set(edge.nodeId, list);
  }

  const statusMap = new Map<string, ComputedNodeStatus>();

  for (const node of nodes) {
    const userStatus = progressMap.get(node.id);

    if (userStatus === "completed") {
      statusMap.set(node.id, {
        nodeId: node.id,
        status: "completed",
        isUnlocked: true,
        prerequisitesCompleted: true,
      });
      continue;
    }

    if (userStatus === "in_progress") {
      statusMap.set(node.id, {
        nodeId: node.id,
        status: "in_progress",
        isUnlocked: true,
        prerequisitesCompleted: true,
      });
      continue;
    }

    // Check prerequisites
    const incomingPrereqs = prereqMap.get(node.id) ?? [];
    const allPrereqsMet = incomingPrereqs.every(
      (prereqId) => progressMap.get(prereqId) === "completed"
    );

    if (allPrereqsMet) {
      statusMap.set(node.id, {
        nodeId: node.id,
        status: "available",
        isUnlocked: true,
        prerequisitesCompleted: true,
      });
    } else {
      statusMap.set(node.id, {
        nodeId: node.id,
        status: "locked",
        isUnlocked: false,
        prerequisitesCompleted: false,
      });
    }
  }

  return statusMap;
}
