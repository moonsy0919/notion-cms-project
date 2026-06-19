import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";

/** 기술 카테고리 데이터 */
const techCategories = [
  {
    label: "Frontend",
    items: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Prisma"],
  },
  {
    label: "Tools",
    items: ["Git", "Notion", "Vercel"],
  },
];

/**
 * 홈 About 프리뷰 섹션
 * 좌: 바이오 카드(monospace), 우: 프로필 사진(tilt + teal border)
 * 하단: 기술 카테고리 태그 행
 */
export function AboutPreview() {
  return (
    <section className="border-t py-20">
      <Container>
        {/* <About /> 태그 스타일 섹션 헤더 */}
        <div className="mb-10">
          <p className="font-mono text-accent text-sm font-medium mb-2">
            &lt;About /&gt;
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">소개</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            개발자로서의 가치관과 기술 스택을 소개합니다.
          </p>
        </div>

        {/* 좌우 2컬럼 — 바이오 카드 + 프로필 사진 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 좌측: 자기소개 바이오 카드 (monospace, dark card) */}
          <div className="rounded-lg border border-border bg-card p-6 font-mono text-sm space-y-3">
            <p className="text-muted-foreground text-xs">
              {`// about me`}
            </p>
            <p className="text-foreground leading-relaxed">
              <span className="text-accent">{"{"}</span>
              <br />
              {"  "}
              <span style={{ color: "var(--syntax-prop)" }}>name</span>
              {": "}
              <span style={{ color: "var(--syntax-string)" }}>"문시현"</span>
              {","}
              <br />
              {"  "}
              <span style={{ color: "var(--syntax-prop)" }}>role</span>
              {": "}
              <span style={{ color: "var(--syntax-string)" }}>"Frontend Developer"</span>
              {","}
              <br />
              {"  "}
              <span style={{ color: "var(--syntax-prop)" }}>location</span>
              {": "}
              <span style={{ color: "var(--syntax-string)" }}>"인천, 대한민국"</span>
              {","}
              <br />
              {"  "}
              <span style={{ color: "var(--syntax-prop)" }}>passion</span>
              {": "}
              <span style={{ color: "var(--syntax-string)" }}>"사용자 경험 & 성능"</span>
              {","}
              <br />
              <span className="text-accent">{"}"}</span>
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed pt-2">
              {`// Next.js와 TypeScript를 주로 사용하며`}
              <br />
              {`// 깔끔한 코드와 좋은 DX를 추구합니다.`}
            </p>
          </div>

          {/* 우측: 프로필 사진 (rotate-[-3deg] 틸트, teal accent border) */}
          <div className="flex justify-center">
            <div className="rotate-[-3deg] rounded-xl border-2 border-accent overflow-hidden shadow-lg">
              <Image
                src="https://avatars.githubusercontent.com/moonsy0919"
                alt="문시현 프로필 사진"
                width={240}
                height={240}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 하단: 기술 카테고리 태그 행 */}
        <div className="mt-10 flex flex-wrap gap-4">
          {techCategories.map((category) => (
            <div key={category.label} className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-accent border border-accent/40 rounded px-2 py-0.5">
                {category.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {category.items.join(" · ")}
              </span>
            </div>
          ))}
        </div>

        {/* 소개 페이지 링크 */}
        <div className="mt-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">
              자세한 소개 보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
