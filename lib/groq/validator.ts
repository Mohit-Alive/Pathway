import dagre from "@dagrejs/dagre";
import { ArchitectOutput, ALLOWED_CS_TAGS } from "./schema";

export interface ValidatedNode {
  id: string;
  title: string;
  category: string;
  estimatedHours: number;
  tags: string[];
  isStretch: boolean;
  positionX: number;
  positionY: number;
  sequenceIndex: number;
}

export interface ValidatedEdge {
  source: string;
  target: string;
}

export interface ValidatedGraph {
  nodes: ValidatedNode[];
  edges: ValidatedEdge[];
  cycleDetected: boolean;
  totalHours: number;
}

/**
 * Detect cycles using Kahn's Algorithm (Topological Sort).
 * Returns cycle nodes if a cycle exists, or empty array if DAG is clean.
 */
export function findGraphCycles(
  nodeIds: string[],
  edges: { source: string; target: string }[]
): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adj.set(id, []);
  }

  for (const e of edges) {
    if (inDegree.has(e.target)) {
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    }
    const neighbors = adj.get(e.source) ?? [];
    neighbors.push(e.target);
    adj.set(e.source, neighbors);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  let visitedCount = 0;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    visitedCount++;

    for (const neighbor of adj.get(curr) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (visitedCount === nodeIds.length) {
    return []; // No cycle
  }

  // Find remaining nodes with inDegree > 0
  const cyclicNodes: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg > 0) cyclicNodes.push(id);
  }
  return cyclicNodes;
}

/**
 * Repair graph: filter off-vocabulary tags, detach self-loops, remove cycle back-edges.
 */
export function validateAndRepairGraph(
  rawGraph: ArchitectOutput,
  budgetHours: number
): ValidatedGraph {
  const nodeMap = new Map<string, ArchitectOutput["nodes"][0]>();
  for (const n of rawGraph.nodes) {
    // Sanitize tags against allowed CS vocabulary
    const validTags = n.tags.filter((t) =>
      ALLOWED_CS_TAGS.includes(t.toLowerCase() as any)
    );
    nodeMap.set(n.id, {
      ...n,
      tags: validTags.length > 0 ? validTags : ["cs-fundamentals"],
    });
  }

  const validNodeIds = new Set(nodeMap.keys());

  // Filter edges to valid node IDs and remove self-loops
  let cleanEdges = rawGraph.edges.filter(
    (e) =>
      validNodeIds.has(e.source) &&
      validNodeIds.has(e.target) &&
      e.source !== e.target
  );

  // Check for cycles
  const cyclicNodes = findGraphCycles(Array.from(validNodeIds), cleanEdges);
  let cycleDetected = false;

  if (cyclicNodes.length > 0) {
    cycleDetected = true;
    const cyclicSet = new Set(cyclicNodes);
    // Break back-edges in cycles
    cleanEdges = cleanEdges.filter(
      (e) => !(cyclicSet.has(e.source) && cyclicSet.has(e.target))
    );
  }

  // Calculate layout using Dagre server-side
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    ranker: "network-simplex",
    nodesep: 60,
    ranksep: 110,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const [id, node] of nodeMap.entries()) {
    // Approximate node width based on title length
    const width = Math.max(180, node.title.length * 9 + 40);
    g.setNode(id, { width, height: 120 });
  }

  for (const e of cleanEdges) {
    g.setEdge(e.source, e.target);
  }

  dagre.layout(g);

  let sequenceIndex = 0;
  let totalHours = 0;

  const validatedNodes: ValidatedNode[] = [];
  for (const [id, node] of nodeMap.entries()) {
    const dagreNode = g.node(id);

    // Convert Dagre center coords to top-left coords
    const positionX = Math.round(dagreNode ? dagreNode.x - dagreNode.width / 2 : sequenceIndex * 220);
    const positionY = Math.round(dagreNode ? dagreNode.y - dagreNode.height / 2 : sequenceIndex * 140);

    totalHours += node.estimatedHours;

    validatedNodes.push({
      id: node.id,
      title: node.title,
      category: node.category,
      estimatedHours: node.estimatedHours,
      tags: node.tags,
      isStretch: node.isStretch || totalHours > budgetHours * 1.15,
      positionX,
      positionY,
      sequenceIndex: sequenceIndex++,
    });
  }

  return {
    nodes: validatedNodes,
    edges: cleanEdges,
    cycleDetected,
    totalHours,
  };
}

/**
 * Fallback static roadmap DAG generator per track in case Groq fails repeatedly.
 */
export function getFallbackTrackGraph(track: string, plannedWeeks: number, hoursPerSession: number): ArchitectOutput {
  const isBackend = track.toLowerCase().includes("backend") || track.toLowerCase().includes("data");
  
  if (isBackend) {
    return {
      nodes: [
        { id: "n1", title: "Programming Fundamentals & Logic", category: "Basics", estimatedHours: 15, tags: ["python", "javascript"], isStretch: false },
        { id: "n2", title: "Data Structures & Algorithms", category: "Core CS", estimatedHours: 25, tags: ["algorithms", "data-structures"], isStretch: false },
        { id: "n3", title: "Relational Databases & SQL", category: "Database", estimatedHours: 20, tags: ["postgresql", "sql"], isStretch: false },
        { id: "n4", title: "REST APIs & Web Servers", category: "Backend", estimatedHours: 20, tags: ["node", "express", "fastapi"], isStretch: false },
        { id: "n5", title: "Authentication & Security", category: "Backend", estimatedHours: 15, tags: ["security", "rest-api"], isStretch: false },
        { id: "n6", title: "Caching with Redis", category: "Architecture", estimatedHours: 10, tags: ["redis", "backend"], isStretch: false },
        { id: "n7", title: "Docker & Containerization", category: "DevOps", estimatedHours: 15, tags: ["docker", "tools"], isStretch: false },
        { id: "n8", title: "System Design & Microservices", category: "Architecture", estimatedHours: 25, tags: ["system-design", "microservices"], isStretch: true },
      ],
      edges: [
        { source: "n1", target: "n2" },
        { source: "n1", target: "n3" },
        { source: "n2", target: "n4" },
        { source: "n3", target: "n4" },
        { source: "n4", target: "n5" },
        { source: "n4", target: "n6" },
        { source: "n5", target: "n7" },
        { source: "n6", target: "n7" },
        { source: "n7", target: "n8" },
      ],
    };
  }

  // Frontend / Default
  return {
    nodes: [
      { id: "n1", title: "HTML5 Semantics & Web Structure", category: "Web Core", estimatedHours: 12, tags: ["html", "css"], isStretch: false },
      { id: "n2", title: "Modern CSS & Responsive Flexbox/Grid", category: "Web Core", estimatedHours: 18, tags: ["css", "tailwind"], isStretch: false },
      { id: "n3", title: "JavaScript ES6+ Primitives & DOM", category: "JavaScript", estimatedHours: 25, tags: ["javascript"], isStretch: false },
      { id: "n4", title: "Async JS, Promises & Fetch API", category: "JavaScript", estimatedHours: 15, tags: ["javascript", "rest-api"], isStretch: false },
      { id: "n5", title: "React Fundamentals: JSX & Props", category: "Frontend", estimatedHours: 20, tags: ["react", "javascript"], isStretch: false },
      { id: "n6", title: "React State Management & Hooks", category: "Frontend", estimatedHours: 20, tags: ["react"], isStretch: false },
      { id: "n7", title: "Next.js App Router & Server Components", category: "Fullstack", estimatedHours: 25, tags: ["nextjs", "react", "typescript"], isStretch: false },
      { id: "n8", title: "Testing & Performance Optimization", category: "Engineering", estimatedHours: 15, tags: ["testing", "javascript"], isStretch: true },
    ],
    edges: [
      { source: "n1", target: "n2" },
      { source: "n1", target: "n3" },
      { source: "n2", target: "n3" },
      { source: "n3", target: "n4" },
      { source: "n3", target: "n5" },
      { source: "n5", target: "n6" },
      { source: "n6", target: "n7" },
      { source: "n7", target: "n8" },
    ],
  };
}
