import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideStep, ExternalLinkText } from "@/components/setup/GuideStep";

/** Anthropic (Claude) API Key 생성 방법 안내 페이지 */
export default function ClaudeGuidePage() {
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

        <h1 className="mb-2 text-2xl font-bold">Anthropic API Key 생성 방법</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          Claude Console 접속부터 API Key 생성 및 보관까지 순서대로 따라해주세요.
        </p>

        <div>
          <GuideStep step={1} title="Claude Console 접속 및 로그인">
            <ExternalLinkText href="https://console.anthropic.com/">
              console.anthropic.com
            </ExternalLinkText>
            {" "}공식 사이트에 접속해서 로그인을 진행해주세요.
          </GuideStep>

          <GuideStep
            step={2}
            title="API 키 메뉴 클릭"
            image={{ src: "/guide/claude/01-api-key-menu.png", width: 500, height: 600 }}
          >
            로그인 후, 좌측 사이드바의 <strong className="text-foreground">API 키</strong> 메뉴를
            클릭해주세요.
          </GuideStep>

          <GuideStep step={3} title="키 생성 시작">
            API 키 화면 우측의 <strong className="text-foreground">+ 키 생성</strong>을 눌러서
            진행해주세요.
          </GuideStep>

          <GuideStep step={4} title="API Key 이름 입력">
            API Key 이름을 입력하고 <strong className="text-foreground">추가</strong>하여
            생성해주세요.
          </GuideStep>

          <GuideStep step={5} title="API Key 저장" important>
            생성하면 &quot;아래 키를 기록해 두세요. 다시 확인할 수 없습니다.&quot; 메시지와 함께{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">sk-···</code> 형태의 API
            Key가 생성됩니다. 꼭 해당 키를 복사해서 자신만이 아는 저장공간에 보관해주세요!
          </GuideStep>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          API Key를 저장했으면, Claude의 API Key 구현이 완료됐습니다.
        </p>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/setup">
              API Key 설정하러 가기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
