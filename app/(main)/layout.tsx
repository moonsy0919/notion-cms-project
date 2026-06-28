import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeveloperProfileProvider } from "@/contexts/DeveloperProfileContext";
import { getOwnerProfile } from "@/lib/notion";
import { DEFAULT_PROFILE } from "@/types/profile";
import type { DeveloperProfile } from "@/types/profile";

/** (main) 그룹 레이아웃 — Header·Footer 포함, 프로필 Context 제공 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
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
      // 쿠키 파싱 실패 시 기본값 사용
    }
  }

  const apiKey = cookieStore.get("notion-api-key")?.value ?? "";
  const githubToken = cookieStore.get("github-token")?.value ?? "";

  let avatarUrl: string | null = null;
  let githubUrl: string | null = null;

  const [ownerProfile, githubUser] = await Promise.all([
    apiKey
      ? getOwnerProfile(apiKey).catch(() => null)
      : Promise.resolve(null),
    githubToken
      ? fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github+json",
          },
          cache: "no-store",
        })
          .then((r) => (r.ok ? (r.json() as Promise<{ html_url: string }>) : null))
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  avatarUrl = ownerProfile?.avatarUrl ?? null;
  githubUrl = githubUser?.html_url ?? null;

  return (
    <DeveloperProfileProvider initialProfile={initialProfile} avatarUrl={avatarUrl} githubUrl={githubUrl}>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </DeveloperProfileProvider>
  );
}
