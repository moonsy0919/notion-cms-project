import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DEFAULT_PROFILE } from "@/types/profile";
import type { DeveloperProfile } from "@/types/profile";

export const metadata: Metadata = {
  title: "소개 | 문시현",
  description: "개발자 문시현 소개 페이지",
};

/**
 * 소개 페이지 (서버 컴포넌트)
 * 개발자 이력 및 기술 스택을 소개합니다.
 */
export default async function AboutPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  let profile: DeveloperProfile = DEFAULT_PROFILE;
  if (raw) {
    try {
      profile = JSON.parse(raw) as DeveloperProfile;
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }

  const techSkills = {
    Frontend: profile.skills.frontend,
    Backend: profile.skills.backend,
    Tools: profile.skills.tools,
  };

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="소개"
          description={`안녕하세요, ${profile.role} ${profile.name}입니다.`}
          className="mb-10"
        />

        <div className="mx-auto max-w-3xl space-y-12">
          {/* 자기소개 */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">About Me</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                {profile.focus}를 주로 사용하는 {profile.role}입니다.
                사용자 경험과 코드 품질을 중요하게 생각하며, 꾸준히 성장하는 개발자를 목표로 합니다.
              </p>
              <p>
                이 포트폴리오는 Notion을 CMS로 활용하여 프로젝트를 관리하고,
                Next.js App Router로 렌더링하는 구조로 만들어졌습니다.
              </p>
            </div>
          </section>

          {/* 기술 스택 */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">기술 스택</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(techSkills).map(([category, skills]) => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 경력/이력 — 추후 확장 예정 */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">경력</h2>
            <p className="text-sm text-muted-foreground">
              경력 정보를 추가할 예정입니다.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
