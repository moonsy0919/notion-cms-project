import Link from "next/link";
import { ArrowLeft, Bot, GitBranch, Key, Lock, ShieldCheck, Database } from "lucide-react";

interface InfoSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

/** API 키 설명 섹션 단위 컴포넌트 */
function InfoSection({ icon, title, children }: InfoSectionProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span className="text-accent">{icon}</span>
        {title}
      </div>
      <div className="pl-6 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}

/** API 키가 필요한 이유를 설명하는 페이지 */
export default function WhyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/setup"
          className="mb-6 flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          돌아가기
        </Link>

        <h1 className="mb-10 text-2xl font-bold">왜 API key가 필요한가요?</h1>

        <div className="space-y-6">
          <InfoSection icon={<ShieldCheck className="h-4 w-4" />} title="BYO Key 구조">
            이 포트폴리오는 서버 환경변수를 사용하지 않습니다. 입력한 API 키는{" "}
            <strong className="text-foreground">httpOnly 쿠키</strong>로 브라우저에만 저장되며,
            외부 서버나 데이터베이스에 전송·보관되지 않습니다. 쿠키는 30일 후 자동 만료됩니다.
          </InfoSection>

          <InfoSection icon={<Key className="h-4 w-4" />} title="Notion API Key">
            Notion 워크스페이스에 접근하기 위한 인증 토큰입니다. 프로젝트 목록을 가져오고
            각 프로젝트의 상세 콘텐츠를 렌더링할 때 사용됩니다.
            Notion Settings → Integrations에서 발급할 수 있습니다.
          </InfoSection>

          <InfoSection icon={<Database className="h-4 w-4" />} title="Notion Database ID">
            프로젝트 데이터가 저장된 Notion 데이터베이스를 지정합니다.
            Notion에서 데이터베이스 페이지를 열었을 때 URL에 포함된 32자리 ID입니다.
            (예: notion.so/workspace/<strong className="text-foreground">abc123...</strong>?v=…)
          </InfoSection>

          <InfoSection icon={<Bot className="h-4 w-4" />} title="Anthropic API Key">
            GitHub 저장소를 분석해 Notion DB를 자동으로 채우는 AI 기능에 사용됩니다.
            Claude claude-sonnet-4-6 모델이 README·기여자 수·언어 분포를 분석해
            프로젝트 설명과 기술 스택을 자동 생성합니다.
          </InfoSection>

          <InfoSection icon={<GitBranch className="h-4 w-4" />} title="GitHub Token (선택)">
            GitHub 저장소 메타데이터·README·언어 분포를 가져올 때 사용됩니다.
            입력하지 않으면 GitHub API를 인증 없이 호출하므로{" "}
            <strong className="text-foreground">시간당 60회</strong> 요청 제한이 적용됩니다.
            프로젝트가 많다면 토큰을 입력하는 것을 권장합니다.
          </InfoSection>

          <InfoSection icon={<Lock className="h-4 w-4" />} title="보안 안내">
            httpOnly 속성 덕분에 JavaScript로 쿠키에 접근할 수 없어 XSS 공격에 안전합니다.
            쿠키가 만료되거나 로그아웃 시 모든 키가 즉시 삭제되며, 재입력이 필요합니다.
          </InfoSection>
        </div>
      </div>
    </main>
  );
}
