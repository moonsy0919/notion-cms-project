import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideStep, ExternalLinkText } from "@/components/setup/GuideStep";

/** GitHub Token 생성 방법 안내 페이지 */
export default function GithubGuidePage() {
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

        <h1 className="mb-2 text-2xl font-bold">GitHub Token 생성 방법</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          GitHub 로그인부터 Personal Access Token 발급 및 보관까지 순서대로 따라해주세요.
        </p>

        <div>
          <GuideStep step={1} title="GitHub 접속 및 로그인">
            <ExternalLinkText href="https://github.com/?locale=ko-kr">
              github.com
            </ExternalLinkText>
            {" "}공식 사이트에 접속해서 로그인을 진행해주세요.
          </GuideStep>

          <GuideStep
            step={2}
            title="프로필 아이콘 → Settings"
            image={{ src: "/guide/github/01-settings.png", width: 510, height: 1180 }}
          >
            우측 상단의 프로필 아이콘을 클릭한 후, 하단의{" "}
            <strong className="text-foreground">Settings</strong>를 클릭해주세요.
          </GuideStep>

          <GuideStep
            step={3}
            title="Developer settings 클릭"
            image={{ src: "/guide/github/02-developer-settings.png", width: 600, height: 104 }}
          >
            좌측 사이드바의 가장 하단에 있는{" "}
            <strong className="text-foreground">Developer settings</strong>를 클릭해주세요.
          </GuideStep>

          <GuideStep
            step={4}
            title="Tokens (classic) 클릭"
            image={{ src: "/guide/github/03-tokens-classic.png", width: 608, height: 384 }}
          >
            <strong className="text-foreground">Personal access tokens</strong>를 펼친 후{" "}
            <strong className="text-foreground">Tokens (classic)</strong>을 클릭해주세요.
          </GuideStep>

          <GuideStep
            step={5}
            title="Generate new token (classic) 클릭"
            image={{ src: "/guide/github/04-generate-classic.png", width: 618, height: 298 }}
          >
            우측의 <strong className="text-foreground">Generate new token</strong>을 클릭한 후{" "}
            <strong className="text-foreground">Generate new token (classic)</strong>을
            선택해주세요.
          </GuideStep>

          <GuideStep step={6} title="이름·기간·스코프 선택 후 생성">
            이름과 기간(Expiration)을 입력하고, 스코프에서{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">repo</code> 또는{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">public_repo</code>를 선택한
            후, 하단의 <strong className="text-foreground">Generate token</strong>을
            클릭해주세요.
          </GuideStep>

          <GuideStep step={7} title="발급된 토큰 저장" important>
            발급된 토큰은 보안상의 이유로 한 번만 표시되므로, 다시 확인할 수 없습니다. 꼭 해당
            토큰을 복사해서 자신만이 아는 저장소에 보관해주세요!
          </GuideStep>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          GitHub Token을 저장했으면, GitHub의 API Key 구현이 완료됐습니다.
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
