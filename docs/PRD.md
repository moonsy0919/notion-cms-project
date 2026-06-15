# PRD: 개인 포트폴리오 웹사이트 (Notion CMS 기반)

## 1. 프로젝트 개요

- **프로젝트명**: 개인 포트폴리오 웹사이트 (Personal Portfolio Website)
- **목적**: Notion을 CMS(콘텐츠 관리 시스템)로 활용하여 자신의 프로젝트 경험과 기술 역량을 효과적으로 보여주는 개인 포트폴리오 사이트 구축
- **CMS 선택 이유**: Notion의 친숙한 UI를 통해 새로운 프로젝트 추가, 이력 수정, 상세 내용 업데이트를 코드 수정이나 별도의 배포 없이 실시간으로 반영하기 위함

---

## 2. 주요 기능

1. **Notion 연동 프로젝트 목록**: Notion 데이터베이스에서 프로젝트 리스트를 가져와 카드 형태로 표시
2. **프로젝트 상세 페이지**: 개별 프로젝트의 상세 아키텍처, 개발 일지, 성과 등을 Notion 본문 그대로 렌더링
3. **기술 스택 필터링**: 사용한 기술 스택(예: React, Next.js, Python 등)에 따라 프로젝트를 분류해서 볼 수 있는 기능
4. **검색 기능**: 프로젝트 제목, 요약, 사용 기술을 기반으로 한 통합 검색
5. **반응형 디자인**: 모바일, 태블릿, 데스크톱 등 모든 기기 환경에 최적화된 레이아웃 제공

---

## 3. 기술 스택

- **Frontend**: Next.js 16, TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 4. Notion 데이터베이스 구조

포트폴리오 관리를 위해 Notion 데이터베이스는 다음과 같은 속성(Property)으로 구성합니다.

| 속성명 (Property) | 타입 (Type) | 설명 |
| :--- | :--- | :--- |
| **Title** | title | 프로젝트명 |
| **Description** | text | 프로젝트 한 줄 요약 |
| **Category** | select | 프로젝트 유형 (Personal / Team / Company) |
| **Tech Stack** | multi_select | 사용한 기술 스택 (Next.js, TypeScript, Node.js 등) |
| **Period** | date | 개발 기간 (시작일 ~ 종료일) |
| **Status** | select | 진행 상태 (진행중 / 완료 / 유지보수) |
| **Github** | url | 깃허브 저장소 링크 |
| **Demo** | url | 라이브 데모 웹사이트 링크 |
| **Content** | page content | 프로젝트 상세 정보 및 회고 (본문 내용) |

---

## 5. 화면 구성

- **홈 (Home)**: 자기소개(Hero 섹션) 및 핵심 프로젝트/최근 프로젝트 요약 목록
- **프로젝트 목록 (Projects)**: 전체 프로젝트 리스트, 기술 스택별 필터 및 검색 바
- **프로젝트 상세 (Project Detail)**: 개별 프로젝트의 상세 정보, 링크(Github/Demo), Notion 본문 렌더링
- **이력/소개 (About)**: 간략한 인적 사항, 기술 역량 타임라인 (선택 사항)

---

## 6. MVP (최소 기능 제품) 범위

- Notion API 연동을 통한 프로젝트 데이터 동적 바인딩
- 프로젝트 목록 페이지 및 상세 보기 페이지 구현
- Tailwind CSS와 shadcn/ui를 활용한 깔끔하고 전문적인 포트폴리오 스타일링
- 다양한 디바이스를 지원하는 반응형 웹 디자인 적용

---

## 7. 구현 단계

1. **Notion API 패키지 설치 및 환경 설정**
   - Next.js 16 프로젝트 생성 및 `@notionhq/client` 등 필요 라이브러리 설치
   - `.env.local` 파일에 Notion API Key 및 Database ID 설정

2. **Notion 데이터베이스 생성 및 API 권한 설정**
   - Notion에서 포트폴리오용 데이터베이스 포맷 설계
   - Notion Integrations을 통해 API 키 발급 및 데이터베이스 연결

3. **프로젝트 목록 페이지 구현**
   - Notion API를 통해 데이터를 Fetching하여 카드 UI로 리스트 구현
   - 기술 스택별 필터링 및 검색 로직 적용

4. **프로젝트 상세 페이지 구현**
   - Dynamic Routing(`[id]/page.tsx`)을 활용한 상세 페이지 구성
   - Notion 블록 데이터를 HTML/Markdown 형태로 변환하여 본문 렌더링

5. **스타일링 및 최적화**
   - shadcn/ui 컴포넌트를 활용한 다크 모드 및 반응형 레이아웃 완성
   - Next.js App Router의 캐싱 기능을 활용한 속도 최적화 및 Vercel 배포
