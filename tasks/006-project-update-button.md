# Task 006: 개발용 프로젝트 업데이트 버튼 구현

## 목표

웹 UI 헤더 우상단에 "프로젝트 업데이트" 버튼을 추가하여, 클릭 한 번으로 다음 워크플로우를 자동화한다:
1. `npm run fill-notion` 실행 (GitHub → AI → Notion 데이터 채우기)
2. ISR 페치 캐시 초기화 (`.next/cache/fetch-cache` 삭제)
3. 페이지 자동 새로고침

## 전제 조건

- `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN` 등록 완료
- `npm run fill-notion` 스크립트 정상 동작 확인

## 구현 항목

### 1. API Route: `app/api/update-projects/route.ts`
- POST 핸들러 (개발 전용, production 시 403 반환)
- SSE(Server-Sent Events) 스트리밍 응답
- `child_process.spawn`으로 fill-notion 스크립트 실행
- 실행 완료 후 ISR 캐시 삭제 + `revalidatePath('/', 'layout')` 호출

### 2. 버튼 컴포넌트: `components/shared/UpdateProjectsButton.tsx`
- 개발 환경에서만 렌더링 (`NODE_ENV !== 'development'` 시 null 반환)
- SSE 스트리밍으로 실시간 로그 수신 및 표시
- 상태: idle / running / done / error
- 완료 후 자동 새로고침 (1초 딜레이)
- 모바일에서 숨김 (`hidden md:flex`)

### 3. Header 수정: `components/layout/Header.tsx`
- ThemeToggle 왼쪽에 `<UpdateProjectsButton />` 삽입

## 수락 기준

- [ ] 데스크톱(≥768px)에서 헤더 우상단에 새로고침 아이콘 표시
- [ ] 모바일(<768px)에서 버튼 미표시
- [ ] 클릭 시 스피너 전환 + 로그 팝업 실시간 출력
- [ ] 완료 1초 후 자동 새로고침 + 최신 Notion 데이터 반영
- [ ] `npm run build && npm start` 후 버튼 미표시, POST → 403 반환
