# 개인 포트폴리오 웹사이트 (Notion CMS 기반)

Notion을 CMS로 활용하여 프로젝트 경험과 기술 역량을 보여주는 개인 포트폴리오 사이트입니다.
GitHub URL 하나만 입력하면 Claude AI가 자동으로 분석해 Notion DB에 프로젝트 정보를 채워줍니다.
API 키는 브라우저 UI에서 직접 입력하며, 서버 환경변수나 별도 인프라 없이 Vercel Hobby 플랜에 바로 배포할 수 있습니다.

![Lighthouse Performance](https://img.shields.io/badge/Performance-96-brightgreen) ![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-100-brightgreen) ![Lighthouse Best Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen) ![Lighthouse SEO](https://img.shields.io/badge/SEO-100-brightgreen)

## 기술 스택

- **Framework**: Next.js 16 (App Router), TypeScript
- **CMS**: Notion API (`@notionhq/client` v5)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Icons**: Lucide React, React Icons
- **자동화 도구**: Claude AI (`@anthropic-ai/sdk`), GitHub REST API, `tsx`
- **Deployment**: Vercel

## 주요 기능

- **Welcome 랜딩 페이지**: 9개 포트폴리오 카드 회전 애니메이션 시작 화면
- **BYO Key 온보딩**: Notion·Anthropic·GitHub API 키를 UI에서 직접 입력, httpOnly 쿠키로 안전하게 저장
- **GitHub → Notion 자동 채우기**: GitHub URL 입력 → Claude AI 분석 → Notion DB 속성·본문 자동 생성
- **Notion 연동 프로젝트 목록**: 기술 스택 필터 + 키워드 검색, URL 파라미터 기반 상태 관리
- **프로젝트 상세 페이지 + UI 흐름 이미지**: Notion 블록 재귀 렌더링 + AI 생성 사용자 흐름 이미지
- **개발자 프로필 설정**: 이름·역할·기술 스택을 입력하면 홈 화면에 즉시 반영
- **다크 모드 및 반응형 레이아웃**

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에 접속하면 `/welcome` 랜딩 페이지로 자동 이동합니다.

### 3. 온보딩 흐름

1. **`/welcome`** — 포트폴리오 카드 애니메이션 시작 화면, "시작하기" 클릭
2. **`/setup`** — Notion API Key, Notion DB ID, Anthropic API Key, GitHub Token(선택) 입력
3. **`/admin`** — 개발자 이름·역할·기술 스택 입력
4. **`/`** — 포트폴리오 홈으로 이동 완료

> API 키는 모두 브라우저 httpOnly 쿠키에만 저장됩니다. 서버 환경변수 설정이 불필요합니다.

### 4. 프로젝트 자동 채우기 (선택)

Notion DB에 GitHub URL을 추가한 뒤 헤더의 새로고침 버튼을 누르면 Claude AI가 자동으로 분석해 내용을 채웁니다.

로컬에서 CLI로 직접 실행할 수도 있습니다:

```bash
# .env.local에 NOTION_API_KEY, NOTION_DATABASE_ID, ANTHROPIC_API_KEY 설정 필요 (로컬 전용)
# .env.local.example을 복사해 사용하세요
cp .env.local.example .env.local

npm run fill-notion                                          # 대기 중인 모든 페이지 처리
npm run fill-notion -- --url https://github.com/owner/repo  # 단일 URL 모드
```

## 명령어

```bash
npm run dev      # 개발 서버 실행 (Turbopack, http://localhost:3000)
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버 실행
npm run lint     # ESLint 검사
npm run check    # TypeScript 타입 오류 확인
```

## 프로젝트 구조

```
app/
├── layout.tsx                  # 루트: ThemeProvider + body flex-col
├── opengraph-image.tsx         # 정적 OG 이미지 (소셜 공유용, CDN 캐시)
├── setup/
│   ├── layout.tsx              # /setup 전용 OG 메타데이터
│   ├── page.tsx                # API 키 입력 온보딩
│   └── why/
│       └── page.tsx            # "왜 API key가 필요한가요?" 설명 페이지
├── (main)/                     # 포트폴리오 페이지 (Header + Footer 포함)
│   ├── layout.tsx              # DeveloperProfileProvider, Notion 아바타 주입
│   ├── page.tsx                # 홈 (Hero + 최근 프로젝트 + About 프리뷰)
│   └── projects/
│       ├── page.tsx            # 프로젝트 목록 (필터 + 검색)
│       └── [id]/page.tsx       # 프로젝트 상세 (Notion 블록 + UI 흐름 이미지)
├── (onboarding)/               # 온보딩 페이지 (Header·Footer 없음)
│   ├── layout.tsx              # DeveloperProfileProvider만 제공
│   ├── welcome/
│   │   └── page.tsx            # 포트폴리오 카드 회전 애니메이션 랜딩 페이지
│   └── admin/page.tsx          # 개발자 프로필 설정 (회로기판 배경 테마)
└── api/
    ├── auth/setup/route.ts     # API 키 검증 + 쿠키 설정
    ├── auth/logout/route.ts    # 쿠키 일괄 만료
    ├── profile/route.ts        # 개발자 프로필 저장
    ├── project-flow/[id]/route.tsx # AI 생성 UI 흐름 이미지 (프로젝트 OG 이미지 겸용)
    └── update-projects/route.ts # Notion 프로젝트 AI 채우기 (폴링, 1 call = 1 project)

proxy.ts                        # 온보딩 리다이렉트 (Next.js 16 middleware 컨벤션)
contexts/
└── DeveloperProfileContext.tsx # 개발자 프로필 전역 상태 (avatarUrl, githubUrl 포함)
lib/
├── notion.ts                   # Notion API 함수 (per-request Client, apiKey 파라미터)
├── fill-notion/                # AI 채우기 모듈 (배포 번들 포함)
│   ├── github.ts
│   ├── ai-analyzer.ts
│   └── notion-updater.ts
└── ...
scripts/                        # 로컬 전용 CLI (Vercel 빌드 제외)
└── github-to-notion.ts
public/
└── robots.txt                  # 크롤러 접근 허용 설정
```

## Vercel 배포

환경변수 설정 없이 바로 배포 가능합니다. API 키는 UI 온보딩에서 입력합니다.

1. [vercel.com](https://vercel.com)에서 GitHub 저장소를 Import
2. 빌드 설정은 Next.js 자동 감지 — 별도 수정 불필요
3. **환경변수 등록 없이** 배포 클릭

배포 후 발급된 URL에 접속하면 `/welcome` 랜딩 페이지로 이동합니다.

## 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md)
- [개발 로드맵](./docs/ROADMAP.md)
