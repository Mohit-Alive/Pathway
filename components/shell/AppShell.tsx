import type { ReactNode } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import type { SidebarCollection } from './SidebarNav';

interface AppShellProps {
  children: ReactNode;
  collections?: SidebarCollection[];
}

/**
 * Replaces the five duplicated `flex h-screen ... overflow-hidden` shells.
 * `min-w-0` on the content pane is the fix that was missing everywhere —
 * without it a flex child can't shrink below its intrinsic content width,
 * which was half the mobile breakage independent of the sidebar itself.
 */
export function AppShell({ children, collections }: AppShellProps) {
  return (
    <div className="flex h-dvh bg-canvas font-sans text-slate-900 overflow-hidden">
      <DesktopSidebar collections={collections} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
