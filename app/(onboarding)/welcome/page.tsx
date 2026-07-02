"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardData {
  name: string;
  description: string;
  tags: string[];
  accent: string;
}

const CARDS: CardData[] = [
  {
    name: "포트폴리오 CMS",
    description: "Notion 기반 자동 생성",
    tags: ["Next.js", "Notion API"],
    accent: "#2a9d8f",
  },
  {
    name: "AI 분석 대시보드",
    description: "실시간 데이터 시각화",
    tags: ["React", "Claude API"],
    accent: "#7c3aed",
  },
  {
    name: "E-Commerce 플랫폼",
    description: "풀스택 쇼핑몰 서비스",
    tags: ["Next.js", "Node.js"],
    accent: "#2563eb",
  },
  {
    name: "팀 협업 툴",
    description: "실시간 업무 관리",
    tags: ["React", "Socket.io"],
    accent: "#16a34a",
  },
  {
    name: "오픈 API 서버",
    description: "REST·GraphQL 백엔드",
    tags: ["Node.js", "TypeScript"],
    accent: "#0891b2",
  },
  {
    name: "디자인 시스템",
    description: "컴포넌트 라이브러리",
    tags: ["React", "Storybook"],
    accent: "#4f46e5",
  },
  {
    name: "모바일 앱",
    description: "크로스플랫폼 서비스",
    tags: ["React Native", "Expo"],
    accent: "#dc2626",
  },
];

const RADIUS = 320;

/** 브라우저 윈도우 스타일 프로젝트 카드 */
function ProjectCard({ card }: { card: CardData }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#1e2535] bg-[#0f1117] flex flex-col"
      style={{ width: 130, height: 170 }}
    >
      {/* accent 바 */}
      <div style={{ height: 5, background: card.accent, flexShrink: 0 }} />

      {/* 브라우저 dots */}
      <div className="flex items-center gap-1 px-2.5 py-1.5" style={{ flexShrink: 0 }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.accent, opacity: 0.6 }} />
      </div>

      {/* 구분선 */}
      <div className="border-b border-[#1e2535] mx-2" />

      {/* 본문 */}
      <div className="flex flex-col flex-1 px-2.5 pt-2.5 pb-2.5">
        <p className="text-white font-bold leading-tight" style={{ fontSize: 11 }}>
          {card.name}
        </p>
        <p className="text-[#9ca3af] mt-1 leading-tight" style={{ fontSize: 9 }}>
          {card.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-1 py-0.5 text-[#9ca3af] bg-[#1e2535]"
              style={{ fontSize: 8 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Welcome 랜딩 페이지 */
export default function WelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const DURATION = 60000; // 60초 = 1바퀴
    let startTime: number | null = null;
    let rafId: number;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const angle = (elapsed / DURATION) * 360;
      if (containerRef.current) {
        containerRef.current.style.transform = `rotate(${angle % 360}deg)`;
      }
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#080808] overflow-hidden relative min-h-screen">
      {/* 호(arc) 컨테이너 — JS requestAnimationFrame으로 회전 */}
      <div
        ref={containerRef}
        className="absolute"
        style={{
          top: "62%",
          left: "50%",
          width: 0,
          height: 0,
        }}
      >
        {CARDS.map((card, i) => {
          const angle = -150 + i * 40; // -150, -110, ..., 90
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * RADIUS;
          const y = -Math.cos(rad) * RADIUS;
          return (
            <div
              key={card.name}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            >
              <ProjectCard card={card} />
            </div>
          );
        })}
      </div>

      {/* 헤드라인 + CTA */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-14 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          포트폴리오를
          <br />
          시작하세요
        </h1>
        <p className="text-[#9ca3af] text-sm md:text-base max-w-md mb-10">
          Notion CMS 기반으로 나만의 개발자 포트폴리오를 자동 생성합니다
        </p>
        <Button
          asChild
          size="lg"
          className="bg-[#2a9d8f] hover:bg-[#21867a] text-white font-semibold px-8"
        >
          <Link href="/setup">
            시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
