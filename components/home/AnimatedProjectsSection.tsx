"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types/notion";

/** 카드별 스태거 딜레이 (ms) */
const STAGGER_DELAYS = [0, 150, 300];

interface AnimatedProjectsSectionProps {
  projects: Project[];
}

/**
 * 홈 최근 프로젝트 섹션 — Intersection Observer 기반 스크롤 진입 애니메이션
 * Server Component(app/page.tsx)에서 데이터를 props로 전달받아 렌더링
 */
export function AnimatedProjectsSection({ projects }: AnimatedProjectsSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-t py-20">
      <Container>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-mono text-accent text-sm font-medium mb-2">
              &lt;Projects /&gt;
            </p>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" ref={gridRef}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{
                opacity: isVisible ? undefined : 0,
                animation: isVisible
                  ? `slide-up 600ms ease-out ${STAGGER_DELAYS[index] ?? 300}ms both`
                  : "none",
              }}
            >
              <ProjectCard
                project={project}
                className="h-full transition-colors duration-200 hover:border-accent"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
