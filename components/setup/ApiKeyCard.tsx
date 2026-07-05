"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ApiKeyProvider = "notion" | "claude" | "github";
type CardStatus = "idle" | "verifying" | "success" | "error";

interface FieldSpec {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "password";
}

interface ApiKeyCardProps {
  provider: ApiKeyProvider;
  icon: ReactNode;
  iconBgClassName: string;
  title: string;
  fields: FieldSpec[];
  guideHref: string;
  onVerified: (provider: ApiKeyProvider) => void;
}

/** Notion·Claude·GitHub API 키 입력 및 개별 검증 카드 */
export function ApiKeyCard({
  provider,
  icon,
  iconBgClassName,
  title,
  fields,
  guideHref,
  onVerified,
}: ApiKeyCardProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""]))
  );
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<CardStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sweeping, setSweeping] = useState(false);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function toggleVisibility(name: string) {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  async function handleVerify() {
    setStatus("verifying");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, ...values }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setStatus("error");
        setErrorMessage(data.error ?? "잘못된 API Key입니다.");
        setSweeping(true);
        return;
      }

      setStatus("success");
      setSweeping(true);
      onVerified(provider);
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setSweeping(true);
    }
  }

  const sweepColor = status === "success" ? "#22c55e" : "#ef4444";
  const settledBorder =
    status === "success"
      ? "border-green-500"
      : status === "error"
        ? "border-destructive"
        : "border-border";

  return (
    <div
      className={cn("relative rounded-xl", sweeping ? "animate-border-sweep p-[2px]" : "p-0")}
      style={sweeping ? ({ "--sweep-color": sweepColor } as CSSProperties) : undefined}
      onAnimationEnd={() => setSweeping(false)}
    >
      {(status === "success" || status === "error") && (
        <div
          className={cn(
            "absolute -top-3 -right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full shadow-md",
            status === "success" ? "bg-green-500" : "bg-destructive"
          )}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-white" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      <div
        className={cn(
          "flex h-full flex-col gap-4 rounded-[calc(var(--radius-xl)-2px)] bg-card py-4 text-card-foreground",
          sweeping ? "border-0" : cn("border", settledBorder)
        )}
      >
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                iconBgClassName
              )}
            >
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Link
            href={guideHref}
            className="shrink-0 text-xs whitespace-nowrap text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            +API Key 생성 방법
          </Link>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex-1 space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`${provider}-${field.name}`}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={`${provider}-${field.name}`}
                    type={
                      field.type === "password" && !visibility[field.name]
                        ? "password"
                        : "text"
                    }
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    autoComplete="off"
                    className={field.type === "password" ? "pr-8" : undefined}
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field.name)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={visibility[field.name] ? "숨기기" : "보이기"}
                    >
                      {visibility[field.name] ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {status === "error" && errorMessage && (
              <p className="text-xs text-destructive">{errorMessage}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={status === "verifying" || status === "success"}
              onClick={handleVerify}
            >
              {status === "verifying" ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  검증 중...
                </>
              ) : status === "success" ? (
                "검증 완료"
              ) : (
                "검증"
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
