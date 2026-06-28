import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

const DOT_COLS = [14, 22, 30, 38, 46, 54, 62, 70];
const DOT_ROWS = [14, 22, 30];

function CornerSVG({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("absolute w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48", className)}
      style={style}
      aria-hidden="true"
    >
      {/* 칩 사각형 */}
      <rect x="5" y="5" width="90" height="50" rx="4" fill="#0f1117" stroke="#1e2535" strokeWidth="1" />

      {/* 칩 내부 dot matrix: 3행 × 8열 */}
      {DOT_ROWS.map((y) =>
        DOT_COLS.map((x) => (
          <rect key={`${x},${y}`} x={x} y={y} width="2" height="2" fill="#2a3040" />
        ))
      )}

      {/* 칩 우측 핀 라인 */}
      <line x1="95" y1="20" x2="108" y2="20" stroke="#1e2535" strokeWidth="1" />
      <line x1="95" y1="40" x2="108" y2="40" stroke="#1e2535" strokeWidth="1" />

      {/* 수평 트레이스 */}
      <line x1="108" y1="20" x2="185" y2="20" stroke="#1a2030" strokeWidth="1" />
      <line x1="108" y1="40" x2="155" y2="40" stroke="#1a2030" strokeWidth="1" />

      {/* 절점 dot (우측 트레이스 꺾임) */}
      <circle cx="155" cy="40" r="3" fill="#2a3545" />

      {/* 수직 트레이스 (절점에서 화면 안쪽으로) */}
      <line x1="155" y1="40" x2="155" y2="185" stroke="#1a2030" strokeWidth="1" />

      {/* 칩 하단 핀 라인 */}
      <line x1="28" y1="55" x2="28" y2="68" stroke="#1e2535" strokeWidth="1" />
      <line x1="56" y1="55" x2="56" y2="68" stroke="#1e2535" strokeWidth="1" />

      {/* 수직 트레이스 (하단 핀에서 화면 안쪽으로) */}
      <line x1="28" y1="68" x2="28" y2="185" stroke="#1a2030" strokeWidth="1" />
      <line x1="56" y1="68" x2="56" y2="120" stroke="#1a2030" strokeWidth="1" />

      {/* 절점 dot (하단 트레이스 꺾임) */}
      <circle cx="56" cy="120" r="3" fill="#2a3545" />

      {/* 수평 트레이스 (절점에서 화면 안쪽으로) */}
      <line x1="56" y1="120" x2="185" y2="120" stroke="#1a2030" strokeWidth="1" />
    </svg>
  );
}

/** 온보딩 페이지용 회로기판 테마 배경 wrapper — 라이트/다크 무관 항상 다크 적용 */
export function CircuitBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 flex flex-col bg-[#080808]">
      <CornerSVG className="top-0 left-0" />
      <CornerSVG className="top-0 right-0" style={{ transform: "scaleX(-1)" }} />
      <CornerSVG className="bottom-0 left-0" style={{ transform: "scaleY(-1)" }} />
      <CornerSVG className="bottom-0 right-0" style={{ transform: "scale(-1)" }} />

      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
}
