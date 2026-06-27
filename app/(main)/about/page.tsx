import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { MermaidDiagram } from "@/components/architecture/MermaidDiagram";

export const metadata: Metadata = {
  title: "Architecture | 문시현",
  description: "포트폴리오 시스템 아키텍처 및 개발 회고",
};

const SEQUENCE_DIAGRAM = `
sequenceDiagram
  actor User as 사용자
  participant Setup as /setup
  participant Admin as /admin
  participant Notion as Notion DB
  participant App as Next.js (Vercel)
  participant GitHub as GitHub API
  participant Claude as Claude AI

  User->>Setup: API Key 입력<br/>(Notion · Anthropic · GitHub)
  Setup-->>User: httpOnly 쿠키 저장

  User->>Admin: 개발자 정보 입력
  Admin-->>User: 프로필 쿠키 저장

  User->>Notion: GitHub URL 추가 (Notion에서 직접)
  User->>App: 업데이트 버튼 클릭

  loop 대기 중인 프로젝트가 있을 동안
    App->>Notion: 대기 페이지 탐지
    App->>GitHub: 레포지토리 데이터 수집
    GitHub-->>App: 메타데이터 · README · 언어
    App->>Claude: 데이터 분석 요청
    Claude-->>App: 제목 · 설명 · 기술스택 · 회고 블록
    App->>Notion: 속성 + 블록 업데이트
  end

  User->>App: 포트폴리오 접속
  App->>Notion: 최신 데이터 fetch
  Notion-->>App: 프로젝트 목록 · 상세
  App-->>User: 렌더링된 웹 페이지
`.trim();

export default function ArchitecturePage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="Architecture"
          description="이 포트폴리오가 어떻게 동작하는지 시스템 구조를 소개합니다."
          className="mb-10"
        />

        <div className="mx-auto max-w-4xl space-y-16">

          {/* 시스템 흐름 다이어그램 */}
          <section>
            <h2 className="mb-2 text-xl font-semibold">시스템 흐름</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              API Key 입력부터 웹 페이지 렌더링까지 전체 자동화 파이프라인입니다.
            </p>
            <MermaidDiagram chart={SEQUENCE_DIAGRAM} />
          </section>

          {/* 개발 회고 */}
          <section className="space-y-10">
            <h2 className="text-xl font-semibold">개발 회고</h2>

            <div className="space-y-2">
              <h3 className="font-medium">왜 이 프로젝트를 만들었나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                개인 포트폴리오를 운영하면서 가장 귀찮은 작업은 새 프로젝트를 추가할 때마다
                코드를 수정하고 배포하는 과정이었습니다. Notion을 CMS로 쓰면 코드 수정 없이
                콘텐츠를 관리할 수 있다는 아이디어에서 출발했고, GitHub URL 하나만 입력하면
                AI가 나머지를 채워준다면 진입 장벽이 거의 없어진다고 생각했습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">기술 선택 이유</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Next.js App Router</span>
                  {" "}— 서버 컴포넌트 우선 구조로 Notion API 호출을 서버에서 처리해
                  클라이언트 번들에 API Key가 노출되지 않습니다.
                </li>
                <li>
                  <span className="font-medium text-foreground">Notion API</span>
                  {" "}— 친숙한 UI로 콘텐츠를 관리하고, 블록 구조 그대로 렌더링해
                  별도 에디터가 필요 없습니다.
                </li>
                <li>
                  <span className="font-medium text-foreground">BYO Key + httpOnly 쿠키</span>
                  {" "}— Vercel Hobby 플랜의 환경변수 제한 없이 누구든 자신의 API Key로
                  바로 배포·사용할 수 있는 구조입니다.
                </li>
                <li>
                  <span className="font-medium text-foreground">Claude AI (Tool use)</span>
                  {" "}— GitHub README와 코드 분포를 분석해 JSON 스키마로 강제 출력하므로
                  파싱 오류 없이 Notion 속성에 바로 매핑됩니다.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">배운 점</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  Next.js 16에서 <code className="text-xs bg-muted px-1 py-0.5 rounded">searchParams</code>·
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">cookies()</code>가
                  모두 Promise 기반으로 바뀌어 await 패턴이 필수입니다.
                  훈련 데이터와 다른 API가 많아 <code className="text-xs bg-muted px-1 py-0.5 rounded">node_modules/next/dist/docs</code>를
                  직접 읽는 습관이 생겼습니다.
                </li>
                <li>
                  Notion SDK v5에서 <code className="text-xs bg-muted px-1 py-0.5 rounded">databases.query</code>가 제거되어
                  REST fetch를 직접 호출해야 합니다.
                  SDK를 맹목적으로 신뢰하지 말고 변경 이력을 확인하는 것이 중요합니다.
                </li>
                <li>
                  Vercel Hobby 60초 제한으로 인해 SSE 스트리밍 → 폴링 방식으로 전환했습니다.
                  제약 조건이 설계를 단순하게 만들기도 합니다.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">개선하고 싶은 점</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  현재 Notion 블록 렌더러는 기본 타입만 지원합니다.
                  이미지·토글·콜아웃 등 확장 블록을 추가하면 Notion 본문을 더 풍부하게 표현할 수 있습니다.
                </li>
                <li>
                  AI 분석 결과를 사용자가 수정할 수 있는 인라인 편집 UI가 있으면
                  자동화의 한계를 보완할 수 있습니다.
                </li>
              </ul>
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
}
