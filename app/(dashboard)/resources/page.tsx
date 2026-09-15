'use client';

import { BookOpen, ExternalLink, Code, BookMarked, Video, Search } from 'lucide-react';
import { PageHeader } from '@/components/shell/PageHeader';

interface ResourceItem {
  title: string;
  author?: string;
  duration?: string;
  isFree: boolean;
}

interface ResourceSection {
  category: string;
  icon: React.ReactNode;
  items: ResourceItem[];
}

const resourcesData: ResourceSection[] = [
  {
    category: 'Video Courses',
    icon: <Video className="w-4 h-4 text-blue-500" />,
    items: [
      { title: 'The Complete Web Developer Course', author: 'Colt Steele', duration: '32 hours', isFree: false },
      { title: 'React Crash Course', author: 'FreeCodeCamp', duration: '12 hours', isFree: true },
      { title: 'JavaScript: The Hard Parts', author: 'Kyle Simpson', duration: '6 hours', isFree: false },
    ]
  },
  {
    category: 'Documentation & Books',
    icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
    items: [
      { title: 'MDN Web Docs', author: 'Mozilla', isFree: true },
      { title: 'Eloquent JavaScript', author: 'Kyle Simpson', isFree: true },
      { title: 'React Official Documentation', author: 'Meta', isFree: true },
    ]
  },
  {
    category: 'Interactive Practice',
    icon: <Code className="w-4 h-4 text-orange-500" />,
    items: [
      { title: 'LeetCode Algorithms', isFree: true },
      { title: 'CSS Battle', isFree: true },
      { title: 'Front End Mentor Projects', isFree: true },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Learning Resources"
        search={
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded shadow-sm text-slate-500">⌘F</kbd>
            </div>
          </div>
        }
        actions={
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
            <BookMarked className="w-4 h-4" />
            <span className="hidden md:inline">Saved Items</span>
          </button>
        }
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {resourcesData.map((section, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    {section.icon}
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">{section.category}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col h-full group cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      </div>

                      <div className="mb-4 pr-6">
                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        {item.author && <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">By {item.author}</p>}
                      </div>

                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.isFree ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {item.isFree ? 'Free' : 'Premium'}
                        </span>
                        {item.duration && (
                          <span className="text-[11px] font-bold text-slate-500 ml-auto bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
