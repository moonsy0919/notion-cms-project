---
name: hydration-patterns
description: 프로젝트에서 자주 발생하는 Hydration 불일치 패턴 목록과 올바른 해결책
metadata:
  type: project
---

## 확인된 Hydration 패턴

**올바르게 처리된 곳**
- `app/examples/settings/page.tsx` ThemeCard: mounted 패턴 사용 (RadioGroup value)
- `app/examples/hooks/page.tsx` MediaQueryDemo: `initializeWithValue: false` 사용
- `app/examples/hooks/page.tsx` WindowSizeDemo: `initializeWithValue: false` 사용

**처리 필요한 곳**
- `components/layout/Sidebar.tsx` L60: `useMediaQuery`에 `initializeWithValue: false` 누락 → 모바일/데스크탑 레이아웃 불일치 가능
- `components/shared/ThemeToggle.tsx`: mounted 패턴 없이 `useTheme` 직접 사용 — next-themes 기본 동작으로 아이콘 전환이 CSS(dark: 클래스 기반)로만 처리되어 실제 hydration 에러는 없으나, `resolvedTheme` 미사용
- `components/layout/Footer.tsx` L12: `new Date().getFullYear()` — Server Component이고 정적 값이라 실제 불일치는 없음

**useLocalStorage Hydration 참고**
- usehooks-ts v3의 `useLocalStorage`는 SSR 환경에서 `initializeWithValue: false` 옵션 제공
- 현재 `app/examples/hooks/page.tsx` L82에서 옵션 없이 사용 중 → Next.js 16 Static 빌드에서는 문제없을 수 있으나 SSR/Streaming 사용 시 주의

**Why:** 빌드 시 ESLint `react-hooks/set-state-in-effect` 에러가 settings/page.tsx에서 발생 (setMounted 패턴)
**How to apply:** useMediaQuery/useWindowSize는 항상 `initializeWithValue: false` 옵션 추가, ThemeToggle은 CSS 전환 방식으로 유지하거나 mounted 패턴 추가
