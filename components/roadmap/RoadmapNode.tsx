'use client';

import { Handle, Position } from '@xyflow/react';
import { RoadmapNode as RoadmapNodeType } from '@/lib/mockData';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Clock } from 'lucide-react';

interface CustomNodeProps {
  data: RoadmapNodeType['data'] & { onClick?: (e: React.MouseEvent) => void };
  isConnecting: boolean;
}

export function RoadmapNode({ data, isConnecting }: CustomNodeProps) {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  const isLocked = data.status === 'locked';

  // Base styling - Premium solid colors (no gradients)
  let containerStyle = "rounded-xl p-4 min-w-[220px] text-left shadow-sm transition-all duration-200 cursor-pointer border bg-white ";
  let iconStyle = "";
  let IconComponent = BookOpen;

  if (isCompleted) {
    containerStyle += "border-slate-300 hover:shadow-md hover:-translate-y-0.5";
    iconStyle = "bg-slate-100 text-slate-700";
    IconComponent = CheckCircle2;
  } else if (isInProgress) {
    containerStyle += "border-blue-600 shadow-md ring-4 ring-blue-50 hover:-translate-y-0.5";
    iconStyle = "bg-blue-100 text-blue-600";
    IconComponent = PlayCircle;
  } else {
    containerStyle += "border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300";
    iconStyle = "bg-slate-50 text-slate-400";
    IconComponent = Lock;
  }

  return (
    <div className={containerStyle} onClick={data.onClick}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`w-3 h-3 border-2 border-white rounded-full ${isInProgress ? 'bg-blue-600' : isCompleted ? 'bg-slate-400' : 'bg-slate-300'}`} 
      />

      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg flex items-center justify-center ${iconStyle}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100 text-[10px] font-bold text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{data.hours}h</span>
        </div>
      </div>

      <h3 className={`font-bold text-sm mb-1.5 ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
        {data.label}
      </h3>

      <div className="mt-1 flex items-center">
        <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isInProgress ? 'text-blue-600' : 'text-slate-400'}`}>
          {data.status.replace('-', ' ')}
        </span>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`w-3 h-3 border-2 border-white rounded-full ${isInProgress ? 'bg-blue-600' : isCompleted ? 'bg-slate-400' : 'bg-slate-300'}`}
      />
    </div>
  );
}
