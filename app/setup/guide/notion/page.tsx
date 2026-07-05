import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideStep, ExternalLinkText } from "@/components/setup/GuideStep";

/** Notion API Key 생성 방법 안내 페이지 */
export default function NotionGuidePage() {
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

        <h1 className="mb-2 text-2xl font-bold">Notion API Key 생성 방법</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          Notion 데스크톱 앱 설치부터 액세스 토큰·데이터베이스 ID 확보까지 순서대로 따라해주세요.
        </p>

        <div>
          <GuideStep step={1} title="Notion 데스크톱 앱 다운로드">
            <ExternalLinkText href="https://www.notion.com/ko/desktop">
              notion.com/ko/desktop
            </ExternalLinkText>
            {" "}공식 홈페이지에 들어가서 다운로드를 진행해주세요.
          </GuideStep>

          <GuideStep step={2} title="로그인">
            다운로드 완료 후 앱을 실행할 때 로그인이 안 돼 있으면{" "}
            <strong className="text-foreground">[브라우저에서 계속하기]</strong> 버튼을 클릭하여
            로그인을 진행해주세요.
          </GuideStep>

          <GuideStep step={3} title="워크스페이스 생성">
            로그인 진행 후 워크스페이스가 없으면 워크스페이스를 생성해주세요.
          </GuideStep>

          <GuideStep
            step={4}
            title="개인 페이지에서 페이지 추가"
            image={{ src: "/guide/notion/01-add-page.png", width: 261, height: 153 }}
          >
            생성된 워크스페이스의 좌측 하단 개인 페이지에서{" "}
            <strong className="text-foreground">[페이지 추가]</strong>를 클릭해주세요.
          </GuideStep>

          <GuideStep
            step={5}
            title="데이터베이스 - 전체 페이지 선택"
            image={{ src: "/guide/notion/02-select-database.png", width: 353, height: 425 }}
          >
            생성된 페이지에서 <strong className="text-foreground">+</strong>를 누르고 데이터베이스를
            검색한 후, <strong className="text-foreground">전체 페이지</strong>를 선택해주세요.
          </GuideStep>

          <GuideStep step={6} title="속성 입력">
            <p className="mb-2">생성된 페이지에서 각각의 속성들을 다음과 같이 입력해주세요.</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>Title</li>
              <li>Description (유형: 텍스트)</li>
              <li>Category (유형: 선택)</li>
              <li>Tech Stack (유형: 다중 선택)</li>
              <li>Period (유형: 날짜)</li>
              <li>Status (유형: 선택)</li>
              <li>Github (유형: URL)</li>
              <li>Demo (유형: URL)</li>
            </ul>
          </GuideStep>

          <GuideStep
            step={7}
            title="Integration 생성"
            image={{ src: "/guide/notion/04-new-connection.png", width: 894, height: 124 }}
          >
            <ExternalLinkText href="https://www.notion.so/my-integrations">
              notion.so/my-integrations
            </ExternalLinkText>
            {" "}사이트에 접속 후, Notion의 API가 없다면{" "}
            <strong className="text-foreground">+신규 연결</strong>을 눌러주세요.
          </GuideStep>

          <GuideStep
            step={8}
            title="워크스페이스 지정"
            image={{ src: "/guide/notion/05-connection-modal.png", width: 457, height: 447 }}
          >
            하단의 설치 가능 워크스페이스에 Notion 앱에서 만든 워크스페이스를 지정합니다.
          </GuideStep>

          <GuideStep
            step={9}
            title="액세스 토큰 저장"
            important
            image={{ src: "/guide/notion/06-access-token.png", width: 922, height: 479 }}
          >
            생성 후 원한다면 아바타 및 이름을 편집하고, 액세스 토큰을 복사해서 자신만이 아는
            저장소에 저장해주세요!
          </GuideStep>

          <GuideStep
            step={10}
            title="데이터베이스에 연결 활성화"
            image={{ src: "/guide/notion/07-check-connection.png", width: 1633, height: 770 }}
          >
            Notion 앱의 만들었던 데이터베이스로 돌아와서, 우측 상단의{" "}
            <strong className="text-foreground">···</strong>을 클릭 후 하단의 연결을 확인해주세요.
            연결이 없다면 <strong className="text-foreground">+ 연결 추가하기</strong>를 통해 앞서
            만든 API 연결을 선택해서 활성화합니다.
          </GuideStep>

          <GuideStep
            step={11}
            title="데이터베이스 ID 저장"
            important
            image={{ src: "/guide/notion/08-share-copy-link.png", width: 1636, height: 586 }}
          >
            활성화 후 우측 상단의 <strong className="text-foreground">공유</strong> 버튼 클릭 후
            하단의 <strong className="text-foreground">링크 복사</strong>를 해주세요. 링크를
            붙여넣기 하면{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              https://app.notion.com/p/···?v···=copy_link
            </code>
            {" "}와 같이 표시되는데, 이때{" "}
            <strong className="text-foreground">p/과 ?v 사이의 숫자</strong>만 복사해서 자신만이
            아는 저장소에 저장해주세요!
          </GuideStep>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          액세스 토큰과 데이터베이스 ID를 저장했으면, Notion의 API Key 구현이 완료됐습니다.
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
