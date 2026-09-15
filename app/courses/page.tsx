'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { courses } from '@/lib/courseData';
import { 
  ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, 
  PlayCircle, GraduationCap, XCircle, Search 
} from 'lucide-react';

export default function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'toc' | 'content' | 'quiz' | 'completed'>('list');
  const [chapterIndex, setChapterIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const course = courses.find(c => c.id === selectedCourseId);
  const chapter = course?.chapters[chapterIndex];

  const handleStartCourse = (id: string) => {
    setSelectedCourseId(id);
    setView('toc');
    setChapterIndex(0);
  };

  const handleStartChapter = (index: number) => {
    setChapterIndex(index);
    setView('content');
  };

  const handleToQuiz = () => {
    setAnswers({});
    setIsQuizSubmitted(false);
    setView('quiz');
  };

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (isQuizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < 5) return; // Wait until all answered
    let newScore = 0;
    chapter?.quiz.forEach((q, i) => {
      if (answers[i] === q.ans) newScore++;
    });
    setScore(newScore);
    setIsQuizSubmitted(true);
  };

  const handleNextChapter = () => {
    if (course && chapterIndex < course.chapters.length - 1) {
      setChapterIndex(prev => prev + 1);
      setView('content');
    } else {
      setView('completed');
    }
  };

  const renderHeader = (title: string, onBack?: () => void) => (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>
      {view === 'list' && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {view === 'list' && (
          <>
            {renderHeader('Interactive Courses')}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => handleStartCourse(c.id)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[240px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                      <p className="text-sm text-slate-500 font-medium mb-6 flex-1">{c.description}</p>
                      <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-50 pt-4">
                        <span>{c.chapters.length} Modules</span>
                        <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                          Start <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'toc' && course && (
          <>
            {renderHeader(course.title, () => setView('list'))}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Course Modules</h2>
                    <p className="text-sm text-slate-500 font-medium">{course.description}</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {course.chapters.map((ch, idx) => (
                      <div key={ch.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm">{ch.title}</h3>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          {ch.quiz.length} Questions
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <button 
                      onClick={() => handleStartChapter(0)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      Start First Module <PlayCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'content' && chapter && (
          <>
            {renderHeader(`Module ${chapterIndex + 1}: ${chapter.title}`, () => setView('toc'))}
            <div className="flex-1 overflow-auto p-8 bg-white">
              <div className="max-w-3xl mx-auto pb-32">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">{chapter.title}</h2>
                <div 
                  className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
               <div className="max-w-3xl mx-auto flex justify-end">
                 <button 
                    onClick={handleToQuiz}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
                  >
                    Take Chapter Quiz <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </>
        )}

        {view === 'quiz' && chapter && (
          <>
            {renderHeader(`Quiz: ${chapter.title}`, () => setView('content'))}
            <div className="flex-1 overflow-auto p-8 pb-32">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
                   <div>
                     <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Knowledge Check</h2>
                     <p className="text-sm text-slate-500 font-medium mt-1">Answer all 5 questions to proceed.</p>
                   </div>
                   {isQuizSubmitted && (
                     <div className="text-right">
                       <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Score</span>
                       <span className={`text-3xl font-black ${score >= 3 ? 'text-emerald-500' : 'text-red-500'}`}>{score}/5</span>
                     </div>
                   )}
                </div>

                {chapter.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex gap-3">
                      <span className="text-blue-500">{qIndex + 1}.</span> {q.q}
                    </h3>
                    <div className="space-y-3">
                      {q.opts.map((opt, optIndex) => {
                        const isSelected = answers[qIndex] === optIndex;
                        const isCorrect = optIndex === q.ans;
                        
                        let optClass = "p-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer flex items-center gap-3 ";
                        
                        if (!isQuizSubmitted) {
                          optClass += isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:bg-slate-50";
                        } else {
                          if (isCorrect) {
                            optClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                          } else if (isSelected && !isCorrect) {
                            optClass += "border-red-500 bg-red-50 text-red-700";
                          } else {
                            optClass += "border-slate-100 bg-white text-slate-400 opacity-50";
                          }
                        }

                        return (
                          <div key={optIndex} className={optClass} onClick={() => handleOptionSelect(qIndex, optIndex)}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                !isQuizSubmitted 
                                  ? (isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white")
                                  : (isCorrect ? "border-emerald-500 bg-emerald-500" : (isSelected ? "border-red-500 bg-red-500" : "border-slate-300 bg-white"))
                              }`}>
                                {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-3 h-3 text-white" />}
                                {isQuizSubmitted && isSelected && !isCorrect && <XCircle className="w-3 h-3 text-white" />}
                                {!isQuizSubmitted && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="leading-snug">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                    {isQuizSubmitted && (
                      <div className={`mt-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${answers[qIndex] === q.ans ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                        {answers[qIndex] === q.ans ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />}
                        <div>
                          <strong className="block mb-1">{answers[qIndex] === q.ans ? 'Correct!' : 'Incorrect'}</strong>
                          {q.exp}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
               <div className="max-w-3xl mx-auto flex justify-end gap-4">
                 {!isQuizSubmitted ? (
                   <button 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(answers).length < 5}
                      className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
                    >
                      Submit Answers
                    </button>
                 ) : (
                   <button 
                      onClick={handleNextChapter}
                      className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
                    >
                      {chapterIndex < (course.chapters.length - 1) ? 'Proceed to Next Module' : 'Complete Course'} <ArrowRight className="w-4 h-4" />
                    </button>
                 )}
               </div>
            </div>
          </>
        )}

        {view === 'completed' && course && (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Course Completed!</h2>
              <p className="text-sm text-slate-500 font-medium mb-8">You have successfully finished all modules and quizzes for &ldquo;{course.title}&rdquo;.</p>
              <button 
                onClick={() => setView('list')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Back to Courses Catalog
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
