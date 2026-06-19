import { HeroSection } from "@/components/home/HeroSection";
import { AnimatedProjectsSection } from "@/components/home/AnimatedProjectsSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { dummyProjects } from "@/lib/dummy";

/**
 * 홈 페이지 — Hero 섹션 + 최근 프로젝트 3개
 * TODO: Phase 3에서 dummyProjects → getProjects({ limit: 3 })으로 교체
 */
export default function HomePage() {
  const recentProjects = dummyProjects.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 최근 프로젝트 섹션 */}
      <AnimatedProjectsSection projects={recentProjects} />

      {/* About 프리뷰 섹션 */}
      <AboutPreview />
    </div>
  );
}
