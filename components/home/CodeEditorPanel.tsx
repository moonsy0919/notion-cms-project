"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "start.ts" | "skills.ts";
type TokenType = "keyword" | "string" | "comment" | "prop" | "plain";

type Token = { text: string; type: TokenType };
type CodeLine = Token[];

/** 문자당 타이핑 속도 (ms) */
const CHAR_MS = 30;

/** 신택스 토큰 색상 맵 — CSS 변수 참조 */
const TOKEN_COLOR: Record<TokenType, string | undefined> = {
  keyword: "var(--syntax-keyword)",
  string:  "var(--syntax-string)",
  comment: "var(--syntax-comment)",
  prop:    "var(--syntax-prop)",
  plain:   undefined,
};

const kw    = (text: string): Token => ({ text, type: "keyword" });
const str   = (text: string): Token => ({ text, type: "string" });
const cmt   = (text: string): Token => ({ text, type: "comment" });
const prop  = (text: string): Token => ({ text, type: "prop" });
const plain = (text: string): Token => ({ text, type: "plain" });

const START_LINES: CodeLine[] = [
  [cmt("// 포트폴리오를 방문해 주셔서")],
  [cmt("// 감사합니다!")],
  [],
  [kw("const"), plain(" developer"), plain(" = {")],
  [plain("  "), prop("name"),      plain(": "), str('"문시현"'),              plain(",")],
  [plain("  "), prop("role"),      plain(": "), str('"Frontend Developer"'),  plain(",")],
  [plain("  "), prop("focus"),     plain(": "), str('"Next.js & TypeScript"'), plain(",")],
  [plain("  "), prop("available"), plain(": "), kw("true"),                   plain(",")],
  [plain("};")],
];

const SKILLS_LINES: CodeLine[] = [
  [kw("const"), plain(" skills"), plain(" = {")],
  [plain("  "), prop("frontend"), plain(": [")],
  [plain("    "), str('"Next.js"'),  plain(", "), str('"TypeScript"'),  plain(",")],
  [plain("    "), str('"React"'),    plain(", "), str('"Tailwind CSS"'), plain(",")],
  [plain("  ],")],
  [plain("  "), prop("backend"), plain(": ["), str('"Node.js"'), plain("],")],
  [plain("  "), prop("tools"),   plain(": [")],
  [plain("    "), str('"Git"'), plain(", "), str('"Notion"'), plain(", "), str('"Vercel"'), plain(",")],
  [plain("  ],")],
  [plain("};")],
];

const TABS: Tab[] = ["start.ts", "skills.ts"];
const CODE: Record<Tab, CodeLine[]> = {
  "start.ts":  START_LINES,
  "skills.ts": SKILLS_LINES,
};

/** 라인의 총 문자 수 반환. 빈 줄은 최소 1로 보정 (steps(0) 방지) */
function charCount(line: CodeLine): number {
  if (line.length === 0) return 1;
  return line.reduce((sum, token) => sum + token.text.length, 0);
}

/** 코드 에디터 패널 — 기술 스택을 JS 객체 형태로 표현 */
export function CodeEditorPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("start.ts");
  const lines = CODE[activeTab];

  /* 라인별 누적 딜레이 및 전체 타이핑 완료 시간 사전 계산 */
  const lineDelays: number[] = [];
  let accumulated = 0;
  for (const line of lines) {
    lineDelays.push(accumulated);
    accumulated += charCount(line) * CHAR_MS;
  }
  const totalDuration = accumulated;

  return (
    <div className="w-full rounded-lg border border-border bg-card overflow-hidden font-mono text-xs">
      {/* macOS 스타일 윈도우 바 */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/10">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      {/* 파일 탭 */}
      <div className="flex bg-muted/20 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium transition-colors border-r border-border",
              activeTab === tab
                ? "text-accent bg-card border-b-2 border-b-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 코드 영역 — 라인 번호 + 코드 내용 2컬럼 */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          {/* key={activeTab}: 탭 전환 시 tbody 재마운트 → 타이핑 재시작 */}
          <tbody key={activeTab}>
            {lines.map((line, lineIdx) => {
              const n     = charCount(line);
              const delay = lineDelays[lineIdx];

              return (
                <tr key={lineIdx} className="leading-6">
                  {/* 라인 번호 */}
                  <td className="pr-4 text-right text-muted-foreground/40 select-none w-6 align-top">
                    {lineIdx + 1}
                  </td>

                  {/* 코드 내용 — clip-typing 래퍼로 글자 단위 타이핑 연출 */}
                  <td className="whitespace-pre text-foreground">
                    <span
                      className="inline-block overflow-hidden whitespace-pre align-bottom"
                      style={{
                        animation: `clip-typing ${n * CHAR_MS}ms steps(${n}, end) ${delay}ms both`,
                      }}
                    >
                      {line.length === 0
                        ? " "
                        : line.map((token, tokenIdx) => (
                            <span
                              key={tokenIdx}
                              style={
                                TOKEN_COLOR[token.type]
                                  ? { color: TOKEN_COLOR[token.type] }
                                  : undefined
                              }
                            >
                              {token.text}
                            </span>
                          ))}
                    </span>

                    {/* 커서: 전체 타이핑 완료 후 마지막 줄에 등장 */}
                    {lineIdx === lines.length - 1 && (
                      <span
                        className="animate-cursor-blink text-accent ml-0.5"
                        style={{ animationDelay: `${totalDuration}ms` }}
                      >
                        |
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
