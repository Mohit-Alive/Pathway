import { getActiveRoadmap } from "@/lib/dal/roadmap";
import RoadmapPageClient from "@/components/roadmap/RoadmapPageClient";

export default async function RoadmapPage() {
  const activeRoadmapData = await getActiveRoadmap();

  return <RoadmapPageClient initialData={activeRoadmapData} />;
}
