"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle, BrainCircuit, Database } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Status = "idle" | "running" | "done" | "error";

/** 단계 정의: 레이블, 아이콘, 예상 전환 지연(ms) */
const STEPS = [
  { label: "GitHub 데이터 수집 중", Icon: FaGithub, delay: 3_000 },
  { label: "Claude AI 분석 중", Icon: BrainCircuit, delay: 32_000 },
  { label: "Notion 저장 중", Icon: Database, delay: 8_000 },
] as const;

/** Notion 대기 프로젝트를 폴링 방식으로 순차 처리하는 버튼 */
export function UpdateProjectsButton() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [total, setTotal] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** 진행 중인 단계 타이머를 모두 정리합니다 */
  const clearStepTimers = () => {
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
  };

  /** 단계 레이블을 알려진 지연 시간 기반으로 순차 전환합니다 */
  const startStepTimers = () => {
    clearStepTimers();
    setStepIndex(0);

    let accumulated = 0;
    STEPS.slice(0, -1).forEach((step, i) => {
      accumulated += step.delay;
      const timer = setTimeout(() => setStepIndex(i + 1), accumulated);
      stepTimersRef.current.push(timer);
    });
  };

  useEffect(() => {
    return () => clearStepTimers();
  }, []);

  const handleUpdate = async () => {
    setStatus("running");
    setProcessed(0);
    setCompletedTitles([]);

    try {
      // 전체 대기 수 조회
      const countRes = await fetch("/api/update-projects");
      if (!countRes.ok) {
        setStatus("error");
        return;
      }
      const { pending } = await countRes.json() as { pending: number };

      if (pending === 0) {
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2_000);
        return;
      }

      setTotal(pending);
      startStepTimers();

      // 1 call = 1 project 폴링
      while (true) {
        const res = await fetch("/api/update-projects", { method: "POST" });

        if (!res.ok) {
          const data = await res.json() as { error?: string };
          setCompletedTitles((prev) => [
            ...prev,
            `오류: ${data.error ?? res.statusText}`,
          ]);
          setStatus("error");
          clearStepTimers();
          return;
        }

        const data = await res.json() as {
          done: boolean;
          processed?: string;
          title?: string;
          remaining?: number;
        };

        if (data.title) {
          setCompletedTitles((prev) => [...prev, data.title!]);
          setProcessed((prev) => prev + 1);
        }

        if (data.done) {
          clearStepTimers();
          setStatus("done");
          setTimeout(() => {
            router.refresh();
            setStatus("idle");
          }, 1_500);
          return;
        }

        startStepTimers();
      }
    } catch {
      setStatus("error");
      setCompletedTitles((prev) => [...prev, "네트워크 오류가 발생했습니다."]);
      clearStepTimers();
    }
  };

  const progressPercent = total > 0 ? Math.round((processed / total) * 100) : 0;
  const CurrentStepIcon = status === "done"
    ? CheckCircle2
    : status === "error"
    ? XCircle
    : STEPS[stepIndex]?.Icon ?? RefreshCw;

  const HeaderIcon = status === "done"
    ? CheckCircle2
    : status === "error"
    ? XCircle
    : RefreshCw;

  return (
    <div className="hidden md:flex items-center relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleUpdate}
        disabled={status === "running"}
        title="Notion 프로젝트 업데이트"
      >
        <HeaderIcon
          className={cn(
            "h-4 w-4",
            status === "running" && "animate-spin",
            status === "done" && "text-accent",
            status === "error" && "text-destructive"
          )}
        />
        <span className="sr-only">프로젝트 업데이트</span>
      </Button>

      {status !== "idle" && (
        <div className="absolute top-full right-0 mt-1 w-96 rounded-md border bg-card p-3 shadow-lg z-50">
          {/* 헤더 */}
          <p className="text-xs font-semibold mb-2">
            {status === "running"
              ? "Notion 프로젝트 업데이트 중"
              : status === "done"
              ? "업데이트 완료"
              : "오류 발생"}
          </p>

          {/* 전체 진행률 바 */}
          {total > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">전체 진행률</span>
                <span className="text-xs font-mono font-medium">
                  {processed} / {total} ({progressPercent}%)
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* 현재 단계 레이블 */}
          {status === "running" && total > 0 && (
            <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/50 mb-2">
              <CurrentStepIcon className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="text-xs text-muted-foreground">
                {STEPS[stepIndex]?.label ?? "처리 중"}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {stepIndex + 1}/3
              </span>
            </div>
          )}

          {/* 완료된 프로젝트 목록 */}
          {completedTitles.length > 0 && (
            <div className="space-y-0.5 max-h-24 overflow-y-auto">
              {completedTitles.map((title, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-accent shrink-0" />
                  <span className="truncate">{title}</span>
                </div>
              ))}
            </div>
          )}

          {/* 완료 상태 메시지 */}
          {status === "done" && total === 0 && (
            <p className="text-xs text-muted-foreground">
              대기 중인 프로젝트가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
