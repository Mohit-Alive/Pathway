import { getCuratedResourcesList } from "@/lib/dal/resources";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  BookOpen,
  ExternalLink,
  Code,
  Video,
  GraduationCap,
  Map as MapIcon,
  Palette,
  Search,
  Bookmark,
  Star,
} from "lucide-react";
import ResourceCardClient from "@/components/resources/ResourceCardClient";
import { ResourceWithSavedStatus } from "@/lib/dal/resources";

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4 text-blue-500" />,
  Atom: <Code className="w-4 h-4 text-sky-500" />,
  Database: <Code className="w-4 h-4 text-purple-500" />,
  GitBranch: <Code className="w-4 h-4 text-amber-500" />,
  GraduationCap: <GraduationCap className="w-4 h-4 text-emerald-500" />,
  Palette: <Palette className="w-4 h-4 text-pink-500" />,
  Map: <MapIcon className="w-4 h-4 text-indigo-500" />,
  Code: <Code className="w-4 h-4 text-blue-500" />,
};

export default async function ResourcesPage() {
  const resources = await getCuratedResourcesList();

  // Group resources by type
  const typeGroups = new Map<string, ResourceWithSavedStatus[]>();
  for (const r of resources) {
    const groupName =
      r.type === "doc"
        ? "Documentation & Guides"
        : r.type === "course"
        ? "Courses & Degrees"
        : r.type === "book"
        ? "Books & Manuals"
        : r.type === "tool"
        ? "Tools & Frameworks"
        : "Articles & Tutorials";

    const list = typeGroups.get(groupName) ?? [];
    list.push(r);
    typeGroups.set(groupName, list);
  }

  return (
    <>
      <PageHeader
        title="Learning Resources"
        search={
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search verified resources..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {Array.from(typeGroups.entries()).map(([category, items], index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    {ICON_MAP[items[0]?.iconKey ?? "BookOpen"]}
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">{category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <ResourceCardClient key={item.id} resource={item} />
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
