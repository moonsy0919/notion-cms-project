"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Post = { id: number; title: string; category: string };

const mockPosts: Post[] = [
  { id: 7, title: "에러 처리 패턴 완벽 가이드", category: "패턴" },
  { id: 8, title: "로딩·성공·에러 상태 설계", category: "UX" },
  { id: 9, title: "재시도(Retry) 로직 구현법", category: "패턴" },
];

/** 50% 확률로 에러를 던지는 목업 API */
async function loadPostsWithError(): Promise<Post[]> {
  await new Promise((r) => setTimeout(r, 900));
  if (Math.random() < 0.5) {
    throw new Error("네트워크 오류: 서버에 연결할 수 없습니다.");
  }
  return mockPosts;
}

type Status = "idle" | "loading" | "success" | "error";

export function ErrorFetchExample() {
  const [status, setStatus] = useState<Status>("idle");
  const [posts, setPosts] = useState<Post[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFetch = async () => {
    setStatus("loading");
    setPosts([]);
    setErrorMsg("");
    try {
      const data = await loadPostsWithError();
      setPosts(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "알 수 없는 오류");
      setStatus("error");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">에러 처리</CardTitle>
            <Badge variant="secondary">try / catch</Badge>
          </div>
          <Button size="sm" variant="outline" onClick={handleFetch} disabled={status === "loading"}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
            {status === "idle" ? "불러오기" : "재시도"}
          </Button>
        </div>
        <CardDescription>
          버튼을 누르면 50% 확률로 에러가 발생합니다.
          로딩·성공·에러 세 가지 상태를 직접 체험해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <p className="text-sm text-muted-foreground">버튼을 눌러 데이터를 불러오세요.</p>
        )}

        {status === "loading" && (
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <Skeleton className="h-10 w-full rounded-md" />
              </li>
            ))}
          </ul>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {status === "success" && (
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
