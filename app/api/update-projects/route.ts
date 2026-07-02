import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPendingPages } from "@/lib/fill-notion/notion-updater";
import { fetchGithubRepoData } from "@/lib/fill-notion/github";
import { analyzeRepo } from "@/lib/fill-notion/ai-analyzer";
import { updatePageProperties, appendPageBlocks } from "@/lib/fill-notion/notion-updater";

export const maxDuration = 60;

/** 대기 중인 프로젝트 수를 반환합니다 */
export async function GET() {
  const cookieStore = await cookies();
  const notionApiKey = cookieStore.get("notion-api-key")?.value;
  const dbId = cookieStore.get("notion-db-id")?.value;

  if (!notionApiKey || !dbId) {
    return NextResponse.json({ error: "인증 정보가 없습니다." }, { status: 401 });
  }

  const pending = await getPendingPages(notionApiKey, dbId);
  return NextResponse.json({ pending: pending.length });
}

/** 대기 중인 Notion 페이지 1개를 처리합니다 (폴링 방식, 1 call = 1 project) */
export async function POST() {
  const cookieStore = await cookies();
  const notionApiKey = cookieStore.get("notion-api-key")?.value;
  const dbId = cookieStore.get("notion-db-id")?.value;
  const anthropicApiKey = cookieStore.get("anthropic-api-key")?.value;
  const githubToken = cookieStore.get("github-token")?.value;

  if (!notionApiKey || !dbId || !anthropicApiKey) {
    return NextResponse.json({ error: "인증 정보가 없습니다." }, { status: 401 });
  }

  const pending = await getPendingPages(notionApiKey, dbId);

  if (pending.length === 0) {
    return NextResponse.json({ done: true, remaining: 0 });
  }

  const page = pending[0];
  let projectTitle = page.githubUrl;

  try {
    const githubData = await fetchGithubRepoData(page.githubUrl, githubToken, {
      tokenBudget: 5_000,
    });
    const analyzed = await analyzeRepo(githubData, anthropicApiKey, {
      maxTokens: 4_096,
    });
    projectTitle = analyzed.title;

    await updatePageProperties(page.pageId, analyzed, notionApiKey);
    await appendPageBlocks(page.pageId, analyzed.blocks, notionApiKey);
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({
    done: pending.length <= 1,
    processed: page.githubUrl,
    title: projectTitle,
    remaining: pending.length - 1,
  });
}
