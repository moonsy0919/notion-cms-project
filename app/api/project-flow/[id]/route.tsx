import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getProjectById, getProjectBlocks } from "@/lib/notion";
import type { UiElement, UserFlowStep } from "@/lib/fill-notion/ai-analyzer";

export const runtime = "nodejs";

const BG = "#080808";
const CARD_BG = "#0f1117";
const BORDER = "#1e2535";
const TEAL = "#2a9d8f";
const WHITE = "#f8f8f2";
const MUTED = "#9ca3af";
const DIM = "#555";

/** Notion 블록 목록에서 __USER_FLOW__ 마커 코드 블록을 찾아 파싱합니다 */
function extractUserFlow(blocks: Awaited<ReturnType<typeof getProjectBlocks>>): UserFlowStep[] {
  for (const block of blocks) {
    if (block.type !== "code") continue;
    const text = block.code.rich_text.map((t: { plain_text: string }) => t.plain_text).join("");
    if (!text.startsWith("// __USER_FLOW__")) continue;
    try {
      const json = text.replace("// __USER_FLOW__", "").trim();
      return JSON.parse(json) as UserFlowStep[];
    } catch {
      return [];
    }
  }
  return [];
}

/** 단일 UI 요소를 JSX로 렌더링합니다 */
function renderElement(el: UiElement, idx: number) {
  switch (el.type) {
    case "input":
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            border: `1px solid ${BORDER}`,
            borderRadius: "4px",
            padding: "5px 8px",
            color: DIM,
            fontSize: "11px",
            marginBottom: "4px",
          }}
        >
          {el.label ?? "입력 필드"}
        </div>
      );

    case "button":
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "center",
            background: el.variant === "primary" ? TEAL : BORDER,
            borderRadius: "4px",
            padding: "5px 10px",
            color: el.variant === "primary" ? WHITE : MUTED,
            fontSize: "11px",
            marginBottom: "4px",
          }}
        >
          {el.label ?? "버튼"}
        </div>
      );

    case "list":
      return (
        <div key={idx} style={{ display: "flex", flexDirection: "column", marginBottom: "4px" }}>
          {(el.items ?? []).slice(0, 3).map((item, i) => (
            <div key={i} style={{ display: "flex", color: MUTED, fontSize: "11px", marginBottom: "2px" }}>
              <span style={{ color: TEAL, marginRight: "4px", display: "flex" }}>●</span>
              {item}
            </div>
          ))}
        </div>
      );

    case "heading":
      return (
        <div
          key={idx}
          style={{ display: "flex", color: "#9cdcfe", fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}
        >
          {el.label ?? "제목"}
        </div>
      );

    case "card":
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            border: `1px solid ${BORDER}`,
            borderRadius: "4px",
            padding: "4px 8px",
            color: MUTED,
            fontSize: "11px",
            marginBottom: "4px",
          }}
        >
          {el.label ?? "카드"}
        </div>
      );

    case "nav":
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: `1px solid ${BORDER}`,
            paddingBottom: "5px",
            marginBottom: "6px",
          }}
        >
          {(el.items ?? ["탭1", "탭2"]).slice(0, 3).map((item, i) => (
            <span key={i} style={{ color: i === 0 ? TEAL : MUTED, fontSize: "10px", display: "flex" }}>
              {item}
            </span>
          ))}
        </div>
      );

    default:
      return (
        <div key={idx} style={{ display: "flex", color: DIM, fontSize: "11px", marginBottom: "3px" }}>
          {el.label ?? ""}
        </div>
      );
  }
}

/** 흐름 데이터 없을 때 fallback: 제목 + 기술 스택 */
function renderFallback(title: string, techStack: string[]) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ color: TEAL, fontSize: "32px", display: "flex" }}>{"</>"}</span>
          <span style={{ color: WHITE, fontSize: "36px", fontWeight: "bold", display: "flex" }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {techStack.slice(0, 6).map((t, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                padding: "4px 12px",
                background: BORDER,
                color: MUTED,
                fontSize: "14px",
                borderRadius: "4px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = request.cookies.get("notion-api-key")?.value ?? "";

  if (!apiKey) {
    return renderFallback("Portfolio", []);
  }

  const project = await getProjectById(apiKey, id);
  if (!project) return renderFallback("Portfolio", []);

  const blocks = await getProjectBlocks(apiKey, id);
  const steps = extractUserFlow(blocks);

  if (steps.length === 0) {
    return renderFallback(project.title, project.techStack);
  }

  const visibleSteps = steps.slice(0, 4);
  const extraCount = steps.length - visibleSteps.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          padding: "28px 36px",
          fontFamily: "monospace",
        }}
      >
        {/* 헤더: 프로젝트명 + 기술 스택 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: TEAL, fontSize: "18px", display: "flex" }}>{"</>"}</span>
            <span style={{ color: WHITE, fontSize: "20px", fontWeight: "bold", display: "flex" }}>
              {project.title}
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {project.techStack.slice(0, 4).map((t, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  padding: "3px 9px",
                  background: BORDER,
                  color: MUTED,
                  fontSize: "12px",
                  borderRadius: "4px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ height: "1px", background: BORDER, marginBottom: "20px" }} />

        {/* 단계 카드 행 */}
        <div style={{ display: "flex", gap: "12px", flex: 1 }}>
          {visibleSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {/* 단계 카드 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "8px",
                  padding: "14px",
                  height: "100%",
                }}
              >
                {/* 단계 번호 + 제목 */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      background: TEAL,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: WHITE,
                      fontSize: "11px",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {step.stepNumber}
                  </div>
                  <span
                    style={{
                      color: WHITE,
                      fontSize: "13px",
                      fontWeight: "bold",
                      display: "flex",
                      lineHeight: "1.2",
                    }}
                  >
                    {step.title}
                  </span>
                </div>

                {/* UI 요소들 */}
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  {step.uiElements.slice(0, 5).map((el, j) => renderElement(el, j))}
                </div>

                {/* 단계 설명 */}
                <div
                  style={{
                    color: DIM,
                    fontSize: "10px",
                    marginTop: "8px",
                    lineHeight: "1.4",
                    display: "flex",
                  }}
                >
                  {step.description.length > 40
                    ? step.description.slice(0, 40) + "..."
                    : step.description}
                </div>
              </div>

              {/* 화살표 (마지막 카드 제외) */}
              {i < visibleSteps.length - 1 && (
                <div
                  style={{
                    color: TEAL,
                    fontSize: "18px",
                    margin: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}

          {/* +N 단계 더 */}
          {extraCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: MUTED,
                fontSize: "13px",
                paddingLeft: "8px",
                flexShrink: 0,
              }}
            >
              +{extraCount} 단계 더
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
