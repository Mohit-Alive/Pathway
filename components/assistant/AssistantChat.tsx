"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicAssistantMessage } from "@/lib/dal/assistant";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AssistantChatProps {
  initialMessages: PublicAssistantMessage[];
}

const SUGGESTED_PROMPTS = [
  "What should I work on next in my roadmap?",
  "Explain the topic in my current module.",
  "How am I pacing against my study schedule?",
  "What skills am I missing for my target track?",
];

function genId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/** The system prompt asks the model not to use markdown (replies render as
 * plain text here, not HTML), but models don't always comply perfectly.
 * Strip the common markdown emphasis markers as a display-only cleanup -
 * this never touches what is sent to the model or stored in the database,
 * only how an assistant message is rendered. */
function stripMarkdownEmphasis(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "");
}

export function AssistantChat({ initialMessages }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content }))
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");

    const userMessage: ChatMessage = { id: genId(), role: "user", content: trimmed };
    const assistantId = genId();
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const accumulatedRef = { current: "" };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedRef.current += decoder.decode(value, { stream: true });
        const snapshot = accumulatedRef.current;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m))
        );
      }

      if (!accumulatedRef.current) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        throw new Error("The assistant didn't return a response. Please try again.");
      }
    } catch (err) {
      // Roll back the empty assistant placeholder; the user's own message
      // stays so they can see what they asked and retry.
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Ask about your curriculum</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
                I know your track, your roadmap, and your progress. Ask me about what to study
                next, a concept from your courses, or how you&apos;re pacing.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-slate-900 text-white" : "bg-blue-50 text-blue-600"
                )}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                )}
              >
                {(m.role === "assistant" ? stripMarkdownEmphasis(m.content) : m.content) || (
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                    Thinking…
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your roadmap, a course topic, or career prep…"
            rows={1}
            maxLength={2000}
            disabled={isStreaming}
            className="min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-[11px] font-medium text-slate-400">
          Pathway Assistant only answers questions about your CS curriculum, roadmap, and career
          prep for your track.
        </p>
      </div>
    </div>
  );
}
