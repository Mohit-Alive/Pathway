'use client';

import { useState } from 'react';
import { ExternalLink, Bookmark, Star } from 'lucide-react';
import { ResourceWithSavedStatus } from '@/lib/dal/resources';
import { toast } from 'sonner';

export default function ResourceCardClient({ resource }: { resource: ResourceWithSavedStatus }) {
  const [isSaved, setIsSaved] = useState(resource.isSaved);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    try {
      const res = await fetch('/api/resources/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save resource.');
      }
      setIsSaved(data.isSaved);
      toast.success(data.isSaved ? 'Saved to your bookmarks!' : 'Removed from bookmarks.');
    } catch (err: any) {
      toast.error(err.message || 'Error updating bookmark');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all flex flex-col h-full group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3 pr-2">
        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        <button
          onClick={handleToggleSave}
          disabled={isToggling}
          title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
          className={`p-1.5 rounded-lg transition-all border ${
            isSaved
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed">
        {resource.description}
      </p>

      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{resource.rating}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {resource.estimatedMinutes}m
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </a>
  );
}
