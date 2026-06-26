/**
 * Notion API 클라이언트 및 데이터 접근 함수
 * @notionhq/client v5: databases.query가 SDK에서 제거됨.
 * dataSources.query는 새로운 "Data Sources" 기능 전용으로 일반 DB에 작동하지 않음.
 * getProjects()는 REST API fetch로 직접 쿼리.
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
 * Notion 클라이언트 lazy 싱글톤
 * 실제 API 호출 시점에 초기화하여 빌드 타임 환경변수 오류를 방지합니다.
 */
let _notion: Client | null = null;

/** Notion 클라이언트 인스턴스를 반환합니다 (서버 사이드 전용) */
function getNotionClient(): Client {
  if (_notion) return _notion;
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.");
  }
  _notion = new Client({ auth: apiKey });
  return _notion;
}

/** 프로젝트 데이터 소스(데이터베이스) ID */
function getDataSourceId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) {
    throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.");
  }
  return id;
}

/**
 * Notion 페이지 응답에서 프로젝트 데이터를 파싱합니다.
 * @param page - Notion API의 PageObjectResponse
 * @returns 파싱된 Project 객체
 */
function parseProject(page: PageObjectResponse): Project {
  const props = page.properties;

  /** 텍스트 속성 값을 문자열로 추출 */
  const getText = (prop: PageObjectResponse["properties"][string]): string => {
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("");
    }
    if (prop.type === "rich_text") {
      return prop.rich_text.map((t) => t.plain_text).join("");
    }
    return "";
  };

  /** select 속성 값을 문자열로 추출 */
  const getSelect = (prop: PageObjectResponse["properties"][string]): string | null => {
    if (prop.type === "select") {
      return prop.select?.name ?? null;
    }
    return null;
  };

  /** multi_select 속성 값을 문자열 배열로 추출 */
  const getMultiSelect = (prop: PageObjectResponse["properties"][string]): string[] => {
    if (prop.type === "multi_select") {
      return prop.multi_select.map((s) => s.name);
    }
    return [];
  };

  /** url 속성 값을 문자열로 추출 */
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
 * @param options - 필터 및 검색 옵션
 * @returns Project 배열
 */
export async function getProjects(options: ProjectFilterOptions = {}): Promise<Project[]> {
  const { techStack, category, status, limit } = options;
  const filters: PropertyFilter[] = [];

  if (category) {
    filters.push({
      property: "Category",
      select: { equals: category },
    });
  }

  if (status) {
    filters.push({
      property: "Status",
      select: { equals: status },
    });
  }

  if (techStack && techStack.length > 0) {
    techStack.forEach((tech) => {
      filters.push({
        property: "Tech Stack",
        multi_select: { contains: tech },
      });
    });
  }

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.");

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
    `https://api.notion.com/v1/databases/${getDataSourceId()}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error("Notion DB query 실패:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return (data.results as PageObjectResponse[])
    .filter((page): page is PageObjectResponse => page.object === "page" && "properties" in page)
    .map(parseProject);
}

/**
 * 특정 프로젝트 상세 정보를 ID로 조회합니다.
 * @param id - Notion 페이지 ID
 * @returns Project 객체 또는 null
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const notion = getNotionClient();
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
 * has_children: true 블록에 대해 하위 블록을 재귀 페칭하고 children 필드에 병합합니다.
 * Notion API rate limit(3 req/sec) 대응을 위해 재귀 호출 사이 350ms 딜레이를 적용합니다.
 * @param pageId - Notion 페이지 ID 또는 블록 ID
 * @returns 하위 블록이 병합된 블록 트리
 */
export async function getProjectBlocks(pageId: string): Promise<BlockWithChildren[]> {
  const notion = getNotionClient();
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  const blocks = response.results.filter(
    (b): b is BlockObjectResponse => "type" in b
  );

  const result: BlockWithChildren[] = [];
  for (const block of blocks) {
    if (block.has_children) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const children = await getProjectBlocks(block.id);
      result.push({ ...block, children });
    } else {
      result.push(block);
    }
  }
  return result;
}

/** Notion Integration 소유자 프로필 */
export interface OwnerProfile {
  name: string;
  avatarUrl: string | null;
}

/**
 * Notion workspace의 person 유저 프로필을 조회합니다.
 * ProfileAvatar 컴포넌트에 실제 아바타 URL 전달에 사용합니다.
 * @returns 첫 번째 person 유저의 name과 avatar_url, 실패 시 null
 */
export async function getOwnerProfile(): Promise<OwnerProfile | null> {
  try {
    const notion = getNotionClient();
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
