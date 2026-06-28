"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useProfile } from "@/contexts/DeveloperProfileContext";

/** 사이트 푸터 — 저작권 + 간단한 네비게이션 */
export function Footer() {
  const { profile } = useProfile();

  return (
    <footer className="border-t bg-background">
      <Container className="max-w-none">
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile.name || "개발자"}. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              홈
            </Link>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              프로젝트
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Architecture
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
