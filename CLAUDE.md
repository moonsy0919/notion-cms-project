# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 명령어

```bash
npm run dev              # 개발 서버 (Turbopack, http://localhost:3000)
npm run build            # 프로덕션 빌드
npm run lint             # ESLint 검사
npm run check            # TypeScript 타입 오류 확인
npm run fill-notion      # GitHub URL → Notion DB 자동 채우기 (로컬 전용)
npm run fill-notion -- --url https://github.com/owner/repo  # 단일 URL 모드
```

## 아키텍처 개요

Next.js 16 App Router 기반의 개인 포트폴리오 사이트입니다. Notion을 CMS로 사용하며, **BYO Key(Bring Your Own Key)** 구조로 동작합니다. 사용자가 `/setup`에서 API 키를 직접 입력하면 httpOnly 쿠키로 저장되고, 이후 모든 서버 컴포넌트에서 쿠키를 읽어 Notion API를 호출합니다. Vercel 환경변수 등록 없이 Vercel Hobby 플랜에 배포 가능합니다.

### 라우트 구조

| 경로 | 설명 |
|---|---|
| `/setup` | API 키 입력 온보딩 — 쿠키 미설정 시 모든 경로에서 리다이렉트 |
| `/admin` | 개발자 프로필 설정 온보딩 — notion-api-key 있고 developer-profile 없을 때 리다이렉트 |
| `/` | 홈 (Hero 섹션 + 최근 프로젝트 3개 + About 프리뷰) |
| `/projects` | 프로젝트 목록 (기술 스택 필터 + 검색) |
| `/projects/[id]` | 프로젝트 상세 (Notion 블록 렌더링) |
| `/about` | Architecture 페이지 (Mermaid 시스템 다이어그램 + 개발 회고) |

### 레이아웃 계층

```
app/layout.tsx                # 루트: ThemeProvider + body flex-col + Toaster만 담당
app/(main)/layout.tsx         # Header·Footer 포함, 포트폴리오 페이지 전용
                              # DeveloperProfileProvider + Notion 아바타 + GitHub URL 주입
app/(onboarding)/layout.tsx   # Header·Footer 없음, DeveloperProfileProvider만
                              # /setup · /admin 온보딩 페이지 전용
```

`proxy.ts`(프로젝트 루트)가 2단계 쿠키 체크로 온보딩 순서를 강제합니다:
- `notion-api-key` 없음 → `/setup` 리다이렉트
- `notion-api-key` 있음 + `developer-profile` 없음 + `/admin` 이외 경로 → `/admin` 리다이렉트
- 두 쿠키 모두 있음 + `/setup`·`/admin` 직접 접근 → `/` 리다이렉트
- `/api/*` 경로는 리다이렉트 예외 처리

### 컴포넌트 계층

```
components/
  ui/           # shadcn/ui (radix-nova 스타일, npx shadcn add로 추가)
                # circuit-background.tsx — 온보딩 전용 PCB 테마 배경 wrapper
  layout/       # Header, Footer, Container
  shared/       # PageHeader, EmptyState, ThemeToggle, UpdateProjectsButton
  home/         # HeroSection, CodeEditorPanel, ProfileAvatar, AboutPreview, AnimatedProjectsSection
  projects/     # ProjectCard, ProjectFilters, ProjectSearchBar
  notion/       # BlockRenderer (Notion 블록 → JSX 재귀 렌더링)
  admin/        # ProfileForm (개발자 프로필 편집 폼)
  architecture/ # MermaidDiagram (다크/라이트 테마 연동 Mermaid 렌더러)
```

### 스타일링

- Tailwind CSS v4 + `tw-animate-css` + `shadcn/tailwind.css`를 `globals.css`에서 import합니다.
- CSS 변수 방식으로 테마 관리. 다크 모드는 `next-themes`가 `<html>`에 `.dark` 클래스를 붙여 처리합니다.
- 클래스 병합은 항상 `cn()` (`lib/utils.ts`)을 사용합니다.
- JetBrains Mono를 `next/font`로 로드, `--font-mono` CSS 변수로 등록합니다.

### 유틸리티, 타입, 컨텍스트

- `lib/notion.ts` — Notion API per-request Client 생성, `getProjects()`, `getProjectById()`, `getProjectBlocks()`, `getOwnerProfile()`. 모든 함수가 `apiKey` 파라미터로 Client를 생성합니다 (전역 싱글톤 없음).
- `lib/fill-notion/` — 배포 번들에 포함되는 AI 채우기 모듈. `github.ts`·`ai-analyzer.ts`·`notion-updater.ts`. `scripts/`와 달리 환경변수 직접 읽기 없이 파라미터로 키를 받습니다.
- `lib/dummy.ts` — 개발용 더미 프로젝트 5개
- `lib/format.ts` — 숫자·통화·퍼센트 포맷 (Intl API, 한국어)
- `lib/date.ts` — 날짜 포맷 (date-fns + 한국어 로케일)
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- `types/notion.ts` — `Project`, `ProjectCategory`, `ProjectStatus`, `ProjectFilterOptions` 타입
- `types/profile.ts` — `DeveloperProfile`, `DEFAULT_PROFILE` 타입
- `types/index.ts` — `NavItem`, `ApiResponse<T>`, `PaginatedResponse<T>` 등 공통 타입
- `contexts/DeveloperProfileContext.tsx` — `DeveloperProfileProvider`(Client) + `useProfile()` 훅. `profile`, `setProfile`, `avatarUrl`, `githubUrl` 제공.

### 스크립트 아키텍처 (`scripts/`)

배포 앱과 완전히 분리된 로컬 전용 CLI 도구입니다. `tsconfig.json`의 `exclude`로 Vercel 빌드 범위에서 제외됩니다.

- `scripts/lib/github.ts` — GitHub REST API 수집 (메타데이터, README, 언어 분포, 기여자 수)
- `scripts/lib/ai-analyzer.ts` — Claude claude-sonnet-4-6 분석, Tool use JSON 강제 출력, 지수 백오프
- `scripts/lib/notion-updater.ts` — 대기 중 페이지 탐지 및 속성/블록 업데이트
- `scripts/github-to-notion.ts` — 메인 CLI 오케스트레이터

## 환경변수

```
# .env.local — 로컬 scripts/ CLI 전용. Vercel 배포에는 불필요.
NOTION_API_KEY          # fill-notion CLI용 (스크립트 전용)
NOTION_DATABASE_ID      # fill-notion CLI용 (스크립트 전용)
GITHUB_TOKEN            # GitHub API 토큰 (스크립트 전용, 선택)
ANTHROPIC_API_KEY       # Claude API 키 (스크립트 전용, Vercel 환경변수에 등록 금지)
```

**실제 앱 키는 UI 입력 후 httpOnly 쿠키로 관리합니다:**
`notion-api-key`, `notion-db-id`, `anthropic-api-key`, `github-token`, `developer-profile`

`NEXT_PUBLIC_` 접두사를 절대 붙이지 마세요 — 클라이언트 번들에 노출됩니다.

## Notion API 주의사항

- `@notionhq/client` v5에서 `databases.query`가 **제거**됨. `dataSources.query`는 일반 DB에 작동하지 않음
- `getProjects()`는 REST API fetch로 `/v1/databases/{id}/query` 직접 호출
- `pages.retrieve`, `blocks.children.list`는 SDK Client 사용 (per-request, 전역 싱글톤 없음)
- 중첩 블록(`has_children: true`)은 재귀 페칭 필요 — 재귀 호출 사이 350ms 딜레이 적용 (rate limit 3 req/sec)
- `avatar_url`은 AWS S3 Pre-signed URL로 수 시간 후 만료됨 — `cookies()` 호출로 동적 렌더링 전환, 매 요청마다 최신 URL 반환

## 주요 패턴

**BYO Key 쿠키 흐름**: `/setup` → `POST /api/auth/setup` 검증 → httpOnly 쿠키 저장 → 서버 컴포넌트에서 `cookies()`로 읽어 Notion 함수에 전달. `cookies()` 호출 자체가 Next.js 동적 렌더링을 강제하므로 ISR 없이 항상 최신 데이터를 반환합니다.

**Server Component 우선**: 데이터 fetch는 서버 컴포넌트에서 처리. 인터랙션이 필요한 부분만 `"use client"` 분리.

**DeveloperProfileContext 패턴**: 서버 레이아웃(`(main)/layout.tsx`, `(onboarding)/layout.tsx`)에서 쿠키를 읽어 `DeveloperProfileProvider`로 초기화 → 클라이언트 컴포넌트에서 `useProfile()`로 소비. `avatarUrl`은 Notion `getOwnerProfile()`로 서버에서 1회 주입, 쿠키에 저장하지 않습니다.

**CircuitBackground 높이 패턴**: `min-h-screen` 대신 `flex-1 flex flex-col` 사용. 부모의 남은 공간을 채우는 방식으로, Header+Footer가 있는 레이아웃 안에서 뷰포트 초과 스크롤 문제를 방지합니다.

**URL 파라미터 기반 필터 상태**: `useSearchParams` + `useRouter`로 필터/검색 상태를 URL에 반영. `router.replace()` 사용 (`router.push()` 쓰면 검색마다 히스토리 누적).

**Next.js 16 필수 패턴**: `searchParams`는 `Promise<{ tech?: string; q?: string }>` 타입으로 선언하고 `await` 처리 필수.

**Hydration 불일치 방지**: 브라우저 전용 값(테마, 미디어 쿼리)을 SSR과 함께 사용할 때:

```tsx
// next-themes: mounted 패턴
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
<Component value={mounted ? value : ""} />

// usehooks-ts: initializeWithValue 옵션
useMediaQuery("(min-width: 768px)", { initializeWithValue: false });
```

### Next.js 버전 주의

이 프로젝트는 **Next.js 16**을 사용합니다. API와 컨벤션이 훈련 데이터와 다를 수 있으므로, 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 확인하세요. `middleware.ts` → `proxy.ts` 컨벤션 변경이 대표적인 예입니다.

---

## 작업 완료 후 필수 체크리스트(필수) 중요!!!!

작업(Task)을 완료한 후에는 반드시 다음 순서로 직접 실행하고 검증해야 합니다.

### 1단계: 코드 품질 검증
- `npm run lint`  — ESLint 오류 0개 확인
- `npm run check` — TypeScript 타입 오류 0개 확인
- `npm run build` — 빌드 오류 없이 성공 확인

### 2단계: 직접 실행 및 브라우저 검증 (필수)
- `npm run dev`로 개발 서버 실행
- 변경된 페이지/기능을 브라우저에서 직접 열어 정상 동작 확인
- 골든 패스(주요 사용 흐름) 직접 클릭하며 검증
- UI 변경 시: 다크/라이트 모드 전환 확인
- 레이아웃 변경 시: 모바일 뷰포트(375px) 확인

### 3단계: ROADMAP 업데이트
- `docs/ROADMAP.md`에서 완료된 항목을 ✅ 상태로 업데이트

### 4단계: 커밋
- `/git:commit` 스킬로 커밋 (이모지 + 컨벤셔널 메시지)
