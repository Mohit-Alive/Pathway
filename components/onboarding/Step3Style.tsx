'use client';

import { Card } from '@/components/ui/card';

export const LEARNING_STYLES = [
  { id: "projects", label: "Hands-on Projects", description: "Learn by building real-world software applications." },
  { id: "interactive", label: "Interactive Quizzes", description: "Test and reinforce concepts after every module." },
  { id: "documentation", label: "Documentation & Reads", description: "Deep dive into official guides and specifications." },
  { id: "videos", label: "Video Walkthroughs", description: "Visual demonstrations and step-by-step videos." },
];

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
          Select all learning formats that fit your preferences
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LEARNING_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <Card
              key={style.id}
              className={`p-6 cursor-pointer rounded-xl transition-all shadow-sm ${
                isSelected
                  ? 'border-2 border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10'
                  : 'border border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
              onClick={() => onStyleToggle(style.id)}
            >
              <h4 className={`font-bold mb-1 text-sm ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
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
