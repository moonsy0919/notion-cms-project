import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClientFetchExample } from "./ClientFetchExample";
import { ErrorFetchExample } from "./ErrorFetchExample";

type Post = { id: number; title: string; category: string };

async function getPosts(): Promise<Post[]> {
  // 실제 API 호출 패턴: const res = await fetch("https://api.example.com/posts", { cache: "force-cache" });
  await new Promise((r) => setTimeout(r, 0));
  return [
    { id: 1, title: "Next.js App Router 완벽 가이드", category: "Next.js" },
    { id: 2, title: "TypeScript 제네릭 마스터하기", category: "TypeScript" },
    { id: 3, title: "Tailwind CSS v4 새로운 기능", category: "CSS" },
  ];
}

async function ServerFetchSection() {
  const posts = await getPosts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Server Component</CardTitle>
          <Badge variant="secondary">async/await</Badge>
        </div>
        <CardDescription>
          Server Component에서 직접 async/await로 데이터를 가져옵니다.
          클라이언트 JS 없이 서버에서 렌더링되며, Next.js의 fetch 캐싱을 그대로 활용할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span className="text-sm">{post.title}</span>
              <Badge variant="outline">{post.category}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function DataFetchingPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="데이터 페칭"
          description="API 호출, 로딩 상태, 에러 처리 등 데이터 관리의 세 가지 핵심 패턴을 확인하세요."
          className="mb-10"
        />
        <div className="grid gap-6 md:grid-cols-3">
          <ServerFetchSection />
          <ClientFetchExample />
          <ErrorFetchExample />
        </div>
      </Container>
    </div>
  );
}
