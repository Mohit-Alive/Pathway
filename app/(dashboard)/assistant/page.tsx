import { PageHeader } from "@/components/shell/PageHeader";
import { getConversationHistory } from "@/lib/dal/assistant";
import { AssistantChat } from "@/components/assistant/AssistantChat";

export default async function AssistantPage() {
  const initialMessages = await getConversationHistory();

  return (
    <>
      <PageHeader
        title="Pathway Assistant"
        badge={
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md border border-slate-200">
            Beta
          </span>
        }
      />
      <div className="flex-1 min-h-0 overflow-hidden bg-canvas">
        <AssistantChat initialMessages={initialMessages} />
      </div>
    </>
  );
}
