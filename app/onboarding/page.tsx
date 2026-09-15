'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Step1Goal } from '@/components/onboarding/Step1Goal';
import { Step2Skills } from '@/components/onboarding/Step2Skills';
import { Step3Style } from '@/components/onboarding/Step3Style';
import { Step4Time } from '@/components/onboarding/Step4Time';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  // Step 1 state
  const [track, setTrack] = useState('Frontend Development');
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('12 Weeks (Standard)');

  // Step 2 state
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);
  const [hasShipped, setHasShipped] = useState(false);

  // Step 3 state
  const [learningStyles, setLearningStyles] = useState<string[]>(['projects', 'interactive']);

  // Step 4 state
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [hoursPerSession, setHoursPerSession] = useState(2);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const isStep1Valid = Boolean(track && goal && timeline);
  const isStep2Valid = Boolean(experienceLevel);
  const isStep3Valid = learningStyles.length > 0;
  const isStep4Valid = daysPerWeek > 0 && hoursPerSession > 0;

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

  const toggleLanguage = (lang: string) => {
    setLanguagesKnown((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleLearningStyle = (styleId: string) => {
    setLearningStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    setGenerationMessage('Architecting your DAG roadmap structure...');

    try {
      const timelineWeeks = parseInt(timeline, 10) || 12;

      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track,
          goal,
          timelineWeeks,
          daysPerWeek,
          hoursPerSession,
          experienceLevel,
          languagesKnown,
          hasShipped,
          learningStyles,
          additionalNotes,
        }),
      });

      const data = await res.json();

      if (res.status === 401 || data.error === 'Unauthorized') {
        toast.error('Please sign in to generate your roadmap.');
        router.push('/sign-in');
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate roadmap.');
      }

      toast.success('Your personalized roadmap is ready!');
      router.push('/roadmap');
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      toast.error(err.message || 'Something went wrong during generation. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Build Your Personalized Learning Pathway
          </h1>
          <p className="text-base font-medium text-slate-500">
            Tell us about your goals and schedule to generate a custom CS curriculum.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Step Content Card */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Generating Your AI Roadmap
              </h3>
              <p className="text-sm text-slate-500 max-w-md font-medium">
                {generationMessage}
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <Step1Goal
              track={track}
              goal={goal}
              timeline={timeline}
              onTrackChange={setTrack}
              onGoalChange={setGoal}
              onTimelineChange={setTimeline}
            />
          )}

          {currentStep === 2 && (
            <Step2Skills
              experienceLevel={experienceLevel}
              languagesKnown={languagesKnown}
              hasShipped={hasShipped}
              onExperienceChange={setExperienceLevel}
              onLanguageToggle={toggleLanguage}
              onShippedChange={setHasShipped}
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
              daysPerWeek={daysPerWeek}
              hoursPerSession={hoursPerSession}
              additionalNotes={additionalNotes}
              onDaysChange={setDaysPerWeek}
              onHoursChange={setHoursPerSession}
              onNotesChange={setAdditionalNotes}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-between items-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={currentStep === 1 || isGenerating}
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
                disabled={!isStep4Valid || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  'Generate My Roadmap'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
