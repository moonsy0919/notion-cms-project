"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "running" | "done" | "error";

/** 개발 환경 전용 Notion 프로젝트 업데이트 버튼 — 프로덕션에서는 null 반환 */
export function UpdateProjectsButton() {
  if (process.env.NODE_ENV !== "development") return null;
  return <UpdateButton />;
}

/** fill-notion 실행, SSE 스트리밍 로그 표시, 완료 후 자동 새로고침 */
function UpdateButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const handleUpdate = async () => {
    setStatus("running");
    setLogs([]);

    try {
      const res = await fetch("/api/update-projects", { method: "POST" });
      const reader = res.body?.getReader();
      if (!reader) throw new Error("스트림 없음");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "log") {
              setLogs((prev) => [...prev.slice(-4), data.line]);
            } else if (data.type === "done") {
              setStatus(data.success ? "done" : "error");
              if (data.success) setTimeout(() => window.location.reload(), 1000);
            } else if (data.type === "error") {
              setStatus("error");
            }
          } catch {
            // malformed SSE 무시
          }
        }
      }
    } catch {
      setStatus("error");
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
