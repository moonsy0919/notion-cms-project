# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 (Turbopack, http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

테스트 러너는 없습니다.

## 아키텍처 개요

Next.js 16 App Router 기반의 컴포넌트 스타터킷입니다. 실제 서비스를 위한 앱이 아니라, 패턴과 컴포넌트를 시연하기 위한 예제 모음입니다.

### 라우트 구조

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 |
| `/components` | shadcn/ui 컴포넌트 쇼케이스 |
| `/examples/*` | 기능별 예제 (forms, hooks, layouts, settings, data-fetching) |
| `/dashboard/*` | 사이드바 레이아웃을 사용하는 대시보드 영역 |

### 레이아웃 계층

- **루트 레이아웃** (`app/layout.tsx`): `ThemeProvider` → `TooltipProvider` → `Header` + `<main>` + `Footer` + `Toaster` 순서로 감쌉니다. `suppressHydrationWarning`은 `<html>`에만 적용합니다.
- **대시보드 레이아웃** (`app/dashboard/layout.tsx`): `Sidebar` + 콘텐츠 영역으로 구성되는 중첩 레이아웃입니다.

### 컴포넌트 계층

```
components/
  ui/          # shadcn/ui 원본 (직접 수정 가능, npx shadcn add로 추가)
  layout/      # Header, Footer, Container, Sidebar
  shared/      # 재사용 비즈니스 컴포넌트 (PageHeader, EmptyState, DataTable, ThemeToggle, QuickStartDialog)
```

`components/ui/`는 `radix-nova` 스타일로 설치된 shadcn/ui입니다. 새 컴포넌트는 `npx shadcn add <name>`으로 추가합니다.

### 스타일링

- Tailwind CSS v4 + `tw-animate-css` + `shadcn/tailwind.css`를 `globals.css`에서 import합니다.
- CSS 변수 방식(`--color-*`)으로 테마를 관리합니다. 다크 모드는 `next-themes`가 `<html>`에 `.dark` 클래스를 붙여 처리합니다.
- 클래스 병합은 항상 `cn()` (`lib/utils.ts`)을 사용합니다.

### 유틸리티

- `lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- `lib/format.ts` — 숫자·통화·퍼센트 포맷 (Intl API, 한국어 기본값)
- `lib/date.ts` — 날짜 포맷 (date-fns + 한국어 로케일)
- `types/index.ts` — `NavItem`, `ApiResponse<T>`, `PaginatedResponse<T>`, `SortState` 등 공통 타입

### 주요 패턴

**Hydration 불일치 방지**: 브라우저 전용 값(테마, 미디어 쿼리, 창 크기)을 SSR과 함께 사용할 때는 반드시 처리가 필요합니다.

```tsx
// next-themes: mounted 패턴
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
<RadioGroup value={mounted ? (theme ?? "") : ""} />

// usehooks-ts: initializeWithValue 옵션
useMediaQuery("(min-width: 768px)", { initializeWithValue: false });
useWindowSize({ initializeWithValue: false });
```

**Server / Client 컴포넌트 분리**: `data-fetching` 예제처럼 Server Component에서 데이터를 fetch하고, 인터랙티브한 부분만 `"use client"` 파일로 분리합니다.

**DataTable**: `components/shared/DataTable.tsx`는 제네릭 `<T>`를 받는 범용 테이블로, `columns` 정의에 `render` 함수를 넣어 커스텀 셀 렌더링, 정렬, 페이지네이션을 지원합니다.

### Next.js 버전 주의

이 프로젝트는 **Next.js 16**을 사용합니다. API와 컨벤션이 훈련 데이터와 다를 수 있으므로, 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 확인하세요.
