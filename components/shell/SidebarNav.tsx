"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react';

const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Roadmap', href: '/roadmap', icon: Map },
  { label: 'Courses', href: '/courses', icon: GraduationCap },
  { label: 'Resources', href: '/resources', icon: BookOpen },
  { label: 'Progress', href: '/progress', icon: BarChart3 },
];

export interface SidebarCollection {
  id: string;
  label: string;
  color: string;
  href: string;
}

interface SidebarNavProps {
  collections?: SidebarCollection[];
}

/**
 * The nav body shared by the desktop rail (DesktopSidebar) and the mobile
 * drawer (MobileNavTrigger) — one implementation, so there is only one nav
 * to maintain.
 */
export function SidebarNav({ collections = [] }: SidebarNavProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 flex items-center gap-3">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">PathwayAI</h1>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 mt-2">
        <div className="space-y-1 mb-8">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-bold transition-all ${
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

        {collections.length > 0 && (
          <>
            <div className="mb-3 px-3 flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Collections</span>
              <Link href="/onboarding" aria-label="Create a new roadmap" className="hover:text-slate-600 text-lg leading-none">
                +
              </Link>
            </div>
            <div className="space-y-1">
              {collections.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-sm ${item.color}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            Settings
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-500 mt-1">
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'h-7 w-7' } }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {isLoaded ? (user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Account') : ' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
