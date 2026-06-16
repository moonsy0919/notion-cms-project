"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 네비게이션 메뉴 항목 정의 */
const navItems = [
  { label: "프로젝트", href: "/projects" },
  { label: "소개", href: "/about" },
];

/** 사이트 헤더 — 로고 + 네비게이션 + 테마 토글 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-foreground">
              문시현
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
