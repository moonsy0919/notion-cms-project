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

/** 배경 전체를 채우는 PCB 트레이스 패턴 */
const TRACES = [
  // 좌상 구역
  "0,120 300,120 300,260 440,260 440,400",
  "0,340 140,340 140,220 300,220",
  "140,340 140,560 240,560",
  // 우상 구역
  "1440,100 1200,100 1200,220 1060,220 1060,380",
  "840,120 840,240 980,240 980,380 1060,380",
  "1060,380 1320,380 1440,380",
  "1320,380 1320,540 1440,540",
  // 좌하 구역
  "0,660 140,660 140,780 300,780 300,860 440,860",
  "0,820 100,820 100,780 140,780",
  "240,560 360,560 360,680 500,680 500,780 640,780",
  // 우하 구역
  "1440,620 1320,620 1320,540",
  "980,620 980,780 1120,780 1120,860 1440,860",
  "640,780 640,900",
  // 중앙 연결 (폼 카드 뒤에 가려짐)
  "440,400 640,400 640,580 780,580 780,400 980,400 980,380",
  "980,400 980,620",
  "640,580 640,780",
];

/** 꺾이는 지점·분기점 절점 */
const NODES: [number, number][] = [
  // 좌상
  [300, 120], [300, 260], [440, 260],
  [140, 340], [140, 220], [300, 220],
  [140, 560],
  // 우상
  [1200, 100], [1200, 220], [1060, 220], [1060, 380],
  [840, 240], [980, 240], [980, 380],
  [1320, 380], [1320, 540],
  // 좌하
  [140, 660], [140, 780], [300, 780], [300, 860],
  [100, 820], [100, 780],
  [360, 560], [360, 680], [500, 680], [500, 780],
  // 우하
  [1320, 620],
  [980, 620], [980, 780], [1120, 780], [1120, 860],
  // 중앙
  [440, 400], [640, 400], [640, 580], [780, 580], [780, 400], [980, 400],
  [640, 780],
];

/** 트레이스 끝점 — glowPulse 애니메이션 적용 */
const GLOW_POINTS = [
  { cx: 0,    cy: 120, delay: "0s"   },
  { cx: 0,    cy: 340, delay: "2.1s" },
  { cx: 240,  cy: 560, delay: "0.6s" },
  { cx: 440,  cy: 860, delay: "1.8s" },
  { cx: 0,    cy: 660, delay: "1.2s" },
  { cx: 0,    cy: 820, delay: "3.0s" },
  { cx: 840,  cy: 120, delay: "0.4s" },
  { cx: 1440, cy: 100, delay: "1.5s" },
  { cx: 1440, cy: 380, delay: "0.9s" },
  { cx: 1440, cy: 540, delay: "2.4s" },
  { cx: 1440, cy: 620, delay: "0.3s" },
  { cx: 1440, cy: 860, delay: "1.7s" },
  { cx: 640,  cy: 900, delay: "2.7s" },
];

function BackgroundCircuitSVG() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* glow filter: 블러 레이어 + 원본 레이어 합성 */}
        <filter id="circuit-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* PCB 트레이스 라인 */}
      <g stroke="#1a2535" strokeWidth="1" fill="none" strokeLinecap="square">
        {TRACES.map((pts, i) => (
          <polyline key={i} points={pts} />
        ))}
      </g>

      {/* 절점 dot */}
      <g fill="#2a3545">
        {NODES.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" />
        ))}
      </g>

      {/* 빛나는 끝점 — glowPulse로 순차 점멸 */}
      <g fill="#2a9d8f" filter="url(#circuit-glow)">
        {GLOW_POINTS.map((pt, i) => (
          <circle
            key={i}
            cx={pt.cx}
            cy={pt.cy}
            r="3.5"
            style={{
              animation: "glowPulse 2.5s ease-in-out infinite",
              animationDelay: pt.delay,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

/** 온보딩 페이지용 회로기판 테마 배경 wrapper — 라이트/다크 무관 항상 다크 적용 */
export function CircuitBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 flex flex-col bg-[#080808]">
      <BackgroundCircuitSVG />
      <CornerSVG className="top-0 left-0" />
      <CornerSVG className="top-0 right-0" style={{ transform: "scaleX(-1)" }} />
      <CornerSVG className="bottom-0 left-0" style={{ transform: "scaleY(-1)" }} />
      <CornerSVG className="bottom-0 right-0" style={{ transform: "scale(-1)" }} />
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
}
