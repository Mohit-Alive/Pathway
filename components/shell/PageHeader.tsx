import type { ReactNode } from 'react';
import { MobileNavTrigger } from './MobileNavTrigger';
import type { SidebarCollection } from './SidebarNav';

interface PageHeaderProps {
  title: string;
  leading?: ReactNode;
  badge?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  collections?: SidebarCollection[];
}

/**
 * Replaces the five duplicated `h-16 ... px-8` header divs. Desktop
 * (`lg:`) is pixel-identical to the original; below `lg` it grows and
 * wraps instead of clipping, and gains the mobile nav trigger.
 */
export function PageHeader({ title, leading, badge, search, actions, collections }: PageHeaderProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6 lg:h-16 lg:px-8 lg:py-0">
      <div className="flex min-w-0 items-center gap-3 lg:gap-8">
        <MobileNavTrigger collections={collections} />
        {leading}
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-lg font-bold text-slate-800">
            {title}
          </h1>
          {badge}
        </div>
        {search}
      </div>

      {actions && <div className="flex items-center gap-2 sm:gap-5">{actions}</div>}
    </div>
  );
}
