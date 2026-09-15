'use client';

import { useState } from 'react';
import { RoadmapCanvas } from './RoadmapCanvas';
import { PageHeader } from '@/components/shell/PageHeader';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Clock, BookOpen, PlayCircle, Code2, CheckCircle2, ArrowRight, Download, Loader2 } from 'lucide-react';
import { RoadmapWithGraph } from '@/lib/dal/roadmap';
import { toast } from 'sonner';

export default function RoadmapPageClient({ initialData }: { initialData: RoadmapWithGraph | null }) {
  const [data, setData] = useState(initialData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!data || data.nodes.length === 0) {
    return (
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
        <PageHeader title="My Roadmap" />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">No Active Roadmap</h2>
          <p className="text-slate-500 max-w-md mb-6 font-medium">
            Generate your personalized CS roadmap via onboarding to view interactive nodes.
          </p>
          <a
            href="/onboarding"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
          >
            Start Onboarding
          </a>
        </div>
      </div>
    );
  }

  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId);

  // Convert DB nodes & edges into ReactFlow node & edge shapes
  const reactFlowNodes = data.nodes.map((node) => {
    const status = node.computedStatus.status;
    return {
      id: node.id,
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.title,
        status,
        hours: node.estimatedHours,
        category: node.category,
        description: node.description,
        topics: node.topics || [],
        projects: node.projects || [],
      },
    };
  });

  const reactFlowEdges = data.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  const handleToggleStatus = async (nodeId: string, currentStatus: string) => {
    setIsUpdating(true);
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    try {
      const res = await fetch('/api/roadmap/node/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, status: nextStatus }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to update node status.');
      }

      toast.success(`Node updated to ${nextStatus.replace('_', ' ')}!`);
      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.map((n) => {
            if (n.id === nodeId) {
              return {
                ...n,
                computedStatus: {
                  ...n.computedStatus,
                  status: nextStatus as any,
                },
              };
            }
            return n;
          }),
        };
      });
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const progressPercentage = Math.round(
    (data.stats.completedNodes / Math.max(1, data.stats.totalNodes)) * 100
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
      <PageHeader
        title="My Roadmap"
        badge={
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md border border-slate-200">
            {data.roadmap.track}
          </span>
        }
        actions={
          <>
            <div className="hidden lg:flex items-center gap-3 mr-4">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Progress
                </span>
                <span className="font-extrabold text-slate-900 text-sm leading-tight">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shadow-sm">
                <span className="text-[10px] font-bold text-slate-700">
                  {data.stats.completedNodes}/{data.stats.totalNodes}
                </span>
              </div>
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export Map</span>
            </button>
          </>
        }
      />

      {/* Canvas Container */}
      <div className="flex-1 w-full min-h-0 bg-canvas relative z-0">
        <RoadmapCanvas
          initialNodes={reactFlowNodes}
          initialEdges={reactFlowEdges}
          showMiniMap={true}
          showControls={true}
          interactive={true}
          height="h-full"
          onNodeSelect={(id) => setSelectedNodeId(id)}
        />
      </div>

      {/* Node Detail Sheet */}
      <Sheet open={Boolean(selectedNode)} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col overflow-y-auto">
          {selectedNode && (
            <>
              <SheetHeader className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md ${
                      selectedNode.computedStatus.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : selectedNode.computedStatus.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : selectedNode.computedStatus.status === 'available'
                        ? 'bg-sky-50 text-sky-600 border border-sky-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {selectedNode.computedStatus.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedNode.estimatedHours}h
                  </div>
                </div>
                <SheetTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {selectedNode.title}
                </SheetTitle>
              </SheetHeader>

              <div className="p-6 space-y-8 flex-1">
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedNode.description}
                  </p>
                </div>

                {selectedNode.topics && selectedNode.topics.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Key Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.projects && selectedNode.projects.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4" /> Practical Projects
                    </h4>
                    <div className="space-y-3">
                      {selectedNode.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 rounded-xl p-4 text-white shadow-sm"
                        >
                          <p className="text-xs font-bold text-slate-100">{proj}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                <button
                  disabled={isUpdating}
                  onClick={() =>
                    handleToggleStatus(selectedNode.id, selectedNode.computedStatus.status)
                  }
                  className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    selectedNode.computedStatus.status === 'completed'
                      ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : selectedNode.computedStatus.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Mark as Incomplete
                    </>
                  ) : (
                    <>
                      Mark as Complete <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
