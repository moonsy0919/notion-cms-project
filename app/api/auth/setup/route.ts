import { NextRequest, NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 2592000,
  path: "/",
} as const;

/** Notion API Key 유효성 검증 (GET /v1/users) */
async function validateNotionKey(notionApiKey: string): Promise<boolean> {
  const res = await fetch("https://api.notion.com/v1/users", {
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
    },
    cache: "no-store",
  });
  return res.ok;
}

/** Notion DB ID 유효성 검증 (POST /v1/databases/{id}/query) */
async function validateNotionDbId(
  notionApiKey: string,
  notionDbId: string
): Promise<boolean> {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${notionDbId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({ page_size: 1 }),
      cache: "no-store",
    }
  );
  return res.ok;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: {
    notionApiKey?: string;
    notionDbId?: string;
    anthropicApiKey?: string;
    githubToken?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { notionApiKey, notionDbId, anthropicApiKey, githubToken } = body;

  if (!notionApiKey || !notionDbId || !anthropicApiKey) {
    return NextResponse.json(
      { error: "Notion API Key, DB ID, Anthropic API Key는 필수입니다." },
      { status: 400 }
    );
  }

  // 1단계: Notion API Key 검증
  const isKeyValid = await validateNotionKey(notionApiKey);
  if (!isKeyValid) {
    return NextResponse.json(
      { error: "Notion API Key가 유효하지 않습니다." },
      { status: 400 }
    );
  }

  // 2단계: Notion DB ID 검증
  const isDbValid = await validateNotionDbId(notionApiKey, notionDbId);
  if (!isDbValid) {
    return NextResponse.json(
      { error: "Notion DB ID가 유효하지 않거나 Integration이 연결되지 않았습니다." },
      { status: 400 }
    );
  }

  // 검증 성공 — httpOnly 쿠키 설정
  const res = NextResponse.json({ ok: true });

  res.cookies.set("notion-api-key", notionApiKey, COOKIE_OPTIONS);
  res.cookies.set("notion-db-id", notionDbId, COOKIE_OPTIONS);
  res.cookies.set("anthropic-api-key", anthropicApiKey, COOKIE_OPTIONS);
  if (githubToken) {
    res.cookies.set("github-token", githubToken, COOKIE_OPTIONS);
  }

  return res;
}
