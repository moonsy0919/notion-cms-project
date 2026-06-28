"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "running" | "done" | "error";

/** Notion 대기 프로젝트를 폴링 방식으로 순차 처리하는 버튼 */
export function UpdateProjectsButton() {
  return <UpdateButton />;
}

function UpdateButton() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (line: string) =>
    setLogs((prev) => [...prev.slice(-4), line]);

  const handleUpdate = async () => {
    setStatus("running");
    setLogs([]);

    try {
      while (true) {
        const res = await fetch("/api/update-projects", { method: "POST" });

        if (!res.ok) {
          const data = await res.json() as { error?: string };
          addLog(`오류: ${data.error ?? res.statusText}`);
          setStatus("error");
          return;
        }

        const data = await res.json() as {
          done: boolean;
          processed?: string;
          remaining?: number;
        };

        if (data.processed != null) {
          addLog(
            `완료: ${data.processed} (남은 ${data.remaining ?? 0}개)`
          );
        }

        if (data.done) {
          setStatus("done");
          setTimeout(() => {
            router.refresh();
            setStatus("idle");
          }, 1000);
          return;
        }
      }
    } catch {
      setStatus("error");
      addLog("네트워크 오류가 발생했습니다.");
    }
  };

  const Icon =
    status === "done" ? CheckCircle2 : status === "error" ? XCircle : RefreshCw;

  return (
    <div className="hidden md:flex items-center relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleUpdate}
        disabled={status === "running"}
        title="Notion 프로젝트 업데이트"
      >
        <Icon
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
        <div className="absolute top-full right-0 mt-1 w-80 rounded-md border bg-card p-2 shadow-lg z-50">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {status === "running"
              ? "업데이트 중..."
              : status === "done"
              ? "완료 — 새로고침 중"
              : "오류 발생 — 재시도 가능"}
          </p>
          {logs.length > 0 && (
            <div className="font-mono text-xs space-y-0.5 max-h-32 overflow-y-auto">
              {logs.map((log, i) => (
                <p key={i} className="text-muted-foreground truncate">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
