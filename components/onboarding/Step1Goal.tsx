'use client';

import { Input } from '@/components/ui/input';
import { onboardingData } from '@/lib/mockData';

interface Step1GoalProps {
  goal: string;
  timeline: string;
  goalType: string;
  onGoalChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
  onGoalTypeChange: (value: string) => void;
}

export function Step1Goal({
  goal,
  timeline,
  goalType,
  onGoalChange,
  onTimelineChange,
  onGoalTypeChange,
}: Step1GoalProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          What do you want to learn?
        </label>
        <Input
          placeholder="e.g. Full Stack Web Development, Machine Learning..."
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          className="text-base rounded-xl border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 shadow-sm py-6"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-4">
          Your target timeline
        </label>
        <div className="space-y-3">
          {onboardingData.timelines.map((option) => (
            <label key={option} className="flex items-center cursor-pointer gap-3 group">
              <input
                type="radio"
                name="timeline"
                value={option}
                checked={timeline === option}
                onChange={(e) => onTimelineChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-4">
          Your goal
        </label>
        <div className="space-y-3">
          {onboardingData.goalTypes.map((option) => (
            <label key={option} className="flex items-center cursor-pointer gap-3 group">
              <input
                type="radio"
                name="goalType"
                value={option}
                checked={goalType === option}
                onChange={(e) => onGoalTypeChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
