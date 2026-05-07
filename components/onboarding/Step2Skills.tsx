'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { onboardingData } from '@/lib/mockData';

interface Step2SkillsProps {
  skills: Record<string, string>;
  onSkillChange: (skill: string, level: string) => void;
}

export function Step2Skills({ skills, onSkillChange }: Step2SkillsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Rate your current skills
        </h3>
        <p className="text-sm font-medium text-slate-500">
          Select your proficiency level for each skill
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {onboardingData.skills.map((skill) => (
          <Card key={skill.name} className="p-4 rounded-xl shadow-sm border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">
                  {skill.name}
                </p>
              </div>
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const isSelected = skills[skill.name] === level;
                  return (
                    <Button
                      key={level}
                      variant="outline"
                      size="sm"
                      onClick={() => onSkillChange(skill.name, level)}
                      className={`text-xs font-bold rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                          : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {level}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
