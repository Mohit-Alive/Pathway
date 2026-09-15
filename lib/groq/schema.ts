import { z } from "zod";

export const ALLOWED_CS_TAGS = [
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "node",
  "express",
  "python",
  "django",
  "fastapi",
  "postgresql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "git",
  "ci-cd",
  "algorithms",
  "data-structures",
  "system-design",
  "css",
  "html",
  "tailwind",
  "graphql",
  "rest-api",
  "testing",
  "security",
  "microservices",
] as const;

export type AllowedCsTag = (typeof ALLOWED_CS_TAGS)[number];

export const ArchitectNodeSchema = z.object({
  id: z.string(), // e.g. "node_1"
  title: z.string().min(2).max(80),
  category: z.string().min(2).max(40),
  estimatedHours: z.number().int().min(2).max(60),
  tags: z.array(z.string()).default([]),
  isStretch: z.boolean().default(false),
});

export const ArchitectEdgeSchema = z.object({
  source: z.string(), // node id
  target: z.string(), // node id
});

export const ArchitectOutputSchema = z.object({
  nodes: z.array(ArchitectNodeSchema).min(5).max(30),
  edges: z.array(ArchitectEdgeSchema),
});

export const EnricherNodeDetailSchema = z.object({
  id: z.string(),
  description: z.string().min(10).max(500),
  topics: z.array(z.string()).min(1).max(8),
  projects: z.array(z.string()).min(1).max(5),
});

export const EnricherOutputSchema = z.object({
  nodeDetails: z.array(EnricherNodeDetailSchema),
});

export type ArchitectOutput = z.infer<typeof ArchitectOutputSchema>;
export type EnricherOutput = z.infer<typeof EnricherOutputSchema>;
