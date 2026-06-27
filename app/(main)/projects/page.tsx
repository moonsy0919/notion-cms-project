import { cookies } from "next/headers";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectSearchBar } from "@/components/projects/ProjectSearchBar";
import { getProjects } from "@/lib/notion";

interface ProjectsPageProps {
  searchParams: Promise<{ tech?: string; q?: string }>;
}

/** 프로젝트 목록 페이지 (서버 컴포넌트) */
export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { tech, q } = await searchParams;
  const cookieStore = await cookies();
  const apiKey = cookieStore.get("notion-api-key")?.value ?? "";
  const dbId = cookieStore.get("notion-db-id")?.value ?? "";

  // 전체 목록 한 번만 조회 — techList 추출 및 JS 필터링에 사용
  const allProjects = await getProjects(apiKey, dbId);
  const techList = Array.from(new Set(allProjects.flatMap((p) => p.techStack)));

  const projects = allProjects.filter((p) => {
    if (tech && !p.techStack.includes(tech)) return false;
    if (q) {
      const lower = q.toLowerCase();
      if (
        !p.title.toLowerCase().includes(lower) &&
        !p.description.toLowerCase().includes(lower)
      )
        return false;
    }
    return true;
  });

  const isFiltered = Boolean(tech || q);

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="프로젝트"
          description="Notion으로 관리되는 프로젝트들입니다."
          className="mb-8"
        />

        <div className="mb-6 flex flex-col gap-3">
          <ProjectSearchBar initialQuery={q} />
          <ProjectFilters techList={techList} selectedTech={tech} />
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title={isFiltered ? "검색 결과가 없습니다" : "프로젝트가 없습니다"}
            description={
              isFiltered
                ? "다른 검색어나 필터를 시도해보세요."
                : "Notion DB에 프로젝트를 추가하면 목록이 표시됩니다."
            }
            action={isFiltered ? { label: "전체 보기", href: "/projects" } : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
