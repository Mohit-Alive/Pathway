'use client';

import { todayTasks } from '@/lib/mockData';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export function TodayTasks() {
  const [tasks, setTasks] = useState(todayTasks.map(t => ({ ...t, completed: false })));

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
      <div className="bg-zinc-50/50 border-b border-zinc-100 px-6 py-5">
        <h3 className="text-lg font-bold text-zinc-900">Today's Tasks</h3>
      </div>
      <div className="p-4 space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all ${
              task.completed 
                ? 'bg-zinc-50/80 opacity-60' 
                : 'hover:bg-zinc-50 bg-white border border-transparent hover:border-zinc-200'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-zinc-900" />
              ) : (
                <Circle className="w-6 h-6 text-zinc-300" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-md">
                  {task.type}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {task.duration}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
