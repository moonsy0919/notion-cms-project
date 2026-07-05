import { forwardRef, type ReactNode } from "react";
import { Files } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiKeyProvider } from "@/components/setup/ApiKeyCard";

interface ArcNode {
  provider: ApiKeyProvider;
  icon: ReactNode;
  iconBgClassName: string;
}

export type ConvergePhase = "idle" | "sliding" | "merged" | "flying" | "done";

interface VerificationArcTrackerProps {
  nodes: [ArcNode, ArcNode, ArcNode];
  verified: Set<ApiKeyProvider>;
  convergePhase: ConvergePhase;
}

const NODE_POSITIONS = ["16.6667%", "50%", "83.3333%"];

/** Notion·Claude·GitHub 검증 진행 상황을 잇는 반원형 아크 트래커 — 3개 모두 검증되면 Claude 위치로 슬라이드 컨버전스되어 문서 아이콘으로 병합됨 */
export const VerificationArcTracker = forwardRef<HTMLDivElement, VerificationArcTrackerProps>(
  function VerificationArcTracker({ nodes, verified, convergePhase }, mergedIconRef) {
    const [, second, third] = nodes;
    const secondFilled = verified.has(second.provider);
    const thirdFilled = verified.has(third.provider);
    const converging = convergePhase !== "idle";
    const merged = convergePhase !== "idle" && convergePhase !== "sliding";
    const badgeVisible = convergePhase === "merged";

    return (
      <div className="relative mt-2 hidden h-24 md:block">
        <svg
          viewBox="0 0 300 90"
          preserveAspectRatio="none"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-300",
            converging ? "opacity-0" : "opacity-100"
          )}
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

        {merged ? (
          <div
            ref={mergedIconRef}
            className={cn(
              "absolute top-[61%] left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
              badgeVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 animate-document-merge",
                second.iconBgClassName
              )}
            >
              <Files className="h-4 w-4 text-white" />
            </div>
          </div>
        ) : (
          nodes.map((node, index) => {
            const isVerified = verified.has(node.provider);
            const left = converging ? "50%" : NODE_POSITIONS[index];
            return (
              <div
                key={node.provider}
                className="absolute top-[61%] -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-in-out"
                style={{ left }}
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
          })
        )}
      </div>
    );
  }
);
