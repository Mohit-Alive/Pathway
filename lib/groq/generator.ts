import Groq from "groq-sdk";
import { db } from "@/lib/db/client";
import {
  users,
  roadmaps,
  roadmapNodes,
  nodePrerequisites,
  generationJobs,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ArchitectOutputSchema,
  EnricherOutputSchema,
  ArchitectOutput,
  EnricherOutput,
} from "./schema";
import {
  validateAndRepairGraph,
  getFallbackTrackGraph,
} from "./validator";

export interface QuestionnaireAnswers {
  track: string;
  goal: string;
  timelineWeeks: number; // e.g. 12
  daysPerWeek: number; // e.g. 5
  hoursPerSession: number; // e.g. 2
  experienceLevel: string; // "Beginner" | "Intermediate" | "Advanced"
  languagesKnown: string[];
  hasShipped: boolean;
  learningStyles: string[];
  additionalNotes?: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

const PRIMARY_MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODEL = "openai/gpt-oss-20b";

export async function generatePersonalizedRoadmap(
  userId: string,
  answers: QuestionnaireAnswers
): Promise<string> {
  // 1. Mutex Check via generation_jobs
  const activeJobs = await db
    .select()
    .from(generationJobs)
    .where(
      and(
        eq(generationJobs.userId, userId),
        eq(generationJobs.status, "running")
      )
    )
    .limit(1);

  if (activeJobs.length > 0) {
    throw new Error("A roadmap generation is already in progress for your account.");
  }

  const [job] = await db
    .insert(generationJobs)
    .values({
      userId,
      status: "running",
      attemptCount: 1,
    })
    .returning();

  try {
    // Calculate total budget hours: plannedWeeks * daysPerWeek * hoursPerSession * 0.8 (attrition)
    const budgetHours = Math.round(
      answers.timelineWeeks * answers.daysPerWeek * answers.hoursPerSession * 0.8
    );
    const targetNodes = Math.min(25, Math.max(8, Math.round(budgetHours / 18)));

    // Phase A: Generate Architect Graph (Nodes & Edges)
    let architectData: ArchitectOutput | null = null;
    let attempts = 0;

    const architectPrompt = `You are a Senior Principal Software Architect and Curriculum Designer.
Generate a structured, personalized computer science learning roadmap DAG (Directed Acyclic Graph) for a student.

USER PROFILE:
- Target Track: ${answers.track}
- Primary Goal: ${answers.goal}
- Experience Level: ${answers.experienceLevel}
- Languages Known: ${answers.languagesKnown.join(", ") || "None"}
- Shipped Real Projects Before: ${answers.hasShipped ? "Yes" : "No"}
- Available Time Budget: ${budgetHours} total hours over ${answers.timelineWeeks} weeks
- Target Node Count: ${targetNodes} nodes

STRICT INSTRUCTIONS:
1. Return ONLY valid JSON adhering strictly to the JSON schema.
2. The graph MUST be a valid Directed Acyclic Graph (DAG). Do NOT create any cycles!
3. Allowed CS tags (choose 1-3 per node from this exact list): javascript, typescript, react, nextjs, node, express, python, django, fastapi, postgresql, mongodb, redis, docker, kubernetes, aws, git, ci-cd, algorithms, data-structures, system-design, css, html, tailwind, graphql, rest-api, testing, security, microservices.

Return JSON in this format:
{
  "nodes": [
    {
      "id": "node_1",
      "title": "Node Title",
      "category": "Category Name",
      "estimatedHours": 15,
      "tags": ["python", "algorithms"],
      "isStretch": false
    }
  ],
  "edges": [
    { "source": "node_1", "target": "node_2" }
  ]
}`;

    while (attempts < 2 && !architectData) {
      attempts++;
      const modelToUse = attempts === 1 ? PRIMARY_MODEL : FALLBACK_MODEL;
      try {
        const response = await groq.chat.completions.create({
          model: modelToUse,
          messages: [
            { role: "system", content: "You output strictly JSON conforming to the requested schema." },
            { role: "user", content: architectPrompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        });

        const rawText = response.choices[0]?.message?.content ?? "{}";
        const parsedJson = JSON.parse(rawText);

        const validated = ArchitectOutputSchema.safeParse(parsedJson);
        if (validated.success) {
          architectData = validated.data;
        } else {
          console.warn("Zod validation retry needed for Groq Architect output:", validated.error);
        }
      } catch (err) {
        console.error(`Groq Phase A attempt ${attempts} error:`, err);
      }
    }

    if (!architectData) {
      console.warn("Falling back to deterministic track DAG template.");
      architectData = getFallbackTrackGraph(answers.track, answers.timelineWeeks, answers.hoursPerSession);
    }

    // Validate graph, compute layout with Dagre, repair cycles
    const validatedGraph = validateAndRepairGraph(architectData, budgetHours);

    // Phase B: Generate Node Enrichments (Descriptions, Topics, Projects)
    let enrichments: EnricherOutput | null = null;
    let enrichmentStatus = "completed";

    try {
      const enricherPrompt = `For the following roadmap nodes, provide rich descriptions, key learning topics, and practical project ideas.

NODES:
${JSON.stringify(validatedGraph.nodes.map((n) => ({ id: n.id, title: n.title, category: n.category })), null, 2)}

Return JSON in this exact format:
{
  "nodeDetails": [
    {
      "id": "node_1",
      "description": "Comprehensive 2-3 sentence overview of what the student will master.",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "projects": ["Build a small CLI tool", "Build a REST API endpoint"]
    }
  ]
}`;

      const enrichResponse = await groq.chat.completions.create({
        model: PRIMARY_MODEL,
        messages: [
          { role: "system", content: "You output strictly JSON." },
          { role: "user", content: enricherPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const rawText = enrichResponse.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(rawText);
      const val = EnricherOutputSchema.safeParse(parsed);
      if (val.success) {
        enrichments = val.data;
      } else {
        enrichmentStatus = "degraded";
      }
    } catch (e) {
      console.warn("Phase B enrichment failed, falling back to default descriptions:", e);
      enrichmentStatus = "degraded";
    }

    const detailMap = new Map<string, { description: string; topics: string[]; projects: string[] }>();
    if (enrichments) {
      for (const d of enrichments.nodeDetails) {
        detailMap.set(d.id, {
          description: d.description,
          topics: d.topics,
          projects: d.projects,
        });
      }
    }

    // 3. Persist to Database in a single transaction-like flow
    // Update User record
    await db
      .update(users)
      .set({
        track: answers.track,
        isOnboarded: true,
        onboardingAnswers: answers as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Archive old active roadmaps
    await db
      .update(roadmaps)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(roadmaps.userId, userId), eq(roadmaps.isActive, true)));

    // Insert new Roadmap
    const [newRoadmap] = await db
      .insert(roadmaps)
      .values({
        userId,
        track: answers.track,
        title: `${answers.track} Master Pathway`,
        summary: answers.goal || `Personalized ${answers.timelineWeeks}-week learning roadmap`,
        isActive: true,
        budgetHours,
        plannedWeeks: answers.timelineWeeks,
        targetNodes: validatedGraph.nodes.length,
        enrichmentStatus,
      })
      .returning();

    // Insert Roadmap Nodes & map original string node ids to inserted DB UUIDs
    const dbNodeIdMap = new Map<string, string>(); // raw node.id -> db node.uuid

    for (const node of validatedGraph.nodes) {
      const details = detailMap.get(node.id) ?? {
        description: `Master key concepts and practical applications for ${node.title}.`,
        topics: [`Foundations of ${node.title}`, "Hands-on Exercises", "Best Practices"],
        projects: [`Build a project demonstrating ${node.title}`],
      };

      const [insertedNode] = await db
        .insert(roadmapNodes)
        .values({
          roadmapId: newRoadmap.id,
          nodeId: node.id,
          title: node.title,
          description: details.description,
          estimatedHours: node.estimatedHours,
          category: node.category,
          tags: node.tags,
          positionX: node.positionX,
          positionY: node.positionY,
          isStretch: node.isStretch,
          sequenceIndex: node.sequenceIndex,
          topics: details.topics,
          projects: details.projects,
        })
        .returning();

      dbNodeIdMap.set(node.id, insertedNode.id);
    }

    // Insert Node Prerequisites
    for (const edge of validatedGraph.edges) {
      const targetDbId = dbNodeIdMap.get(edge.target);
      const sourceDbId = dbNodeIdMap.get(edge.source);

      if (targetDbId && sourceDbId) {
        await db.insert(nodePrerequisites).values({
          roadmapId: newRoadmap.id,
          nodeId: targetDbId,
          prerequisiteNodeId: sourceDbId,
        });
      }
    }

    // Mark generation job as completed
    await db
      .update(generationJobs)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(generationJobs.id, job.id));

    return newRoadmap.id;
  } catch (err: any) {
    // Mark job as failed on error
    await db
      .update(generationJobs)
      .set({
        status: "failed",
        error: err?.message || "Unknown error during roadmap generation",
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, job.id));

    throw err;
  }
}
