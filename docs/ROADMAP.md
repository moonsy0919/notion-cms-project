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
  - **버그 수정**: 기술 스택 배지 수가 적은 카드에서 GitHub 버튼이 콘텐츠 직후에 위치해 카드 하단에서 떠오르는 문제 → `Card`에 `flex flex-col`, `CardContent`에 `flex-1` 추가로 Footer 항상 카드 최하단 고정

- **Task 008: Architecture 페이지 완성** ✅
  - `/about` 라우트를 Architecture 페이지로 전면 교체
  - Header 네비게이션 "소개" → "Architecture" 변경
  - 시스템 시퀀스 다이어그램 구현 (Mermaid.js, 다크/라이트 테마 자동 적용)
    - 흐름: API Key 입력 → 개발자 정보 입력 → Notion에 GitHub URL 추가 → 업데이트 버튼(폴링) → GitHub fetch → Claude 분석 → Notion DB 업데이트 → Next.js(Vercel) 렌더링
  - 개발 회고 정적 콘텐츠 섹션 (프로젝트 동기 / 기술 선택 이유 / 배운 점)
  - **버그 수정**: 내비게이션 이탈 후 재방문 시 다이어그램 미표시 → `finally` 블록이 `innerHTML`에 삽입된 SVG를 `getElementById`로 재탐색해 제거하던 문제. Mermaid 임시 엘리먼트 정리 순서를 `render()` 직후 · `innerHTML` 설정 전으로 변경해 해결. `resolvedTheme` 미확정 시 렌더링 스킵으로 불필요한 초기 실행 방지

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
  - **버그 수정**: `developer-profile` 쿠키가 부분 구조(`skills` 누락 등)로 저장된 경우 `CodeEditorPanel`에서 `profile.skills.frontend` 접근 시 TypeError 크래시 → `JSON.parse(raw) as DeveloperProfile` 단순 캐스팅 대신 `DEFAULT_PROFILE`과 deep merge(`{ ...DEFAULT_PROFILE, ...parsed, skills: { ...DEFAULT_PROFILE.skills, ...(parsed.skills ?? {}) } }`)로 수정

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
  - **Task 019-A (보완): GitHub 프로필 URL 자동 취득** ✅ — `github-token` 쿠키 → `GET https://api.github.com/user` 병렬 호출 → `html_url`을 `githubUrl`로 Context에 주입. `HeroSection` 아이콘 하드코딩 제거, 토큰 미입력 시 아이콘 미노출

- **Task 019-B: LinkedIn 아이콘 제거** ✅
  - `HeroSection`에서 LinkedIn 아이콘 및 `FaLinkedin` import 제거 — 불필요 소셜 링크 삭제

- **Task 019-C: 온보딩 페이지 회로기판 배경 UI 개선** ✅

  > `/setup`(API 키 입력)·`/admin`(개발자 프로필 입력) 두 온보딩 페이지에 회로기판 테마 배경을 적용합니다.
  > 기존 폼 필드와 기능은 일절 변경하지 않으며, 배경 레이어만 교체합니다.
  > 참조: 순수 검정 배경 + 4개 모서리 PCB 칩 장식 + 회로 트레이스 선 구성

  - ✅ **1단계: `components/ui/circuit-background.tsx` 신규 생성**
    - 배경: `bg-[#080808]` — 라이트/다크 모드 무관 항상 다크 적용
    - `children`을 감싸는 `relative min-h-screen` wrapper 컴포넌트
    - 4개 모서리에 `position: absolute` SVG 장식 배치 (`aria-hidden="true"` 처리)
    - 코너 SVG 구성 요소:
      - 칩 사각형: `rx=4` 둥근 모서리, fill `#0f1117`, stroke `#1e2535`
      - 칩 내부 dot matrix: 3행 × 8열 `2×2px` 사각형 격자, fill `#2a3040`
      - 칩 측면 핀(pin) 라인: 칩 외곽에서 뻗는 짧은 수평 라인 2개
      - 수평 트레이스: 칩에서 내부로 뻗는 1px 선, stroke `#1a2030`
      - 절점 dot: 트레이스 꺾임 지점 `circle r=3`, fill `#2a3545`
      - 수직 트레이스: 절점에서 화면 안쪽으로 이어지는 선
    - top-left SVG를 기준으로 `transform: scaleX(-1)` · `scaleY(-1)` · `scale(-1)` 적용해 나머지 3개 코너 재사용

  - ✅ **2단계: `app/setup/page.tsx` 수정**
    - 기존 래퍼 `<div className="flex min-h-screen items-center justify-center bg-background px-4">` 를 `<CircuitBackground>` 내부로 이동
    - Card 컴포넌트 및 폼 필드 4개(Notion API Key · Notion DB ID · Anthropic API Key · GitHub Token) 변경 없음
    - 에러 Alert · 로딩 버튼 상태 변경 없음

  - ✅ **3단계: `app/(main)/admin/page.tsx` 수정**
    - 기존 최상단 래퍼 `<div className="py-8">` 를 `<CircuitBackground>` 로 교체
    - `Container` · `PageHeader` · `ProfileForm` 내용물 변경 없음
    - ⚠️ 이 시점에 `(main)` 레이아웃의 Header · Footer가 admin에 노출되는 문제가 발생 → Task 019-D에서 수정

  - **검증 기준**
    - ✅ `/setup` 전체 화면 검정 배경 + 4개 코너 회로 장식 표시
    - ✅ `/admin` 콘텐츠 영역 검정 배경 + 코너 회로 장식 표시
    - ✅ 라이트 모드 전환 시에도 두 페이지는 항상 다크 배경 유지
    - ✅ 기존 폼 입력 · 제출 · 에러 표시 기능 회귀 없음
    - ✅ 모바일 뷰포트(375px)에서 코너 장식 카드와 겹침 없음 확인

- **Task 019-D: 온보딩 레이아웃 버그 수정** ✅

  > Task 019-C에서 admin 페이지에 Header·Footer가 노출되는 문제와 CircuitBackground의
  > `min-h-screen`이 Header+Footer 높이를 포함해 뷰포트를 초과하던 레이아웃 버그를 수정합니다.

  - ✅ **`app/(onboarding)/` 라우트 그룹 신설**
    - `app/(onboarding)/layout.tsx` — `DeveloperProfileProvider`만 wrap, Header·Footer 없음
    - `app/(main)/admin/` → `app/(onboarding)/admin/` 이동 — `/admin` URL은 동일 유지
    - `githubUrl=null` 고정 (온보딩 중 GitHub API 호출 불필요)
    - `notion-api-key` 쿠키 존재 시 `getOwnerProfile()` 호출 → `avatarUrl` 취득, 없으면 `null` 폴백

  - ✅ **`CircuitBackground` 높이 로직 수정 (`min-h-screen` → `flex-1`)**
    - `relative min-h-screen` → `relative flex-1 flex flex-col` — 부모 컨테이너 크기를 채우도록 변경
    - 내부 `relative z-10` → `relative z-10 flex-1 flex flex-col` — 높이 체인 전달
    - `/setup`: body(flex-col 100vh) → CircuitBackground(flex-1=100vh) → 카드 수직 중앙 ✓
    - `/admin`: body(flex-col 100vh) → CircuitBackground(flex-1=뷰포트 전체) ✓

  - ✅ **`(main)/layout.tsx` main 태그 수정**
    - `flex-1` → `flex-1 flex flex-col` — 포트폴리오 페이지에서 높이 전달 가능하도록 (기존 레이아웃 회귀 없음)

  - ✅ **`setup/page.tsx` 내부 div 수정**
    - `flex min-h-screen items-center` → `flex flex-1 items-center` — 중복 min-h-screen 제거

  - ✅ **`/admin` 페이지 Notion 아바타 연동**
    - 기존 `avatarUrl={null}` 고정 → `/setup`에서 저장된 `notion-api-key` 쿠키로 `getOwnerProfile()` 조건부 호출
    - `/admin` 진입 시 ProfileForm 상단에 GitHub 기본 아이콘 대신 실제 Notion 프로필 사진 표시
    - API 키 없거나 호출 실패 시 `null` 폴백(기본 아이콘) — 크래시 없음

- **Task 020: 메타데이터 완성 및 프로덕션 배포 검증** - 진행중
  - 전역 메타데이터 완성:
    - ✅ title template 동적 이름 반영 — `app/layout.tsx`를 정적 `metadata`에서 async `generateMetadata`로 전환. `developer-profile` 쿠키의 `name` 필드를 읽어 `title.template: '%s | {name}'`, `title.default: '{name} | 포트폴리오'` 반환. 쿠키 미설정 시 "개발자" 기본값
    - ✅ 각 페이지 `generateMetadata` 수정 — `app/(main)/about/page.tsx`의 `"Architecture | 문시현"` 하드코딩 제거(루트 템플릿 자동 조합), `app/(main)/projects/[id]/page.tsx`의 `"${project.title} | 문시현"` 및 404 fallback 하드코딩 동일 처리
    - ✅ 버그 수정: 프로필 저장 후 타이틀 즉시 반영 — ProfileForm handleSubmit에서 router.refresh() 추가. generateMetadata가 서버 사이드 함수라 클라이언트 쿠키 변경에 반응하지 않아 refresh로 루트 레이아웃 재요청 강제
    - OG 이미지 기본값 설정 - 대기
  - Lighthouse 목표: Performance 80점 이상, Accessibility 90점 이상 - 대기
  - Vercel 배포: 환경변수 등록 **불필요** (키는 UI 입력 후 쿠키 관리), 프로덕션 URL 확인 - 대기
  - Playwright MCP 프로덕션 E2E 검증 - 대기:
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
- **라우트 그룹 분리**: `(main)` — Header·Footer 포함, 포트폴리오 페이지 전용. `(onboarding)` — Header·Footer 없음, DeveloperProfileProvider만 제공, `/setup`·`/admin` 온보딩 페이지 전용. 루트 레이아웃은 ThemeProvider·body flex-col만 담당

## 리스크 및 기술 이슈

| 리스크 | 내용 | 완화 전략 |
|:---|:---|:---|
| Notion `avatar_url` 만료 | `notion.users.list()`가 반환하는 `avatar_url`은 AWS S3 Pre-signed URL로 수 시간 후 만료됨 | `(main)/layout.tsx`에서 매 요청마다 `getOwnerProfile()` 재호출 — 동적 렌더링으로 항상 최신 URL 반영 |
| Notion API rate limit | `getProjectBlocks()` 재귀 호출 시 3 req/sec 제한 초과 가능 | 재귀 호출 사이 350ms 딜레이 적용 |
| `developer-profile` 쿠키 구조 불일치 | 부분 저장·손상된 쿠키 파싱 시 `skills` 등 중첩 프로퍼티 누락으로 런타임 크래시 | `DEFAULT_PROFILE`과 deep merge로 파싱 — 중첩 프로퍼티도 항상 fallback 보장 |
| `CircuitBackground` 뷰포트 초과 | `min-h-screen`(100vh)이 Header+Footer가 있는 레이아웃 안에서 사용되면 총 높이 초과 → 스크롤바 → 레이아웃 좌측 쏠림 | `flex-1 flex flex-col`로 교체 — 부모 컨테이너 남은 공간을 채우는 방식. `(onboarding)` 라우트 그룹 분리로 재발 방지 |
