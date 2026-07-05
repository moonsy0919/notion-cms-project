"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { ArrowRight, KeyRound } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { SiNotion, SiClaude } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiKeyCard, type ApiKeyProvider } from "@/components/setup/ApiKeyCard";
import { VerificationArcTracker, type ConvergePhase } from "@/components/setup/VerificationArcTracker";
import { FlyingDocumentIcon } from "@/components/setup/FlyingDocumentIcon";

const REQUIRED_PROVIDERS: ApiKeyProvider[] = ["notion", "claude", "github"];

const ARC_NODES: [
  { provider: ApiKeyProvider; icon: ReactNode; iconBgClassName: string },
  { provider: ApiKeyProvider; icon: ReactNode; iconBgClassName: string },
  { provider: ApiKeyProvider; icon: ReactNode; iconBgClassName: string },
] = [
  { provider: "notion", icon: <SiNotion className="h-4 w-4 text-white" />, iconBgClassName: "bg-neutral-900" },
  { provider: "claude", icon: <SiClaude className="h-4 w-4 text-white" />, iconBgClassName: "bg-[#c15f3c]" },
  { provider: "github", icon: <FaGithub className="h-4 w-4 text-white" />, iconBgClassName: "bg-neutral-800" },
];

/** API 키 입력 페이지 — Notion·Claude·GitHub 카드별 개별 검증 + 즉시 쿠키 저장 */
export default function SetupPage() {
  const router = useRouter();
  const [verified, setVerified] = useState<Set<ApiKeyProvider>>(new Set());
  const [convergePhase, setConvergePhase] = useState<ConvergePhase>("idle");
  const [buttonPulse, setButtonPulse] = useState(false);
  const [flightRects, setFlightRects] = useState<{ start: DOMRect; end: DOMRect } | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)", { initializeWithValue: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedIconRef = useRef<HTMLDivElement>(null);

  function handleVerified(provider: ApiKeyProvider) {
    setVerified((prev) => new Set(prev).add(provider));
  }

  const allVerified = REQUIRED_PROVIDERS.every((provider) => verified.has(provider));

  // 3개 카드 검증 완료 시점에 컨버전스 애니메이션 시작 (데스크톱만, 모바일은 트래커 비노출이라 바로 활성화)
  useEffect(() => {
    if (!allVerified || convergePhase !== "idle") return;
    const timer = setTimeout(
      () => setConvergePhase(isDesktop ? "sliding" : "done"),
      isDesktop ? 0 : 600
    );
    return () => clearTimeout(timer);
  }, [allVerified, convergePhase, isDesktop]);

  // sliding → merged → flying 단계 자동 전이 (CSS 트랜지션/애니메이션 길이에 맞춘 타이머)
  useEffect(() => {
    if (convergePhase === "sliding") {
      const timer = setTimeout(() => setConvergePhase("merged"), 700);
      return () => clearTimeout(timer);
    }
    if (convergePhase === "merged") {
      const timer = setTimeout(() => setConvergePhase("flying"), 900);
      return () => clearTimeout(timer);
    }
  }, [convergePhase]);

  // flying 진입 시 문서 아이콘 시작/도착 좌표 계산
  useLayoutEffect(() => {
    if (convergePhase !== "flying") return;
    if (!mergedIconRef.current || !buttonRef.current) return;
    setFlightRects({
      start: mergedIconRef.current.getBoundingClientRect(),
      end: buttonRef.current.getBoundingClientRect(),
    });
  }, [convergePhase]);

  // 버튼 활성화 순간 하이라이트 펄스
  useEffect(() => {
    if (convergePhase !== "done") return;
    const startTimer = setTimeout(() => setButtonPulse(true), 0);
    const endTimer = setTimeout(() => setButtonPulse(false), 600);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [convergePhase]);

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:py-16">
      <Link
        href="/setup/why"
        className="fixed top-4 right-4 z-50 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline md:top-6 md:right-6"
      >
        왜 API key가 필요한가요?
      </Link>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="flex items-center justify-center gap-2 font-mono text-2xl font-bold">
            <KeyRound className="h-6 w-6 text-primary" /> API Key 설정
          </h1>
          <p className="text-sm text-muted-foreground">
            Notion·Claude·GitHub 키를 각각 입력하고 검증해주세요. 키는 브라우저에만 저장됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ApiKeyCard
            provider="notion"
            title="Notion"
            icon={<SiNotion className="h-4 w-4 text-white" />}
            iconBgClassName="bg-neutral-900"
            guideHref="/setup/guide/notion"
            fields={[
              { name: "notionApiKey", label: "Notion API Key", placeholder: "secret_...", type: "password" },
              {
                name: "notionDbId",
                label: "Notion Database ID",
                placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                type: "text",
              },
            ]}
            onVerified={handleVerified}
          />

          <ApiKeyCard
            provider="claude"
            title="Claude"
            icon={<SiClaude className="h-4 w-4 text-white" />}
            iconBgClassName="bg-[#c15f3c]"
            guideHref="/setup/guide/claude"
            fields={[
              {
                name: "anthropicApiKey",
                label: "Anthropic API Key",
                placeholder: "sk-ant-...",
                type: "password",
              },
            ]}
            onVerified={handleVerified}
          />

          <ApiKeyCard
            provider="github"
            title="GitHub"
            icon={<FaGithub className="h-4 w-4 text-white" />}
            iconBgClassName="bg-neutral-800"
            guideHref="/setup/guide/github"
            fields={[
              { name: "githubToken", label: "GitHub Token", placeholder: "ghp_...", type: "password" },
            ]}
            onVerified={handleVerified}
          />
        </div>

        <VerificationArcTracker
          ref={mergedIconRef}
          nodes={ARC_NODES}
          verified={verified}
          convergePhase={convergePhase}
        />

        <div className="mt-4 flex justify-center md:mt-10">
          <Button
            ref={buttonRef}
            type="button"
            disabled={convergePhase !== "done"}
            onClick={() => router.push("/admin")}
            className={cn(
              "transition-shadow duration-300",
              buttonPulse && "ring-2 ring-green-500 ring-offset-2 ring-offset-background"
            )}
          >
            계속하기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {convergePhase === "flying" && flightRects && (
        <FlyingDocumentIcon
          startRect={flightRects.start}
          endRect={flightRects.end}
          iconBgClassName="bg-[#c15f3c]"
          onArrived={() => setConvergePhase("done")}
        />
      )}
    </main>
  );
}
