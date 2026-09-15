import { SidebarNav, type SidebarCollection } from './SidebarNav';

interface DesktopSidebarProps {
  collections?: SidebarCollection[];
}

export function DesktopSidebar({ collections }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <SidebarNav collections={collections} />
    </aside>
  );
}
