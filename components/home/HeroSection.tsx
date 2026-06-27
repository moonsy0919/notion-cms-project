"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { ProfileAvatar } from "@/components/home/ProfileAvatar";
import { CodeEditorPanel } from "@/components/home/CodeEditorPanel";
import { useProfile } from "@/contexts/DeveloperProfileContext";

interface HeroSectionProps {
  /** Notion getOwnerProfile()에서 전달받은 아바타 URL. 없으면 ProfileAvatar 기본값 사용 */
  avatarUrl?: string;
}

/**
 * 홈 Hero 섹션 — 좌우 2컬럼 레이아웃
 * 좌측 45%: 소개 텍스트 + 소셜 링크 + CTA
 * 우측 55%: 프로필 아바타 + CodeEditorPanel
 * 모바일: 우측 컬럼 숨김
 */
export function HeroSection({ avatarUrl }: HeroSectionProps) {
  const { profile, githubUrl } = useProfile();

  return (
    <section className="min-h-screen flex items-center py-24">
      <Container>
        <div className="flex items-center gap-8 lg:gap-16">
          {/* 좌측 45% */}
          <div className="w-full md:w-[45%] space-y-6">
            {/* <Hello /> 태그 레이블 */}
            <p className="font-mono text-accent text-sm font-medium">
              &lt;Hello /&gt;
            </p>

            {/* 이름 — teal 하이라이트 */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              안녕하세요,
              <br />
              <span className="text-accent">{profile.name}</span>입니다.
            </h1>

            {/* {역할} — 중괄호 스타일 */}
            <p className="font-mono text-base">
              <span className="text-accent">{"{ "}</span>
              <span className="text-foreground">{profile.role}</span>
              <span className="text-accent">{" }"}</span>
            </p>

            {/* 한 줄 소개 */}
            <p className="text-muted-foreground text-base leading-relaxed">
              Notion으로 관리되는 프로젝트들을 소개합니다.
            </p>

            {/* 소셜 아이콘 행 */}
            <div className="flex items-center gap-4">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              )}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>

            {/* CTA 버튼 */}
            <Button size="lg" asChild>
              <Link href="/projects">
                프로젝트 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 우측 55% — 모바일에서 숨김 */}
          <div className="hidden md:flex md:w-[55%] flex-col items-center gap-6">
            <ProfileAvatar size={96} src={avatarUrl} />
            <CodeEditorPanel />
          </div>
        </div>
      </Container>
    </section>
  );
}
