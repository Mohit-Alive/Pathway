'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shell/PageHeader';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PublicQuizQuestion, QuizEvaluationResult } from '@/lib/dal/courses';
import { toast } from 'sonner';

export default function ChapterQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = use(params);

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<QuizEvaluationResult | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/health`); // quick health or fetch
        const qRes = await fetch(`/api/courses/${courseId}/${chapterId}/questions`);
        if (qRes.ok) {
          const data = await qRes.json();
          setQuestions(data.questions);
        } else {
          // Fallback fetch if direct api route unbuilt
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [courseId, chapterId]);

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (evalResult) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/courses/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, answers }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit quiz.');
      }

      setEvalResult(data.result);
      if (data.result.passed) {
        toast.success(`Passed! Score: ${data.result.score}/${data.result.total}`);
      } else {
        toast.error(`Not passed. Score: ${data.result.score}/${data.result.total}. Review answers below.`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error submitting quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestions = questions.length || 5;
  const isAllAnswered = questions.length > 0
    ? questions.every((q) => answers[q.id] !== undefined)
    : Object.keys(answers).length >= 5;

  return (
    <>
      <PageHeader
        title="Knowledge Check"
        leading={
          <Link
            href={`/courses/${courseId}/${chapterId}`}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Quiz Evaluation
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Select your answers for all questions and submit.
              </p>
            </div>
            {evalResult && (
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                  Score
                </span>
                <span
                  className={`text-3xl font-black ${
                    evalResult.passed ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {evalResult.score}/{evalResult.total}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            questions.map((q, qIndex) => {
              const res = evalResult?.questionResults.find((r) => r.questionId === q.id);
              const isSelected = answers[q.id] !== undefined;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-800 mb-6 flex gap-3">
                    <span className="text-blue-500">{qIndex + 1}.</span> {q.question}
                  </h3>

                  <div className="space-y-3">
                    {q.options.map((opt, optIndex) => {
                      const isOptionChosen = answers[q.id] === optIndex;
                      const isOptionCorrect = res?.correctIndex === optIndex;

                      let optClass =
                        "p-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer flex items-center gap-3 ";

                      if (!evalResult) {
                        optClass += isOptionChosen
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:bg-slate-50";
                      } else {
                        if (isOptionCorrect) {
                          optClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                        } else if (isOptionChosen && !isOptionCorrect) {
                          optClass += "border-red-500 bg-red-50 text-red-700";
                        } else {
                          optClass += "border-slate-100 bg-white text-slate-400 opacity-50";
                        }
                      }

                      return (
                        <div
                          key={optIndex}
                          className={optClass}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              !evalResult
                                ? isOptionChosen
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-slate-300 bg-white"
                                : isOptionCorrect
                                ? "border-emerald-500 bg-emerald-500"
                                : isOptionChosen
                                ? "border-red-500 bg-red-500"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {evalResult && isOptionCorrect && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                            {evalResult && isOptionChosen && !isOptionCorrect && (
                              <XCircle className="w-3 h-3 text-white" />
                            )}
                            {!evalResult && isOptionChosen && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="leading-snug">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {res && (
                    <div
                      className={`mt-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
                        res.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                      }`}
                    >
                      {res.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <strong className="block mb-1">
                          {res.isCorrect ? "Correct!" : "Incorrect"}
                        </strong>
                        {res.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex justify-end gap-4">
          {!evalResult ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={!isAllAnswered || isSubmitting}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Answers
            </button>
          ) : (
            <Link
              href={`/courses/${courseId}`}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
            >
              Continue Module <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
