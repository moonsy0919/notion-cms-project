import { cookies } from "next/headers";
import { DeveloperProfileProvider } from "@/contexts/DeveloperProfileContext";
import { getOwnerProfile } from "@/lib/notion";
import { DEFAULT_PROFILE } from "@/types/profile";
import type { DeveloperProfile } from "@/types/profile";

/** (onboarding) 그룹 레이아웃 — Header·Footer 없음, Context만 제공 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  const apiKey = cookieStore.get("notion-api-key")?.value ?? "";

  let initialProfile: DeveloperProfile = DEFAULT_PROFILE;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<DeveloperProfile>;
      initialProfile = {
        ...DEFAULT_PROFILE,
        ...parsed,
        skills: { ...DEFAULT_PROFILE.skills, ...(parsed.skills ?? {}) },
      };
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }

  // /setup에서 저장된 notion-api-key로 Notion 아바타 취득
  const ownerProfile = apiKey
    ? await getOwnerProfile(apiKey).catch(() => null)
    : null;
  const avatarUrl = ownerProfile?.avatarUrl ?? null;

  return (
    <DeveloperProfileProvider
      initialProfile={initialProfile}
      avatarUrl={avatarUrl}
      githubUrl={null}
    >
      {children}
    </DeveloperProfileProvider>
  );
}
