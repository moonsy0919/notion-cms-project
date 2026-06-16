import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";

/**
 * 프로젝트 상세 페이지 파라미터 타입
 */
interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 동적 메타데이터 생성
 * TODO: Notion API 연동 후 실제 프로젝트 제목으로 교체
 */
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  // TODO: const project = await getProjectById(id);
  return {
    title: `프로젝트 상세 | 문시현`,
    description: `프로젝트 ID: ${id}`,
  };
}

/**
 * 프로젝트 상세 페이지 (서버 컴포넌트)
 * TODO: Notion API 연동 후 getProjectById, getProjectBlocks로 데이터 fetch
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  // TODO: Notion API 연동 후 아래 주석 해제
  // const project = await getProjectById(id);
  // if (!project) notFound();
  // const blocks = await getProjectBlocks(id);

  // 임시: API 연동 전에는 404 반환
  if (!process.env.NOTION_API_KEY) {
    notFound();
  }

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

          {/* 프로젝트 헤더 — TODO: 실제 데이터로 교체 */}
          <div className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">완료</Badge>
              <Badge variant="secondary">Personal</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">프로젝트 제목</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Notion API 연동 후 실제 프로젝트 설명이 표시됩니다.
            </p>

            {/* 메타 정보 */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                2024.01 ~ 2024.06
              </span>
            </div>

            {/* 기술 스택 */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Next.js", "TypeScript", "Tailwind CSS"].map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* 링크 버튼 */}
            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="sm" disabled>
                <FaGithub className="mr-1.5 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Demo
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="mb-8" />

          {/* 본문 콘텐츠 — TODO: Notion 블록 렌더러로 교체 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Notion API가 연동되면 이 영역에 프로젝트 상세 내용이 표시됩니다.
              <br />
              페이지 ID: <code className="font-mono text-sm">{id}</code>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
