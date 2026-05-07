'use client';

import { Card, CardContent } from '@/components/ui/card';
import { onboardingData } from '@/lib/mockData';

interface Step3StyleProps {
  selectedStyles: string[];
  onStyleToggle: (styleId: string) => void;
}

export function Step3Style({ selectedStyles, onStyleToggle }: Step3StyleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          How do you prefer to learn?
        </h3>
        <p className="text-sm font-medium text-slate-500">
          Select all that apply
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {onboardingData.learningStyles.map((style) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <Card
              key={style.id}
              className={`p-6 cursor-pointer rounded-xl transition-all shadow-sm ${
                isSelected
                  ? 'border-2 border-blue-600 bg-blue-50/50'
                  : 'border border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
              onClick={() => onStyleToggle(style.id)}
            >
              <h4 className={`font-bold mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                {style.label}
              </h4>
              <p className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                {style.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
