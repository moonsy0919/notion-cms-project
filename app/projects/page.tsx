import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Project } from "@/types/notion";

/**
 * 프로젝트 목록 페이지 (서버 컴포넌트)
 * TODO: Notion API 연동 후 getProjects()로 데이터 fetch
 * TODO: 기술 스택 필터 및 검색 기능 클라이언트 컴포넌트로 추가
 */
export default async function ProjectsPage() {
  // TODO: Notion API 연동 후 아래 주석 해제
  // const projects = await getProjects();
  const projects: Project[] = [];

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="프로젝트"
          description="Notion으로 관리되는 프로젝트들입니다."
          className="mb-10"
        />

        {/* TODO: 기술 스택 필터 + 검색 UI 추가 예정 */}

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

/**
 * 프로젝트 카드 컴포넌트
 * @param project - 프로젝트 데이터
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          {project.status && (
            <Badge variant="outline" className="text-xs">
              {project.status}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub className="mr-1.5 h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
        )}
        {project.demoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
