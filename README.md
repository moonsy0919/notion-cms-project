# 개인 포트폴리오 웹사이트 (Notion CMS 기반)

Notion을 CMS로 활용하여 프로젝트 경험과 기술 역량을 보여주는 개인 포트폴리오 사이트입니다.  
Notion 데이터베이스에서 데이터를 가져와 코드 수정 없이 콘텐츠를 실시간으로 업데이트할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## 주요 기능

- Notion 데이터베이스 연동 프로젝트 목록 (카드 UI)
- 기술 스택별 필터링 및 키워드 검색
- 프로젝트 상세 페이지 (Notion 본문 블록 렌더링)
- 다크 모드 및 반응형 레이아웃

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
NOTION_API_KEY=your_notion_integration_key
NOTION_DATABASE_ID=your_notion_database_id
```

Notion API 키 발급 방법은 [Notion Integrations](https://www.notion.so/my-integrations)에서 확인하세요.

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (Turbopack, http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 프로젝트 구조

```
app/
├── page.tsx              # 홈 (Hero + 최근 프로젝트)
├── projects/
│   ├── page.tsx          # 프로젝트 목록 (필터 + 검색)
│   └── [id]/page.tsx     # 프로젝트 상세
└── about/page.tsx        # 이력/소개

docs/
└── PRD.md                # 제품 요구사항 문서
```

## 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md)
