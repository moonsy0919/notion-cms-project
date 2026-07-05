import { cookies } from "next/headers";
import type { Metadata } from "next";
import { ProfileWizard } from "@/components/admin/ProfileWizard";
import type { DeveloperProfile } from "@/types/profile";

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

  return <ProfileWizard initialProfile={initialProfile} />;
}
