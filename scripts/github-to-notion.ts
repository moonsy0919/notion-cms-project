import { parseGithubUrl, fetchGithubRepoData } from "@/lib/fill-notion/github";
import { analyzeRepo } from "@/lib/fill-notion/ai-analyzer";
import {
  getPendingPages,
  updatePageProperties,
  appendPageBlocks,
  appendUserFlowBlock,
  type PendingPage,
} from "@/lib/fill-notion/notion-updater";

/** CLI 인수에서 --url 값을 추출합니다 */
function parseArgs(): { url: string | null } {
  const idx = process.argv.indexOf("--url");
  if (idx === -1) return { url: null };
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) {
    console.error("[오류] --url 플래그에 값이 필요합니다.");
    process.exit(1);
  }
  return { url: value };
}

/** 단일 페이지 처리 파이프라인 — try-catch로 격리하여 부분 실패 허용 */
async function processPage(
  page: PendingPage,
  notionApiKey: string,
  anthropicApiKey: string,
  githubToken?: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { pageId, githubUrl } = page;

  try {
    console.log(`  [1/5] GitHub 데이터 수집 중: ${githubUrl}`);
    const repoData = await fetchGithubRepoData(githubUrl, githubToken);
    console.log(`  [1/5] 완료: ${repoData.name}`);

    console.log(`  [2/5] Claude AI 분석 중...`);
    const analyzed = await analyzeRepo(repoData, anthropicApiKey);
    console.log(`  [2/5] 완료: "${analyzed.title}"`);

    console.log(`  [3/5] Notion 속성 업데이트 중...`);
    await updatePageProperties(pageId, analyzed, notionApiKey);
    console.log(`  [3/5] 완료`);

    console.log(`  [4/5] Notion 블록 추가 중 (${analyzed.blocks.length}개)...`);
    await appendPageBlocks(pageId, analyzed.blocks, notionApiKey);
    console.log(`  [4/5] 완료`);

    console.log(`  [5/5] 사용자 흐름 블록 추가 중 (${analyzed.userFlow.length}단계)...`);
    await appendUserFlowBlock(pageId, analyzed.userFlow, notionApiKey);
    console.log(`  [5/5] 완료`);

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** 메인 오케스트레이터 */
async function main(): Promise<void> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDbId = process.env.NOTION_DATABASE_ID;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!notionApiKey) {
    console.error("[오류] NOTION_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }
  if (!notionDbId) {
    console.error("[오류] NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }
  if (!anthropicApiKey) {
    console.error("[오류] ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  const { url: targetUrl } = parseArgs();

  // --url 플래그가 있으면 유효한 GitHub URL인지 선검증
  if (targetUrl !== null) {
    try {
      parseGithubUrl(targetUrl);
    } catch {
      console.error(`[오류] 유효하지 않은 GitHub URL입니다: ${targetUrl}`);
      process.exit(1);
    }
  }

  console.log("\n[Notion] 대기 중인 페이지 탐색 중...");
  const allPending = await getPendingPages(notionApiKey, notionDbId);

  // 처리 대상 페이지 결정
  let targets: PendingPage[];

  if (targetUrl !== null) {
    // 단일 URL 모드: githubUrl이 일치하는 페이지만 추출
    const normalizedTarget = targetUrl.trim().replace(/\.git$/, "").replace(/\/$/, "");
    targets = allPending.filter((p) => {
      const normalizedPage = p.githubUrl.trim().replace(/\.git$/, "").replace(/\/$/, "");
      return normalizedPage === normalizedTarget;
    });

    if (targets.length === 0) {
      console.log(
        `[안내] 해당 URL의 대기 중 페이지가 없습니다: ${targetUrl}`
      );
      console.log(
        "       Notion DB에 해당 Github URL이 입력된 페이지가 있는지 확인해주세요."
      );
      process.exit(0);
    }
  } else {
    // 배치 모드: 전체 대기 목록 처리
    targets = allPending;

    if (targets.length === 0) {
      console.log("[안내] 처리할 페이지가 없습니다. (대기 중인 페이지 없음)");
      process.exit(0);
    }
  }

  const total = targets.length;
  const mode = targetUrl !== null ? "단일 URL 모드" : "배치 모드";
  console.log(`\n[시작] ${mode} — 총 ${total}개 페이지 처리\n`);

  // 결과 집계
  const results: Array<{ githubUrl: string; success: boolean; error?: string }> = [];

  // 순차 처리 — API rate limit 충돌 방지
  for (let i = 0; i < targets.length; i++) {
    const page = targets[i];
    console.log(`[${i + 1}/${total}] 처리 시작: ${page.githubUrl}`);

    const result = await processPage(page, notionApiKey, anthropicApiKey, githubToken);

    if (result.success) {
      console.log(`[${i + 1}/${total}] ✅ 완료\n`);
      results.push({ githubUrl: page.githubUrl, success: true });
    } else {
      console.error(`[${i + 1}/${total}] ❌ 실패: ${result.error}\n`);
      results.push({ githubUrl: page.githubUrl, success: false, error: result.error });
    }
  }

  // 최종 요약
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  const failures = results.filter((r) => !r.success);

  console.log("========================================");
  console.log(`처리 완료: ${successCount}/${total}개`);

  if (failures.length > 0) {
    console.log(`\n실패 (${failCount}개):`);
    failures.forEach((f) => {
      console.log(`  - ${f.githubUrl}`);
      console.log(`    → ${f.error}`);
    });
  }
  console.log("========================================\n");

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("[치명적 오류]", err.message);
  process.exit(1);
});
