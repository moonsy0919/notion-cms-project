---
name: recurring-issues
description: 여러 파일에 걸쳐 반복되는 구조적 코드 문제 — 코드 리뷰 시 우선 확인할 항목
metadata:
  type: project
---

## 반복 발생 구조적 문제

### 1. GITHUB_URL 상수 중복
4개 파일에서 동일한 URL 상수를 각각 정의:
- `app/page.tsx`, `components/layout/Footer.tsx`, `components/layout/Header.tsx`, `components/shared/QuickStartDialog.tsx`
- 해결: `lib/constants.ts`로 추출

### 2. Post 타입 중복
data-fetching 예제 3개 파일에서 동일한 타입 정의:
- `app/examples/data-fetching/page.tsx`, `ClientFetchExample.tsx`, `ErrorFetchExample.tsx`
- 해결: 공유 타입 파일로 추출

### 3. JSDoc 주석 누락
layout 컴포넌트들 (Footer, Header, Container)에 JSDoc 없음
프로젝트 코딩 스타일 기준: 함수마다 간단한 주석 포함

### 4. DataTable key 불안정
- `DataTable.tsx` L103: `key={rowIdx}` — 인덱스 기반 key는 정렬/필터 시 리렌더링 버그 유발
- 해결: 데이터에 고유 id 필드 있으면 사용하도록 Column 타입에 idKey 옵션 추가 권장

### 5. 함수 길이 초과 (30줄 기준)
- `DataTable`: 함수 본문 103줄
- `ContactFormSection` (forms/page.tsx): ~142줄
- `SecurityCard` (settings/page.tsx): ~67줄
- 코딩 스타일 기준 위반

### 6. 빌드 경고
- `next.config.ts`에 `turbopack.root` 미설정으로 빌드 경고 발생
- 여러 lockfile 감지

**Why:** 초기 단계의 스타터킷으로 리팩터링이 덜 된 상태
**How to apply:** 신규 컴포넌트 추가 시 위 패턴을 반복하지 않도록 주의
