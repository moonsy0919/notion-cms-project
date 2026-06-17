# Development Guidelines

## 프로젝트 개요

- **목적**: Notion을 CMS로 활용하는 개인 포트폴리오 웹사이트
- **스택**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, `@notionhq/client` v5
- **배포**: Vercel
- **개발 로드맵**: `docs/ROADMAP.md` — 7개 Task, Phase 1 완료 / Phase 2~5 대기 중

---

## 프로젝트 디렉토리 구조

```
app/                          # Next.js App Router 페이지
  layout.tsx                  # 루트 레이아웃 (ThemeProvider → TooltipProvider → Header/main/Footer/Toaster)
  page.tsx                    # 홈 (Hero + 최근 프로젝트 카드 — 현재 플레이스홀더)
  about/page.tsx              # 소개 페이지 (정적)
  projects/page.tsx           # 프로젝트 목록 (인라인 ProjectCard 함수 있음 — Task 002에서 분리 예정)
  projects/[id]/page.tsx      # 프로젝트 상세

components/
  ui/                         # shadcn/ui 원본 (npx shadcn add로만 추가)
  layout/                     # Container, Header, Footer
  shared/                     # 재사용 비즈니스 컴포넌트 (EmptyState, PageHeader, ThemeToggle)
                              # ProjectCard, ProjectFilters, ProjectSearchBar 여기에 추가 예정
  notion/                     # Notion 전용 컴포넌트 (BlockRenderer 여기에 추가 예정)

lib/
  notion.ts                   # Notion 클라이언트 + getProjects / getProjectById / getProjectBlocks
  dummy.ts                    # 더미 데이터 (Task 002에서 생성 예정)
  utils.ts                    # cn() 함수
  format.ts                   # 숫자·통화·퍼센트 포맷
  date.ts                     # 날짜 포맷 (date-fns + 한국어 로케일)

types/
  notion.ts                   # Project, ProjectCategory, ProjectStatus, ProjectFilterOptions
  index.ts                    # NavItem, ApiResponse, PaginatedResponse 등 공통 타입

tasks/                        # 태스크 상세 스펙 파일 (구현 전 반드시 참고)
docs/
  PRD.md                      # 제품 요구사항 문서
  ROADMAP.md                  # 개발 로드맵 (Phase별 Task 목록)
```

---

## @notionhq/client v5 API 규칙 ⚠️

### 절대 규칙 (위반 시 런타임 오류)

- **`databases.query` 사용 금지** — v5에서 제거됨
- **반드시 `dataSources.query` 사용**
- **`data_source_id` 파라미터 사용** — `database_id` 아님

```typescript
// ✅ 올바른 방법
await notion.dataSources.query({
  data_source_id: getDataSourceId(),
  filter: ...,
  sorts: [...],
});

// ❌ 금지 — v5에서 제거됨
await notion.databases.query({ database_id: ... });
```

- `lib/notion.ts`의 현재 구현 패턴을 그대로 유지
- 새 Notion API 호출 추가 시 반드시 `lib/notion.ts` 안에서만 작성

---

## Next.js 16 breaking changes 규칙

### params는 반드시 await

```typescript
// ✅ 올바른 방법 — Next.js 16
interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  ...
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  ...
}

// ❌ 금지 — Next.js 15 이하 방식
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // Promise 해제 없이 직접 접근
}
```

---

## 컴포넌트 배치 규칙

| 컴포넌트 종류 | 위치 | 추가 방법 |
|---|---|---|
| shadcn/ui 원본 | `components/ui/` | `npx shadcn add <name>` 으로만 추가 |
| 레이아웃 컴포넌트 | `components/layout/` | 직접 생성 |
| 재사용 비즈니스 컴포넌트 | `components/shared/` | 직접 생성 |
| Notion 전용 컴포넌트 | `components/notion/` | 직접 생성 |

- `components/ui/` 내 파일을 직접 편집해도 되나, `npx shadcn add` 실행 시 덮어써질 수 있음
- 새 shadcn 컴포넌트 직접 작성 금지 — 반드시 `npx shadcn add <name>` 사용

---

## 멀티파일 동시 수정 규칙

### Task 002: ProjectCard 공통 컴포넌트 생성 시

1. `components/shared/ProjectCard.tsx` 생성
2. **`app/projects/page.tsx`의 인라인 `ProjectCard` 함수 반드시 제거** — 두 파일 동시 수정 필수
3. `app/page.tsx`의 플레이스홀더 `{[1,2,3].map(...)}` 카드도 동시에 교체

```
// 반드시 동시 수정 대상
components/shared/ProjectCard.tsx (신규 생성)
app/projects/page.tsx            (인라인 ProjectCard 함수 제거 + import 교체)
app/page.tsx                     (플레이스홀더 카드 교체)
```

### 새로운 Notion 데이터 타입 추가 시

```
types/notion.ts    (타입 정의 추가)
lib/notion.ts      (파싱 로직 및 API 함수 추가)
```

---

## 환경변수 보안 규칙

- `NOTION_API_KEY`, `NOTION_DATABASE_ID` — **절대 `NEXT_PUBLIC_` 접두사 불가**
- 두 변수는 서버 컴포넌트 및 `lib/notion.ts` 내부에서만 사용
- 클라이언트 컴포넌트(`"use client"`)에서 직접 접근 금지
- `.env.local` 파일은 `.gitignore`에 등록됨 — Git에 커밋 금지
- `.env.local.example`이 존재하므로 변수 키 이름은 이 파일 기준으로 확인

```typescript
// ✅ 올바른 방법 — lib/notion.ts 내부 (서버 전용)
process.env.NOTION_API_KEY

// ❌ 금지
process.env.NEXT_PUBLIC_NOTION_API_KEY
```

---

## 서버 / 클라이언트 컴포넌트 분리 규칙

- **기본값은 서버 컴포넌트** — 데이터 fetch는 서버에서
- `"use client"` 선언은 인터랙션이 반드시 필요한 최소 단위에만 적용
- 필터·검색 상태 관리 컴포넌트만 `"use client"` 적용 (ProjectFilters, ProjectSearchBar)
- `getProjects`, `getProjectById`, `getProjectBlocks` 호출은 서버 컴포넌트에서만

```
// 분리 패턴 예시
app/projects/page.tsx          ← 서버 컴포넌트 (데이터 fetch)
components/shared/ProjectFilters.tsx  ← "use client" (URL 파라미터 조작)
components/shared/ProjectSearchBar.tsx ← "use client" (디바운스 입력)
```

---

## Hydration 불일치 방지 규칙

### next-themes 사용 시

```tsx
// ✅ mounted 패턴 필수
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
<RadioGroup value={mounted ? (theme ?? "") : ""} />
```

### usehooks-ts 사용 시

```tsx
// ✅ initializeWithValue: false 필수
useMediaQuery("(min-width: 768px)", { initializeWithValue: false });
useWindowSize({ initializeWithValue: false });
```

### suppressHydrationWarning

- **`<html>` 태그에만 적용** — `<body>` 및 다른 요소에 적용 금지
- `app/layout.tsx` 참고

---

## 스타일링 규칙

- 클래스 병합은 **반드시 `cn()`** 사용 (`lib/utils.ts` — clsx + tailwind-merge)
- Tailwind CSS v4 사용 — `@apply` 지시어는 v4에서 제한적으로 동작하므로 인라인 클래스 우선
- 테마 색상은 CSS 변수(`--color-*`) 방식 — 하드코딩된 색상 값 사용 금지
- 다크 모드: `dark:` 접두사 Tailwind 클래스 사용 (`.dark` 클래스는 next-themes가 자동 처리)

```tsx
// ✅ 올바른 방법
<div className={cn("base-class", isActive && "active-class", className)} />

// ❌ 금지
<div className={`base-class ${isActive ? "active-class" : ""} ${className}`} />
```

---

## 필터·검색 상태 관리 규칙 (Task 005 기준)

- 필터·검색 상태는 **URL 파라미터 기반**으로 관리
  - 기술 스택 필터: `?tech=Next.js`
  - 검색어: `?q=검색어`
- `useSearchParams` + `useRouter` 조합 사용
- 검색은 300ms 디바운스 후 URL 업데이트
- 서버 컴포넌트에서 `searchParams` prop으로 필터 옵션 수신 후 `getProjects()` 전달

---

## ISR 캐싱 규칙 (Task 007 기준)

- Notion API 응답은 `revalidate: 3600` 또는 `unstable_cache` 적용 (Phase 5에서 구현)
- Phase 3·4 구현 중에는 캐싱 설정 추가 불필요 — 기능 완성 후 Phase 5에서 일괄 적용

---

## 루트 레이아웃 수정 규칙

- `app/layout.tsx` 수정 시 래핑 순서 유지 필수:
  `ThemeProvider` → `TooltipProvider` → `Header` + `<main>` + `Footer` + `Toaster`
- 전역 폰트 변수(`--font-geist-sans`, `--font-geist-mono`)는 `<html>` 태그에 적용

---

## 태스크 파일 참조 규칙

- 각 Task 구현 전 `tasks/` 디렉토리의 해당 파일 반드시 참조
- 수락 기준(AC), 구현 순서, 주의사항이 태스크 파일에 명시됨

| Task 번호 | 파일 | 내용 |
|---|---|---|
| Task 001 | `tasks/001-project-foundation.md` | 프로젝트 기반 구조 (완료) |
| Task 002 | `tasks/002-dummy-data-components.md` | 더미 데이터 + 공통 컴포넌트 |
| Task 003 | `tasks/003-projects-list-notion.md` | 프로젝트 목록 + Notion 연동 |
| Task 004 | `tasks/004-project-detail-notion.md` | 상세 페이지 + BlockRenderer |
| Task 005 | `tasks/005-filter-and-search.md` | 필터·검색 기능 |
| Task 006 | `tasks/006-about-responsive.md` | About 페이지 + 반응형 |
| Task 007 | `tasks/007-performance-and-deployment.md` | 성능 최적화 + 배포 |

---

## AI 의사결정 기준

### 새 컴포넌트 위치 결정

```
Notion API 데이터를 렌더링하는가?
├── YES → components/notion/ (예: BlockRenderer)
└── NO
    ├── 여러 페이지에서 재사용되는가?
    │   ├── YES → components/shared/ (예: ProjectCard, ProjectFilters)
    │   └── NO → 해당 페이지 파일 내 로컬 함수
    └── 레이아웃/구조 역할인가?
        └── YES → components/layout/
```

### 서버/클라이언트 컴포넌트 결정

```
useState, useEffect, onClick, onChange 등 브라우저 API가 필요한가?
├── YES → "use client" 선언
└── NO → 서버 컴포넌트 (기본값)
```

### Notion API 오류 처리

- `getProjects()`: API 오류 시 빈 배열 반환, 앱 크래시 방지
- `getProjectById()`: 존재하지 않는 ID → `notFound()` 호출 (Next.js 404)
- 환경변수 미설정 시: 에러를 throw하되 빌드 타임 오류 방지를 위해 lazy 초기화 유지

---

## 금지 사항

- `databases.query` 사용 — v5에서 제거됨, `dataSources.query` 사용
- `NOTION_API_KEY`에 `NEXT_PUBLIC_` 접두사 사용
- `"use client"` 컴포넌트에서 Notion API 직접 호출
- `suppressHydrationWarning`을 `<html>` 외 요소에 적용
- `components/ui/`에 새 컴포넌트 직접 작성 — `npx shadcn add` 사용
- `app/projects/page.tsx`의 인라인 `ProjectCard`를 유지한 채 `components/shared/ProjectCard.tsx` 생성
- `cn()` 없이 문자열 템플릿으로 Tailwind 클래스 병합
- Next.js 16에서 `params`를 await 없이 직접 구조 분해
- 클라이언트 번들에 포함될 수 있는 위치에서 `process.env.NOTION_API_KEY` 참조
