import { Client } from "@notionhq/client";
import type {
  BlockObjectRequest,
  LanguageRequest,
} from "@notionhq/client/build/src/api-endpoints";
import type { AnalyzedRepoData, NotionBlockSpec } from "./ai-analyzer";

/** 처리 대기 중인 Notion 페이지 */
export interface PendingPage {
  pageId: string;
  githubUrl: string;
}

/** Notion 클라이언트 lazy 싱글톤 */
let _notion: Client | null = null;

function getNotionClient(): Client {
  if (_notion) return _notion;
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.");
  _notion = new Client({ auth: apiKey });
  return _notion;
}

function getDbId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.");
  return id;
}

type NotionApiPage = {
  object: string;
  id: string;
  properties: Record<string, {
    type: string;
    title?: Array<{ plain_text: string }>;
    rich_text?: Array<{ plain_text: string }>;
    select?: { name?: string } | null;
    url?: string | null;
  }>;
};

type QueryResponse = {
  results: NotionApiPage[];
  has_more: boolean;
  next_cursor: string | null;
};

/** Notion DB를 REST API로 쿼리합니다 (SDK v5에서 databases.query 제거됨) */
async function queryDatabase(body: Record<string, unknown>): Promise<NotionApiPage[]> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.");

  const results: NotionApiPage[] = [];
  let startCursor: string | undefined;

  do {
    const reqBody = startCursor ? { ...body, start_cursor: startCursor } : body;
    const res = await fetch(
      `https://api.notion.com/v1/databases/${getDbId()}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify(reqBody),
      }
    );

    if (!res.ok) {
      throw new Error(`Notion DB 쿼리 실패: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as QueryResponse;
    results.push(...data.results);
    startCursor =
      data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (startCursor);

  return results;
}

function getPropText(page: NotionApiPage, propName: string): string {
  const prop = page.properties[propName];
  if (!prop) return "";
  if (prop.type === "title") {
    return prop.title?.map((t) => t.plain_text).join("") ?? "";
  }
  if (prop.type === "rich_text") {
    return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
  }
  return "";
}

function getPropSelect(page: NotionApiPage, propName: string): string | null {
  const prop = page.properties[propName];
  if (prop?.type === "select") {
    return prop.select?.name ?? null;
  }
  return null;
}

function getPropUrl(page: NotionApiPage, propName: string): string | null {
  const prop = page.properties[propName];
  if (prop?.type === "url") {
    return prop.url ?? null;
  }
  return null;
}

/**
 * Github URL이 있고 핵심 속성(Title, Description, Category, Status) 중
 * 하나라도 비어 있는 대기 중 페이지를 반환합니다.
 */
export async function getPendingPages(): Promise<PendingPage[]> {
  const pages = await queryDatabase({
    filter: {
      property: "Github",
      url: { is_not_empty: true },
    },
  });

  const pending: PendingPage[] = [];

  for (const page of pages) {
    if (page.object !== "page") continue;
    const githubUrl = getPropUrl(page, "Github");
    if (!githubUrl) continue;

    const isMissingProps =
      !getPropText(page, "Title") ||
      !getPropText(page, "Description") ||
      !getPropSelect(page, "Category") ||
      !getPropSelect(page, "Status");

    if (isMissingProps) {
      pending.push({ pageId: page.id, githubUrl });
    }
  }

  return pending;
}

type NotionProperties = Parameters<Client["pages"]["update"]>[0]["properties"];

/** AnalyzedRepoData → Notion pages.update() 용 properties 객체로 변환합니다 */
function buildNotionProperties(data: AnalyzedRepoData): NotionProperties {
  const properties: Record<string, unknown> = {
    Title: {
      title: [{ text: { content: data.title } }],
    },
    Description: {
      rich_text: [{ text: { content: data.description } }],
    },
    Category: {
      select: { name: data.category },
    },
    "Tech Stack": {
      multi_select: data.techStack.map((t) => ({ name: t })),
    },
    Status: {
      select: { name: data.status },
    },
  };

  if (data.periodStart) {
    properties["Period"] = {
      date: { start: data.periodStart, end: data.periodEnd ?? null },
    };
  }

  if (data.demoUrl) {
    properties["Demo"] = { url: data.demoUrl };
  }

  return properties as NotionProperties;
}

/**
 * Notion 페이지의 속성(Title, Description, Category 등)을 업데이트합니다.
 */
export async function updatePageProperties(
  pageId: string,
  data: AnalyzedRepoData
): Promise<void> {
  const notion = getNotionClient();
  const properties = buildNotionProperties(data);

  try {
    await notion.pages.update({ page_id: pageId, properties });
    console.log(`[Notion] 속성 업데이트 완료: ${data.title}`);
  } catch (err) {
    throw new Error(
      `[Notion] 속성 업데이트 실패 (pageId: ${pageId}): ${(err as Error).message}`
    );
  }
}

/** Notion이 지원하는 코드 블록 언어 목록 */
const VALID_LANGUAGES = new Set<LanguageRequest>([
  "abap", "abc", "agda", "arduino", "ascii art", "assembly", "bash", "basic",
  "bnf", "c", "c#", "c++", "clojure", "coffeescript", "coq", "css", "dart",
  "dhall", "diff", "docker", "ebnf", "elixir", "elm", "erlang", "f#", "flow",
  "fortran", "gherkin", "glsl", "go", "graphql", "groovy", "haskell", "hcl",
  "html", "idris", "java", "javascript", "json", "julia", "kotlin", "latex",
  "less", "lisp", "livescript", "llvm ir", "lua", "makefile", "markdown",
  "markup", "matlab", "mathematica", "mermaid", "nix", "notion formula",
  "objective-c", "ocaml", "pascal", "perl", "php", "plain text", "powershell",
  "prolog", "protobuf", "purescript", "python", "r", "racket", "reason",
  "ruby", "rust", "sass", "scala", "scheme", "scss", "shell", "smalltalk",
  "solidity", "sql", "swift", "toml", "typescript", "vb.net", "verilog",
  "vhdl", "visual basic", "webassembly", "xml", "yaml", "java/c/c++/c#",
]);

function toValidLanguage(lang?: string): LanguageRequest {
  const lower = lang?.toLowerCase() ?? "";
  return VALID_LANGUAGES.has(lower as LanguageRequest)
    ? (lower as LanguageRequest)
    : "plain text";
}

/** NotionBlockSpec 하나를 BlockObjectRequest로 변환합니다 */
function specToBlock(spec: NotionBlockSpec): BlockObjectRequest {
  const richText = spec.text ? [{ text: { content: spec.text } }] : [];

  switch (spec.type) {
    case "heading_1":
      return { type: "heading_1", heading_1: { rich_text: richText } };
    case "heading_2":
      return { type: "heading_2", heading_2: { rich_text: richText } };
    case "heading_3":
      return { type: "heading_3", heading_3: { rich_text: richText } };
    case "bulleted_list_item":
      return { type: "bulleted_list_item", bulleted_list_item: { rich_text: richText } };
    case "numbered_list_item":
      return { type: "numbered_list_item", numbered_list_item: { rich_text: richText } };
    case "code":
      return {
        type: "code",
        code: { rich_text: richText, language: toValidLanguage(spec.language) },
      };
    case "quote":
      return { type: "quote", quote: { rich_text: richText } };
    case "divider":
      return { type: "divider", divider: {} };
    default:
      console.warn(`[Notion] 알 수 없는 블록 타입: ${spec.type} — paragraph로 대체`);
      return { type: "paragraph", paragraph: { rich_text: richText } };
  }
}

const CHUNK_SIZE = 100;
/** 청킹 간 딜레이 — Notion API rate limit(3 req/sec) 대응 */
const CHUNK_DELAY_MS = 400;

/**
 * Notion 페이지에 본문 블록을 추가합니다.
 * Notion API 한 번 요청에 최대 100개 제한으로 청킹하여 순차 처리합니다.
 * 청킹 간 400ms 딜레이를 적용하여 rate limit을 회피합니다.
 */
export async function appendPageBlocks(
  pageId: string,
  specs: NotionBlockSpec[]
): Promise<void> {
  if (specs.length === 0) {
    console.log("[Notion] 추가할 블록이 없습니다.");
    return;
  }

  const notion = getNotionClient();
  const blocks = specs.map(specToBlock);

  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
    }
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    try {
      await notion.blocks.children.append({ block_id: pageId, children: chunk });
    } catch (err) {
      throw new Error(
        `[Notion] 블록 추가 실패 (pageId: ${pageId}, offset: ${i}): ${(err as Error).message}`
      );
    }
    console.log(`[Notion] 블록 추가: ${i + chunk.length}/${blocks.length}개`);
  }
}

// 스모크 테스트: npx tsx --env-file=.env.local scripts/lib/notion-updater.ts --test
if (process.argv[2] === "--test") {
  console.log("\n[테스트] 대기 중 페이지 탐지\n");

  getPendingPages()
    .then((pages) => {
      if (pages.length === 0) {
        console.log("대기 중인 페이지가 없습니다. (모든 속성이 채워져 있거나 Github URL 미입력)");
      } else {
        console.log(`대기 중 페이지 ${pages.length}개 발견:`);
        pages.forEach((p, i) => {
          console.log(`  [${i + 1}] pageId: ${p.pageId}`);
          console.log(`       github: ${p.githubUrl}`);
        });
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error("[오류]", err.message);
      process.exit(1);
    });
}
