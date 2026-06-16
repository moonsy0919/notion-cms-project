# ROADMAP: 개인 포트폴리오 웹사이트 (Notion CMS 기반)

> 구조 우선 접근법(Structure-First Approach)을 따릅니다.
> 전체 골격과 공통 모듈을 먼저 완성한 뒤 핵심 기능(Notion 연동)을 완성하고,
> 이후 추가 기능(필터·검색·반응형)을 더한 다음 성능 최적화 및 배포로 마무리합니다.

### 진행 상태 범례

- 완료: 해당 항목 구현 완료
- 진행중: 현재 작업 중
- 대기: 아직 시작 전

---

### Phase 1: 프로젝트 골격 구성 ✅ 완료

> 왜 이 순서인가? 라우트·레이아웃·타입·환경변수 구조 없이는 어떤 기능도 시작할 수 없습니다. 전체 앱의 뼈대를 먼저 확정해야 이후 작업이 각자 독립적으로 진행될 수 있습니다.

- **Task 001: 프로젝트 기반 구조 설정** ✅ - 완료
  - See: `/tasks/001-project-foundation.md`
  - ✅ 필수 패키지 설치 및 TypeScript 경로 별칭 확인
  - ✅ Notion 관련 공통 타입 정의 (Project, Category, Status, FilterOptions)
  - ✅ Notion 클라이언트 lazy 싱글톤 및 데이터 조회 함수 골격 작성
  - ✅ 루트 레이아웃 재구성 및 Header, Footer 컴포넌트 구현
  - ✅ 홈 페이지 Hero 섹션 및 더미 프로젝트 카드 3개 골격
  - ✅ 프로젝트 목록·상세·소개 페이지 골격 생성 (빈 상태 UI)

---

### Phase 2: 공통 모듈 구축

> 왜 이 순서인가? 여러 페이지에서 공유되는 컴포넌트와 더미 데이터를 먼저 확정해야 핵심·추가 기능 개발 시 중복 구현이 없습니다. 이 단계의 결과물(ProjectCard, ProjectFilters 등)은 Phase 3·4 전반에서 재사용됩니다.

- **Task 002: 더미 데이터 및 공통 프로젝트 컴포넌트 구축** - 대기
  - See: `/tasks/002-dummy-data-components.md`
  - 더미 프로젝트 5개 정의 (카테고리·기술 스택·상태·기간 다양하게 구성, `lib/dummy.ts`)
  - `ProjectCard` 컴포넌트 구현 (기술 스택 배지, 카테고리, 상태, 기간 표시)
  - `ProjectFilters` 컴포넌트 구현 (기술 스택 필터 버튼 UI — 이 단계에서는 UI 형태만)
  - `ProjectSearchBar` 컴포넌트 구현 (검색 입력 UI — 이 단계에서는 UI 형태만)
  - 모든 컴포넌트 다크 모드 색상 대비 확인

---

### Phase 3: 핵심 기능 구현

> 왜 이 순서인가? 이 사이트의 존재 이유는 Notion 연동 프로젝트 목록과 상세 페이지입니다. 공통 모듈이 준비된 직후 가장 중요한 기능을 완성해 MVP를 조기에 달성합니다. 기존에는 더미 UI 완성과 Notion 연동이 별도 Phase였으나, 목록·상세 페이지를 "UI + Notion 연동"을 한 번에 처리해 중복을 제거합니다.

- **Task 003: 프로젝트 목록 페이지 완성 (UI + Notion API 실제 연동)** - 대기
  - See: `/tasks/003-projects-list-notion.md`
  - Notion Integration API 키 발급 및 환경변수 설정 (`.env.local` 보안 관리 확인)
  - Notion DB 생성 및 샘플 데이터 입력 (PRD 스펙 컬럼 구성)
  - `getProjects()` 함수를 실제 Notion API 호출로 활성화
  - 프로젝트 목록 페이지 — `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 조립, 실제 데이터 연결
  - 홈 페이지 — 최근 프로젝트 카드 3개를 `getProjects({ limit: 3 })` 실제 호출로 연결
  - API 오류 시 빈 배열 반환 및 앱 크래시 방지

- **Task 004: 프로젝트 상세 페이지 완성 (BlockRenderer + Notion 블록 렌더링)** - 대기
  - See: `/tasks/004-project-detail-notion.md`
  - `components/notion/BlockRenderer.tsx` 구현 (paragraph, heading 1~3, bulleted/numbered list, code, quote, divider)
  - `getProjectById`, `getProjectBlocks` 실제 API 호출 연결
  - 실제 프로젝트 메타 정보(제목, 기간, 기술 스택, 링크) 렌더링
  - `generateMetadata` — 실제 프로젝트 제목·설명으로 OG 태그 생성
  - 존재하지 않는 ID 접근 시 `notFound()` 호출 (404 처리)
  - 본문 영역 `prose prose-neutral dark:prose-invert` 스타일 적용

---

### Phase 4: 추가 기능 구현

> 왜 이 순서인가? 핵심 기능(Notion 연동 목록·상세)이 동작하는 상태에서 UX를 향상시키는 부가 기능을 추가합니다. 필터·검색이 없어도 포트폴리오 자체는 완성된 상태이므로 MVP 이후에 배치합니다. 반응형 최종 검증도 기능이 모두 갖춰진 이 시점에 수행해 검증 범위를 한 번에 확정합니다.

- **Task 005: 기술 스택 필터 및 검색 기능 완성** - 대기
  - See: `/tasks/005-filter-and-search.md`
  - `ProjectFilters` — URL 파라미터(`?tech=`) 기반 기술 스택 필터 상태 관리로 교체
  - `ProjectSearchBar` — 300ms 디바운스 후 URL 쿼리(`?q=`) 업데이트로 교체
  - 프로젝트 목록 페이지 — `searchParams`로 서버 사이드 필터·검색 옵션 전달
  - `getProjects` 함수 — `query`, `tech` 필터 파라미터 처리 추가
  - 필터 결과 없을 때 `EmptyState` 표시, "전체" 버튼으로 초기화

- **Task 006: 소개(About) 페이지 완성 + 반응형 디자인 & UX 검증** - 대기
  - See: `/tasks/006-about-responsive.md`
  - 소개 페이지 — 정적 자기소개 텍스트 + 기술 스택 카드 최종본 완성
  - 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 전체 페이지 반응형 레이아웃 점검 및 수정
  - 라이트/다크 모드 전환하며 전체 페이지 색상 대비 확인
  - 네비게이션 → 목록 → 상세 → 뒤로가기 사용자 플로우 모바일·데스크톱 각각 검증

---

### Phase 5: 성능 최적화 및 배포

> 왜 이 순서인가? 기능이 모두 확정된 후에야 캐싱·SEO 최적화가 의미 있습니다. 기능이 변경되면 최적화 결과가 무효화되므로 모든 기능 완결 후 마지막에 배치합니다.

- **Task 007: 성능 최적화 및 Vercel 배포** - 대기
  - See: `/tasks/007-performance-and-deployment.md`
  - Notion API 응답 ISR 캐싱 적용 (`revalidate: 3600` 또는 `unstable_cache`)
  - 전역 메타데이터 완성 (title template, description, OG 이미지)
  - 각 페이지 `generateMetadata` 함수 완성
  - Lighthouse 기준 Performance 80점 이상, Accessibility 90점 이상 목표
  - Vercel 프로젝트 연결, 환경변수 등록 및 프로덕션 배포 검증

---

### 기술 스택 요약

| 구분 | 기술 |
|:---|:---|
| Frontend | Next.js 16 (App Router), TypeScript |
| CMS | Notion API (`@notionhq/client` v5) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Icons | Lucide React, React Icons |
| Deployment | Vercel |

### 핵심 아키텍처 결정사항

- **Server Component 우선**: 데이터 fetch는 서버 컴포넌트에서 처리. 인터랙션이 필요한 부분만 `"use client"` 분리
- **URL 파라미터 기반 필터 상태 관리**: `useSearchParams` + `useRouter`로 필터/검색 상태를 URL에 반영하여 공유 및 새로고침 대응
- **ISR 캐싱**: Notion API 응답을 일정 시간 캐싱하여 렌더링 성능 확보 및 API 호출 횟수 절감
- **Lazy 싱글톤 Notion 클라이언트**: 빌드 타임 환경변수 오류를 방지하기 위해 최초 API 호출 시점에 클라이언트 초기화
- **환경변수 보안**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`는 서버 사이드 전용으로 클라이언트 번들에 포함되지 않도록 관리. `.env.local`은 `.gitignore`에 등록하여 Git에 커밋되지 않도록 방지
- **확장성**: 향후 `About` 페이지 데이터, 이력/타임라인 등 Notion DB 추가 연동이 가능하도록 `lib/notion.ts`의 함수 구조를 범용적으로 설계
