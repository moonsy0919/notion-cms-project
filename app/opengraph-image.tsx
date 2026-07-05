import { ImageResponse } from "next/og";

export const alt = "Notion CMS 기반 개인 포트폴리오";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINES = [
  { num: "1", tokens: [{ text: "const ", color: "#2a9d8f" }, { text: "portfolio", color: "#f8f8f2" }, { text: " = {", color: "#9ca3af" }] },
  { num: "2", tokens: [{ text: "  cms", color: "#9cdcfe" }, { text: ":   ", color: "#9ca3af" }, { text: '"Notion"', color: "#ce9178" }, { text: ",", color: "#9ca3af" }] },
  { num: "3", tokens: [{ text: "  stack", color: "#9cdcfe" }, { text: ": ", color: "#9ca3af" }, { text: '"Next.js 16"', color: "#ce9178" }, { text: ",", color: "#9ca3af" }] },
  { num: "4", tokens: [{ text: "  ai", color: "#9cdcfe" }, { text: ":   ", color: "#9ca3af" }, { text: '"Claude AI"', color: "#ce9178" }, { text: ",", color: "#9ca3af" }] },
  { num: "5", tokens: [{ text: "}", color: "#9ca3af" }] },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#080808",
          padding: "60px",
          fontFamily: "monospace",
          border: "1px solid #1e2535",
        }}
      >
        {/* 좌측: 코드 에디터 미니어처 */}
        <div
          style={{
            width: "44%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0f1117",
            border: "1px solid #1e2535",
            borderRadius: "8px",
            padding: "28px 24px",
            marginRight: "56px",
          }}
        >
          {/* 에디터 상단 탭 바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              gap: "8px",
            }}
          >
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3d4148" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3d4148" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3d4148" }} />
            <div style={{ marginLeft: "12px", color: "#555", fontSize: "13px", display: "flex" }}>
              portfolio.ts
            </div>
          </div>

          {/* 코드 라인 */}
          {LINES.map((line) => (
            <div
              key={line.num}
              style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
            >
              <span style={{ color: "#555", fontSize: "14px", marginRight: "20px", minWidth: "16px", display: "flex" }}>
                {line.num}
              </span>
              <span style={{ display: "flex", fontSize: "16px" }}>
                {line.tokens.map((token, i) => (
                  <span key={i} style={{ color: token.color, display: "flex" }}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* 우측: 타이틀 + 서브타이틀 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* 상단 로고 */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a9d8f"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "10px" }}
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
              <circle cx="16.5" cy="7.5" r=".5" fill="#2a9d8f" />
            </svg>
            <span style={{ color: "#555", fontSize: "16px", display: "flex" }}>
              notion-cms-project
            </span>
          </div>

          <div style={{ color: "#f8f8f2", fontSize: "64px", fontWeight: "bold", display: "flex", lineHeight: "1.1" }}>
            포트폴리오
          </div>
          <div style={{ color: "#9ca3af", fontSize: "22px", marginTop: "20px", display: "flex" }}>
            Notion CMS · Next.js 16 · BYO Key
          </div>

          {/* 하단 구분선 + 설명 */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #1e2535",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {["Next.js 16", "Notion API", "Claude AI"].map((tag) => (
              <span
                key={tag}
                style={{
                  display: "flex",
                  padding: "4px 12px",
                  backgroundColor: "#1e2535",
                  color: "#9ca3af",
                  fontSize: "14px",
                  borderRadius: "4px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
