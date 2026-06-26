"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UpdateProjectsButton } from "@/components/shared/UpdateProjectsButton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "홈", href: "/" },
  { label: "프로젝트", href: "/projects" },
  { label: "소개", href: "/about" },
];

/** 현재 경로가 네비게이션 항목과 일치하는지 판별 */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

/** 사이트 헤더 — 로고 + 네비게이션 + 테마 토글 */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-14 items-stretch justify-between">
          {/* 로고 + 데스크톱 네비게이션 */}
          <div className="flex items-stretch gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 pr-2 font-semibold text-foreground"
            >
              <span className="font-mono text-accent text-sm font-bold">&lt;/&gt;</span>
              <span>문시현</span>
            </Link>

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

          {/* 우측: 업데이트 버튼(개발 전용) + 테마 토글 + 모바일 햄버거 */}
          <div className="flex items-center gap-2">
            <UpdateProjectsButton />
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
                  <span>문시현</span>
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
