---
description: "Next.js (App Router) 프로젝트의 소스 코드, 의존성, 설정을 정밀 정적 분석하여 보안 취약점을 점검하고 표준 포맷으로 보고합니다."
allowed-tools:
  [
    "Bash(npm audit:*)",
    "Grep",
    "Glob",
    "Read",
  ]
---

아래 명시된 순서와 탐지 규칙에 따라 Next.js 프로젝트 보안 점검을 수행하고, 지정된 결과 형식에 맞춰 보고하라.

## [점검 항목 및 탐지 규칙]

### 1. 오픈소스 의존성 취약점
- `npm audit --json` 명령을 실행하여 종속성 라이브러리를 검사한다.
- **Critical** 및 **High** 등급의 취약점만 필터링하여 보고에 포함한다.

### 2. 시크릿 및 자격 증명 노출
`src/` 디렉토리 내부를 대상으로 다음 패턴을 검색한다 (`node_modules/`, `.next/` 제외):
- 하드코딩된 비밀키: `(password|secret|token|api_key|client_secret)\s*=\s*["'][^"']+["']`
- 클라이언트 노출 민감 키: `NEXT_PUBLIC_.*(SECRET|PASSWORD|KEY|TOKEN|AUTH)` (환경 변수 설계 오류)
- 디버깅 로그 유출: `console.log` 또는 `console.dir` 내부에 토큰, 패스워드 변수가 인자로 들어간 경우

### 3. 크로스 사이트 스크립팅 (XSS) & 인젝션
- `dangerouslySetInnerHTML` 구조문 사용처 및 위험성 검증
- `eval(` 또는 `new Function(` 등 동적 코드 실행 함수 사용 여부
- `<a href={...}>` 또는 `Link` 컴포넌트의 href 속성에 사용자 입력값(`req.query`, `params`)이 새니타이징 없이 직접 삽입되는지 확인

### 4. 입력값 검증 (Zod / Validation)
- `src/app/api/` 하위 라우트 핸들러에서 `req.json()`, `req.body`, `searchParams`를 `zod` 등의 스키마 검증 없이 직접 캐스팅하여 사용하는지 확인
- `src/app/` 하위 Server Action (`"use server"`) 함수 내부에서 인자(Arguments)에 대한 유효성 검증 누락 여부

### 5. HTTP 보안 헤더 설정
- `next.config.js` 또는 `next.config.ts` 파일 내 `headers()` 설정 유무를 확인한다.
- 누락되었거나 미흡할 경우 아래의 필수 헤더 설정을 조치 방안으로 제안한다:
  - `X-Frame-Options: DENY` (클릭재킹 방지)
  - `X-Content-Type-Options: nosniff` (MIME 스니핑 방지)
  - `Strict-Transport-Security` (HSTS 강제)
  - `Content-Security-Policy` (CSP 설정 권장)

### 6. 인증 및 인가 레이어
- `src/app/api/` 라우트에 세션/토큰 검증 로직 누락 여부 조사
- 루트 디렉토리에 `middleware.ts`가 존재하는지 확인하고, 보호되어야 할 라우터 경로(ex: `/admin`, `/api`, `/dashboard`)에 대한 매처(matcher) 커버리지가 안전한지 검증

---

## [보고 및 결과 형식]

- 발견된 이슈가 없는 항목은 결과에서 완전히 생략한다.
- **[경고]** `.env` 파일의 실제 값(Value)은 절대 보고서에 출력하거나 노출해서는 안 되며, 파일의 존재 및 설정 여부만 언급한다.
- 결과물에 AI 서명(예: "By Claude")은 절대 추가하지 않는다.

아래 템플릿 서식을 사용하여 결과를 출력하라:

## 🔒 Next.js 보안 점검 결과
발견된 이슈: 총 N개 (🔴 Critical: N | 🟠 High: N | 🟡 Medium: N | 🟢 Low: N)

### [🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low 중 택1] 이슈명
- **위치:** `파일 경로:라인 번호`
- **문제점:** 취약점의 원인과 발생할 수 있는 보안 위협을 설명
- **조치 방안:** 구체적인 수정 코드 또는 대응 명령어 제시
