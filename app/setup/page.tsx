"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircuitBackground } from "@/components/ui/circuit-background";

interface FormState {
  notionApiKey: string;
  notionDbId: string;
  anthropicApiKey: string;
  githubToken: string;
}

/** API 키 입력 → httpOnly 쿠키 설정 → /admin으로 이동 */
export default function SetupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    notionApiKey: "",
    notionDbId: "",
    anthropicApiKey: "",
    githubToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notionApiKey: form.notionApiKey,
          notionDbId: form.notionDbId,
          anthropicApiKey: form.anthropicApiKey,
          githubToken: form.githubToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "알 수 없는 오류가 발생했습니다.");
        return;
      }

      router.push("/admin");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CircuitBackground>
    <main className="flex flex-1 items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            <span className="font-mono text-primary">&lt;/&gt;</span> 포트폴리오 설정
          </CardTitle>
          <CardDescription>
            Notion과 AI 연동을 위한 API 키를 입력해주세요. 키는 브라우저에만 저장됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notionApiKey">Notion API Key *</Label>
              <Input
                id="notionApiKey"
                name="notionApiKey"
                type="password"
                placeholder="secret_..."
                value={form.notionApiKey}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notionDbId">Notion Database ID *</Label>
              <Input
                id="notionDbId"
                name="notionDbId"
                type="text"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={form.notionDbId}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropicApiKey">Anthropic API Key *</Label>
              <Input
                id="anthropicApiKey"
                name="anthropicApiKey"
                type="password"
                placeholder="sk-ant-..."
                value={form.anthropicApiKey}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubToken">
                GitHub Token{" "}
                <span className="text-xs text-muted-foreground">(선택)</span>
              </Label>
              <Input
                id="githubToken"
                name="githubToken"
                type="password"
                placeholder="ghp_..."
                value={form.githubToken}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  검증 중...
                </>
              ) : (
                "시작하기"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
    </CircuitBackground>
  );
}
