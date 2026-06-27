"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, Pencil } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UpdateProjectsButton } from "@/components/shared/UpdateProjectsButton";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "홈", href: "/" },
  { label: "프로젝트", href: "/projects" },
  { label: "Architecture", href: "/about" },
];

/** 현재 경로가 네비게이션 항목과 일치하는지 판별 */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

/** 사이트 헤더 — 로고 + 네비게이션 + 테마 토글 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/setup");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-14 items-stretch justify-between">
          {/* 로고 + 데스크톱 네비게이션 */}
          <div className="flex items-stretch gap-4">
            {/* 로고: </> 아이콘은 홈 링크, 이름은 프로필 편집 Sheet trigger */}
            <div className="flex items-center gap-1.5 pr-2 font-semibold text-foreground">
              <Link href="/" className="font-mono text-accent text-sm font-bold">
                &lt;/&gt;
              </Link>
              <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
                <SheetTrigger asChild>
                  <button className="group flex items-center gap-1 hover:text-accent transition-colors">
                    <span>{profile.name || "개발자"}</span>
                    <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>개발자 프로필 수정</SheetTitle>
                  </SheetHeader>
                  <ProfileForm
                    initialProfile={profile}
                    onSuccess={() => setProfileOpen(false)}
                    onCancel={() => setProfileOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* 데스크톱 네비게이션 — 활성 링크 teal 언더라인 */}
            <nav className="hidden md:flex items-stretch">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 text-sm font-medium transition-colors border-b-2",
                    isActive(pathname, item.href)
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 우측: 업데이트 버튼 + 로그아웃 + 테마 토글 + 모바일 햄버거 */}
          <div className="flex items-center gap-2">
            <UpdateProjectsButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="로그아웃"
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">로그아웃</span>
            </Button>
            <ThemeToggle />

            {/* 모바일 햄버거 메뉴 */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-60">
                <div className="flex items-center gap-1.5 mb-6 pt-2 font-semibold">
                  <span className="font-mono text-accent text-sm font-bold">&lt;/&gt;</span>
                  <span>{profile.name || "개발자"}</span>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(pathname, item.href)
                          ? "text-accent bg-accent/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
