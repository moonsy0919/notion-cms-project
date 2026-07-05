# ROADMAP: 개인 포트폴리오 웹사이트 (Notion CMS 기반)

> 구조 우선 접근법(Structure-First Approach)을 따릅니다.
> 전체 골격과 공통 모듈을 먼저 완성한 뒤 핵심 기능(Notion 연동)을 완성하고,
> 이후 추가 기능(필터·검색·반응형)을 더한 다음 성능 최적화 및 배포로 마무리합니다.

## 진행 상태 범례

- ✅ 완료: 해당 항목 구현 완료
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
  - 더미 프로젝트 5개(`lib/dummy.ts`), `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 구현 *(Phase 3 Notion 연동 완료 후 `lib/dummy.ts` 삭제)*
  - 기존 인라인 카드 코드를 공통 컴포넌트로 교체

---

## Phase 2.5: 홈페이지 UI 리디자인 (코드 에디터 테마) ✅ 완료

> 왜 이 순서인가? Phase 3 Notion 연동 전에 시각적 시스템을 확정해야 데이터를 붙였을 때 디자인 재작업 없이 바로 연결됩니다. 테마·레이아웃이 먼저 확정되면 Phase 3~4의 컴포넌트들이 이 시스템 위에서 자연스럽게 조립됩니다.

- **Task 002-A: 글로벌 다크 테마 및 폰트 시스템 구축** ✅
  - `globals.css` CSS 변수로 라이트/다크 테마 정의, 다크 전용 신택스 토큰 추가
  - `next/font`로 JetBrains Mono 로드 → `--font-mono` CSS 변수 등록

- **Task 002-B: 네비게이션 개선** ✅
  - `</>` 아이콘 + 이름 로고, 활성 링크 teal 언더라인(`usePathname` 기반), 모바일 햄버거 메뉴 구현
  - **버그 수정**: 와이드 화면(1280px+)에서 헤더·푸터 양 사이드 빈 영역 — `Header`·`Footer`의 `Container`에 `className="max-w-none"` 추가로 너비 제한 해제. 페이지 본문 `Container`(`max-w-7xl`)는 유지

- **Task 002-C: Hero 섹션 2컬럼 레이아웃 재구현** ✅
  - `HeroSection.tsx` 신규 — 좌(소개·CTA)·우(아바타+코드 에디터) 2컬럼, 모바일 우측 컬럼 숨김

- **Task 002-D: 코드 에디터 패널 컴포넌트 구현** ✅
  - `CodeEditorPanel.tsx` 신규 — 파일 탭, 라인 번호, 신택스 하이라이트(외부 라이브러리 없음)
  - 타이핑 애니메이션: `clip-path: inset(0 100% 0 0 → 0 0% 0 0)` + `steps(N, end)`로 글자 단위 마스크 해제. `animation-fill-mode: both`로 딜레이 중 마스킹·완료 상태 유지 보장
  - 탭 전환 시 `<tbody key={activeTab}>` DOM 재마운트로 애니메이션 재실행

- **Task 002-E: About 홈 프리뷰 섹션** ✅
  - `AboutPreview.tsx` 신규 — 바이오 카드, 프로필 사진, 기술 카테고리 태그 행

- **Task 002-F: 프로젝트 카드 다크 테마 + 스크롤 진입 애니메이션** ✅
  - `AnimatedProjectsSection.tsx` 신규 — Intersection Observer 기반 카드 스태거 애니메이션 (`threshold: 0.15`)
  - 관찰 대상을 `<section>` 대신 카드 `.grid` div로 설정 — 뷰포트 진입 즉시 발동 방지
  - `HeroSection`에 `min-h-screen` 적용 — 프로젝트 섹션을 항상 fold 아래로 유지

---

## Phase 2.6: GitHub → Notion 자동화 스크립트 ✅ 완료

> 왜 이 순서인가? Phase 3에서 프론트엔드가 실제 Notion 데이터를 렌더링하려면 Notion DB에 진짜 프로젝트 데이터가 먼저 있어야 합니다. GitHub URL 하나만 입력하면 AI가 나머지 속성과 본문을 자동으로 채워주는 CLI 도구로, 배포되는 앱과 무관한 로컬 개발 보조 도구입니다.

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

## Phase 4: 추가 기능 구현 ✅ 완료

> 왜 이 순서인가? 핵심 기능(Notion 연동 목록·상세)이 동작하는 상태에서 UX를 향상시키는 부가 기능을 추가합니다. 필터·검색이 없어도 포트폴리오 자체는 완성된 상태이므로 MVP 이후에 배치합니다.

- **Task 006: 개발용 프로젝트 업데이트 버튼 구현** ✅ *(Phase 5에서 폴링 방식으로 전면 재작성됨 — Task 017 참고)*
  - 헤더 우상단 새로고침 버튼 → SSE 스트리밍 방식으로 초기 구현
  - `next.config.ts` 이미지 허용 호스트 추가, `public/github-placeholder.png` 아바타 폴백 로컬화, 개발 환경 `cache: 'no-store'` 분기 적용

- **Task 007: 기술 스택 필터 및 검색 기능 완성** ✅
  - `ProjectFilters` — URL 파라미터(`?tech=`) 기반 필터, `searchParams.tech` prop으로 새로고침 시 상태 유지
  - `ProjectSearchBar` — 300ms 디바운스 후 URL 쿼리(`?q=`) 업데이트, `router.replace()` 사용 (히스토리 누적 방지)
  - `app/projects/page.tsx` — `searchParams`를 `Promise<{ tech?: string; q?: string }>` 타입으로 선언 + `await` (Next.js 16 필수)
  - `getProjects()` — `query` 파라미터 JS 레벨 post-filter, title·description 대소문자 무관 검색
  - 필터 결과 없을 때 `EmptyState` + "전체 보기" 버튼, Playwright E2E 검증
  - **버그 수정**: 기술 스택 배지 수가 적은 카드에서 GitHub 버튼 떠오름 → `Card`에 `flex flex-col`, `CardContent`에 `flex-1`

- **Task 008: Architecture 페이지 완성** ✅
  - `/about` 라우트를 Architecture 페이지로 전면 교체, Header 네비게이션 "소개" → "Architecture" 변경
  - 시스템 시퀀스 다이어그램 구현 (Mermaid.js, 다크/라이트 테마 자동 적용)
  - 개발 회고 정적 콘텐츠 섹션 (프로젝트 동기 / 기술 선택 이유 / 배운 점)
  - **버그 수정**: 내비게이션 이탈 후 재방문 시 다이어그램 미표시 → Mermaid 임시 엘리먼트 정리 순서를 `render()` 직후·`innerHTML` 설정 전으로 변경, `resolvedTheme` 미확정 시 렌더링 스킵

---

## Phase 5: BYO Key 포트폴리오 + Vercel Hobby 배포 ✅ 완료

> Phase 4.5의 JWT 인증 게이트 대신 BYO Key(Bring Your Own Key) 구조로 전환합니다.
> Vercel Hobby 플랜 60초 제한 안에서 AI 채우기 파이프라인을 실행하기 위해 SSE → 폴링 방식으로 전환합니다.
> Notion 자체를 상태 저장소로 활용해 외부 인프라(Redis, KV) 없이 구현합니다.
>
> **배포 아키텍처**: 환경변수 없는 Vercel Hobby 배포. 모든 API 키는 UI 입력 후 httpOnly 쿠키로 관리합니다.

- **Task 011: 레이아웃 재편 + 개발자 프로필 인프라** ✅
  - `app/(main)/layout.tsx` 라우트 그룹 도입 — `cookies()`로 `developer-profile` 쿠키 읽어 `DeveloperProfileProvider` 초기화, Header·Footer 포함
  - `DeveloperProfileContext.tsx` — `DeveloperProfileProvider`(Client) + `useProfile()` 훅
  - `/admin` 페이지 + `ProfileForm` — 프로필 입력 후 `POST /api/profile` → Context 즉시 반영
  - HeroSection·CodeEditorPanel·AboutPreview에 `useProfile()`로 동적 바인딩
  - **버그 수정**: `developer-profile` 쿠키 부분 구조 파싱 시 `skills` 누락으로 TypeError → `DEFAULT_PROFILE`과 deep merge로 수정

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
  - **버그 수정**: `proxy.ts`가 `developer-profile` 미설정 상태에서 `POST /api/profile`을 `/admin`으로 307 리다이렉트 → 조건에 `&& !pathname.startsWith("/api/")` 예외 추가

- **Task 019: 헤더 인라인 프로필 편집 Sheet** ✅
  - 헤더 이름 클릭 → 사이드 Sheet 오픈, `/admin` 이동 없이 프로필 수정 가능
  - `ProfileForm`에 `onSuccess`·`onCancel` props 추가 — Sheet에서 저장 시 닫힘·Context 즉시 반영
  - `DeveloperProfileContext`에 `avatarUrl` 추가 — `(main)/layout.tsx`에서 `getOwnerProfile()` 호출 후 주입
  - **Task 019-A (보완): GitHub 프로필 URL 자동 취득** ✅ — `github-token` 쿠키 → `GET /user` 병렬 호출 → `html_url`을 `githubUrl`로 Context에 주입. 토큰 미입력 시 아이콘 미노출
  - **Task 019-B: LinkedIn 아이콘 제거** ✅ — `HeroSection`에서 `FaLinkedin` import 및 아이콘 제거

- **Task 019-C: 온보딩 페이지 회로기판 배경 UI 개선** ✅
  - `components/ui/circuit-background.tsx` 신규 — `bg-[#080808]` 항상 다크, `flex-1 flex flex-col` 높이 체인, 4코너 PCB 칩 SVG 장식 (`aria-hidden`, top-left 기준 scaleX/Y 반전으로 3개 재사용)
  - `app/setup/page.tsx`, `app/(onboarding)/admin/page.tsx`에 `CircuitBackground` 적용
  - ⚠️ `(main)` 레이아웃의 Header·Footer가 admin에 노출되는 문제 발생 → Task 019-D에서 수정
  - **보완**: 배경 전체 PCB 트레이스 패턴 추가 — `BackgroundCircuitSVG`(`viewBox 1440×900`, `preserveAspectRatio slice`) 16개 트레이스·37개 절점으로 화면 전체 커버. 13개 끝점에 teal(`#2a9d8f`) glow 순차 점멸 (`feGaussianBlur` + `@keyframes glowPulse`, 각 끝점 다른 `animation-delay`)

- **Task 019-D: 온보딩 레이아웃 버그 수정** ✅
  - `app/(onboarding)/` 라우트 그룹 신설 — Header·Footer 제거, `DeveloperProfileProvider`만 wrap, `/admin` URL 유지
  - `CircuitBackground` `min-h-screen` → `flex-1 flex flex-col` — Header+Footer 포함 레이아웃에서 뷰포트 초과 방지
  - `(main)/layout.tsx` main 태그 `flex-1 flex flex-col` 추가, `setup/page.tsx` 내부 중복 `min-h-screen` 제거
  - `/admin` 진입 시 `notion-api-key` 쿠키로 `getOwnerProfile()` 조건부 호출 → Notion 아바타 표시, 키 없으면 `null` 폴백
  - **버그 수정**: 오버스크롤 시 흰색 노출 — `<html>`에 `bg-[#080808]` 추가. `body`의 `bg-background`가 정상 스크롤 시 덮고, 오버스크롤 시 `html` 배경(`#080808`)이 노출되어 회로 배경과 시각적 연속성 유지
  - **버그 수정**: admin 폼 영역에 circuit 선 비침 — `ProfileForm` 래퍼에 `bg-card` 불투명 div 추가. shadcn `Input`의 `bg-input`이 다크 모드에서 `oklch(1 0 0 / 15%)` 반투명값이라 SVG 선이 비쳐 보이는 문제. `setup` 페이지의 `<Card>` 패턴과 동일하게 해결

- **Task 020: 메타데이터 완성 및 프로덕션 배포 검증** ✅
  - ✅ 전역 메타데이터 완성:
    - title template 동적 이름 반영 — `developer-profile` 쿠키의 `name` 필드로 `title.template`·`title.default` 동적 생성
    - 각 페이지 하드코딩 제거 — 루트 템플릿 자동 조합으로 교체
    - 버그 수정: 프로필 저장 후 타이틀 즉시 반영 — `ProfileForm` handleSubmit에서 `router.refresh()` 추가
    - OG 이미지 기본값 설정 — `app/opengraph-image.tsx` 신규(CDN 캐시), `app/setup/layout.tsx` 신규, `metadataBase` 설정, PUBLIC_PATHS 등록
  - ✅ Lighthouse 목표: Performance 96 / Accessibility 100 / Best Practices 100 / SEO 100 달성
  - ✅ Vercel 배포 완료 — `https://notion-cms-project-delta-azure.vercel.app` (환경변수 등록 없이 배포)
  - ✅ Playwright MCP 프로덕션 E2E 검증:
    - `/` → `/setup` 리다이렉트, `/projects`·`/about` 직접 접근도 동일 리다이렉트 확인
    - `/opengraph-image` 다크 코드 에디터 테마 이미지 정상 렌더링 확인
    - `/robots.txt` 크롤러 차단 없이 정상 응답 확인
    - 타이틀 `포트폴리오 시작하기 | 개발자` 정상 출력 확인
  - **버그 수정**: Discord 등 SNS 공유 시 OG 이미지 로드 실패 — `metadataBase`를 `VERCEL_URL`(배포별 임시 URL)에서 `VERCEL_PROJECT_PRODUCTION_URL`(프로젝트 고정 도메인)로 교체. 도메인 변경(`notion-cms-project-delta-azure` → `notion-autofolio`) 후 `og:image`가 구 도메인을 가리켜 SNS 스크래퍼의 리다이렉트 미추종으로 이미지 미표시

---

## Phase 6: 성능 개선 및 프로젝트 정리 ✅ 완료

> 정적 분석(Lighthouse·번들 측정·코드 리뷰)으로 식별된 이슈를 우선순위 순으로 수정합니다.
> BYO Key 구조상 `cookies()` 호출에 의한 전면 동적 렌더링은 의도된 설계이므로 수정 대상에서 제외합니다.

- **Task 021-A: Geist 폰트 2개 제거** ✅
  - `app/layout.tsx` — 미사용 `Geist`·`Geist_Mono` import·변수 선언 제거, html className에서 제거

- **Task 021-B: `getOwnerProfile()` 이중 호출 제거** ✅
  - `app/(main)/page.tsx` — 중복 `getOwnerProfile()` 호출 제거, `Promise.all` 단순화
  - `HeroSection`·`AboutPreview` — `avatarUrl` prop 제거, `useProfile().avatarUrl` 직접 소비

- **Task 021-C: `getProjectById()` 이중 호출 제거** ✅
  - `app/(main)/projects/[id]/page.tsx` — `React.cache()`로 래핑한 `getCachedProject`로 교체
  - `generateMetadata`·페이지 컴포넌트가 동일 캐시 함수 공유 → Notion API 1회 실행

- **Task 021-D: `window.location.reload()` → `router.refresh()` 교체** ✅
  - `UpdateProjectsButton` — 전체 페이지 재요청 → 서버 컴포넌트 데이터만 재요청
  - **버그 수정**: `router.refresh()`가 클라이언트 상태 보존으로 `status: "done"` 영구 유지 → `setTimeout`으로 1초 후 `setStatus("idle")` 리셋

- **Task 021-E: 블록 재귀 패칭 병렬화** ✅
  - `lib/notion.ts` — 동일 depth `has_children` 형제 블록들을 단일 350ms 대기 후 `Promise.all` 병렬 패칭 (직렬 `350ms × N` 누적 제거)

- **Task 021-F: `getProjectBlocks` 페이지네이션 지원** ✅
  - `lib/notion.ts` — `fetchAllBlocks()` 헬퍼 추가, `has_more: true`인 동안 350ms 대기 후 `start_cursor`로 반복 요청 (100개 초과 블록 누락 방지)
  - Playwright 검증: `page_size=5` 강제로 32개 블록 7회 분할 패칭 후 전체 렌더링 확인

- **Task 022: 프로젝트 정리 및 문서화** ✅
  - `public/robots.txt` 신규 — 크롤러 전체 허용, `proxy.ts` PUBLIC_PATHS 등록
  - `app/setup/page.tsx` — `<div>` → `<main>` 랜드마크 교체 (Accessibility 100 기여)
  - 미사용 파일 12개 제거 — `public/*.svg` 5개(스타터킷 기본 파일), 루트 개발 스크린샷 7개
  - `README.md` 전면 업데이트 — Lighthouse 배지, 프로젝트 구조 보완, Vercel 배포 방법 교체

---

## Phase 7: UX 개선 ✅ 완료

> Setup 페이지 진입 시 API 키를 왜 입력해야 하는지 이해하기 어려운 문제를 해결합니다.
> BYO Key 구조와 각 키의 역할을 설명하는 전용 페이지를 추가합니다.

- **Task 023: "왜 API key가 필요한가요?" 설명 페이지 구현** ✅
  - ✅ `app/setup/page.tsx` — CardHeader 우측 상단에 `/setup/why` 링크 추가 (`flex justify-between` 레이아웃)
  - ✅ `app/setup/why/page.tsx` 신규 — CircuitBackground 재사용, BYO Key 구조·Notion API Key·Notion DB ID·Anthropic API Key·GitHub Token·보안 안내 6개 섹션, "← 돌아가기" 링크
  - `proxy.ts` 미수정 — 기존 `startsWith("/setup/")` 로직으로 `/setup/why`가 이미 공개 경로로 처리됨

---

## Phase 8: 페이지 제거 ✅ 완료

> `/setup/why`에 프로젝트 구조 설명이 추가되면서 `/about`(Architecture) 페이지의 존재 이유가 없어졌습니다.
> 페이지 본체·전용 컴포넌트·네비게이션 링크·mermaid 패키지를 모두 제거합니다.

- **Task 024: Architecture 페이지 완전 삭제** ✅
  - ✅ `app/(main)/about/page.tsx` 및 `about/` 디렉토리 삭제
  - ✅ `components/architecture/MermaidDiagram.tsx` 및 `architecture/` 디렉토리 삭제
  - ✅ `components/layout/Header.tsx` — navItems에서 Architecture 항목 제거
  - ✅ `components/layout/Footer.tsx` — Architecture 링크 제거
  - ✅ `components/home/AboutPreview.tsx` — "포트폴리오 웹 구조 보기" CTA 버튼 제거
  - ✅ `mermaid` 패키지 제거 (`npm uninstall mermaid`) — about 페이지 전용 의존성, 110개 패키지 정리

---

## Phase 9: AI 분석기 개선 ✅ 완료

> 기존 AI 분석기는 README 앞 4000자 + 메타데이터만 분석했습니다.
> GitHub API를 추가 활용해 전체 파일 구조와 가능한 한 많은 소스 코드를 수집하도록 개선합니다.

- **Task 025: GitHub 파일 트리·소스 코드 수집 및 프롬프트 반영** ✅
  - ✅ `lib/fill-notion/github.ts` — `GithubRepoData`에 `fileTree`, `sourceFiles` 필드 추가
  - ✅ `fetchFileTree()` 신규 — `git/trees?recursive=1`로 전체 파일 경로 수집 (노이즈 제거 후 최대 200개)
  - ✅ `fetchSourceFiles()` 신규 — 중요도 순(의존성 파일 → 설정 파일 → 진입점 → 소스) 정렬 후 토큰 예산(20000자) 내 파일 내용 순차 수집
  - ✅ `lib/fill-notion/ai-analyzer.ts` — `buildPrompt()`에 파일 구조·소스 코드 섹션 추가, `max_tokens` 4096 → 8192 증가
  - 소형 프로젝트: 거의 전체 코드 수집 / 대형 프로젝트: 중요도 순 선택적 수집

---

## Phase 10: 프로젝트 상세 페이지 — 소스 코드 기반 UI 흐름 이미지 자동 생성 ✅ 완료

> AI 자동화 스크립트가 GitHub 소스 코드를 분석해 사용자 흐름 단계 데이터를 생성하고,
> `next/og`의 `ImageResponse`로 프로젝트 고유의 UI 목업 이미지를 동적 생성합니다.
> 프로젝트 상세 페이지에서 텍스트 본문과 함께 흐름 이미지를 표시합니다.

- **Task 026: AI 분석기 — 프로젝트별 UI 흐름 데이터 생성** ✅
  - ✅ `lib/fill-notion/ai-analyzer.ts` — `UiElement`, `UserFlowStep` 타입 추가
  - ✅ `AnalyzedRepoData`에 `userFlow` 필드 추가
  - ✅ `ANALYSIS_TOOL` 스키마에 `userFlow` 배열 추가 — 각 단계의 `uiElements`는 소스 코드에서 직접 추출 지침 포함
  - ✅ `buildPrompt()`에 userFlow 생성 지침 추가 — 라우트 구조·컴포넌트 코드 분석 → 3~6단계로 표현
  - ✅ `lib/fill-notion/notion-updater.ts` — `appendUserFlowBlock()` 신규 — `// __USER_FLOW__` 마커 JSON 코드 블록 append
  - ✅ `scripts/github-to-notion.ts` — [5/5] 단계에 `appendUserFlowBlock()` 호출 추가
  - ✅ `app/api/update-projects/route.ts` — `appendUserFlowBlock()` 호출 추가

- **Task 027: `/api/project-flow/[id]` — UI 흐름 이미지 생성 API 신규** ✅
  - ✅ `app/api/project-flow/[id]/route.tsx` 신규 — Notion 블록에서 `__USER_FLOW__` 마커 파싱 → `ImageResponse` 생성
  - ✅ 단계 카드: teal 번호 뱃지 + 제목 + `uiElements` 렌더링(input/button/list/card/nav/heading)
  - ✅ 최대 4단계 표시, 초과 시 `+N 단계 더` 표시
  - ✅ API 키 없거나 데이터 없으면 fallback 이미지 반환
  - ✅ `proxy.ts` PUBLIC_PATHS에 `/api/project-flow` 추가 — OG 크롤러 리다이렉트 방지

- **Task 028: 프로젝트 상세 페이지 — 흐름 이미지 표시** ✅
  - ✅ `app/(main)/projects/[id]/page.tsx` — 헤더와 구분선 사이에 `// 사용 흐름` 레이블 + 흐름 이미지 삽입
  - ✅ `generateMetadata` OG 이미지를 `/api/project-flow/${project.id}`로 교체 — SNS 공유 시 프로젝트별 이미지 표시
  - **버그 수정**: `BlockRenderer` `case "code"` — `// __USER_FLOW__`로 시작하는 코드 블록을 `null` 반환으로 제외 — Notion 본문에 저장된 JSON 데이터가 페이지 콘텐츠에 그대로 노출되는 문제 수정

---

## Phase 11: Welcome 랜딩 페이지 ✅ 완료

> `/setup` 진입 전에 모던한 애니메이션 랜딩 페이지를 추가합니다.
> 포트폴리오 카드들이 반원호를 그리며 천천히 회전하고, 하단에 "시작하기" CTA 버튼을 배치합니다.
>
> **흐름 변경**: (미인증) → `/welcome` → `/setup` → `/admin` → `/`

- **Task 029: Welcome 랜딩 페이지 구현** ✅
  - ✅ `proxy.ts` — `/welcome` PUBLIC_PATHS 추가, 미인증 리다이렉트 대상 `/setup` → `/welcome` 변경, 인증 완료 시 `/welcome` → `/` 리다이렉트 추가
  - ✅ `app/(onboarding)/welcome/page.tsx` 신규 — 9개 프로젝트 카드 전체 원(radius 340px, 40° 간격 균등 360° 배치), 각 카드 접선 방향 기울기. 브라우저 윈도우 스타일(accent 바 + dots) 카드. "시작하기" CTA → `/setup`
  - ✅ 회전 애니메이션: `requestAnimationFrame` + `useRef`로 DOM 직접 조작 (CSS `@keyframes` 미사용 — Next.js 16 + Turbopack 환경에서 inline style이 keyframe을 참조하지 못하는 문제 우회)
  - **버그 수정**: CSS `@keyframes arc-spin` 방식 → `requestAnimationFrame` 교체 — inline style animation이 Turbopack 환경에서 동작하지 않는 문제 해결
  - **보완**: 초기 7개 카드 240° 반원호 배치 → 9개 카드 360° 전체 원 배치로 변경 — 빈 공간 해소

---

## Phase 12: Vercel 타임아웃 수정 ✅ 완료

> Vercel Hobby 플랜 60초 제한 내에서 `/api/update-projects`가 안정적으로 동작하도록 수정합니다.
> `lib/fill-notion/` 공유 모듈에 선택적 파라미터를 추가해 Vercel 배포와 로컬 CLI가 각각 최적값을 사용하도록 합니다.

- **Task 030: GitHub 수집 토큰 예산 및 Claude max_tokens 파라미터화** ✅
  - **원인**: `fetchSourceFiles`가 TOKEN_BUDGET=20,000으로 ~13개 파일을 순차 수집(~6s) + Claude 프롬프트 25,000자로 응답 생성(~40-50s) → 합계 ~55s로 60초 제한 초과
  - ✅ `lib/fill-notion/github.ts` — `fetchSourceFiles`에 `tokenBudget = 20_000` 기본값 파라미터 추가, `fetchGithubRepoData`에 `options?: { tokenBudget?: number }` 추가
  - ✅ `lib/fill-notion/ai-analyzer.ts` — `callClaudeApi`에 `maxTokens = 8_192` 기본값 파라미터 추가, `analyzeRepo`에 `options?: { maxTokens?: number }` 추가
  - ✅ `app/api/update-projects/route.ts` — `tokenBudget: 5_000`, `maxTokens: 4_096` 주입 (Vercel 전용 축소값)
  - `scripts/github-to-notion.ts` 미수정 — 기본값 유지(20,000 / 8,192), 로컬 CLI 품질 저하 없음
  - **예상 개선**: GitHub API 호출 ~13회 → ~4회, 총 소요 시간 ~55s → ~25-30s

- **Task 031: `appendUserFlowBlock` Notion 2000자 제한 수정** ✅
  - **원인**: `JSON.stringify(userFlow, null, 2)` pretty-print로 3000~5000자 생성 → Notion `rich_text[].text.content` 최대 2000자 제한 초과 → API 오류 → 5XX 반환
  - ✅ `lib/fill-notion/notion-updater.ts` — `JSON.stringify(userFlow)` (minified)로 변경 후 2000자 단위 청크 분할, `rich_text` 배열에 다수 요소로 저장
  - `extractUserFlow()`는 기존에 `.join("")`으로 청크를 합치므로 파싱 측 변경 없음

---

## Phase 13: UI 흐름 이미지 기능 제거 ✅ 완료

> Vercel 60초 제한 및 Notion 2000자 제한으로 `/api/project-flow` 이미지 생성이 안정적으로 동작하지 않아 기능 전체를 제거합니다.

- **Task 032: UI 흐름 이미지 관련 코드 전면 제거** ✅
  - ✅ `lib/fill-notion/ai-analyzer.ts` — `UiElement`·`UserFlowStep` 인터페이스 삭제, `AnalyzedRepoData.userFlow` 필드 삭제, `ANALYSIS_TOOL` 스키마에서 `userFlow` 프로퍼티·required 항목 삭제, `buildPrompt()` userFlow 생성 지침 삭제
  - ✅ `lib/fill-notion/notion-updater.ts` — `UserFlowStep` import 삭제, `appendUserFlowBlock()` 함수 전체 삭제
  - ✅ `app/api/project-flow/[id]/route.tsx` — 파일 전체 삭제 (이미지 생성 API 라우트)
  - ✅ `app/api/update-projects/route.ts` — `appendUserFlowBlock` import·호출 제거
  - ✅ `scripts/github-to-notion.ts` — `appendUserFlowBlock` import·[5/5] 호출 제거, 단계 표시 [4/4]로 업데이트
  - ✅ `app/(main)/projects/[id]/page.tsx` — "사용 흐름" 섹션 및 `<img>` 제거, OG 이미지를 전역 기본값으로 복원
  - ✅ `components/notion/BlockRenderer.tsx` — `// __USER_FLOW__` 필터 조건 삭제
  - ✅ `proxy.ts` — PUBLIC_PATHS에서 `/api/project-flow` 항목 삭제

---

## Phase 14: 프로젝트 업데이트 진행 상황 바 추가 ✅ 완료

> 새로고침 버튼 클릭 시 퍼센트 기반 진행 상황을 실시간으로 표시합니다.
> 전체 대기 프로젝트 대비 완료 수를 진행률 바로 보여주고, 각 처리 단계(GitHub 수집 → Claude AI 분석 → Notion 저장)를 레이블로 표시합니다.

- **Task 033: `GET /api/update-projects` 엔드포인트 추가** ✅
  - ✅ `app/api/update-projects/route.ts` — `GET` 핸들러 추가, 대기 중인 전체 프로젝트 수 반환 (`{ pending: number }`)
  - ✅ `POST` 응답에 `title` 필드 추가 — `analyzed.title` (한국어 프로젝트 이름)을 포함해 로그에 이름 표시

- **Task 034: `UpdateProjectsButton` 진행 상황 UI 재설계** ✅
  - ✅ `shadcn/ui Progress` 컴포넌트 설치 (`npx shadcn add progress`)
  - ✅ 상태 모델 확장 — `total`, `processed`, `stepIndex`, `completedTitles` 추가
  - ✅ 단계 타이머 로직 — GitHub 수집(3s) → Claude AI 분석(32s) → Notion 저장(8s) 순으로 단계 레이블 자동 전환 (`useRef` 타이머 관리, 프로젝트 완료 시 초기화 후 재시작)
  - ✅ 팝오버 UI 재설계:
    - 전체 진행률 바: `processed / total × 100%` + `N / M (P%)` 숫자 표시
    - 현재 단계 레이블: GitHub(`FaGithub`) · Claude AI(`BrainCircuit`) · Notion(`Database`) 아이콘 + 단계명 + `N/3` 표시
    - 완료된 프로젝트 목록: 처리 완료된 프로젝트 이름 순서대로 표시 (스크롤 지원)
    - 대기 없음 케이스: "대기 중인 프로젝트가 없습니다." 메시지 표시 후 2초 뒤 닫힘

---

## Phase 15: UI/UX 개선 (15-A, 15-B 완료)

> 정적 분석으로 식별된 UI 개선점을 리스크 낮은 순서로 반영합니다. 디자인 시스템(색상·톤) 정리를 먼저 끝내야 이후 컴포넌트 인터랙션 통일 작업에서 재작업이 발생하지 않습니다.

### Phase 15-A: 디자인 시스템 기초 정리 ✅ 완료

- **Task 035: 다크모드 카드/배경 명도 대비 개선** ✅
  - `globals.css` 다크모드 `--card`(`#111827` → `#161f32`), `--popover`·`--sidebar` 동일 값으로 통일 — 카드가 배경(`#0b1120`) 위에서 시각적으로 구분됨
  - Playwright로 `getComputedStyle` 확인: 배경 `rgb(11,17,32)` vs 카드 `rgb(22,31,50)`

- **Task 036: 코드 블록 신택스 톤 통일** ✅
  - `BlockRenderer`의 `code` 케이스에 `bg-card`·`border-border`·`--syntax-prop` 토큰 적용 — `CodeEditorPanel`과 프로젝트 상세 페이지 코드 블록 톤 일치
  - Tailwind Typography(`prose`)의 `pre`/`code` 기본 스타일이 `:where()`로 감싸져 0 specificity이므로 유틸리티 클래스로 정상 오버라이드됨을 확인

### Phase 15-B: 컴포넌트 인터랙션 일관성 확보 ✅ 완료

- **Task 037: `ProjectCard` hover 스타일 내재화** ✅
  - 홈 섹션(`AnimatedProjectsSection`)에서만 주입되던 `hover:border-accent`를 `ProjectCard` 기본 스타일로 이동 — 목록 페이지·홈 페이지 동일 hover 반응 보장
  - Playwright로 hover 전/후 `border-color` 확인: `rgb(30,41,59)` → `rgb(45,212,191)`(accent)

- **Task 038: Header 로고/이름 시각 위계 재조정** ✅
  - `</>` 로고를 `text-sm` → `text-lg`로 확대, 이름 버튼은 `font-semibold` → `text-sm font-medium text-muted-foreground`로 축소 — 로고가 더 명확한 브랜드 요소로 강조됨 (데스크톱·모바일 Sheet 헤더 동일 적용)

- **Task 039: `EmptyState` 아이콘 적용** ✅
  - `ProjectsPage` — 검색 결과 없음(`SearchX`)/프로젝트 없음(`FolderOpen`) 케이스에 각각 아이콘 전달

- **Task 040: `ProjectFilters` 태그 과다 시 처리** ✅
  - 기술 스택 8개 초과 시 `VISIBLE_TECH_LIMIT`로 잘라 보여주고 "+N개 더"/"접기" 토글 버튼 추가
  - Playwright로 실제 프로젝트 데이터(15개 기술 스택)에서 "+8개 더" 버튼 노출 확인

**검증**: `npm run lint`·`npm run check`·`npm run build` 모두 통과. Playwright로 다크/라이트 모드, 카드 hover, 코드 블록, 헤더, EmptyState, 필터 접기를 실제 Notion 데이터로 스크린샷 검증(콘솔 에러 0건).

---

## Phase 16: Setup 페이지 API Key 카드 UI 개편 ✅ 완료

> 기존 `/setup`은 PCB 회로 배경 위에 4개 필드를 한 카드에 몰아넣고 단일 "시작하기" 버튼으로 검증·저장을 한 번에 처리했습니다. Notion·Claude·GitHub를 개별 카드로 분리해 카드별 실시간 검증 피드백을 제공하도록 개편합니다.

- **Task 041: `/api/auth/validate` 신규 — provider별 개별 검증 API** ✅
  - `app/api/auth/setup/route.ts` 삭제, `app/api/auth/validate/route.ts` 신규 — `{ provider: "notion" | "claude" | "github", ... }` discriminated union body
  - Notion: 기존 `GET /v1/users` + `POST /v1/databases/{id}/query` 검증 로직 재사용
  - Claude: `GET https://api.anthropic.com/v1/models` (헤더 `x-api-key`, `anthropic-version: 2023-06-01`) — 토큰 비용 없이 키 유효성만 확인
  - GitHub: `GET https://api.github.com/user` (헤더 `Authorization: token <token>`)
  - provider별 검증 성공 시 해당 쿠키만 즉시 `httpOnly` 설정(기존 `COOKIE_OPTIONS` 재사용, 30일) — 실패 시 쿠키 미설정, `{ valid: false, error }` 400 반환
  - `proxy.ts` `PUBLIC_PATHS`에서 `/api/auth/setup` → `/api/auth/validate` 교체

- **Task 042: `ApiKeyCard` 컴포넌트 신규 — 카드별 검증 UI** ✅
  - `components/setup/ApiKeyCard.tsx` 신규 — provider·필드·안내 링크를 props로 받는 재사용 카드
  - 비밀번호 필드 show/hide 토글(Eye/EyeOff), 검증 버튼 로딩 스피너(Loader2)
  - 테두리 스윕 애니메이션: `globals.css`에 `@property --border-angle` + `@keyframes border-sweep`(conic-gradient 0→360deg) 추가. 검증 완료 시 1회 회전 후 `onAnimationEnd`에서 정적 `border-green-500`(성공)/`border-destructive`(실패)로 고정
  - 카드 우측 상단 모서리에 겹치는 상태 배지(성공: 초록 원 + CheckCircle2, 실패: 빨간 원 + AlertTriangle), 실패 시 카드 하단에 구체적 에러 메시지 표시

- **Task 043: `app/setup/page.tsx` 전면 재작성** ✅
  - `CircuitBackground`(PCB 테마) 제거 — 사이트 기본 `bg-background` 테마를 따르도록 변경(라이트/다크 모두 정상 대응 확인)
  - "왜 API key가 필요한가요?" 링크를 페이지 우측 상단에 `fixed` 고정
  - Notion(2필드: API Key·DB ID) · Claude(1필드: Anthropic API Key) · GitHub(1필드: Token) 3열 그리드 카드 배치
  - 3개 provider 모두 검증 완료 시에만 "계속하기" 버튼 활성화 — 클릭 시 이미 쿠키가 설정된 상태이므로 추가 API 호출 없이 `/admin`으로 이동

- **Task 044: 프로바이더별 API Key 생성 방법 안내 페이지 신규 (빈 페이지)** ✅
  - `app/setup/guide/notion`, `/claude`, `/github` 3개 라우트 신규 — 각 카드의 `[+API Key 생성 방법]` 링크 대상. 현재는 "준비 중입니다" placeholder만 표시
  - `proxy.ts` 수정 불필요 — 기존 `startsWith("/setup/")` 규칙으로 이미 공개 경로 처리됨
  - `/setup/why` 페이지는 이번 범위에서 미변경(기존 `CircuitBackground` 유지)

**검증**: `npm run lint`·`npm run check`·`npm run build` 모두 통과. Playwright로 다크/라이트 모드, 3개 카드 렌더링, GitHub 카드 잘못된 토큰 검증 시 빨간 테두리·경고 배지·에러 메시지, 모바일 뷰포트(375px) 스크린샷 검증(콘솔 에러 0건, 의도된 400 응답 제외).

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
- **라우트 그룹 분리**: `(main)` — Header·Footer 포함, 포트폴리오 페이지 전용. `(onboarding)` — Header·Footer 없음, DeveloperProfileProvider만 제공, `/setup`·`/admin` 온보딩 페이지 전용. 루트 레이아웃은 ThemeProvider·body flex-col만 담당

## 리스크 및 기술 이슈

| 리스크 | 내용 | 완화 전략 |
|:---|:---|:---|
| Notion `avatar_url` 만료 | `notion.users.list()`가 반환하는 `avatar_url`은 AWS S3 Pre-signed URL로 수 시간 후 만료됨 | `(main)/layout.tsx`에서 매 요청마다 `getOwnerProfile()` 재호출 — 동적 렌더링으로 항상 최신 URL 반영 |
| Notion API rate limit | `getProjectBlocks()` 재귀 호출 시 3 req/sec 제한 초과 가능. 100개 초과 페이지네이션 요청도 동일 제한 적용 | 재귀 호출 사이 350ms 딜레이 적용. `fetchAllBlocks()` 페이지 전환 사이에도 350ms 딜레이 적용 (Task 021-F) |
| `developer-profile` 쿠키 구조 불일치 | 부분 저장·손상된 쿠키 파싱 시 `skills` 등 중첩 프로퍼티 누락으로 런타임 크래시 | `DEFAULT_PROFILE`과 deep merge로 파싱 — 중첩 프로퍼티도 항상 fallback 보장 |
| `CircuitBackground` 뷰포트 초과 | `min-h-screen`(100vh)이 Header+Footer가 있는 레이아웃 안에서 사용되면 총 높이 초과 → 스크롤바 → 레이아웃 좌측 쏠림 | `flex-1 flex flex-col`로 교체 — 부모 컨테이너 남은 공간을 채우는 방식. `(onboarding)` 라우트 그룹 분리로 재발 방지 |
| `router.refresh()` 클라이언트 상태 보존 | `window.location.reload()` 대비 클라이언트 컴포넌트 상태가 초기화되지 않음 → `status` 등 UI 상태 리셋 누락 시 팝업·버튼 상태 영구 잔류 | `router.refresh()` 사용 시 상태 리셋(`setStatus` 등)을 `setTimeout` 콜백에 명시적으로 추가 |
