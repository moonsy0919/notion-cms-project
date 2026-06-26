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

- **Task 001: 프로젝트 기반 구조 설정** ✅ - 완료
  - See: `/tasks/001-project-foundation.md`
  - ✅ 필수 패키지 설치 및 TypeScript 경로 별칭 확인
  - ✅ Notion 관련 공통 타입 정의 (Project, Category, Status, FilterOptions)
  - ✅ Notion 클라이언트 lazy 싱글톤 및 데이터 조회 함수 골격 작성
  - ✅ 루트 레이아웃 재구성 및 Header, Footer 컴포넌트 구현
  - ✅ 홈 페이지 Hero 섹션 및 더미 프로젝트 카드 3개 골격
  - ✅ 프로젝트 목록·상세·소개 페이지 골격 생성 (빈 상태 UI)

---

## Phase 2: 공통 모듈 구축 ✅ 완료

> 왜 이 순서인가? 여러 페이지에서 공유되는 컴포넌트와 더미 데이터를 먼저 확정해야 핵심·추가 기능 개발 시 중복 구현이 없습니다. 이 단계의 결과물(ProjectCard, ProjectFilters 등)은 Phase 3·4 전반에서 재사용됩니다.

- **Task 002: 더미 데이터 및 공통 프로젝트 컴포넌트 구축** ✅ - 완료
  - See: `/tasks/002-dummy-data-components.md`
  - ✅ 더미 프로젝트 5개 정의 (카테고리·기술 스택·상태·기간 다양하게 구성, `lib/dummy.ts`)
  - ✅ `ProjectCard` 컴포넌트 구현 (기술 스택 배지, 카테고리, 상태, 기간 표시)
  - ✅ `app/projects/page.tsx` 내 인라인 `ProjectCard` 코드 제거 후 공통 컴포넌트로 교체
  - ✅ `app/page.tsx` 내 플레이스홀더 카드를 더미 데이터 기반 `ProjectCard`로 교체
  - ✅ `ProjectFilters` 컴포넌트 구현 (기술 스택 필터 버튼 UI — 이 단계에서는 UI 형태만)
  - ✅ `ProjectSearchBar` 컴포넌트 구현 (검색 입력 UI — 이 단계에서는 UI 형태만)
  - ✅ 모든 컴포넌트 다크 모드 색상 대비 확인

---

## Phase 2.5: 홈페이지 UI 리디자인 (코드 에디터 테마) ✅ 완료

> 왜 이 순서인가? Phase 3 Notion 연동 전에 시각적 시스템을 확정해야 데이터를 붙였을 때 디자인 재작업 없이 바로 연결됩니다. 테마·레이아웃이 먼저 확정되면 Phase 3~4의 컴포넌트들이 이 시스템 위에서 자연스럽게 조립됩니다.

- **Task 002-A: 글로벌 다크 테마 및 폰트 시스템 구축** ✅ - 완료
  - ✅ `ThemeProvider` `defaultTheme="dark"` 변경 — 다크를 기본값으로 설정
  - ✅ 기존 ThemeToggle 컴포넌트 및 라이트/다크 전환 기능 **유지**
  - ✅ `globals.css` CSS 변수를 라이트/다크 양쪽 정의
    - 라이트: `--background: #f8fafc`, `--accent: #0d9488`
    - 다크: `--background: #0b1120`, `--accent: #2dd4bf`, `--card: #111827`, `--border: #1e293b`
    - 다크 전용 코드 신택스 토큰: `--syntax-keyword`, `--syntax-string`, `--syntax-comment`, `--syntax-prop`
  - ✅ `next/font`로 JetBrains Mono 로드 → `--font-mono` CSS 변수 등록
  - ✅ 전체 라이트/다크 색상 대비 검증 (WCAG AA 기준)

- **Task 002-B: 네비게이션 개선** ✅ - 완료
  - ✅ 로고 영역: `</>` 코드 아이콘 + 이름 조합으로 변경
  - ✅ 네비게이션 항목 정리: 홈 / 프로젝트 / 소개
  - ✅ 활성 링크 teal 언더라인 인디케이터 (`usePathname` 기반)
  - ✅ 모바일 햄버거 메뉴 구현
  - ✅ ThemeToggle 위치 유지

- **Task 002-C: Hero 섹션 2컬럼 레이아웃 재구현** ✅ - 완료
  - ✅ `components/home/HeroSection.tsx` 신규 — 좌우 2컬럼 레이아웃
  - ✅ `components/home/ProfileAvatar.tsx` 신규 — Notion 프로필 사진 컴포넌트
  - ✅ 좌측 (45%): `<Hello>` 태그 레이블, 이름 teal 하이라이트, `{역할}` 중괄호 스타일, 소셜 아이콘 행(GitHub·LinkedIn), CTA 버튼 1개("프로젝트 보기")
  - ✅ 우측 (55%): ProfileAvatar(원형 96px, teal ring) + CodeEditorPanel(Task 002-D) 수직 배치
  - ✅ ProfileAvatar Phase 2.5: GitHub 아바타 URL 플레이스홀더 사용 / Phase 3: 실제 Notion `avatar_url`로 교체
  - ✅ 모바일: 우측 컬럼 숨김 (`hidden md:flex`)

- **Task 002-D: 코드 에디터 패널 컴포넌트 구현** ✅ - 완료
  - ✅ `components/home/CodeEditorPanel.tsx` 신규
  - ✅ 파일 탭 UI (`start.ts` / `skills.ts`), 라인 번호 + 코드 내용 2컬럼
  - ✅ 기술 스택을 JS 객체 형태로 정적 표현 (`developer` 객체)
  - ✅ 신택스 하이라이트: `<span>` 정적 컬러링 (외부 라이브러리 없음)
    - keyword → teal / string → amber / comment → muted / property → blue
  - ✅ 커서 `|` 깜빡임 CSS 애니메이션 (`@keyframes cursor-blink`, `@layer utilities`)
  - ✅ 코드 라인 글자 단위 타이핑 애니메이션
    - `globals.css`에 `@keyframes clip-typing` 정의 (`clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`, 우→좌 마스크 해제)
    - 모노스페이스 폰트 균등 자폭 특성 + `steps(N, end)` 조합으로 1글자씩 정확하게 타이핑 연출
    - 라인별 `charCount()` × `CHAR_MS(30ms)` = 타이핑 소요 시간, 누적합으로 다음 줄 딜레이 계산
    - `animation-fill-mode: both` 인라인 스타일로 직접 적용
      - `backwards`: 딜레이 중 `from` 키프레임 적용 → 초기 마스킹(비가시) 보장
      - `forwards`: 종료 후 `to` 키프레임 유지 → 타이핑 완료 상태 유지
  - ✅ 탭 전환 시 애니메이션 재실행: `<tbody key={activeTab}>` DOM 재마운트로 리셋

- **Task 002-E: About 홈 프리뷰 섹션** ✅ - 완료
  - ✅ `components/home/AboutPreview.tsx` 신규
  - ✅ `<About>` 태그 스타일 섹션 헤더
  - ✅ 좌측: 짧은 자기소개 바이오 카드 (monospace, dark card)
  - ✅ 우측: 프로필 사진 (`rotate-[-3deg]` 틸트, teal accent border)
  - ✅ 하단: 기술 카테고리 태그 행 (Frontend / Backend / Tools)

- **Task 002-F: 프로젝트 카드 다크 테마 + 스크롤 진입 애니메이션** ✅ - 완료
  - ✅ `components/home/AnimatedProjectsSection.tsx` 신규 (`"use client"`)
  - ✅ 카드 배경 dark variant, 호버 teal 테두리 강조, 섹션 헤더 `<Projects>` 태그 스타일 교체
  - ✅ Intersection Observer 기반 스크롤 진입 감지 (`once: true`)
    - 관찰 대상: `<section>` 전체가 아닌 카드 `.grid` div — IO가 카드 자체가 뷰포트에 진입하는 시점에 발동
    - `threshold: 0.15` — 카드의 15%가 보일 때 발동, 너무 이른 트리거 방지
    - ⚠️ `<section>` 관찰 시 문제: 섹션 헤더가 폴드에 진입하는 순간(scrollY ≈ 57px) 즉시 발동 → 카드가 화면 밖에서 애니메이션 실행 후 종료
  - ✅ 카드 스태거 애니메이션: opacity 0→1, translateY +40px→0, delay 0/150/300ms, duration 600ms ease-out
  - ✅ `app/page.tsx`(Server Component) → `AnimatedProjectsSection`(Client Component)으로 데이터 props 전달
  - ✅ `HeroSection`에 `min-h-screen` 적용 — 뷰포트를 가득 채워 Projects 섹션을 항상 fold 아래로 유지, IO 즉시 발동 방지

---

## Phase 2.6: GitHub → Notion 자동화 스크립트 ✅ 완료

> 왜 이 순서인가? Phase 3에서 프론트엔드가 실제 Notion 데이터를 렌더링하려면 Notion DB에 진짜 프로젝트 데이터가 먼저 있어야 합니다. 이 Phase에서 Notion DB 생성 → Integration 연결 → 스크립트로 데이터 채우기까지 Phase 3 시작 전에 모두 완료합니다. GitHub URL 하나만 입력하면 AI가 나머지 속성과 본문을 자동으로 채워주는 CLI 도구로, 배포되는 앱과 무관한 로컬 개발 보조 도구입니다.

- **Task 003-0: Notion DB 및 Integration 설정** ✅ - 완료
  - ✅ Notion에서 포트폴리오 DB 생성 (PRD 스펙 컬럼 구성: Title, Description, Category, Tech Stack, Period, Status, Github, Demo)
  - ✅ Notion Integration 생성 및 API 키 발급
  - ✅ 생성한 DB에 Integration 연결 ("문시현 포트폴리오" Integration 활성화 확인)
  - ✅ `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 등록
  - ✅ 샘플 페이지 1~2개 수동 생성 (Github URL만 입력, 나머지는 스크립트로 채울 것) — `notion-cms-project`, `claude-nextjs-starters` 2개 확인
  - ✅ 보안 확인: `.env.local`이 `.gitignore`에 등록되어 있는지 확인 (`.env*` 패턴으로 등록됨)
  - ✅ 보안 확인: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `ANTHROPIC_API_KEY` 모두 `NEXT_PUBLIC_` 접두사 없는지 확인 (서버 사이드 전용 — 클라이언트 번들 미포함 보장)
  - ✅ `.env.local`에 `GITHUB_TOKEN` 등록 (미등록 시 GitHub API 60 req/hour 제한 → 배치 모드에서 rate limit 초과 가능)

- **Task 003-A: 환경 설정 및 의존성 구성** ✅ - 완료
  - ✅ `package.json` — `fill-notion` 스크립트 추가, `@anthropic-ai/sdk`, `tsx` 의존성 추가
  - ✅ `tsconfig.json` — `"exclude": ["scripts/**"]` 추가 (Vercel 빌드 격리)
  - ✅ `.env.local` — `ANTHROPIC_API_KEY` 항목 추가

- **Task 003-B: GitHub 데이터 수집 모듈** ✅ - 완료
  - ✅ `scripts/lib/github.ts` 신규 생성
  - ✅ `parseGithubUrl()` — URL에서 owner/repo 추출
  - ✅ `fetchGithubRepoData()` — 메타데이터·README·언어 분포·기여자 수·첫 커밋 날짜 병렬 수집 — `Authorization: Bearer ${GITHUB_TOKEN}` 헤더 포함하여 인증 요청 (인증 시 5,000 req/hour로 제한 완화)

- **Task 003-C: Claude AI 분석 모듈** ✅ - 완료
  - ✅ `scripts/lib/ai-analyzer.ts` 신규 생성
  - ✅ `analyzeRepo()` — `claude-sonnet-4-6`로 포트폴리오 구조화 데이터 + Notion 블록 명세 생성
  - ✅ JSON 스키마 강제 출력, 429 rate limit 지수 백오프

- **Task 003-D: Notion 업데이터 모듈** ✅ - 완료
  - ✅ `scripts/lib/notion-updater.ts` 신규 생성
  - ✅ `getPendingPages()` — Github URL 있음 + 핵심 속성 비어있는 페이지 탐지
  - ✅ `updatePageProperties()` — Title·Description·Category·Tech Stack·Period·Status 업데이트
  - ✅ `appendPageBlocks()` — 본문 블록 변환 및 추가 (100개 청킹)

- **Task 003-E: 메인 CLI 오케스트레이터** ✅ - 완료
  - ✅ `scripts/github-to-notion.ts` 신규 생성
  - ✅ 단일 URL 모드: `npm run fill-notion -- --url https://github.com/owner/repo`
  - ✅ 배치 모드: `npm run fill-notion` — 대기 중인 전체 페이지 순차 처리
  - ✅ 페이지별 `try-catch` 격리, 진행 로그 및 최종 요약 출력

---

## Phase 3: 핵심 기능 구현

> 왜 이 순서인가? 이 사이트의 존재 이유는 Notion 연동 프로젝트 목록과 상세 페이지입니다. Phase 2에서 공통 컴포넌트(카드, 필터 UI)가 완성된 직후, 페이지 단위의 UI 조립과 Notion 연동을 한 번에 수행해 불필요한 더미 데이터 페이지 구현 단계를 생략하고 MVP를 조기에 달성합니다.

- **Task 004: 프로젝트 목록 페이지 완성 (UI + Notion API 실제 연동)** ✅ - 완료
  - See: `/tasks/004-projects-list-notion.md`
  - ✅ 전제: Phase 2.6 완료로 Notion DB·Integration·샘플 데이터가 준비된 상태
  - ✅ `getProjects()` 함수는 이미 REST API fetch로 구현 완료 (`/v1/databases/{id}/query` 직접 호출, ISR `revalidate: 3600` 포함) — `dataSources.query` 미사용
  - ✅ `types/notion.ts`의 `ProjectFilterOptions` 타입에 `limit?: number` 필드 추가
  - ✅ `getProjects` 함수에 `limit` 파라미터 추가 (홈 페이지 최근 3개 호출 — Notion API `page_size` 활용)
  - ✅ 프로젝트 목록 페이지 — `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 조립, 실제 데이터 연결
  - ✅ 홈 페이지 — 최근 프로젝트 카드 3개를 `getProjects({ limit: 3 })` 실제 호출로 연결
  - ✅ `getOwnerProfile()` 함수 추가 (`lib/notion.ts`) — `notion.users.list()`로 `type: "person"` 유저의 `name`·`avatar_url` 반환, `ProfileAvatar` 컴포넌트에 실제 Notion 아바타 URL 전달
  - ✅ API 오류 시 빈 배열 반환 및 앱 크래시 방지
  - ✅ Playwright MCP를 활용한 목록 페이지 및 홈 페이지 실제 데이터 렌더링 E2E 테스트

- **Task 005: 프로젝트 상세 페이지 완성 (BlockRenderer + Notion 블록 렌더링)** - 대기
  - See: `/tasks/005-project-detail-notion.md`
  - `@tailwindcss/typography` 패키지 설치 (`npm install @tailwindcss/typography`)
  - `globals.css`에 `@plugin "@tailwindcss/typography"` 추가 (Tailwind v4 플러그인 등록 방식)
  - `getProjectBlocks` 함수를 재귀 페칭 구조로 교체 (`has_children: true` 블록에 대해 `blocks.children.list` 재귀 호출, 결과를 `block.children`에 병합하여 완전한 블록 트리 반환) — 재귀 호출 간 Notion API rate limit(3 req/sec) 대응을 위해 호출 사이에 350ms 딜레이 적용
  - `components/notion/BlockRenderer.tsx` 구현 (paragraph, heading 1~3, bulleted/numbered list, code, quote, divider) — `block.children` 존재 시 자기 자신을 재귀 호출하여 중첩 목록·토글 등 완전 렌더링 지원
  - `getProjectById`, `getProjectBlocks` 실제 API 호출 연결
  - 실제 프로젝트 메타 정보(제목, 기간, 기술 스택, 링크) 렌더링
  - `generateMetadata` — 실제 프로젝트 제목·설명으로 OG 태그 생성
  - 존재하지 않는 ID 접근 시 `notFound()` 호출 (404 처리)
  - 본문 영역 `prose prose-neutral dark:prose-invert` 스타일 적용
  - Playwright MCP를 활용한 상세 페이지 렌더링·404 처리·OG 태그 E2E 테스트

---

## Phase 4: 추가 기능 구현

> 왜 이 순서인가? 핵심 기능(Notion 연동 목록·상세)이 동작하는 상태에서 UX를 향상시키는 부가 기능을 추가합니다. 필터·검색이 없어도 포트폴리오 자체는 완성된 상태이므로 MVP 이후에 배치합니다. 반응형 최종 검증도 기능이 모두 갖춰진 이 시점에 수행해 검증 범위를 한 번에 확정합니다.

- **Task 006: 기술 스택 필터 및 검색 기능 완성** - 대기
  - See: `/tasks/006-filter-and-search.md`
  - `ProjectFilters` — URL 파라미터(`?tech=`) 기반 기술 스택 필터 상태 관리로 교체 — 서버 컴포넌트(`page.tsx`)에서 읽은 `searchParams.tech`를 `selectedTech` 초기값 prop으로 전달하여 새로고침 시 필터 상태 유지
  - `ProjectSearchBar` — 300ms 디바운스 후 URL 쿼리(`?q=`) 업데이트로 교체 — `router.replace()` 사용 (`router.push()` 사용 시 검색마다 히스토리가 쌓여 뒤로가기 UX 저하)
  - `app/projects/page.tsx` — `searchParams`를 `Promise<{ tech?: string; q?: string }>` 타입으로 선언하고 `await` 처리 (Next.js 16 필수 패턴)
  - 프로젝트 목록 페이지 — `searchParams`로 서버 사이드 필터·검색 옵션 전달
  - `getProjects` 함수 — `query`, `tech` 필터 파라미터 처리 추가
  - 필터 결과 없을 때 `EmptyState` 표시, "전체" 버튼으로 초기화
  - Playwright MCP를 활용한 필터·검색·URL 상태 관리 E2E 테스트

- **Task 007: 소개(About) 페이지 완성 + 반응형 디자인 & UX 검증** - 대기
  - See: `/tasks/007-about-responsive.md`
  - 소개 페이지 — 정적 자기소개 텍스트 + 기술 스택 카드 최종본 완성
  - 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 전체 페이지 반응형 레이아웃 점검 및 수정
  - 라이트/다크 모드 전환하며 전체 페이지 색상 대비 확인
  - 네비게이션 → 목록 → 상세 → 뒤로가기 사용자 플로우 모바일·데스크톱 각각 검증

---

## Phase 5: 성능 최적화 및 배포

> 왜 이 순서인가? 기능이 모두 확정된 후에야 캐싱·SEO 최적화가 의미 있습니다. 기능이 변경되면 최적화 결과가 무효화되므로 모든 기능 완결 후 마지막에 배치합니다.

- **Task 008: 성능 최적화 및 Vercel 배포** - 대기
  - See: `/tasks/008-performance-and-deployment.md`
  - Notion API 응답 ISR 캐싱 적용 (`revalidate: 3600` 또는 `unstable_cache`)
  - 전역 메타데이터 완성 (title template, description, OG 이미지)
  - 각 페이지 `generateMetadata` 함수 완성
  - Lighthouse 기준 Performance 80점 이상, Accessibility 90점 이상 목표
  - Vercel 프로젝트 연결, 환경변수 등록 및 프로덕션 배포 검증
  - Playwright MCP를 활용한 프로덕션 환경 전체 플로우 E2E 검증

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
- **ISR 캐싱**: Notion API 응답을 일정 시간 캐싱하여 렌더링 성능 확보 및 API 호출 횟수 절감
- **Notion API 직접 fetch**: SDK v5에서 `databases.query`가 제거됨에 따라 `getProjects()`는 REST API를 `fetch`로 직접 호출 (`/v1/databases/{id}/query`). `pages.retrieve`·`blocks.children.list`는 SDK Client 계속 사용 (Lazy 싱글톤 유지)
- **환경변수 보안**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`는 서버 사이드 전용으로 클라이언트 번들에 포함되지 않도록 관리. `.env.local`은 `.gitignore`에 등록하여 Git에 커밋되지 않도록 방지
- **확장성**: 향후 `About` 페이지 데이터, 이력/타임라인 등 Notion DB 추가 연동이 가능하도록 `lib/notion.ts`의 함수 구조를 범용적으로 설계
- **자동화 스크립트 분리**: `scripts/` 폴더의 GitHub → Notion 자동화 CLI는 배포 앱과 완전히 분리된 로컬 개발 도구. `tsconfig.json`의 `exclude`로 Vercel 빌드 범위에서 제외. `ANTHROPIC_API_KEY`는 로컬 `.env.local` 전용이며 Vercel 환경변수에 등록하지 않음

## 리스크 및 기술 이슈

| 리스크 | 내용 | 완화 전략 |
|:---|:---|:---|
| `@notionhq/client` v5 API 변경 | SDK v5에서 `databases.query`가 제거됨. `dataSources.query`는 Notion의 별도 Data Sources 기능 전용으로 일반 DB에 작동하지 않음 (실제 검증 완료) | `getProjects()`는 REST API `fetch`로 `/v1/databases/{id}/query` 직접 호출. SDK 메서드 불필요 |
| 인라인 컴포넌트 중복 | Task 002 작업 시 `app/projects/page.tsx`의 기존 인라인 `ProjectCard` 코드를 제거하지 않으면 컴포넌트 충돌 발생 | Task 002 수락 기준에 인라인 코드 제거 항목 명시. 작업 완료 후 인라인 코드 잔존 여부 확인 필수 |
| 환경변수 클라이언트 노출 | `NOTION_API_KEY`가 `NEXT_PUBLIC_` 접두사 없이 서버 사이드에서만 사용되어야 함. Vercel 배포 시 환경변수 설정 오류 가능 | Task 004·008에서 클라이언트 번들 포함 여부 DevTools 확인 및 Playwright MCP 검증 항목 포함 |
| Notion `avatar_url` 만료 | `notion.users.list()`가 반환하는 `avatar_url`은 AWS S3 Pre-signed URL로 수 시간 후 만료됨 | Phase 5의 ISR `revalidate: 3600`으로 1시간마다 페이지 재생성 → URL 만료 전 갱신 보장 |
| Notion 중첩 블록 누락 | `getProjectBlocks`가 최상위 블록만 페칭 — `has_children: true` 블록(중첩 목록, 토글 등)의 하위 내용이 렌더링에서 누락될 수 있음 | Task 005에서 `getProjectBlocks`를 재귀 구조로 교체, `BlockRenderer`도 재귀 렌더링 지원 |
