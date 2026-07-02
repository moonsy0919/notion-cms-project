import { cache } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { getProjectById, getProjectBlocks } from "@/lib/notion";
import { BlocksRenderer } from "@/components/notion/BlockRenderer";
import { formatDate } from "@/lib/date";

/** 동일 요청 내 쿠키를 한 번만 읽도록 캐시 */
const getApiKey = cache(async () => {
  const cookieStore = await cookies();
  return cookieStore.get("notion-api-key")?.value ?? "";
});

/** 동일 요청 내 getProjectById를 한 번만 실행하도록 캐시 — generateMetadata·페이지 컴포넌트 공유 */
const getCachedProject = cache(getProjectById);

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 개발 기간 문자열 반환 */
function getPeriodLabel(periodStart: string | null, periodEnd: string | null): string {
  if (!periodStart) return "기간 미정";
  const start = formatDate(periodStart);
  if (!periodEnd) return `${start} ~ 진행중`;
  return `${start} ~ ${formatDate(periodEnd)}`;
}

/** 프로젝트 상태에 따른 배지 variant */
function getStatusVariant(status: string | null) {
  if (status === "진행중") return "default" as const;
  if (status === "유지보수") return "secondary" as const;
  return "outline" as const;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const apiKey = await getApiKey();
  const project = await getCachedProject(apiKey, id);
  if (!project) {
    return { title: "프로젝트를 찾을 수 없습니다" };
  }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const apiKey = await getApiKey();

  const project = await getCachedProject(apiKey, id);
  if (!project) notFound();

  const blocks = await getProjectBlocks(apiKey, id);

  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* 뒤로가기 */}
          <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              프로젝트 목록
            </Link>
          </Button>

          {/* 프로젝트 헤더 */}
          <div className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {project.status && (
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              )}
              {project.category && (
                <Badge variant="secondary">{project.category}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            {project.description && (
              <p className="mt-3 text-lg text-muted-foreground">
                {project.description}
              </p>
            )}

            {/* 기간 */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {getPeriodLabel(project.periodStart, project.periodEnd)}
              </span>
            </div>

            {/* 기술 스택 */}
            {project.techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* 링크 버튼 */}
            <div className="mt-6 flex gap-3">
              {project.githubUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-1.5 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <FaGithub className="mr-1.5 h-4 w-4" />
                  GitHub
                </Button>
              )}
              {project.demoUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Demo
                </Button>
              )}
            </div>
          </div>

          {/* 구분선 */}
          <hr className="mb-8" />

          {/* 본문 콘텐츠 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {blocks.length > 0 ? (
              <BlocksRenderer blocks={blocks} />
            ) : (
              <p className="text-muted-foreground">
                아직 작성된 내용이 없습니다.
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
