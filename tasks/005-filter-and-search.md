# Task 005: 기술 스택 필터 및 검색 기능 완성

## 개요

Phase 3에서 UI 골격만 완성된 `ProjectFilters`, `ProjectSearchBar` 컴포넌트에
실제 URL 파라미터 기반 상태 관리와 서버 사이드 필터 로직을 연결합니다.
필터/검색 상태는 URL 쿼리 파라미터(`?tech=Next.js&q=검색어`)로 관리하여
공유 및 새로고침에도 상태가 유지되도록 합니다.
Server Component(데이터 fetch) + Client Component(인터랙션) 분리 패턴을 따릅니다.

## 관련 파일

- `app/projects/page.tsx` — `searchParams` prop을 받아 `getProjects(options)`에 필터/검색 옵션 전달 (서버 컴포넌트)
- `components/projects/ProjectFilters.tsx` — `useRouter`, `useSearchParams` 기반 URL 파라미터 조작으로 교체
- `components/projects/ProjectSearchBar.tsx` — 디바운스 입력 후 URL 쿼리(`?q=`) 업데이트로 교체
- `lib/notion.ts` — `getProjects` 함수에 `query`, `tech` 필터 파라미터 처리 추가

## 수락 기준 (Acceptance Criteria)

- [ ] Notion DB의 전체 기술 스택 목록이 필터 버튼으로 표시된다
- [ ] 기술 스택 버튼 클릭 시 URL이 `?tech=기술명`으로 변경되고 해당 스택 프로젝트만 표시된다
- [ ] 검색창 입력 시 URL이 `?q=검색어`로 변경되고 프로젝트 제목/설명 기준으로 필터링된다
- [ ] 필터와 검색을 동시에 적용할 수 있으며 두 조건이 AND로 작동한다
- [ ] URL을 직접 공유하거나 새로고침해도 동일한 필터/검색 상태가 유지된다
- [ ] 필터 결과가 없을 때 `EmptyState` 컴포넌트가 표시된다
- [ ] "전체" 버튼 클릭 시 `tech`, `q` 쿼리 파라미터가 제거되어 전체 목록으로 초기화된다
- [ ] 검색 입력에 300ms 디바운스가 적용되어 불필요한 URL 업데이트가 방지된다

## 구현 단계

1. `lib/notion.ts` — `getProjects` 함수에 `ProjectFilterOptions`의 `query`, `tech` 필드 처리 로직 추가
2. `app/projects/page.tsx` — `searchParams` prop에서 `tech`, `q` 파라미터를 추출하여 `getProjects(options)`에 전달
3. `components/projects/ProjectFilters.tsx` — 더미 선택 상태를 `useSearchParams` + `useRouter` 기반 URL 파라미터 조작으로 교체
4. `components/projects/ProjectSearchBar.tsx` — 로컬 상태를 `useSearchParams` + `useRouter` 기반으로 교체, 300ms 디바운스 적용
5. 필터 결과가 없는 경우 `EmptyState` 표시 조건 추가
6. "전체" 버튼의 초기화 동작 — `router.push('/projects')`로 쿼리 파라미터 전체 제거

## 테스트 체크리스트

- [ ] "Next.js" 필터 클릭 시 URL이 `?tech=Next.js`로 변경되고 해당 프로젝트만 표시되는지 확인
- [ ] 검색창에 키워드 입력 시 URL이 `?q=키워드`로 변경되고 관련 프로젝트만 표시되는지 확인
- [ ] 필터 + 검색 동시 적용 시 두 조건이 AND로 작동하는지 확인 (`?tech=Next.js&q=포트폴리오`)
- [ ] 필터 결과가 없을 때 `EmptyState`가 표시되는지 확인
- [ ] URL에 `?tech=React`를 직접 입력하여 해당 필터가 적용된 상태로 페이지가 로드되는지 확인
- [ ] 브라우저 뒤로가기/앞으로가기 시 필터 상태가 올바르게 복원되는지 확인
- [ ] "전체" 버튼 클릭 시 URL에서 `tech`, `q` 파라미터가 제거되고 전체 목록이 표시되는지 확인
- [ ] 모바일 화면(375px)에서 필터 버튼이 가로 스크롤 또는 줄바꿈으로 올바르게 표시되는지 확인

## 변경 사항 요약

(작업 완료 후 작성)
