import Anthropic from "@anthropic-ai/sdk";
import type { GithubRepoData } from "./github";

/** Notion 페이지 본문 블록 명세 */
export interface NotionBlockSpec {
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "code"
    | "quote"
    | "divider";
  text?: string;
  language?: string;
}

/** 단계별 UI 요소 명세 */
export interface UiElement {
  type: "heading" | "input" | "button" | "list" | "card" | "text" | "nav";
  label?: string;
  items?: string[];
  variant?: "primary" | "secondary" | "outline";
}

/** 프로젝트 사용자 흐름 단계 */
export interface UserFlowStep {
  stepNumber: number;
  title: string;
  description: string;
  uiElements: UiElement[];
}

/** Claude 분석 결과 — Notion DB 프로퍼티 + 페이지 본문 블록 + 사용자 흐름 */
export interface AnalyzedRepoData {
  title: string;
  description: string;
  category: "Personal" | "Team" | "Company";
  techStack: string[];
  periodStart: string | null;
  periodEnd: string | null;
  status: "진행중" | "완료" | "유지보수";
  demoUrl: string | null;
  blocks: NotionBlockSpec[];
  userFlow: UserFlowStep[];
}

/** tool_use 강제로 JSON 스키마 출력을 보장하는 Anthropic Tool 정의 */
const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "submit_analysis",
  description: "GitHub 레포지토리 분석 결과를 포트폴리오 Notion 데이터로 제출합니다.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "포트폴리오 프로젝트 제목 (한국어 또는 영어)" },
      description: { type: "string", description: "프로젝트 한 줄 요약 (한국어)" },
      category: {
        type: "string",
        enum: ["Personal", "Team", "Company"],
        description: "Personal: 개인 프로젝트, Team: 팀 협업, Company: 기업 업무",
      },
      techStack: {
        type: "array",
        items: { type: "string" },
        description: "실제 사용 기술 스택 (Next.js, TypeScript 등 원래 명칭 사용)",
      },
      periodStart: {
        anyOf: [{ type: "string" }, { type: "null" }],
        description: "개발 시작일 YYYY-MM-DD 형식 (예: 2024-01-15), 알 수 없으면 null",
      },
      periodEnd: {
        anyOf: [{ type: "string" }, { type: "null" }],
        description: "개발 종료일 YYYY-MM-DD 형식, 진행 중이거나 알 수 없으면 null",
      },
      status: {
        type: "string",
        enum: ["진행중", "완료", "유지보수"],
        description: "진행중: 활발히 커밋 중, 완료: 개발 종료, 유지보수: 배포 후 유지",
      },
      demoUrl: {
        anyOf: [{ type: "string" }, { type: "null" }],
        description: "README에서 발견한 라이브 데모 URL, 없으면 null",
      },
      blocks: {
        type: "array",
        description: "Notion 페이지 본문 블록 (프로젝트 개요 → 주요 기능 → 기술 선택 이유 → 성과 순서)",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "paragraph",
                "heading_1",
                "heading_2",
                "heading_3",
                "bulleted_list_item",
                "numbered_list_item",
                "code",
                "quote",
                "divider",
              ],
            },
            text: { type: "string", description: "블록 내용 (divider 타입 제외)" },
            language: { type: "string", description: "code 타입 전용 언어 (typescript, bash 등)" },
          },
          required: ["type"],
          additionalProperties: false,
        },
      },
      userFlow: {
        type: "array",
        description: "사용자가 이 앱을 처음 접하는 순간부터 핵심 기능을 사용하기까지의 흐름 (3~6단계). 소스 코드의 라우트·컴포넌트에서 실제 UI 요소를 추출해 각 단계에 반영하세요.",
        items: {
          type: "object",
          properties: {
            stepNumber: { type: "number", description: "단계 번호 (1부터 시작)" },
            title: { type: "string", description: "이 화면/단계의 이름 (예: 로그인, 상품 목록, 장바구니)" },
            description: { type: "string", description: "이 단계에서 사용자가 하는 행동 (40자 이내)" },
            uiElements: {
              type: "array",
              description: "이 화면에 실제 존재하는 UI 요소들 (최대 6개). 소스 코드에서 직접 추출하세요 (Input placeholder, Button 텍스트, 목록 항목명 등)",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["heading", "input", "button", "list", "card", "text", "nav"],
                    description: "heading: 섹션 제목, input: 입력 필드, button: 버튼, list: 목록, card: 카드 컴포넌트, nav: 탭/메뉴",
                  },
                  label: { type: "string", description: "input 필드명, button 텍스트, heading/card 내용" },
                  items: {
                    type: "array",
                    items: { type: "string" },
                    description: "list 또는 nav 타입의 항목들 (최대 4개)",
                  },
                  variant: {
                    type: "string",
                    enum: ["primary", "secondary", "outline"],
                    description: "button 타입에서 사용. primary: 주요 CTA, secondary: 보조, outline: 테두리",
                  },
                },
                required: ["type"],
                additionalProperties: false,
              },
            },
          },
          required: ["stepNumber", "title", "description", "uiElements"],
          additionalProperties: false,
        },
      },
    },
    required: [
      "title",
      "description",
      "category",
      "techStack",
      "periodStart",
      "periodEnd",
      "status",
      "demoUrl",
      "blocks",
      "userFlow",
    ],
    additionalProperties: false,
  },
};

/**
 * Anthropic 429 Rate Limit 에러 발생 시 지수 백오프로 재시도합니다.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err instanceof Anthropic.RateLimitError;
      const hasRetriesLeft = attempt < maxRetries;
      if (isRateLimit && hasRetriesLeft) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: 예기치 못한 경로 도달");
}

/** Claude 응답 input의 필수 필드와 enum 값을 검증합니다 */
function validateAnalyzedData(input: unknown): AnalyzedRepoData {
  const d = input as Record<string, unknown>;
  const validCategories = ["Personal", "Team", "Company"];
  const validStatuses = ["진행중", "완료", "유지보수"];
  if (typeof d.title !== "string" || !d.title) {
    throw new Error("Claude 응답 검증 실패: title 누락");
  }
  if (!validCategories.includes(d.category as string)) {
    throw new Error(`Claude 응답 검증 실패: 잘못된 category — ${d.category}`);
  }
  if (!validStatuses.includes(d.status as string)) {
    throw new Error(`Claude 응답 검증 실패: 잘못된 status — ${d.status}`);
  }
  if (!Array.isArray(d.blocks)) {
    throw new Error("Claude 응답 검증 실패: blocks가 배열이 아닙니다.");
  }
  return d as unknown as AnalyzedRepoData;
}

/** Claude API 분석 프롬프트를 빌드합니다 */
function buildPrompt(data: GithubRepoData): string {
  const readmeExcerpt = data.readme.slice(0, 4000);
  const topLanguages = Object.entries(data.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lang]) => lang);

  const fileTreeSection = data.fileTree.length > 0
    ? `\n## 프로젝트 파일 구조\n${data.fileTree.join("\n")}`
    : "";

  const sourceFilesSection = Object.keys(data.sourceFiles).length > 0
    ? "\n## 소스 코드\n" +
      Object.entries(data.sourceFiles)
        .map(([path, content]) => {
          const ext = path.split(".").pop() ?? "text";
          return `### ${path}\n\`\`\`${ext}\n${content}\n\`\`\``;
        })
        .join("\n\n")
    : "";

  return `다음 GitHub 레포지토리를 분석하여 포트폴리오 CMS(Notion) 데이터를 생성해주세요.

## 레포지토리 정보
- 이름: ${data.name}
- 설명: ${data.description ?? "(없음)"}
- 별점: ${data.stars}
- 주요 언어: ${topLanguages.join(", ") || "(없음)"}
- 기여자 수: ${data.contributorCount}
- 첫 커밋 날짜: ${data.firstCommitDate ?? "(알 수 없음)"}

## README (앞 4000자)
${readmeExcerpt || "(README 없음)"}
${fileTreeSection}
${sourceFilesSection}

## 분석 지침
- description과 blocks 본문은 반드시 한국어로 작성하세요
- blocks는 포트폴리오 독자가 이해하기 쉽도록 구성하세요: 프로젝트 개요 → 주요 기능 → 기술 선택 이유 → 성과/회고
- 파일 구조와 소스 코드(특히 package.json dependencies)를 참고해 정확한 기술 스택을 추출하세요
- 소스 코드를 참고해 아키텍처 패턴과 실제 구현 방식을 blocks에 반영하세요
- periodStart는 첫 커밋 날짜(${data.firstCommitDate ?? "미상"})를 기준으로 YYYY-MM-DD 형식(예: 2024-01-15)으로 추정하세요. 알 수 없으면 null을 사용하세요
- status는 최근 커밋 활동과 README 내용을 종합하여 판단하세요
- userFlow: 소스 코드의 라우트 구조(app/ 폴더, 라우터 파일)를 분석해 사용자가 이 앱을 처음 접하는 순간부터 핵심 기능을 완료하기까지의 흐름을 3~6단계로 표현하세요. 각 단계의 uiElements는 해당 화면의 실제 컴포넌트 코드에서 직접 추출하세요 (Input의 placeholder/label, Button의 텍스트, List의 항목명 등). 범용적인 "form"·"list" 레이블이 아니라 해당 프로젝트 고유의 실제 값을 사용하세요.`;
}

/** Claude API를 호출하고 tool_use input을 반환합니다 */
async function callClaudeApi(client: Anthropic, prompt: string, maxTokens = 8_192): Promise<unknown> {
  const response = await withRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      tools: [ANALYSIS_TOOL],
      tool_choice: { type: "tool", name: "submit_analysis" },
      messages: [{ role: "user", content: prompt }],
    })
  );
  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude가 tool_use 응답을 반환하지 않았습니다.");
  }
  return toolUse.input;
}

/**
 * GitHub 레포 데이터를 Claude로 분석하여 Notion 포트폴리오 구조화 데이터를 반환합니다.
 * @param data - fetchGithubRepoData()가 반환한 GitHub 레포 데이터
 * @param anthropicApiKey - Anthropic API 키
 * @param options.maxTokens - Claude 응답 토큰 상한 (기본값 8192)
 */
export async function analyzeRepo(
  data: GithubRepoData,
  anthropicApiKey: string,
  options?: { maxTokens?: number }
): Promise<AnalyzedRepoData> {
  const client = new Anthropic({ apiKey: anthropicApiKey });
  const prompt = buildPrompt(data);
  const raw = await callClaudeApi(client, prompt, options?.maxTokens);
  return validateAnalyzedData(raw);
}
