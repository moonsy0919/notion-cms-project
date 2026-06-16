# Task 001: 프로젝트 기반 구조 설정

## 개요

Next.js 16 App Router 기반의 포트폴리오 프로젝트 골격을 구성합니다.
전체 라우트 구조, 레이아웃, 타입 정의, Notion API 클라이언트 초기화까지
실제 기능 구현 전에 필요한 모든 뼈대를 세웁니다.

## 관련 파일

- `app/layout.tsx` — 루트 레이아웃 (ThemeProvider, Header, Footer)
- `app/page.tsx` — 홈 페이지 (Hero + 더미 프로젝트 카드)
- `app/projects/page.tsx` — 프로젝트 목록 페이지 (빈 상태)
- `app/projects/[id]/page.tsx` — 프로젝트 상세 페이지 (플레이스홀더)
- `app/about/page.tsx` — 소개 페이지 (정적 콘텐츠)
- `components/layout/Header.tsx` — 헤더 (네비게이션 + 테마 토글)
- `components/layout/Footer.tsx` — 푸터
- `lib/notion.ts` — Notion API 클라이언트 및 데이터 접근 함수
- `types/notion.ts` — Notion 관련 타입 정의

## 수락 기준 (Acceptance Criteria)

- [x] 루트 레이아웃에 Header, Footer, ThemeProvider가 올바르게 배치된다
- [x] `/`, `/projects`, `/projects/[id]`, `/about` 라우트가 모두 존재한다
- [x] `Project`, `ProjectCategory`, `ProjectStatus`, `ProjectFilterOptions` 타입이 정의된다
- [x] `lib/notion.ts`에 `getProjects`, `getProjectById`, `getProjectBlocks` 함수 시그니처가 준비된다
- [x] Notion 클라이언트가 환경변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)를 읽어 lazy 초기화된다
- [x] 헤더 네비게이션(프로젝트, 소개)과 다크 모드 토글이 정상 동작한다
- [x] 홈 페이지에 Hero 섹션과 더미 프로젝트 카드 3개가 표시된다
- [x] 프로젝트 목록 페이지에 빈 상태(EmptyState) UI가 표시된다
- [x] 소개 페이지에 기술 스택 카드가 정적으로 표시된다

## 구현 단계

1. Next.js 16 프로젝트 초기화 및 `@notionhq/client`, `react-icons` 등 패키지 설치
2. `types/notion.ts` — 프로젝트 도메인 타입 전체 정의
3. `lib/notion.ts` — Notion 클라이언트 싱글톤 및 데이터 접근 함수 골격 작성
4. 루트 레이아웃 수정 — Header, Footer 포트폴리오 버전으로 교체
5. 홈, 프로젝트 목록, 프로젝트 상세, 소개 페이지 파일 생성 (더미 데이터 또는 빈 상태)

## 변경 사항 요약

- `types/notion.ts`: `Project`, `ProjectCategory`, `ProjectStatus`, `ProjectFilterOptions` 타입 신규 정의
- `lib/notion.ts`: Notion 클라이언트 lazy 싱글톤 및 `getProjects`, `getProjectById`, `getProjectBlocks` 함수 골격 작성. 환경변수 누락 시 명확한 에러 메시지 출력
- `app/layout.tsx`: 기존 스타터킷 레이아웃을 포트폴리오용 Header, Footer, ThemeProvider 구조로 재구성
- `components/layout/Header.tsx`: 로고 + 프로젝트/소개 네비게이션 + 다크 모드 토글 구현
- `components/layout/Footer.tsx`: 저작권 표시 + 간단한 네비게이션 링크 구현
- `app/page.tsx`: Hero 섹션 + 더미 프로젝트 카드 3개 표시 (Notion API 연동 전 플레이스홀더)
- `app/projects/page.tsx`: 프로젝트 목록 페이지 골격 생성. 빈 배열로 EmptyState UI 표시
- `app/projects/[id]/page.tsx`: 프로젝트 상세 페이지 동적 라우트 골격 생성 (플레이스홀더 콘텐츠)
- `app/about/page.tsx`: 정적 자기소개 텍스트 + 기술 스택 카드 UI 구현
