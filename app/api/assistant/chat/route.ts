import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { requireUser, UnauthorizedError } from "@/lib/auth";
import {
  appendMessage,
  assertWithinRateLimit,
  getRecentHistoryForModel,
  sanitizeUserMessage,
  RateLimitError,
} from "@/lib/dal/assistant";
import { getAssistantContext } from "@/lib/assistant/context";
import { buildSystemPrompt } from "@/lib/assistant/prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    await requireUser();

    const body = await req.json().catch(() => null);
    const message = sanitizeUserMessage(body?.message);

    // Checked before anything is persisted, so a rejected message never
    // counts against the caller's own limit.
    await assertWithinRateLimit();

    // Persist the user's turn first. If the LLM call below fails, the
    // learner's message is not lost, and it is already the DB's problem
    // (not the client's) to decide what history the next turn sees.
    await appendMessage("user", message);

    const [context, history] = await Promise.all([
      getAssistantContext(),
      getRecentHistoryForModel(),
    ]);

    const system = buildSystemPrompt(context);

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system,
      messages: history,
      temperature: 0.4,
      onFinish: async ({ text }) => {
        if (text) {
          await appendMessage("assistant", text);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof RateLimitError) {
      return Response.json({ error: error.message }, { status: 429 });
    }

    const message = error instanceof Error ? error.message : "Failed to reach the assistant.";
    console.error("Assistant chat error:", error);
    return Response.json({ error: message }, { status: 400 });
  }
}
