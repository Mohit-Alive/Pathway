"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { SidebarNav, type SidebarCollection } from './SidebarNav';

interface MobileNavTriggerProps {
  collections?: SidebarCollection[];
  className?: string;
}

export function MobileNavTrigger({ collections, className }: MobileNavTriggerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation via React's documented render-phase "adjust state
  // when a prop changes" pattern (no effect flash) — also immunizes against
  // React `<Activity>` state preservation if `cacheComponents` is ever
  // turned on. https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden ${className ?? ''}`}
      >
        <Menu className="h-5 w-5" />
      </button>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarNav collections={collections} />
      </SheetContent>
    </Sheet>
  );
}
