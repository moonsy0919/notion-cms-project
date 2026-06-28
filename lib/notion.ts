/**
 * Notion API 클라이언트 및 데이터 접근 함수
 * @notionhq/client v5: databases.query가 SDK에서 제거됨.
 * getProjects()는 REST API fetch로 직접 쿼리.
 * 모든 함수는 apiKey를 파라미터로 받아 per-request Client를 생성합니다.
 */
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  PropertyFilter,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Project, ProjectFilterOptions } from "@/types/notion";

/** Notion 블록에 재귀 조회된 하위 블록을 포함한 타입 */
export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

/**
 * Notion 페이지 응답에서 프로젝트 데이터를 파싱합니다.
 */
function parseProject(page: PageObjectResponse): Project {
  const props = page.properties;

  const getText = (prop: PageObjectResponse["properties"][string]): string => {
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("");
    }
    if (prop.type === "rich_text") {
      return prop.rich_text.map((t) => t.plain_text).join("");
    }
    return "";
  };

  const getSelect = (prop: PageObjectResponse["properties"][string]): string | null => {
    if (prop.type === "select") {
      return prop.select?.name ?? null;
    }
    return null;
  };

  const getMultiSelect = (prop: PageObjectResponse["properties"][string]): string[] => {
    if (prop.type === "multi_select") {
      return prop.multi_select.map((s) => s.name);
    }
    return [];
  };

  const getUrl = (prop: PageObjectResponse["properties"][string]): string | null => {
    if (prop.type === "url") {
      return prop.url ?? null;
    }
    return null;
  };

  return {
    id: page.id,
    title: getText(props["Title"]),
    description: getText(props["Description"]),
    category: getSelect(props["Category"]) as Project["category"],
    techStack: getMultiSelect(props["Tech Stack"]),
    periodStart: props["Period"]?.type === "date" ? (props["Period"].date?.start ?? null) : null,
    periodEnd: props["Period"]?.type === "date" ? (props["Period"].date?.end ?? null) : null,
    status: getSelect(props["Status"]) as Project["status"],
    githubUrl: getUrl(props["Github"]),
    demoUrl: getUrl(props["Demo"]),
    lastEditedTime: page.last_edited_time,
  };
}

/**
 * 프로젝트 목록을 Notion DB에서 조회합니다.
 * SDK v5에서 databases.query가 제거됐으므로 REST API를 직접 호출합니다.
 */
export async function getProjects(
  apiKey: string,
  databaseId: string,
  options: ProjectFilterOptions = {}
): Promise<Project[]> {
  const { techStack, category, status, limit, query } = options;
  const filters: PropertyFilter[] = [];

  if (category) {
    filters.push({ property: "Category", select: { equals: category } });
  }
  if (status) {
    filters.push({ property: "Status", select: { equals: status } });
  }
  if (techStack && techStack.length > 0) {
    techStack.forEach((tech) => {
      filters.push({ property: "Tech Stack", multi_select: { contains: tech } });
    });
  }

  const body: Record<string, unknown> = {
    sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    ...(limit ? { page_size: limit } : {}),
  };

  if (filters.length === 1) {
    body.filter = filters[0];
  } else if (filters.length > 1) {
    body.filter = { and: filters };
  }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Notion DB query 실패:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const projects = (data.results as PageObjectResponse[])
    .filter((page): page is PageObjectResponse => page.object === "page" && "properties" in page)
    .map(parseProject);

  if (!query) return projects;
  const q = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

/**
 * 특정 프로젝트 상세 정보를 ID로 조회합니다.
 */
export async function getProjectById(apiKey: string, id: string): Promise<Project | null> {
  try {
    const notion = new Client({ auth: apiKey });
    const page = await notion.pages.retrieve({ page_id: id });

    if (page.object !== "page" || !("properties" in page)) {
      return null;
    }

    return parseProject(page as PageObjectResponse);
  } catch {
    return null;
  }
}

/**
 * 프로젝트 Notion 페이지의 블록 콘텐츠를 재귀적으로 조회합니다.
 * 같은 depth의 has_children 블록들을 Promise.all로 병렬 패칭하고,
 * depth 전환 시에만 350ms 딜레이를 1회 적용합니다.
 * (기존: 블록마다 350ms × N 직렬 → 개선: depth당 350ms × 1)
 */
/**
 * 주어진 블록 ID의 하위 블록 전체를 페이지네이션으로 수집합니다.
 * has_more가 true인 경우 350ms 대기 후 다음 페이지를 요청합니다.
 */
async function fetchAllBlocks(
  notion: Client,
  blockId: string
): Promise<BlockObjectResponse[]> {
  const all: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    all.push(
      ...response.results.filter((b): b is BlockObjectResponse => "type" in b)
    );

    if (response.has_more && response.next_cursor) {
      cursor = response.next_cursor;
      await new Promise((resolve) => setTimeout(resolve, 350));
    } else {
      cursor = undefined;
    }
  } while (cursor);

  return all;
}

export async function getProjectBlocks(
  apiKey: string,
  pageId: string
): Promise<BlockWithChildren[]> {
  const notion = new Client({ auth: apiKey });
  const blocks = await fetchAllBlocks(notion, pageId);

  const blocksWithChildren = blocks.filter((b) => b.has_children);

  // 같은 depth에 children이 있는 블록이 하나라도 있으면 딜레이 1회만 적용
  if (blocksWithChildren.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  // 같은 depth의 children을 병렬로 패칭
  const childrenMap = new Map<string, BlockWithChildren[]>();
  await Promise.all(
    blocksWithChildren.map(async (block) => {
      const children = await getProjectBlocks(apiKey, block.id);
      childrenMap.set(block.id, children);
    })
  );

  // 원래 순서 유지하며 children 병합
  return blocks.map((block) =>
    block.has_children
      ? { ...block, children: childrenMap.get(block.id) ?? [] }
      : block
  );
}

/** Notion Integration 소유자 프로필 */
export interface OwnerProfile {
  name: string;
  avatarUrl: string | null;
}

/**
 * Notion workspace의 person 유저 프로필을 조회합니다.
 */
export async function getOwnerProfile(apiKey: string): Promise<OwnerProfile | null> {
  try {
    const notion = new Client({ auth: apiKey });
    const response = await notion.users.list({});
    const person = response.results.find((u) => u.type === "person");
    if (!person) return null;
    return {
      name: person.name ?? "",
      avatarUrl: person.avatar_url ?? null,
    };
  } catch (err) {
    console.error("getOwnerProfile 실패:", err);
    return null;
  }
}
