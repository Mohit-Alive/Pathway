'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const LANGUAGE_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "SQL",
  "HTML/CSS",
];

interface Step2SkillsProps {
  experienceLevel: string;
  languagesKnown: string[];
  hasShipped: boolean;
  onExperienceChange: (level: string) => void;
  onLanguageToggle: (lang: string) => void;
  onShippedChange: (shipped: boolean) => void;
}

export function Step2Skills({
  experienceLevel,
  languagesKnown,
  hasShipped,
  onExperienceChange,
  onLanguageToggle,
  onShippedChange,
}: Step2SkillsProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          Overall Engineering Experience Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <Button
              key={level}
              type="button"
              variant="outline"
              onClick={() => onExperienceChange(level)}
              className={`py-6 rounded-xl font-bold transition-all ${
                experienceLevel === level
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
                  : "text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">
          Languages & Technologies You Already Know
        </label>
        <p className="text-xs font-medium text-slate-500 mb-3">
          Select any tools you are already comfortable with so we don&apos;t waste your time.
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = languagesKnown.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageToggle(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {lang} {isSelected ? "✓" : "+"}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="p-5 rounded-xl border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 text-sm">
              Have you built and shipped full applications before?
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Helps us calibrate between syntax learning and project-based architectural tasks.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onShippedChange(true)}
              className={`rounded-lg font-bold ${
                hasShipped ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-200"
              }`}
            >
              Yes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onShippedChange(false)}
              className={`rounded-lg font-bold ${
                !hasShipped ? "bg-slate-700 text-white border-slate-700" : "border-slate-200"
              }`}
            >
              No
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
