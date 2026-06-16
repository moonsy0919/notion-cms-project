# Task 002: 더미 데이터 및 공통 프로젝트 컴포넌트 구축

## 개요

실제 Notion API 연동 없이 사용할 하드코딩된 더미 데이터를 정의하고,
프로젝트 목록/상세 화면 전반에서 공통으로 사용될 UI 컴포넌트를 구현합니다.
`lib/dummy.ts`에 `Project` 타입을 준수하는 더미 프로젝트 5개를 정의하고,
`ProjectCard`, `ProjectFilters`, `ProjectSearchBar` 컴포넌트를 shadcn/ui 기반으로 구현합니다.
필터 버튼과 검색 바는 이 단계에서 UI 형태만 완성하며 실제 동작은 Phase 4에서 구현합니다.

## 관련 파일

- `lib/dummy.ts` — 더미 프로젝트 데이터 정의 (신규)
- `components/projects/ProjectCard.tsx` — 프로젝트 카드 컴포넌트 (신규)
- `components/projects/ProjectFilters.tsx` — 기술 스택 필터 버튼 UI (신규)
- `components/projects/ProjectSearchBar.tsx` — 검색 입력 UI (신규)

## 수락 기준 (Acceptance Criteria)

- [ ] `lib/dummy.ts`에 `Project` 타입을 준수하는 더미 프로젝트 5개가 정의된다 (다양한 카테고리, 기술 스택, 상태 포함)
- [ ] `ProjectCard` 컴포넌트가 제목, 설명, 기술 스택 배지, 카테고리, 상태, 기간을 표시한다
- [ ] `ProjectFilters` 컴포넌트가 더미 기술 스택 목록을 버튼으로 렌더링한다 (실제 필터 동작 없이 UI 형태만)
- [ ] `ProjectSearchBar` 컴포넌트가 검색 입력 UI를 제공한다 (로컬 상태만 관리, 실제 검색 동작 없음)
- [ ] 모든 컴포넌트가 shadcn/ui 기반으로 구현된다
- [ ] 모든 컴포넌트가 다크 모드에서 올바른 색상으로 표시된다

## 구현 단계

1. `lib/dummy.ts` 생성 — `Project` 타입을 준수하는 더미 데이터 5개 정의 (다양한 카테고리, 기술 스택, 상태, GitHub/Demo URL 포함)
2. `components/projects/` 디렉토리 생성
3. `components/projects/ProjectCard.tsx` 생성 — shadcn/ui `Card` 컴포넌트 기반, 기술 스택 `Badge`, 상태 배지, 기간 표시 포함
4. `components/projects/ProjectFilters.tsx` 생성 — 더미 기술 스택 목록을 `Button` 컴포넌트로 렌더링, 클라이언트 컴포넌트, 로컬 선택 상태 관리
5. `components/projects/ProjectSearchBar.tsx` 생성 — shadcn/ui `Input` 기반 검색 UI, 클라이언트 컴포넌트, 로컬 상태만 관리
6. 각 컴포넌트의 다크 모드 색상 대비 확인

## 변경 사항 요약

(작업 완료 후 작성)
