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

/** Anthropic API Key 유효성 검증 (GET /v1/models — 토큰 비용 없음) */
async function validateAnthropicKey(anthropicApiKey: string): Promise<boolean> {
  const res = await fetch("https://api.anthropic.com/v1/models", {
    headers: {
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    cache: "no-store",
  });
  return res.ok;
}

/** GitHub Token 유효성 검증 (GET /user) */
async function validateGithubToken(githubToken: string): Promise<boolean> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${githubToken}`,
    },
    cache: "no-store",
  });
  return res.ok;
}

type ValidateBody =
  | { provider: "notion"; notionApiKey?: string; notionDbId?: string }
  | { provider: "claude"; anthropicApiKey?: string }
  | { provider: "github"; githubToken?: string };

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ValidateBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { valid: false, error: "요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  if (body.provider === "notion") {
    const { notionApiKey, notionDbId } = body;
    if (!notionApiKey || !notionDbId) {
      return NextResponse.json(
        { valid: false, error: "Notion API Key와 Database ID를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (!(await validateNotionKey(notionApiKey))) {
      return NextResponse.json(
        { valid: false, error: "Notion API Key가 유효하지 않습니다." },
        { status: 400 }
      );
    }

    if (!(await validateNotionDbId(notionApiKey, notionDbId))) {
      return NextResponse.json(
        {
          valid: false,
          error: "Notion Database ID가 유효하지 않거나 Integration이 연결되지 않았습니다.",
        },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ valid: true });
    res.cookies.set("notion-api-key", notionApiKey, COOKIE_OPTIONS);
    res.cookies.set("notion-db-id", notionDbId, COOKIE_OPTIONS);
    return res;
  }

  if (body.provider === "claude") {
    const { anthropicApiKey } = body;
    if (!anthropicApiKey) {
      return NextResponse.json(
        { valid: false, error: "Anthropic API Key를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!(await validateAnthropicKey(anthropicApiKey))) {
      return NextResponse.json(
        { valid: false, error: "Anthropic API Key가 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ valid: true });
    res.cookies.set("anthropic-api-key", anthropicApiKey, COOKIE_OPTIONS);
    return res;
  }

  if (body.provider === "github") {
    const { githubToken } = body;
    if (!githubToken) {
      return NextResponse.json(
        { valid: false, error: "GitHub Token을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!(await validateGithubToken(githubToken))) {
      return NextResponse.json(
        { valid: false, error: "GitHub Token이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ valid: true });
    res.cookies.set("github-token", githubToken, COOKIE_OPTIONS);
    return res;
  }

  return NextResponse.json(
    { valid: false, error: "알 수 없는 provider입니다." },
    { status: 400 }
  );
}
