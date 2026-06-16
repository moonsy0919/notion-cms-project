/**
 * Notion 데이터베이스 속성 타입 정의
 * PRD 기준: Title, Description, Category, Tech Stack, Period, Status, Github, Demo
 */

/** 프로젝트 카테고리 */
export type ProjectCategory = "Personal" | "Team" | "Company";

/** 프로젝트 진행 상태 */
export type ProjectStatus = "진행중" | "완료" | "유지보수";

/**
 * Notion DB에서 파싱된 프로젝트 데이터
 * Notion API 원본 응답과 분리하여 앱 내부에서 사용
 */
export interface Project {
  /** Notion 페이지 ID */
  id: string;
  /** 프로젝트명 */
  title: string;
  /** 한 줄 요약 */
  description: string;
  /** 카테고리 (Personal / Team / Company) */
  category: ProjectCategory | null;
  /** 기술 스택 목록 */
  techStack: string[];
  /** 개발 기간 시작일 */
  periodStart: string | null;
  /** 개발 기간 종료일 */
  periodEnd: string | null;
  /** 진행 상태 */
  status: ProjectStatus | null;
  /** GitHub 링크 */
  githubUrl: string | null;
  /** 데모 링크 */
  demoUrl: string | null;
  /** Notion 페이지 마지막 수정일 */
  lastEditedTime: string;
}

/** 프로젝트 목록 조회 옵션 */
export interface ProjectFilterOptions {
  /** 기술 스택 필터 (빈 배열이면 전체) */
  techStack?: string[];
  /** 카테고리 필터 */
  category?: ProjectCategory;
  /** 상태 필터 */
  status?: ProjectStatus;
  /** 검색어 (title, description에서 검색) */
  query?: string;
}
