'use client';

import { Input } from '@/components/ui/input';

export const TRACK_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Fullstack Engineering",
  "Mobile App Development",
  "AI & Machine Learning",
  "DevOps & Cloud Engineering",
  "Data Engineering",
  "Cyber Security",
];

export const TIMELINE_OPTIONS = [
  "4 Weeks (Intensive)",
  "8 Weeks (Standard)",
  "12 Weeks (Comprehensive)",
  "16 Weeks (Extended)",
];

interface Step1GoalProps {
  track: string;
  goal: string;
  timeline: string;
  onTrackChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
}

export function Step1Goal({
  track,
  goal,
  timeline,
  onTrackChange,
  onGoalChange,
  onTimelineChange,
}: Step1GoalProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          Select Your Target Track
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRACK_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTrackChange(t)}
              className={`p-3 rounded-xl text-left border font-medium text-sm transition-all ${
                track === t
                  ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          What is your specific learning goal?
        </label>
        <Input
          placeholder="e.g. Build production React & Node apps, Become a Senior Backend Engineer..."
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          className="text-base rounded-xl border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 shadow-sm py-4"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-4">
          Target Duration
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIMELINE_OPTIONS.map((option) => (
            <label
              key={option}
              className={`flex items-center cursor-pointer gap-3 p-3 rounded-xl border transition-all ${
                timeline === option
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="timeline"
                value={option}
                checked={timeline === option}
                onChange={(e) => onTimelineChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-800">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
