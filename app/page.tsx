import { Layers, Zap, Palette, Terminal, Package } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { QuickStartDialog } from "@/components/shared/QuickStartDialog";

const GITHUB_URL = "https://github.com/moonsy0919/claude-nextjs-starters";

const features = [
  {
    icon: Zap,
    title: "빠른 시작",
    description:
      "Next.js 15 App Router, TypeScript, Tailwind CSS v4가 사전 구성되어 즉시 개발을 시작할 수 있습니다.",
  },
  {
    icon: Layers,
    title: "체계적인 구조",
    description:
      "Atomic Design 기반으로 분류된 컴포넌트 계층으로 유지보수가 쉽고 확장 가능한 코드베이스를 제공합니다.",
  },
  {
    icon: Palette,
    title: "다크모드 지원",
    description:
      "next-themes와 shadcn/ui CSS 변수를 사용한 완벽한 Light/Dark 모드 지원으로 사용자 경험을 향상시킵니다.",
  },
];

const techStack = [
  "Next.js 15",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "next-themes",
  "Lucide Icons",
  "Sonner",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="py-24 text-center">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Badge variant="secondary" className="mb-6">
              <Package className="mr-1.5 h-3 w-3" />
              프로덕션 레디 스타터킷
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              모던 웹 개발을
              <br />
              <span className="text-primary">빠르게 시작하세요</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui 로 구성된
              <br />
              프로덕션 레디 스타터킷입니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <QuickStartDialog>
                <Button size="lg">
                  <Terminal className="mr-2 h-4 w-4" />
                  시작하기
                </Button>
              </QuickStartDialog>
              <Button size="lg" variant="outline" asChild>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="mr-2 h-4 w-4" />
                  GitHub에서 보기
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 기술 스택 배지 */}
      <section className="border-t border-b py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm text-muted-foreground">기술 스택</span>
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      {/* 주요 특징 섹션 */}
      <section className="bg-muted/30 py-20">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">주요 특징</h2>
            <p className="mt-2 text-muted-foreground">
              검증된 기술 스택으로 생산성 높은 개발 환경을 제공합니다.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
