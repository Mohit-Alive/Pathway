'use client';

import { Input } from '@/components/ui/input';

export const DAYS_PER_WEEK_OPTIONS = [
  { value: 3, label: "3 Days / Week (Part Time)" },
  { value: 5, label: "5 Days / Week (Regular)" },
  { value: 6, label: "6 Days / Week (Dedicated)" },
  { value: 7, label: "7 Days / Week (Full Immersion)" },
];

export const HOURS_PER_SESSION_OPTIONS = [
  { value: 1, label: "1 Hour / Session" },
  { value: 2, label: "2 Hours / Session" },
  { value: 4, label: "4 Hours / Session" },
  { value: 6, label: "6+ Hours / Session" },
];

interface Step4TimeProps {
  daysPerWeek: number;
  hoursPerSession: number;
  additionalNotes: string;
  onDaysChange: (value: number) => void;
  onHoursChange: (value: number) => void;
  onNotesChange: (value: string) => void;
}

export function Step4Time({
  daysPerWeek,
  hoursPerSession,
  additionalNotes,
  onDaysChange,
  onHoursChange,
  onNotesChange,
}: Step4TimeProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          Days Per Week You Can Study
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DAYS_PER_WEEK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onDaysChange(opt.value)}
              className={`p-3.5 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all ${
                daysPerWeek === opt.value
                  ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          Hours Per Study Session
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HOURS_PER_SESSION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onHoursChange(opt.value)}
              className={`p-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                hoursPerSession === opt.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">
          Special Focus or Constraints (Optional, max 200 chars)
        </label>
        <Input
          placeholder="e.g. Focus on TypeScript and Docker, preparing for upcoming interviews..."
          value={additionalNotes}
          maxLength={200}
          onChange={(e) => onNotesChange(e.target.value)}
          className="text-sm rounded-xl border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 shadow-sm py-4"
        />
        <div className="text-right text-xs font-medium text-slate-400 mt-1">
          {additionalNotes.length} / 200
        </div>
      </div>
    </div>
  );
}
