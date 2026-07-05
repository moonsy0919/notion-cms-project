import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Notion API Key 생성 방법 안내 페이지 (준비 중) */
export default function NotionGuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Link
        href="/setup"
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        돌아가기
      </Link>
      <h1 className="text-xl font-bold">Notion API Key 생성 방법</h1>
      <p className="text-sm text-muted-foreground">준비 중입니다.</p>
    </main>
  );
}
