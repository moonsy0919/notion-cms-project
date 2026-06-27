import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { DEFAULT_PROFILE } from "@/types/profile";
import type { DeveloperProfile } from "@/types/profile";

export const metadata: Metadata = {
  title: "프로필 설정 | 관리자",
};

/** 개발자 프로필 관리 페이지 (서버 컴포넌트) */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  let initialProfile: DeveloperProfile = DEFAULT_PROFILE;
  if (raw) {
    try {
      initialProfile = JSON.parse(raw) as DeveloperProfile;
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="개발자 프로필 설정"
          description="홈 화면과 소개 섹션에 표시될 정보를 입력하세요."
          className="mb-8"
        />
        <ProfileForm initialProfile={initialProfile} />
      </Container>
    </div>
  );
}
