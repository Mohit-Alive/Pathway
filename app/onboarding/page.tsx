'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Step1Goal } from '@/components/onboarding/Step1Goal';
import { Step2Skills } from '@/components/onboarding/Step2Skills';
import { Step3Style } from '@/components/onboarding/Step3Style';
import { Step4Time } from '@/components/onboarding/Step4Time';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('');
  const [goalType, setGoalType] = useState('');

  // Step 2 state
  const [skills, setSkills] = useState<Record<string, string>>({});

  // Step 3 state
  const [learningStyles, setLearningStyles] = useState<string[]>([]);

  // Step 4 state
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [schedule, setSchedule] = useState('');

  const isStep1Valid = goal && timeline && goalType;
  const isStep2Valid = Object.keys(skills).length > 0;
  const isStep3Valid = learningStyles.length > 0;
  const isStep4Valid = hoursPerDay && schedule;

  const getIsStepValid = (step: number) => {
    switch (step) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const toggleLearningStyle = (styleId: string) => {
    setLearningStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Build Your Learning Pathway
          </h1>
          <p className="text-base font-medium text-slate-500">
            Let&apos;s personalize your learning journey in 4 simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Step Content */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 mb-8">
          {currentStep === 1 && (
            <Step1Goal
              goal={goal}
              timeline={timeline}
              goalType={goalType}
              onGoalChange={setGoal}
              onTimelineChange={setTimeline}
              onGoalTypeChange={setGoalType}
            />
          )}

          {currentStep === 2 && (
            <Step2Skills
              skills={skills}
              onSkillChange={(skill, level) =>
                setSkills((prev) => ({ ...prev, [skill]: level }))
              }
            />
          )}

          {currentStep === 3 && (
            <Step3Style
              selectedStyles={learningStyles}
              onStyleToggle={toggleLearningStyle}
            />
          )}

          {currentStep === 4 && (
            <Step4Time
              hoursPerDay={hoursPerDay}
              schedule={schedule}
              onHoursChange={setHoursPerDay}
              onScheduleChange={setSchedule}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={currentStep === 1}
          >
            Back
          </Button>

          <div className="flex gap-4">
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={!getIsStepValid(currentStep)}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white px-6"
                disabled={!isStep4Valid}
              >
                Generate My Roadmap
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
