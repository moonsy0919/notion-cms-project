import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectSearchBar } from "@/components/projects/ProjectSearchBar";
import { dummyProjects } from "@/lib/dummy";

/**
 * 프로젝트 목록 페이지 (서버 컴포넌트)
 * TODO: Phase 3에서 dummyProjects → getProjects()로 교체
 */
export default async function ProjectsPage() {
  const projects = dummyProjects;
  const techList = Array.from(new Set(projects.flatMap((p) => p.techStack)));

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="프로젝트"
          description="Notion으로 관리되는 프로젝트들입니다."
          className="mb-8"
        />

        <div className="mb-6 flex flex-col gap-3">
          <ProjectSearchBar />
          <ProjectFilters techList={techList} />
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="프로젝트가 없습니다"
            description="Notion API를 연동하면 프로젝트 목록이 표시됩니다."
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
