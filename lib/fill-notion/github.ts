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
  fileTree: string[];
  sourceFiles: Record<string, string>;
}

/**
 * GitHub URL에서 owner와 repo를 추출합니다.
 * HTTPS와 SSH URL 형식 모두 지원합니다.
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
  const match = cleaned.match(/github\.com[/:]([^/?#]+)\/([^/?#]+)/);
  if (!match) {
    throw new Error(`유효하지 않은 GitHub URL입니다: ${url}`);
  }
  return { owner: match[1], repo: match[2] };
}

/** Authorization 헤더를 포함한 GitHub API fetch 헬퍼 */
async function githubFetch(
  path: string,
  token?: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => headers.set(key, value));
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
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
async function fetchContributorCount(
  owner: string,
  repo: string,
  token?: string
): Promise<number> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/contributors?per_page=1&anon=true`,
    token
  );
  if (!res.ok) return 0;

  const lastPage = parseLastPage(res.headers.get("Link") ?? "");
  if (lastPage !== null) return lastPage;

  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

/** 노이즈 경로를 제외하고 파일 트리를 반환합니다 */
async function fetchFileTree(
  owner: string,
  repo: string,
  sha: string,
  token?: string
): Promise<string[]> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
    token
  );
  if (!res.ok) return [];

  const data = await res.json() as { tree: Array<{ path: string; type: string }> };

  const EXCLUDED_PREFIXES = [
    "node_modules/", ".git/", "dist/", "build/", ".next/",
    "__pycache__/", ".cache/", "vendor/", "coverage/",
  ];
  const EXCLUDED_EXTENSIONS = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".zip",
    ".tar", ".gz", ".mp4", ".mp3", ".webp", ".bin", ".exe",
  ]);
  const EXCLUDED_FILENAMES = new Set([
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock",
  ]);

  return data.tree
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .filter((path) => {
      if (EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
      const base = path.split("/").pop() ?? "";
      if (EXCLUDED_FILENAMES.has(base)) return false;
      const dotIdx = base.lastIndexOf(".");
      if (dotIdx !== -1 && EXCLUDED_EXTENSIONS.has(base.slice(dotIdx))) return false;
      return true;
    })
    .slice(0, 200);
}

/** 파일 목록을 중요도 순으로 정렬합니다 */
function sortByImportance(paths: string[]): string[] {
  const PRIORITY_NAMES = new Set([
    "package.json", "pyproject.toml", "go.mod", "Cargo.toml",
    "tsconfig.json", "vite.config.ts", "vite.config.js",
    "next.config.ts", "next.config.js", "next.config.mjs",
    "index.ts", "index.js", "main.ts", "main.js", "main.py", "main.go",
    "app.ts", "app.js",
  ]);

  const priority: string[] = [];
  const sourceFiles: string[] = [];
  const rest: string[] = [];

  for (const p of paths) {
    const base = p.split("/").pop() ?? "";
    if (PRIORITY_NAMES.has(base)) {
      priority.push(p);
    } else if (/^(src|app|lib|components|pages|routes)\//i.test(p)) {
      sourceFiles.push(p);
    } else {
      rest.push(p);
    }
  }

  return [...priority, ...sourceFiles, ...rest];
}

/** 토큰 예산 내에서 중요도 순으로 소스 파일 내용을 수집합니다 */
async function fetchSourceFiles(
  owner: string,
  repo: string,
  fileTree: string[],
  token?: string
): Promise<Record<string, string>> {
  const TOKEN_BUDGET = 20000;
  const FILE_MAX_CHARS = 3000;
  const sorted = sortByImportance(fileTree);
  const result: Record<string, string> = {};
  let totalChars = 0;

  for (const path of sorted) {
    if (totalChars >= TOKEN_BUDGET) break;

    try {
      const res = await githubFetch(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
        token
      );
      if (!res.ok) continue;

      const data = await res.json() as { content?: string; encoding?: string };
      if (data.encoding !== "base64" || !data.content) continue;

      const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
      const truncated = decoded.slice(0, FILE_MAX_CHARS);
      result[path] = truncated;
      totalChars += truncated.length;
    } catch {
      // 개별 파일 실패는 건너뜀
    }
  }

  return result;
}

/** 첫 커밋 날짜를 ISO 8601 형식으로 반환합니다. 조회 실패 시 null 반환 */
async function fetchFirstCommitDate(
  owner: string,
  repo: string,
  defaultBranch: string,
  token?: string
): Promise<string | null> {
  const probeRes = await githubFetch(
    `/repos/${owner}/${repo}/commits?sha=${defaultBranch}&per_page=1`,
    token
  );
  if (!probeRes.ok) return null;

  const lastPage = parseLastPage(probeRes.headers.get("Link") ?? "");

  if (lastPage !== null) {
    const lastRes = await githubFetch(
      `/repos/${owner}/${repo}/commits?sha=${defaultBranch}&per_page=1&page=${lastPage}`,
      token
    );
    if (!lastRes.ok) return null;
    const commits = await lastRes.json();
    return commits[0]?.commit?.author?.date ?? null;
  }

  const commits = await probeRes.json();
  return commits[0]?.commit?.author?.date ?? null;
}

/**
 * GitHub 레포지토리의 데이터를 병렬로 수집합니다.
 * 개별 API 실패 시 해당 항목은 기본값으로 처리하여 부분 성공을 허용합니다.
 */
export async function fetchGithubRepoData(
  githubUrl: string,
  githubToken?: string
): Promise<GithubRepoData> {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const [metaRes, readmeRes, languagesRes] = await Promise.all([
    githubFetch(`/repos/${owner}/${repo}`, githubToken),
    githubFetch(`/repos/${owner}/${repo}/readme`, githubToken, {
      headers: { Accept: "application/vnd.github.raw+json" },
    }),
    githubFetch(`/repos/${owner}/${repo}/languages`, githubToken),
  ]);

  const meta = metaRes.ok ? await metaRes.json() : {};
  const readme = readmeRes.ok ? await readmeRes.text() : "";
  const languages: Record<string, number> = languagesRes.ok
    ? await languagesRes.json()
    : {};

  const defaultBranch: string = meta.default_branch ?? "main";

  const [contributorCount, firstCommitDate] = await Promise.all([
    fetchContributorCount(owner, repo, githubToken),
    fetchFirstCommitDate(owner, repo, defaultBranch, githubToken),
  ]);

  const fileTree = await fetchFileTree(owner, repo, defaultBranch, githubToken);
  const sourceFiles = await fetchSourceFiles(owner, repo, fileTree, githubToken);

  return {
    name: meta.name ?? repo,
    description: meta.description ?? null,
    readme,
    languages,
    contributorCount,
    firstCommitDate,
    stars: meta.stargazers_count ?? 0,
    defaultBranch,
    fileTree,
    sourceFiles,
  };
}
