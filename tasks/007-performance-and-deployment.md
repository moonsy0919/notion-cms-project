# Task 007: 성능 최적화 및 Vercel 배포

## 개요

Next.js App Router의 ISR 캐싱 전략을 적용하여 Notion API 호출 횟수를 줄이고,
사이트 전역 및 페이지별 SEO 메타데이터를 완성한 뒤 Vercel에 프로덕션 배포합니다.
모바일 반응형 최종 점검 및 접근성(a11y) 기본 사항을 확인합니다.
보안 측면에서 Vercel 환경변수 설정 시 API 키가 클라이언트 번들에 노출되지 않도록 검증합니다.

## 관련 파일

- `lib/notion.ts` — `fetch` 캐시 옵션 (`revalidate`) 적용
- `app/layout.tsx` — 사이트 전역 `metadata` 객체 완성
- `app/page.tsx` — 홈 페이지 OG 태그 및 메타데이터
- `app/projects/page.tsx` — 프로젝트 목록 페이지 메타데이터
- `app/projects/[id]/page.tsx` — 동적 OG 메타데이터 (프로젝트별 제목/설명)
- `next.config.ts` — 이미지 도메인 허용 등 필요 시 설정 추가

## 수락 기준 (Acceptance Criteria)

- [ ] Notion API 응답에 ISR(`revalidate: 3600`) 또는 `unstable_cache`가 적용되어 불필요한 API 재호출이 방지된다
- [ ] `app/layout.tsx`에 사이트 전역 `metadata` 객체(title template, description, OG 이미지)가 완성된다
- [ ] 각 페이지에 적절한 `<title>`, `<meta description>`, Open Graph 태그가 설정된다
- [ ] 프로젝트 상세 페이지의 OG 태그에 실제 프로젝트 제목과 설명이 반영된다
- [ ] Lighthouse 기준 Performance 80점 이상, Accessibility 90점 이상을 달성한다
- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 뷰포트에서 레이아웃이 깨지지 않는다
- [ ] Vercel 환경변수에 `NOTION_API_KEY`, `NOTION_DATABASE_ID`가 등록되며 클라이언트 번들에 노출되지 않는다
- [ ] 프로덕션 URL에서 `/`, `/projects`, `/projects/[id]`, `/about` 전 경로가 정상 동작한다

## 구현 단계

1. `lib/notion.ts` — `fetch` 호출에 `{ next: { revalidate: 3600 } }` 옵션 추가 (또는 `unstable_cache` 활용)
2. `app/layout.tsx` — 사이트 전역 `metadata` 객체 완성 (title template: `%s | 포트폴리오`, description, OG)
3. `app/page.tsx`, `app/projects/page.tsx` — 페이지별 `metadata` 내보내기 추가
4. `app/projects/[id]/page.tsx` — `generateMetadata` 함수에서 실제 프로젝트 제목/설명으로 OG 태그 생성
5. 반응형 레이아웃 최종 점검 — 각 뷰포트에서 수동 확인 및 누락된 미디어 쿼리 수정
6. Vercel 프로젝트 연결 (`vercel link`) 및 환경변수 등록 (`vercel env add`)
7. 프로덕션 배포 (`vercel --prod`) 후 실제 동작 확인

## 테스트 체크리스트

- [ ] 프로덕션 URL에서 `/`, `/projects`, `/projects/[id]`, `/about` 모두 정상 접근 확인
- [ ] Notion DB에 새 항목 추가 후 `revalidate` 시간(1시간) 이후 목록에 반영되는지 확인
- [ ] 모바일 기기(또는 DevTools Device Toolbar)에서 네비게이션 및 카드 레이아웃 확인
- [ ] SNS 공유 시 OG 이미지/제목/설명이 올바르게 표시되는지 확인 (Facebook Debugger 또는 Twitter Card Validator 사용)
- [ ] 다크 모드에서 모든 페이지의 색상 대비가 올바른지 확인
- [ ] Vercel 배포 로그에서 빌드 오류 없이 성공하는지 확인
- [ ] 브라우저 DevTools에서 `NOTION_API_KEY`가 클라이언트 번들 또는 네트워크 응답에 포함되지 않는지 확인

## 변경 사항 요약

(작업 완료 후 작성)
