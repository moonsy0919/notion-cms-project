"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/moonsy0919/claude-nextjs-starters";

const steps = [
  {
    label: "1. 저장소 클론",
    command: "git clone https://github.com/moonsy0919/claude-nextjs-starters",
  },
  {
    label: "2. 의존성 설치",
    command: "cd claude-nextjs-starters && npm install",
  },
  {
    label: "3. 개발 서버 실행",
    command: "npm run dev",
  },
];

/** 클립보드 복사 버튼 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("클립보드에 복사됐습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      aria-label="명령어 복사"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

/** 시작하기 다이얼로그 — 자식 요소를 트리거로 사용 */
export function QuickStartDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            스타터킷 시작하기
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {steps.map((step) => (
            <div key={step.label}>
              <p className="mb-1.5 text-sm font-medium text-muted-foreground">{step.label}</p>
              <div className="flex items-center rounded-md bg-muted px-3 py-2">
                <code className="flex-1 select-all font-mono text-sm">{step.command}</code>
                <CopyButton text={step.command} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub에서 보기
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
