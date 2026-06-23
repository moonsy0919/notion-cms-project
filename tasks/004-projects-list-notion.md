# Task 003: 프로젝트 목록 페이지 완성 (UI + Notion API 실제 연동)

## 개요

Notion Integration을 발급하고 환경변수를 설정한 뒤,
프로젝트 목록 페이지와 홈 페이지의 UI를 완성하고 실제 Notion DB 데이터를 연결합니다.
`lib/notion.ts`의 `getProjects` 함수를 실제 Notion API 호출로 활성화하며,
API 키는 서버 사이드에만 노출되며 클라이언트 번들에 포함되지 않도록 관리합니다.

## 관련 파일

- `.env.local` — `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수 (Git에 커밋 금지)
- `lib/notion.ts` — `getProjects`, `getProjectById`, `getProjectBlocks` 함수 활성화
- `lib/dummy.ts` — 더미 데이터 (Notion 연동 후 import 제거 대상)
- `app/projects/page.tsx` — `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 조립 + `getProjects()` 실제 호출로 교체
- `app/page.tsx` — Hero 섹션 + 최근 프로젝트 카드 3개 Notion 데이터 연결

## 수락 기준 (Acceptance Criteria)

- [ ] 홈 페이지에 Hero 섹션과 최근 프로젝트 카드 3개가 표시된다
- [ ] `/projects` 페이지에 `ProjectCard` 목록, `ProjectFilters`, `ProjectSearchBar`가 모두 조립되어 표시된다
- [ ] Notion Integration API 키가 발급되고 `.env.local`에 설정된다
- [ ] `.env.local`이 `.gitignore`에 포함되어 있으며 Git에 커밋되지 않는다
- [ ] `NOTION_API_KEY`가 서버 사이드 전용으로만 사용되며 클라이언트 번들에 포함되지 않는다
- [ ] Notion 데이터베이스에 PRD 스펙 컬럼(Title, Description, Category, Tech Stack, Period, Status, Github, Demo)이 구성된다
- [ ] `getProjects()`가 Notion DB에서 프로젝트 목록을 성공적으로 가져온다
- [ ] `/projects` 페이지에 실제 Notion 프로젝트 카드들이 렌더링된다
- [ ] `/` 홈 페이지 최근 프로젝트 섹션에 실제 Notion 데이터 3개가 표시된다
- [ ] Notion API 오류 발생 시 빈 배열을 반환하며 앱이 크래시되지 않는다

## 구현 단계

1. Notion 워크스페이스에서 Integration 생성 및 API 키 발급
2. Notion DB 생성 — PRD 스펙에 맞춰 컬럼 구성 및 샘플 프로젝트 데이터 3개 이상 입력
3. DB를 Integration과 연결 (Notion DB 페이지 > 공유 > Integration 추가)
4. `.env.local` 파일에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 입력 후 `.gitignore` 확인
5. `app/page.tsx` — Hero 섹션 UI 다듬기, 더미 최근 프로젝트 → `getProjects({ limit: 3 })` 실제 호출로 교체
6. `app/projects/page.tsx` — `ProjectCard`·`ProjectFilters`·`ProjectSearchBar` 조립하여 목록 UI 완성, `lib/dummy.ts` 참조를 `getProjects()` 실제 호출로 교체
7. `lib/notion.ts` — `getProjects()` 함수를 실제 Notion API 호출로 활성화
8. 로컬 개발 서버에서 실제 Notion 데이터 표시 확인

## 테스트 체크리스트

- [ ] [Playwright MCP] `/projects` navigate → 프로젝트 카드 목록 렌더링 확인 및 스크린샷 (Notion DB 입력 데이터 표시 여부)
- [ ] [Playwright MCP] `/` navigate → 최근 프로젝트 섹션 스크린샷 → 카드 3개 존재 및 실제 프로젝트명 표시 검증
- [ ] [수동 + Playwright MCP] `.env.local` API 키를 무효 값으로 변경 후 서버 재시작 → `/projects` navigate → 빈 목록 표시 및 앱 크래시 없음 확인
- [ ] [수동 + Playwright MCP] Notion DB 신규 항목 추가 → `/projects` navigate → 새 프로젝트 카드 목록 반영 확인
- [ ] [Playwright MCP] `evaluate()` 실행 → 클라이언트 번들(`window.__NEXT_DATA__`)에 `NOTION_API_KEY` 문자열 미포함 검증

## 변경 사항 요약

(작업 완료 후 작성)
