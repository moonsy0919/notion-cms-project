import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
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
      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Badge variant="secondary" className="mb-6">
              개발자 포트폴리오
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              안녕하세요,
              <br />
              <span className="text-primary">문시현</span>입니다.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Next.js와 TypeScript를 주로 사용하는 프론트엔드 개발자입니다.
              <br />
              Notion으로 관리되는 프로젝트들을 소개합니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/projects">
                  프로젝트 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">소개 보기</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 최근 프로젝트 섹션 */}
      <section className="border-t py-20">
        <Container>
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">최근 프로젝트</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Notion에서 관리되는 최신 프로젝트들입니다.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                전체 보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
