const GITHUB_API_BASE = "https://api.github.com";

/** GitHub API 응답 데이터 타입 */
export interface GithubRepoData {
  name: string;
  description: string | null;
  readme: string;
  languages: Record<string, number>;
  contributorCount: number;
  firstCommitDate: string | null;
  stars: number;
  defaultBranch: string;
}

/**
 * GitHub URL에서 owner와 repo를 추출합니다.
 * HTTPS와 SSH URL 형식 모두 지원합니다.
 * @example parseGithubUrl("https://github.com/owner/repo") → { owner: "owner", repo: "repo" }
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
  // [/:]로 HTTPS·SSH 모두 처리, [^/?#]+로 쿼리스트링·해시 차단
  const match = cleaned.match(/github\.com[/:]([^/?#]+)\/([^/?#]+)/);
  if (!match) {
    throw new Error(`유효하지 않은 GitHub URL입니다: ${url}`);
  }
  return { owner: match[1], repo: match[2] };
}

/** Authorization 헤더를 포함한 GitHub API fetch 헬퍼 */
async function githubFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  // Headers 객체로 정규화하여 타입 안전하게 병합
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => headers.set(key, value));
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.warn("[GitHub] GITHUB_TOKEN 미설정 — 비인증 요청(60 req/hour 제한)으로 폴백합니다.");
  }
  return fetch(`${GITHUB_API_BASE}${path}`, { ...options, headers });
}

/** Link 헤더에서 rel="last" 링크의 page 번호를 추출합니다 */
function parseLastPage(linkHeader: string): number | null {
  const match = linkHeader.match(/<([^>]+)>;\s*rel="last"/);
  if (!match) return null;
  const page = new URL(match[1]).searchParams.get("page");
  return page ? parseInt(page, 10) : null;
}

/** 기여자 수를 Link 헤더 페이지네이션으로 계산합니다 */
async function fetchContributorCount(owner: string, repo: string): Promise<number> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/contributors?per_page=1&anon=true`
  );
  if (!res.ok) return 0;

  const lastPage = parseLastPage(res.headers.get("Link") ?? "");
  if (lastPage !== null) return lastPage;

  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

/** 첫 커밋 날짜를 ISO 8601 형식으로 반환합니다. 조회 실패 시 null 반환 */
async function fetchFirstCommitDate(
  owner: string,
  repo: string,
  defaultBranch: string
): Promise<string | null> {
  // 마지막 페이지의 커밋이 첫 커밋 — Link 헤더로 last page 번호 확인 후 재요청
  const probeRes = await githubFetch(
    `/repos/${owner}/${repo}/commits?sha=${defaultBranch}&per_page=1`
  );
  if (!probeRes.ok) return null;

  const lastPage = parseLastPage(probeRes.headers.get("Link") ?? "");

  if (lastPage !== null) {
    // 마지막 페이지 별도 요청 — probeRes body는 소비하지 않음
    const lastRes = await githubFetch(
      `/repos/${owner}/${repo}/commits?sha=${defaultBranch}&per_page=1&page=${lastPage}`
    );
    if (!lastRes.ok) return null;
    const commits = await lastRes.json();
    return commits[0]?.commit?.author?.date ?? null;
  }

  // Link 헤더 없음 = 커밋이 1페이지뿐 — probeRes body를 여기서 처음 소비
  const commits = await probeRes.json();
  return commits[0]?.commit?.author?.date ?? null;
}

/**
 * GitHub 레포지토리의 데이터를 병렬로 수집합니다.
 * 개별 API 실패 시 해당 항목은 기본값으로 처리하여 부분 성공을 허용합니다.
 */
export async function fetchGithubRepoData(githubUrl: string): Promise<GithubRepoData> {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const [metaRes, readmeRes, languagesRes] = await Promise.all([
    githubFetch(`/repos/${owner}/${repo}`),
    githubFetch(`/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
    }),
    githubFetch(`/repos/${owner}/${repo}/languages`),
  ]);

  const meta = metaRes.ok ? await metaRes.json() : {};
  const readme = readmeRes.ok ? await readmeRes.text() : "";
  const languages: Record<string, number> = languagesRes.ok
    ? await languagesRes.json()
    : {};

  const defaultBranch: string = meta.default_branch ?? "main";

  const [contributorCount, firstCommitDate] = await Promise.all([
    fetchContributorCount(owner, repo),
    fetchFirstCommitDate(owner, repo, defaultBranch),
  ]);

  return {
    name: meta.name ?? repo,
    description: meta.description ?? null,
    readme,
    languages,
    contributorCount,
    firstCommitDate,
    stars: meta.stargazers_count ?? 0,
    defaultBranch,
  };
}

// 스모크 테스트: npx tsx --env-file=.env.local scripts/lib/github.ts --test [url]
if (process.argv[2] === "--test") {
  const testUrl = process.argv[3] ?? "https://github.com/vercel/next.js";
  console.log(`\n[테스트] GitHub 데이터 수집: ${testUrl}\n`);
  fetchGithubRepoData(testUrl)
    .then((data) => {
      console.log("name           :", data.name);
      console.log("description    :", data.description);
      console.log("stars          :", data.stars);
      console.log("defaultBranch  :", data.defaultBranch);
      console.log("contributorCount:", data.contributorCount);
      console.log("firstCommitDate:", data.firstCommitDate);
      console.log("languages      :", data.languages);
      console.log("readme(앞 200자):", data.readme.slice(0, 200));
      process.exit(0);
    })
    .catch((err) => {
      console.error("[오류]", err.message);
      process.exit(1);
    });
}
