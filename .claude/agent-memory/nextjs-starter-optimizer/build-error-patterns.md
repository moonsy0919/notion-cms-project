---
name: build-error-patterns
description: 이 프로젝트에서 반복 발생한 빌드 에러 원인과 해결책
metadata:
  type: feedback
---

## lucide-react v1.x에서 Github 아이콘 없음

lucide-react v1.x에서 `Github` 브랜드 아이콘이 제거되었습니다.

**Why:** 브랜드 아이콘은 lucide-react 스코프에서 제거됨
**How to apply:** GitHub 아이콘은 `react-icons/fa6`의 `FaGithub`을 사용합니다. `import { FaGithub } from "react-icons/fa6"` — 이미 프로젝트 의존성에 포함되어 있음

## @notionhq/client v5에서 databases.query 제거

**Why:** v5에서 Notion API 구조 변경으로 `databases` 네임스페이스에서 `query`가 제거되고 `dataSources.query`로 이동됨
**How to apply:**
- `notion.databases.query({ database_id: ... })` → `notion.dataSources.query({ data_source_id: ... })`
- 파라미터 키도 변경: `database_id` → `data_source_id`
- 타입: `QueryDataSourceParameters`, 필터: `PropertyFilter`, `GroupFilterOperatorArray`

[[project-context]]
