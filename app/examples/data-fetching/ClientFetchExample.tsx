"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Post = { id: number; title: string; category: string };

const mockPosts: Post[] = [
  { id: 4, title: "React 19 새로운 훅 정리", category: "React" },
  { id: 5, title: "shadcn/ui 커스터마이징 가이드", category: "shadcn" },
  { id: 6, title: "Zustand vs Jotai 상태관리 비교", category: "상태관리" },
];

async function loadPosts(): Promise<Post[]> {
  // 실제 API: const res = await fetch("/api/posts"); return res.json();
  await new Promise((r) => setTimeout(r, 900));
  return mockPosts;
}

export function ClientFetchExample() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 로드: cleanup 함수로 언마운트 후 setState 호출 방지
  useEffect(() => {
    let cancelled = false;
    loadPosts().then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  // 다시 불러오기: 이벤트 핸들러에서 상태 초기화 후 fetch
  const handleRefetch = () => {
    setLoading(true);
    setPosts([]);
    loadPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Client Component</CardTitle>
            <Badge variant="secondary">useEffect</Badge>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefetch} disabled={loading}>
            다시 불러오기
          </Button>
        </div>
        <CardDescription>
          클라이언트에서 useEffect로 데이터를 가져옵니다. 로딩 중에는 Skeleton을 표시하며
          &ldquo;다시 불러오기&rdquo; 버튼으로 로딩 상태를 재현할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <Skeleton className="h-10 w-full rounded-md" />
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
