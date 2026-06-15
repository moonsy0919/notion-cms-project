"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/moonsy0919/claude-nextjs-starters";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-foreground">
              StarterKit
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(pathname.startsWith("/examples") && "bg-accent text-accent-foreground")}
              >
                <Link href="/examples">예제</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub className="h-4 w-4" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
