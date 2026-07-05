"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Database, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { ApiKeyCard, type ApiKeyProvider } from "@/components/setup/ApiKeyCard";

const REQUIRED_PROVIDERS: ApiKeyProvider[] = ["notion", "claude", "github"];

/** API 키 입력 페이지 — Notion·Claude·GitHub 카드별 개별 검증 + 즉시 쿠키 저장 */
export default function SetupPage() {
  const router = useRouter();
  const [verified, setVerified] = useState<Set<ApiKeyProvider>>(new Set());

  function handleVerified(provider: ApiKeyProvider) {
    setVerified((prev) => new Set(prev).add(provider));
  }

  const allVerified = REQUIRED_PROVIDERS.every((provider) => verified.has(provider));

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:py-16">
      <Link
        href="/setup/why"
        className="fixed top-4 right-4 z-50 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline md:top-6 md:right-6"
      >
        왜 API key가 필요한가요?
      </Link>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="font-mono text-2xl font-bold">
            <span className="text-primary">&lt;/&gt;</span> API Key 설정
          </h1>
          <p className="text-sm text-muted-foreground">
            Notion·Claude·GitHub 키를 각각 입력하고 검증해주세요. 키는 브라우저에만 저장됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ApiKeyCard
            provider="notion"
            title="Notion"
            icon={<Database className="h-4 w-4 text-white" />}
            iconBgClassName="bg-neutral-900"
            guideHref="/setup/guide/notion"
            fields={[
              { name: "notionApiKey", label: "Notion API Key", placeholder: "secret_...", type: "password" },
              {
                name: "notionDbId",
                label: "Notion Database ID",
                placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                type: "text",
              },
            ]}
            onVerified={handleVerified}
          />

          <ApiKeyCard
            provider="claude"
            title="Claude"
            icon={<Sparkles className="h-4 w-4 text-white" />}
            iconBgClassName="bg-[#c15f3c]"
            guideHref="/setup/guide/claude"
            fields={[
              {
                name: "anthropicApiKey",
                label: "Anthropic API Key",
                placeholder: "sk-ant-...",
                type: "password",
              },
            ]}
            onVerified={handleVerified}
          />

          <ApiKeyCard
            provider="github"
            title="GitHub"
            icon={<FaGithub className="h-4 w-4 text-white" />}
            iconBgClassName="bg-neutral-800"
            guideHref="/setup/guide/github"
            fields={[
              { name: "githubToken", label: "GitHub Token", placeholder: "ghp_...", type: "password" },
            ]}
            onVerified={handleVerified}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            disabled={!allVerified}
            onClick={() => router.push("/admin")}
          >
            계속하기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
