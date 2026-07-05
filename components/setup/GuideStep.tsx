import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface GuideStepProps {
  step: number;
  title: string;
  important?: boolean;
  image?: { src: string; width: number; height: number };
  children: React.ReactNode;
}

/** 가이드 단계 단위 컴포넌트 — 번호 배지 + 제목 + 설명 + 선택적 스크린샷 */
export function GuideStep({ step, title, important, image, children }: GuideStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
        {step}
      </div>
      <div className="flex-1 space-y-2 pb-8">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-foreground">{title}</h2>
          {important && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              중요
            </span>
          )}
        </div>
        <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
        {image && (
          <div className="mt-3 inline-block overflow-hidden rounded-lg border bg-card">
            <Image
              src={image.src}
              alt={title}
              width={image.width}
              height={image.height}
              className="h-auto w-auto max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ExternalLinkText({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
