import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeveloperProfileProvider } from "@/contexts/DeveloperProfileContext";
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
      initialProfile = JSON.parse(raw) as DeveloperProfile;
    } catch {
      // 쿠키 파싱 실패 시 기본값 사용
    }
  }

  return (
    <DeveloperProfileProvider initialProfile={initialProfile}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </DeveloperProfileProvider>
  );
}
