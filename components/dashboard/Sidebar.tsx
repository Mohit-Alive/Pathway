'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { userProfile } from '@/lib/mockData';

export function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Roadmap', href: '/roadmap', icon: Map },
    { label: 'Courses', href: '/courses', icon: GraduationCap },
    { label: 'Resources', href: '/resources', icon: BookOpen },
    { label: 'Progress', href: '/progress', icon: BarChart3 },
    { label: 'Community', href: '/community', icon: Users },
  ];

  const collections = [
    { label: 'Software Engineer', color: 'bg-blue-500' },
    { label: 'Product Designer', color: 'bg-emerald-500' },
    { label: 'Project Manager', color: 'bg-purple-500' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">PathwayAI</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-2">
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Collections */}
        <div className="mb-3 px-3 flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span>Collections</span>
          <button className="hover:text-slate-600 text-lg leading-none">+</button>
        </div>
        <div className="space-y-1">
          {collections.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
              <div className={`w-2 h-2 rounded-sm ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 opacity-20 blur-xl rounded-full"></div>
          <p className="text-xs font-bold text-slate-900 mb-1">Your Trial is active</p>
          <p className="text-[11px] text-slate-500 font-medium mb-3">Enjoy 5 more days of access</p>
          <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
        </div>
        <div className="space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-slate-400" />
            Knowledge Hub
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors mt-1">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
              {userProfile.avatar}
            </div>
            Invite Teams
          </div>
        </div>
      </div>
    </div>
  );
}
