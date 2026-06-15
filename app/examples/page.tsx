import Link from "next/link";
import { Layers, FileText, LayoutGrid, Settings, Database, Wrench, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";

const examples = [
  {
    icon: Layers,
    title: "컴포넌트 쇼케이스",
    description: "Button, Badge, Dialog, Tabs 등 shadcn/ui 컴포넌트의 모든 variants와 사용법을 한눈에 확인하는 갤러리입니다.",
    href: "/components",
    label: "쇼케이스 보기",
  },
  {
    icon: FileText,
    title: "폼 예제",
    description: "로그인·회원가입·문의·검색 필터 등 다양한 폼 패턴과 실시간 검증, 에러 메시지 처리 예제입니다.",
    href: "/examples/forms",
    label: "폼 예제 보기",
  },
  {
    icon: LayoutGrid,
    title: "레이아웃 예제",
    description: "그리드, 벤토, 사이드바, 반응형 스택 등 Tailwind CSS로 구현하는 다양한 레이아웃 패턴 예제입니다.",
    href: "/examples/layouts",
    label: "레이아웃 보기",
  },
  {
    icon: Settings,
    title: "설정 & 최적화",
    description: "테마·알림·프로필·보안 등 실제 앱 설정 페이지에서 자주 쓰이는 UI 구현 패턴 예제입니다.",
    href: "/examples/settings",
    label: "설정 보기",
  },
  {
    icon: Database,
    title: "데이터 페칭",
    description: "API 호출, 로딩 상태, 에러 처리 등 서버·클라이언트 컴포넌트의 데이터 관리 패턴 예제입니다.",
    href: "/examples/data-fetching",
    label: "데이터 페칭 보기",
  },
  {
    icon: Wrench,
    title: "usehooks-ts 예제",
    description: "useLocalStorage, useDebounce, useWindowSize 등 실무에서 자주 쓰이는 커스텀 훅을 직접 체험하는 예제입니다.",
    href: "/examples/hooks",
    label: "훅 예제 보기",
  },
];

export default function ExamplesPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="예제 탐색"
          description="스타터킷의 모든 기능을 실제 동작하는 예제를 통해 탐색해보세요."
          className="mb-10"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <Card key={example.href} className="group flex flex-col transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={example.href}>
                      {example.label}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
