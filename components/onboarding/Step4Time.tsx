'use client';

import { Select } from '@/components/ui/select';
import { onboardingData } from '@/lib/mockData';

interface Step4TimeProps {
  hoursPerDay: string;
  schedule: string;
  onHoursChange: (value: string) => void;
  onScheduleChange: (value: string) => void;
}

export function Step4Time({
  hoursPerDay,
  schedule,
  onHoursChange,
  onScheduleChange,
}: Step4TimeProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          How much time can you dedicate per day?
        </label>
        <Select value={hoursPerDay} onChange={(e) => onHoursChange(e.target.value)}>
          <option value="">Select hours per day</option>
          {onboardingData.timeOptions.map((option) => (
            <option key={option} value={option}>
              {option} per day
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-4">
          Preferred schedule
        </label>
        <div className="space-y-3">
          {onboardingData.schedules.map((option) => (
            <label key={option} className="flex items-center cursor-pointer gap-3 group">
              <input
                type="radio"
                name="schedule"
                value={option}
                checked={schedule === option}
                onChange={(e) => onScheduleChange(e.target.value)}
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
