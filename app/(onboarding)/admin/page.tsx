import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import type { DeveloperProfile } from "@/types/profile";
import { CircuitBackground } from "@/components/ui/circuit-background";

export const metadata: Metadata = {
  title: "프로필 설정 | 관리자",
};

const EMPTY_PROFILE: DeveloperProfile = {
  name: "",
  role: "",
  focus: "",
  location: "",
  skills: { frontend: [], backend: [], tools: [] },
};

/** 개발자 프로필 관리 페이지 (서버 컴포넌트) */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  let initialProfile: DeveloperProfile = EMPTY_PROFILE;
  if (raw) {
    try {
      initialProfile = JSON.parse(raw) as DeveloperProfile;
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }

  return (
    <CircuitBackground>
      <div className="py-8">
        <Container>
          <PageHeader
            title="개발자 프로필 설정"
            description="홈 화면과 소개 섹션에 표시될 정보를 입력하세요."
            className="mb-8"
          />
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-2xl">
            <ProfileForm initialProfile={initialProfile} />
          </div>
        </Container>
      </div>
    </CircuitBackground>
  );
}
