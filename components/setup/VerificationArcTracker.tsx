import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ApiKeyProvider } from "@/components/setup/ApiKeyCard";

interface ArcNode {
  provider: ApiKeyProvider;
  icon: ReactNode;
  iconBgClassName: string;
}

interface VerificationArcTrackerProps {
  nodes: [ArcNode, ArcNode, ArcNode];
  verified: Set<ApiKeyProvider>;
}

const NODE_POSITIONS = ["16.6667%", "50%", "83.3333%"];

/** Notion·Claude·GitHub 검증 진행 상황을 잇는 반원형 아크 트래커 — 노드/선분이 개별 provider 검증 여부에 따라 독립적으로 초록색으로 채워짐 */
export function VerificationArcTracker({ nodes, verified }: VerificationArcTrackerProps) {
  const [, second, third] = nodes;
  const secondFilled = verified.has(second.provider);
  const thirdFilled = verified.has(third.provider);

  return (
    <div className="relative mt-2 hidden h-24 md:block">
      <svg
        viewBox="0 0 300 90"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path d="M50,55 Q100,15 150,55" fill="none" strokeWidth="3" strokeDasharray="4 5" strokeLinecap="round" className="stroke-border" />
        <path d="M150,55 Q200,15 250,55" fill="none" strokeWidth="3" strokeDasharray="4 5" strokeLinecap="round" className="stroke-border" />

        <path
          d="M50,55 Q100,15 150,55"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={secondFilled ? 0 : 100}
          className="stroke-green-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <path
          d="M150,55 Q200,15 250,55"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={thirdFilled ? 0 : 100}
          className="stroke-green-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>

      {nodes.map((node, index) => {
        const isVerified = verified.has(node.provider);
        return (
          <div
            key={node.provider}
            className="absolute top-[61%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: NODE_POSITIONS[index] }}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500",
                node.iconBgClassName,
                isVerified ? "border-green-500" : "border-border"
              )}
            >
              {node.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
