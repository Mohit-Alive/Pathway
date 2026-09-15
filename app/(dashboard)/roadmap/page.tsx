'use client';

import { useState } from 'react';
import { Clock, BookOpen, Code2, PlayCircle, CheckCircle2, ArrowRight, X, Download } from 'lucide-react';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { mockRoadmapData, dashboardStats } from '@/lib/mockData';
import { PageHeader } from '@/components/shell/PageHeader';

export default function RoadmapPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = mockRoadmapData.nodes.find(
    (node) => node.id === selectedNodeId
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
      <PageHeader
        title="My Roadmap"
        badge={
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md border border-slate-200">
            Full Stack Developer
          </span>
        }
        actions={
          <>
            <div className="hidden lg:flex items-center gap-3 mr-4">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">Progress</span>
                <span className="font-extrabold text-slate-900 text-sm leading-tight">{dashboardStats.progress}%</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shadow-sm">
                <span className="text-[10px] font-bold text-slate-700">{dashboardStats.skillsCompleted}/{dashboardStats.skillsTotal}</span>
              </div>
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export Map</span>
            </button>
          </>
        }
      />

      {/* Canvas */}
      <div className="flex-1 w-full min-h-0 bg-canvas relative z-0">
        <RoadmapCanvas
          showMiniMap={false}
          showControls={true}
          interactive={true}
          height="h-full"
          onNodeClick={(nodeId) =>
            setSelectedNodeId(selectedNodeId === nodeId ? null : nodeId)
          }
        />
      </div>

      {/* Premium Detail Modal Overlay */}
      {selectedNode && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-end bg-slate-900/20 backdrop-blur-[2px] transition-all"
          onClick={() => setSelectedNodeId(null)}
        >
          {/* Modal Content - Sliding in from right */}
          <div
            className="w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md ${
                    selectedNode.data.status === 'completed' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                    selectedNode.data.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {selectedNode.data.status.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Clock className="w-4 h-4" />
                    {selectedNode.data.hours}h
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {selectedNode.data.label}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-8 space-y-10 flex-1">
              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {selectedNode.data.description}
              </p>

              {/* Topics */}
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Key Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.data.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Learning Resources
                </h3>
                <div className="space-y-3">
                  {selectedNode.data.resources.map((resource, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer bg-white shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-md">
                            {resource.type}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {resource.duration}
                          </span>
                          {resource.isFree && (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Free
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Practice Projects
                </h3>
                <div className="space-y-4">
                  {selectedNode.data.projects.map((project, idx) => (
                    <div key={idx} className="bg-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-bold pr-4">{project.title}</h4>
                          <span className="px-2 py-1 bg-slate-800 text-[10px] uppercase tracking-wider font-extrabold rounded-md border border-slate-700 whitespace-nowrap text-slate-300">
                            {project.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
              <button
                className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  selectedNode.data.status === 'completed'
                    ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedNode.data.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    {selectedNode.data.status === 'in-progress' ? 'Continue Learning' : 'Start This Module'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
