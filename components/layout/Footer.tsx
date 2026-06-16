import Link from "next/link";
import { Container } from "@/components/layout/Container";

/** 사이트 푸터 — 저작권 + 간단한 네비게이션 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 문시현. All rights reserved.
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
              소개
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
