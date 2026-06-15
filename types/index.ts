/** 네비게이션 메뉴 항목 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** 활성 상태 수동 지정 (없으면 pathname으로 판단) */
  active?: boolean;
  /** 하위 메뉴 */
  children?: NavItem[];
}

/** API 공통 응답 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 페이지네이션 파라미터 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 정렬 방향 */
export type SortDirection = "asc" | "desc";

/** 테이블 정렬 상태 */
export interface SortState {
  column: string;
  direction: SortDirection;
}
