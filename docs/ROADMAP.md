# ROADMAP: 개인 포트폴리오 웹사이트 (Notion CMS 기반)

> 구조 우선 접근법(Structure-First Approach)을 따릅니다.
> 전체 골격과 공통 모듈을 먼저 완성한 뒤 핵심 기능(Notion 연동)을 완성하고,
> 이후 추가 기능(필터·검색·반응형)을 더한 다음 성능 최적화 및 배포로 마무리합니다.

## 진행 상태 범례

- 완료: 해당 항목 구현 완료
- 진행중: 현재 작업 중
- 대기: 아직 시작 전

---

## Phase 1: 프로젝트 골격 구성 ✅ 완료

> 왜 이 순서인가? 라우트·레이아웃·타입·환경변수 구조 없이는 어떤 기능도 시작할 수 없습니다. 전체 앱의 뼈대를 먼저 확정해야 이후 작업이 각자 독립적으로 진행될 수 있습니다.

- **Task 001: 프로젝트 기반 구조 설정** ✅
  - Notion 공통 타입 정의, 클라이언트 싱글톤 및 데이터 조회 함수 골격 작성
  - 루트 레이아웃, Header/Footer, 홈·프로젝트·소개 페이지 골격 생성

---

## Phase 2: 공통 모듈 구축 ✅ 완료

> 왜 이 순서인가? 여러 페이지에서 공유되는 컴포넌트와 더미 데이터를 먼저 확정해야 핵심·추가 기능 개발 시 중복 구현이 없습니다. 이 단계의 결과물(ProjectCard, ProjectFilters 등)은 Phase 3·4 전반에서 재사용됩니다.

- **Task 002: 더미 데이터 및 공통 프로젝트 컴포넌트 구축** ✅
  - 더미 프로젝트 5개(`lib/dummy.ts`), `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 구현
  - 기존 인라인 카드 코드를 공통 컴포넌트로 교체

---

## Phase 2.5: 홈페이지 UI 리디자인 (코드 에디터 테마) ✅ 완료

> 왜 이 순서인가? Phase 3 Notion 연동 전에 시각적 시스템을 확정해야 데이터를 붙였을 때 디자인 재작업 없이 바로 연결됩니다. 테마·레이아웃이 먼저 확정되면 Phase 3~4의 컴포넌트들이 이 시스템 위에서 자연스럽게 조립됩니다.

- **Task 002-A: 글로벌 다크 테마 및 폰트 시스템 구축** ✅
  - `globals.css` CSS 변수로 라이트/다크 테마 정의, 다크 전용 신택스 토큰 추가
  - `next/font`로 JetBrains Mono 로드 → `--font-mono` CSS 변수 등록

- **Task 002-B: 네비게이션 개선** ✅
  - `</>` 아이콘 + 이름 로고, 활성 링크 teal 언더라인(`usePathname` 기반), 모바일 햄버거 메뉴 구현

- **Task 002-C: Hero 섹션 2컬럼 레이아웃 재구현** ✅
  - `HeroSection.tsx` 신규 — 좌(소개·CTA)·우(아바타+코드 에디터) 2컬럼, 모바일 우측 컬럼 숨김

- **Task 002-D: 코드 에디터 패널 컴포넌트 구현** ✅
  - `CodeEditorPanel.tsx` 신규 — 파일 탭, 라인 번호, 신택스 하이라이트(외부 라이브러리 없음)
  - 타이핑 애니메이션: `clip-path: inset(0 100% 0 0 → 0 0% 0 0)` + `steps(N, end)` 조합으로 글자 단위 마스크 해제. `animation-fill-mode: both`로 딜레이 중 초기 마스킹(`backwards`)과 완료 상태 유지(`forwards`) 보장
  - 탭 전환 시 `<tbody key={activeTab}>` DOM 재마운트로 애니메이션 재실행

- **Task 002-E: About 홈 프리뷰 섹션** ✅
  - `AboutPreview.tsx` 신규 — 바이오 카드, 프로필 사진, 기술 카테고리 태그 행

- **Task 002-F: 프로젝트 카드 다크 테마 + 스크롤 진입 애니메이션** ✅
  - `AnimatedProjectsSection.tsx` 신규 — Intersection Observer 기반 카드 스태거 애니메이션
  - 관찰 대상은 `<section>` 전체가 아닌 카드 `.grid` div. `<section>` 관찰 시 헤더가 뷰포트 진입(scrollY ≈ 57px)과 동시에 발동돼 카드가 화면 밖에서 애니메이션 완료되는 문제가 있었음 (`threshold: 0.15` 적용)
  - `HeroSection`에 `min-h-screen` 적용 — 프로젝트 섹션을 항상 fold 아래로 유지해 IO 즉시 발동 방지

---

## Phase 2.6: GitHub → Notion 자동화 스크립트 ✅ 완료

> 왜 이 순서인가? Phase 3에서 프론트엔드가 실제 Notion 데이터를 렌더링하려면 Notion DB에 진짜 프로젝트 데이터가 먼저 있어야 합니다. 이 Phase에서 Notion DB 생성 → Integration 연결 → 스크립트로 데이터 채우기까지 Phase 3 시작 전에 모두 완료합니다. GitHub URL 하나만 입력하면 AI가 나머지 속성과 본문을 자동으로 채워주는 CLI 도구로, 배포되는 앱과 무관한 로컬 개발 보조 도구입니다.

- **Task 003-0: Notion DB 및 Integration 설정** ✅
  - Notion DB 생성(PRD 스펙 컬럼), Integration API 키 발급 및 DB 연결, `.env.local` 등록
  - `GITHUB_TOKEN` 미등록 시 GitHub API 60 req/hour 제한 → 배치 모드에서 rate limit 초과 위험

- **Task 003-A~E: GitHub → Notion 자동화 CLI 구현** ✅
  - `scripts/lib/github.ts` — GitHub 메타데이터·README·언어·기여자 병렬 수집
  - `scripts/lib/ai-analyzer.ts` — Claude claude-sonnet-4-6 분석, JSON 스키마 강제 출력, 429 지수 백오프
  - `scripts/lib/notion-updater.ts` — 대기 페이지 탐지, 속성 및 블록 업데이트(100개 청킹)
  - `scripts/github-to-notion.ts` — 단일 URL 모드·배치 모드, 페이지별 try-catch 격리
  - `tsconfig.json`에 `"exclude": ["scripts/**"]` 추가 — Vercel 빌드 격리

---

## Phase 3: 핵심 기능 구현 ✅ 완료

> 왜 이 순서인가? 이 사이트의 존재 이유는 Notion 연동 프로젝트 목록과 상세 페이지입니다. Phase 2에서 공통 컴포넌트(카드, 필터 UI)가 완성된 직후, 페이지 단위의 UI 조립과 Notion 연동을 한 번에 수행해 불필요한 더미 데이터 페이지 구현 단계를 생략하고 MVP를 조기에 달성합니다.

- **Task 004: 프로젝트 목록 페이지 완성** ✅
  - `getProjects()` — SDK v5에서 `databases.query` 제거로 REST API fetch 직접 호출(`/v1/databases/{id}/query`)
  - `getOwnerProfile()` 추가 — `notion.users.list()`로 Notion 아바타 URL 취득
  - `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 조립, 실제 Notion 데이터 연결

- **Task 005: 프로젝트 상세 페이지 완성 (BlockRenderer + Notion 블록 렌더링)** ✅
  - `getProjectBlocks()` 재귀 페칭 — `has_children: true` 블록에 하위 블록 재귀 호출. 호출 사이 350ms 딜레이 적용(Notion API rate limit 3 req/sec 대응)
  - `BlockRenderer.tsx` — paragraph·heading 1~3·list·code·quote·divider 지원, 재귀 렌더링으로 중첩 블록 완전 처리
  - `generateMetadata`로 OG 태그 생성, 없는 ID는 `notFound()` 호출

---

## Phase 4: 추가 기능 구현

> 왜 이 순서인가? 핵심 기능(Notion 연동 목록·상세)이 동작하는 상태에서 UX를 향상시키는 부가 기능을 추가합니다. 필터·검색이 없어도 포트폴리오 자체는 완성된 상태이므로 MVP 이후에 배치합니다. 반응형 최종 검증도 기능이 모두 갖춰진 이 시점에 수행해 검증 범위를 한 번에 확정합니다.

- **Task 006: 개발용 프로젝트 업데이트 버튼 구현** ✅ *(Phase 5에서 폴링 방식으로 전면 재작성됨 — Task 017 참고)*
  - 헤더 우상단 새로고침 버튼 → SSE 스트리밍으로 `fill-notion` 실행 및 실시간 로그 팝업
  - **버그 수정**: Notion `avatar_url` 호스트(`s3-us-west-2.amazonaws.com`)가 `next.config.ts` 미등록 → `next/image` 500 크래시 → 호스트 3개 추가, GitHub 아바타 폴백 처리
  - **버그 수정**: Next.js 16 개발 환경 Data Cache로 인해 `revalidatePath` 호출에도 Notion 원본 미반환 → `getProjects()` fetch에 개발/프로덕션 분기 추가(`cache: 'no-store'` / ISR)

- **Task 007: 기술 스택 필터 및 검색 기능 완성** ✅
  - ✅ `ProjectFilters` — URL 파라미터(`?tech=`) 기반 기술 스택 필터 상태 관리로 교체 — 서버 컴포넌트(`page.tsx`)에서 읽은 `searchParams.tech`를 `selectedTech` 초기값 prop으로 전달하여 새로고침 시 필터 상태 유지
  - ✅ `ProjectSearchBar` — 300ms 디바운스 후 URL 쿼리(`?q=`) 업데이트로 교체 — `router.replace()` 사용 (`router.push()` 사용 시 검색마다 히스토리가 쌓여 뒤로가기 UX 저하)
  - ✅ `app/projects/page.tsx` — `searchParams`를 `Promise<{ tech?: string; q?: string }>` 타입으로 선언하고 `await` 처리 (Next.js 16 필수 패턴)
  - ✅ `getProjects` 함수 — `query` 필터 파라미터 처리 추가 (JS 레벨 post-filter, title·description 대소문자 무관 검색)
  - ✅ 필터 결과 없을 때 `EmptyState` 표시, "전체 보기" 버튼으로 초기화 (`EmptyState.action`에 `href` 옵션 추가)
  - ✅ Playwright MCP를 활용한 필터·검색·URL 상태 관리 E2E 테스트

- **Task 008: 소개(About) 페이지 완성 + 반응형 디자인 & UX 검증** - 대기
  - See: `/tasks/008-about-responsive.md`
  - 소개 페이지 — 정적 자기소개 텍스트 + 기술 스택 카드 최종본 완성
  - 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 전체 페이지 반응형 레이아웃 점검 및 수정
  - 라이트/다크 모드 전환하며 전체 페이지 색상 대비 확인
  - 네비게이션 → 목록 → 상세 → 뒤로가기 사용자 플로우 모바일·데스크톱 각각 검증

---

## Phase 5: BYO Key 포트폴리오 + Vercel Hobby 배포

> **이 Phase는 기존 Phase 4.5(인증 게이트)와 Phase 5(성능 최적화 및 배포)를 대체합니다.**
>
> Phase 4.5의 JWT 인증 게이트 대신, 사용자가 자신의 API Key를 직접 입력하는
> BYO Key(Bring Your Own Key) 구조로 전환합니다. Vercel Hobby 플랜의 60초 제한 안에서
> AI 채우기 파이프라인을 실행하기 위해 SSE 스트리밍 → 1 call = 1 project 폴링 방식으로 전환합니다.
> Notion 자체를 상태 저장소로 활용해 외부 인프라(Redis, KV) 없이 구현합니다.
>
> **배포 아키텍처 변경**: 환경변수 없는 Vercel Hobby 배포.
> NOTION_API_KEY, NOTION_DATABASE_ID, ANTHROPIC_API_KEY는 모두 UI에서 입력 후 httpOnly 쿠키로 관리합니다.

- **Task 011: 레이아웃 재편 + 개발자 프로필 인프라** ✅

  > 개발자 프로필(name, role, focus, location, skills)을 `/admin` 페이지에서 입력하면
  > HeroSection·CodeEditorPanel·AboutPreview에 새로고침 없이 즉시 반영되는 구조.
  > httpOnly 쿠키(`developer-profile`)로 저장, React Context로 전역 공유.

  - `app/(main)/layout.tsx` 라우트 그룹 도입 — `cookies()`로 `developer-profile` 쿠키 읽어 `DeveloperProfileProvider` 초기화, Header·Footer 포함
  - `DeveloperProfileContext.tsx` — `DeveloperProfileProvider`(Client) + `useProfile()` 훅
  - `/admin` 페이지 + `ProfileForm` — 프로필 입력 후 `POST /api/profile` → Context 즉시 반영
  - HeroSection·CodeEditorPanel·AboutPreview에 `useProfile()`로 동적 바인딩

- **Task 012: lib/fill-notion/ 모듈 신규 (배포 번들 포함)** ✅
  - `scripts/lib/` 로직을 기반으로 `lib/fill-notion/` 신규 생성 — 환경변수 직접 읽기 제거, `apiKey` 등을 파라미터로 받는 방식으로 전환(BYO Key API Route에서 호출 가능)
  - `scripts/github-to-notion.ts` — `@/lib/fill-notion/*` 임포트로 교체, `process.env` 키를 `main()`에서 읽어 파라미터로 전달

- **Task 013: lib/notion.ts 키 파라미터화** ✅
  - 전역 싱글톤(`let _notion`) 제거, 4개 함수 모두 `apiKey` 파라미터로 per-request Client 생성
  - `process.env.NOTION_API_KEY` 직접 읽기 전면 제거 — 호출부(서버 컴포넌트)가 쿠키에서 읽어 전달

- **Task 014-A: app/api/auth/setup/route.ts 신규 (POST)** ✅
  - 1단계: Notion Key로 `GET /v1/users` 검증, 2단계: DB ID로 `POST /v1/databases/{id}/query` 검증
  - 검증 성공 시 `notion-api-key`, `notion-db-id`, `anthropic-api-key`, `github-token` httpOnly 쿠키 4개 설정(30일)

- **Task 014-B: app/api/auth/logout/route.ts 신규 (POST)** ✅
  - 5개 쿠키(`notion-api-key`, `notion-db-id`, `anthropic-api-key`, `github-token`, `developer-profile`) 일괄 만료

- **Task 014-C: proxy.ts 신규 (프로젝트 루트)** ✅
  - Next.js 16에서 `middleware.ts` → `proxy.ts`로 파일 컨벤션 변경됨(`export function proxy()`)
  - 공개 경로(통과): `/setup`, `/api/auth/setup`, `/api/auth/logout`
  - 2단계 쿠키 체크로 온보딩 순서 강제:
    - `notion-api-key` 없음 → `/setup` 리다이렉트
    - `notion-api-key` 있음 + `developer-profile` 없음 + `/admin` 이외 경로 → `/admin` 리다이렉트
  - 두 쿠키 모두 있음 + `/setup`·`/admin` 직접 접근 → `/` 리다이렉트

- **Task 015: app/setup/page.tsx 신규** ✅
  - API 키 입력 전체화면 카드 — `POST /api/auth/setup` 성공 시 `/admin`으로 이동
  - `/setup` → `/admin` → `/` 온보딩 3단계 흐름 완성

- **Task 016: 페이지 쿠키 연동** ✅
  - 홈·프로젝트 목록·프로젝트 상세 페이지에서 `cookies()`로 `notion-api-key`, `notion-db-id` 읽어 Notion 함수에 전달
  - `cookies()` 호출로 Next.js 동적 렌더링 자동 전환(ISR 비활성화)
  - 상세 페이지: React `cache()`로 동일 요청 내 쿠키 중복 읽기 제거

- **Task 017: 프로젝트 업데이트 API 폴링 방식 전환** ✅
  - `app/api/update-projects/route.ts` 전면 재작성 — SSE·spawn 제거, 폴링 방식(1 call = 1 project)
  - `export const maxDuration = 60`(Vercel Hobby 상한) 안에서 GitHub fetch → Claude 분석 → Notion 업데이트 1건 처리 후 JSON 반환
  - Notion 자체가 상태 저장소: 처리 완료 시 Title 등이 채워지면 `getPendingPages()`에서 자동 제외
  - `UpdateProjectsButton` — SSE reader 루프 → 폴링 루프로 교체, "완료: {title} (남은 N개)" 표시

- **Task 018: Header 로그아웃 버튼 추가** ✅
  - 데스크톱 `[UpdateProjectsButton] [LogoutButton] [ThemeToggle]`, 모바일 Sheet nav 하단 로그아웃 항목
  - **버그 수정**: 로그아웃 후 `developer-profile` 쿠키 미삭제 → `/admin` 온보딩 스킵 문제 → `logout/route.ts`에서 5개 쿠키 일괄 만료로 해결
  - **버그 수정**: `proxy.ts`가 `developer-profile` 미설정 상태에서 `POST /api/profile`을 `/admin`으로 307 리다이렉트 → Route Handler 미실행 → 쿠키 미저장 → `/` 이동이 `/admin`으로 튕김 → 조건에 `&& !pathname.startsWith("/api/")` 예외 추가, `NextResponse.cookies.set()`으로 Set-Cookie 헤더 포함 보장

- **Task 019: 헤더 인라인 프로필 편집 Sheet** ✅
  - 헤더 이름 클릭 → 사이드 Sheet 오픈, `/admin` 이동 없이 프로필 수정 가능
  - `ProfileForm`에 `onSuccess`·`onCancel` props 추가 — Sheet에서 저장 시 닫힘·Context 즉시 반영, `/admin` 온보딩 흐름은 회귀 없음 유지
  - `DeveloperProfileContext`에 `avatarUrl` 추가 — `(main)/layout.tsx`에서 `getOwnerProfile()` 호출 후 주입, Sheet 상단 Notion 아바타 표시

- **Task 020: 메타데이터 완성 및 프로덕션 배포 검증** - 대기
  - 전역 메타데이터 완성: title template `"%s | 문시현 포트폴리오"`, description, OG 이미지 기본값
  - 각 페이지 `generateMetadata` 점검 및 정적 메타데이터 추가
  - Lighthouse 목표: Performance 80점 이상, Accessibility 90점 이상
  - Vercel 배포: 환경변수 등록 **불필요** (키는 UI 입력 후 쿠키 관리), 프로덕션 URL 확인
  - Playwright MCP 프로덕션 E2E 검증:
    - 첫 접속 → `/setup` 리다이렉트 확인
    - 키 입력 → 포트폴리오 로드, 실제 Notion 데이터 표시 확인
    - Notion에 GitHub URL 추가 → 새로고침 버튼 폴링 → 완료 후 카드 추가 확인
    - 로그아웃 → `/setup` 이동, 직접 URL 접속 시 재리다이렉트 확인

---

## 기술 스택 요약

| 구분 | 기술 |
|:---|:---|
| Frontend | Next.js 16 (App Router), TypeScript |
| CMS | Notion API (`@notionhq/client` v5) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Icons | Lucide React, React Icons |
| Deployment | Vercel |
| 자동화 도구 | `@anthropic-ai/sdk` (Claude AI), GitHub REST API, `tsx` (TS 스크립트 실행) |

## 핵심 아키텍처 결정사항

- **Server Component 우선**: 데이터 fetch는 서버 컴포넌트에서 처리. 인터랙션이 필요한 부분만 `"use client"` 분리
- **URL 파라미터 기반 필터 상태 관리**: `useSearchParams` + `useRouter`로 필터/검색 상태를 URL에 반영하여 공유 및 새로고침 대응
- **동적 렌더링**: `cookies()` 호출로 ISR 대신 동적 렌더링 사용. Notion API 응답을 매 요청마다 최신 상태로 반환
- **Notion API 직접 fetch**: SDK v5에서 `databases.query`가 제거됨에 따라 `getProjects()`는 REST API를 `fetch`로 직접 호출(`/v1/databases/{id}/query`). `pages.retrieve`·`blocks.children.list`는 SDK Client 사용
- **BYO Key 쿠키 관리**: NOTION_API_KEY, NOTION_DATABASE_ID, ANTHROPIC_API_KEY는 환경변수 대신 UI 입력 후 httpOnly 쿠키로 관리. 환경변수 없는 Vercel Hobby 배포 가능
- **자동화 스크립트 분리**: `scripts/` 폴더의 GitHub → Notion 자동화 CLI는 배포 앱과 완전히 분리된 로컬 개발 도구. `tsconfig.json`의 `exclude`로 Vercel 빌드 범위에서 제외

## 리스크 및 기술 이슈

| 리스크 | 내용 | 완화 전략 |
|:---|:---|:---|
| Notion `avatar_url` 만료 | `notion.users.list()`가 반환하는 `avatar_url`은 AWS S3 Pre-signed URL로 수 시간 후 만료됨 | `(main)/layout.tsx`에서 매 요청마다 `getOwnerProfile()` 재호출 — 동적 렌더링으로 항상 최신 URL 반영 |
| Notion API rate limit | `getProjectBlocks()` 재귀 호출 시 3 req/sec 제한 초과 가능 | 재귀 호출 사이 350ms 딜레이 적용 |
