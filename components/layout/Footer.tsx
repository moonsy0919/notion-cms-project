import Link from "next/link";
import { Container } from "@/components/layout/Container";

const GITHUB_URL = "https://github.com/moonsy0919/claude-nextjs-starters";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StarterKit. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              홈
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
