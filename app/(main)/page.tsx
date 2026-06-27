import { cookies } from "next/headers";
import { HeroSection } from "@/components/home/HeroSection";
import { AnimatedProjectsSection } from "@/components/home/AnimatedProjectsSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { getProjects, getOwnerProfile } from "@/lib/notion";

/** 홈 페이지 — Hero 섹션 + 최근 프로젝트 3개 + About 프리뷰 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get("notion-api-key")?.value ?? "";
  const dbId = cookieStore.get("notion-db-id")?.value ?? "";
  const [recentProjects, profile] = await Promise.all([
    getProjects(apiKey, dbId, { limit: 3 }),
    getOwnerProfile(apiKey),
  ]);

  return (
    <div className="flex flex-col">
      <HeroSection avatarUrl={profile?.avatarUrl ?? undefined} />
      <AnimatedProjectsSection projects={recentProjects} />
      <AboutPreview avatarUrl={profile?.avatarUrl ?? undefined} />
    </div>
  );
}
