---
name: project-context
description: Notion CMS 기반 포트폴리오 프로젝트의 목적, 구조, 초기화 완료 상태
metadata:
  type: project
---

이 프로젝트는 Notion API를 CMS로 사용하는 개인 포트폴리오 웹사이트입니다. Next.js 16 스타터킷에서 초기화되었습니다.

**Why:** 개발자 문시현이 Notion으로 프로젝트를 관리하고, Next.js App Router로 렌더링하는 포트폴리오를 구축하기 위함

**How to apply:** 새 기능 추가 시 Notion API(`lib/notion.ts`)를 통해 데이터를 fetch하고, 서버 컴포넌트 패턴을 따릅니다.

## 초기화 완료 상태 (2026-06-17)

### 제거된 파일
- `app/examples/*` — 스타터킷 예제 라우트
- `app/dashboard/*` — 대시보드 예제
- `app/components/page.tsx` — 컴포넌트 쇼케이스
- `components/layout/Sidebar.tsx`
- `components/shared/QuickStartDialog.tsx`
- `components/shared/DataTable.tsx`

### 생성된 파일
- `lib/notion.ts` — Notion 클라이언트 + API 함수
- `types/notion.ts` — Project 타입 정의
- `.env.local.example` — 환경변수 예시
- `app/projects/page.tsx` — 프로젝트 목록
- `app/projects/[id]/page.tsx` — 프로젝트 상세
- `app/about/page.tsx` — 소개 페이지

### Notion API 중요 사항
- `@notionhq/client` v5 설치됨
- v5에서 `databases.query` 제거, `dataSources.query` 사용
- `data_source_id` 파라미터 사용 (구버전의 `database_id` 아님)
- 환경변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`

[[build-error-patterns]]
