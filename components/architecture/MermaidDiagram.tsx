"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
}

// 모듈 수준 카운터 — 렌더링마다 항상 고유한 ID 보장
let counter = 0;

/** Mermaid 시퀀스 다이어그램 클라이언트 렌더러 */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // resolvedTheme가 확정되기 전에는 실행하지 않음
    if (!containerRef.current || !resolvedTheme) return;

    let cancelled = false;
    // 매 렌더마다 고유 ID — 이전 렌더의 잔재와 충돌하지 않음
    const id = `mermaid-diagram-${++counter}`;

    (async () => {
      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        sequence: {
          actorMargin: 60,
          messageMargin: 40,
        },
      });

      try {
        const { svg } = await mermaid.render(id, chart);
        // Mermaid가 body에 남긴 임시 엘리먼트 정리 (render 직후, innerHTML 설정 전)
        document.getElementById(id)?.remove();

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        // 언마운트 경쟁 조건 등 — 조용히 무시
        document.getElementById(id)?.remove();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-lg border bg-card p-4 [&_svg]:mx-auto"
    />
  );
}
