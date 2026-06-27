"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
}

/** Mermaid 시퀀스 다이어그램 클라이언트 렌더러 */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const render = async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        sequence: {
          actorMargin: 60,
          messageMargin: 40,
        },
      });

      const id = `mermaid-${Math.floor(Date.now() / 1000)}`;
      const { svg } = await mermaid.render(id, chart);
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    };

    render();
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-lg border bg-card p-4 [&_svg]:mx-auto"
    />
  );
}
