# Task 004: 프로젝트 상세 페이지 완성 (BlockRenderer + Notion 블록 렌더링)

## 개요

프로젝트 상세 페이지의 UI 레이아웃을 완성하고 실제 Notion 데이터를 연결합니다.
Notion 페이지 본문 블록을 React 컴포넌트로 변환하는 `BlockRenderer`를 구현하고,
프로젝트 메타 정보(제목, 기간, 기술 스택, 링크)와 본문 블록을 렌더링합니다.
존재하지 않는 ID 접근 시 404 처리 및 SEO 메타데이터도 이 단계에서 완성합니다.

## 관련 파일

- `components/notion/BlockRenderer.tsx` — Notion 블록 → React 컴포넌트 변환기 (신규)
- `app/projects/[id]/page.tsx` — 상세 페이지 (메타 영역 + 본문 + GitHub/Demo 버튼, getProjectById·getProjectBlocks 실제 연결)
- `app/projects/page.tsx` — 프로젝트 카드에 상세 페이지 링크 추가
- `lib/notion.ts` — `getProjectBlocks` 함수 확인 및 필요 시 보완

## 수락 기준 (Acceptance Criteria)

- [ ] `/projects/[id]` 페이지에 메타 정보(제목, 기간, 기술 스택 배지, 카테고리, 상태)가 표시된다
- [ ] `/projects/[id]` 페이지에 본문 영역과 GitHub/Demo 버튼이 표시된다
- [ ] 프로젝트 목록 카드 클릭 시 `/projects/[id]` 상세 페이지로 이동한다
- [ ] `getProjectById(id)`로 가져온 실제 프로젝트 데이터가 헤더 영역에 표시된다 (제목, 설명, 기간, 상태, 카테고리, 기술 스택)
- [ ] GitHub, Demo 링크가 있을 경우 버튼이 활성화되어 외부 링크로 연결된다
- [ ] `getProjectBlocks(id)`로 가져온 Notion 블록이 `BlockRenderer`를 통해 본문 영역에 렌더링된다
- [ ] 지원 블록 타입: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `numbered_list_item`, `code`, `quote`, `divider`
- [ ] 존재하지 않는 ID로 접근 시 Next.js `notFound()`가 호출되어 404 페이지가 표시된다
- [ ] `generateMetadata`에서 실제 프로젝트 제목을 페이지 타이틀 및 OG 태그로 반환한다
- [ ] 본문 영역에 `prose` 스타일이 적용되며 다크 모드에서도 가독성이 유지된다

## 구현 단계

1. `app/projects/[id]/page.tsx` — 메타 영역(제목, 설명, 기간, 기술 스택 배지, 카테고리, 상태), 본문 플레이스홀더, GitHub/Demo 버튼 UI 완성
2. `app/projects/page.tsx` — `ProjectCard`에 `<Link href={/projects/${project.id}}>` 연결
3. `components/notion/BlockRenderer.tsx` 생성 — 블록 타입별 렌더링 로직 구현 (switch문으로 타입 분기)
4. `app/projects/[id]/page.tsx` — `getProjectById`, `getProjectBlocks` 실제 호출로 교체, `BlockRenderer` 렌더링 연결
5. `generateMetadata` — 실제 프로젝트 제목과 설명을 `title`, `description`, `openGraph` 메타데이터로 반환
6. 본문 영역에 `prose prose-neutral dark:prose-invert` 클래스 적용

## 테스트 체크리스트

- [ ] [Playwright MCP] `/projects` navigate → 첫 번째 카드 클릭 → URL이 `/projects/[id]` 형식으로 변경되는지 확인
- [ ] [Playwright MCP] 상세 페이지 navigate → `get_visible_text()` 로 제목·기간·기술 스택 배지가 Notion DB 데이터와 일치하는지 검증
- [ ] [Playwright MCP] 상세 페이지 navigate → `get_visible_html()` 로 `heading`, `paragraph`, `ul/ol`, `code` 블록 렌더링 확인
- [ ] [Playwright MCP] 상세 페이지 GitHub/Demo 버튼의 `href` 속성값이 Notion DB 입력 URL과 일치하는지 검증
- [ ] [Playwright MCP] `/projects/invalid-id` navigate → 404 페이지 표시 확인 및 스크린샷
- [ ] [Playwright MCP] 상세 페이지 navigate → `evaluate(() => document.title)` 실행 → 실제 프로젝트명과 일치하는지 검증
- [ ] [Playwright MCP] 다크 모드 CSS 클래스(`dark`) 주입 후 상세 페이지 스크린샷 → 본문 텍스트 색상 대비 시각 확인

## 변경 사항 요약

(작업 완료 후 작성)
