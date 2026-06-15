"use client";

import React, { useRef, useState } from "react";
import {
  useCounter,
  useToggle,
  useLocalStorage,
  useDebounceValue,
  useCopyToClipboard,
  useMediaQuery,
  useWindowSize,
  useOnClickOutside,
} from "usehooks-ts";
import { Copy, Check, Monitor, Smartphone, Maximize2, PanelTop } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function HookCard({
  title,
  hook,
  description,
  children,
}: {
  title: string;
  hook: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {hook}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0);
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" variant="outline" onClick={decrement}>
        −
      </Button>
      <span className="w-12 text-center text-xl font-bold tabular-nums">{count}</span>
      <Button size="sm" variant="outline" onClick={increment}>
        +
      </Button>
      <Button size="sm" variant="ghost" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}

function ToggleDemo() {
  const [value, toggle] = useToggle(false);
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={toggle}>
        {value ? "끄기" : "켜기"}
      </Button>
      <Badge variant={value ? "default" : "outline"}>{value ? "ON" : "OFF"}</Badge>
    </div>
  );
}

function LocalStorageDemo() {
  const [storedValue, setStoredValue] = useLocalStorage("starter-kit-demo-text", "");
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="ls-input">입력값 (새로고침 후에도 유지됩니다)</Label>
        <Input
          id="ls-input"
          value={storedValue}
          onChange={(e) => setStoredValue(e.target.value)}
          placeholder="저장할 텍스트 입력..."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        localStorage 키: <code className="font-mono">starter-kit-demo-text</code>
      </p>
    </div>
  );
}

function DebounceDemo() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounceValue(inputValue, 500);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="debounce-input">빠르게 입력해보세요</Label>
        <Input
          id="debounce-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="입력..."
        />
      </div>
      <Separator />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">500ms 후 반영:</span>
        <Badge variant="outline" className="font-mono">
          {debouncedValue || "(비어있음)"}
        </Badge>
      </div>
    </div>
  );
}

function CopyToClipboardDemo() {
  const [copiedText, copy] = useCopyToClipboard();
  const text = "npm run dev";

  return (
    <div className="flex items-center gap-3">
      <code className="rounded bg-muted px-2 py-1 font-mono text-sm">{text}</code>
      <Button
        size="sm"
        variant="outline"
        onClick={() => copy(text)}
      >
        {copiedText ? (
          <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="mr-1.5 h-3.5 w-3.5" />
        )}
        {copiedText ? "복사됨!" : "복사"}
      </Button>
    </div>
  );
}

function MediaQueryDemo() {
  // initializeWithValue: false로 SSR/클라이언트 초기값을 동일하게 유지해 hydration 불일치 방지
  const isMd = useMediaQuery("(min-width: 768px)", { initializeWithValue: false });

  return (
    <div className="flex items-center gap-3">
      {isMd ? (
        <Monitor className="h-5 w-5 text-primary" />
      ) : (
        <Smartphone className="h-5 w-5 text-primary" />
      )}
      <span className="text-sm text-muted-foreground">현재 화면:</span>
      <Badge>{isMd ? "데스크톱 (md 이상)" : "모바일 (md 미만)"}</Badge>
    </div>
  );
}

function WindowSizeDemo() {
  // initializeWithValue: false로 SSR/클라이언트 초기값을 동일하게 유지해 hydration 불일치 방지
  const { width, height } = useWindowSize({ initializeWithValue: false });
  const breakpoint =
    (width ?? 0) >= 1280 ? "xl"
    : (width ?? 0) >= 1024 ? "lg"
    : (width ?? 0) >= 768 ? "md"
    : (width ?? 0) >= 640 ? "sm"
    : "xs";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Maximize2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">
          {width ?? "—"} × {height ?? "—"} px
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Tailwind 브레이크포인트:</span>
        <Badge className="font-mono">{breakpoint}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">브라우저 창 크기를 조절해보세요.</p>
    </div>
  );
}

function ClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // useOnClickOutside는 RefObject<HTMLElement>를 요구하므로 타입 단언
  useOnClickOutside(panelRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setIsOpen(true)} disabled={isOpen}>
        <PanelTop className="mr-1.5 h-3.5 w-3.5" />
        패널 열기
      </Button>
      {isOpen && (
        <div
          ref={panelRef}
          className="rounded-lg border bg-card p-4 shadow-md space-y-2"
        >
          <p className="text-sm font-medium">패널이 열렸습니다</p>
          <p className="text-xs text-muted-foreground">패널 바깥을 클릭하면 자동으로 닫힙니다.</p>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
        </div>
      )}
      {!isOpen && (
        <p className="text-xs text-muted-foreground">패널이 닫혀있습니다.</p>
      )}
    </div>
  );
}

export default function HooksPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="usehooks-ts 예제"
          description="useLocalStorage, useDebounce, useWindowSize 등 실무에서 자주 쓰이는 커스텀 훅을 직접 체험하세요."
          className="mb-10"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <HookCard
            title="카운터"
            hook="useCounter"
            description="숫자를 증가·감소·리셋하는 가장 기본적인 상태 훅입니다."
          >
            <CounterDemo />
          </HookCard>

          <HookCard
            title="토글"
            hook="useToggle"
            description="boolean 값을 토글하는 패턴입니다. ON/OFF 상태 관리에 유용합니다."
          >
            <ToggleDemo />
          </HookCard>

          <HookCard
            title="로컬 스토리지"
            hook="useLocalStorage"
            description="값이 localStorage에 자동 저장되어 새로고침 후에도 유지됩니다."
          >
            <LocalStorageDemo />
          </HookCard>

          <HookCard
            title="디바운스"
            hook="useDebounceValue"
            description="입력이 멈춘 뒤 500ms 후에 값이 업데이트됩니다. 검색 입력에 유용합니다."
          >
            <DebounceDemo />
          </HookCard>

          <HookCard
            title="클립보드 복사"
            hook="useCopyToClipboard"
            description="텍스트를 클립보드에 복사하고, 성공 여부를 상태로 반환합니다."
          >
            <CopyToClipboardDemo />
          </HookCard>

          <HookCard
            title="미디어 쿼리"
            hook="useMediaQuery"
            description="CSS 미디어 쿼리를 React 상태로 구독합니다. 창 크기를 조절해보세요."
          >
            <MediaQueryDemo />
          </HookCard>

          <HookCard
            title="창 크기"
            hook="useWindowSize"
            description="현재 브라우저 창의 너비·높이를 실시간으로 반환합니다. Tailwind 브레이크포인트도 함께 표시합니다."
          >
            <WindowSizeDemo />
          </HookCard>

          <HookCard
            title="바깥 클릭 감지"
            hook="useOnClickOutside"
            description="지정한 요소 바깥을 클릭하면 콜백을 실행합니다. 드롭다운·팝오버 닫기 패턴에 유용합니다."
          >
            <ClickOutsideDemo />
          </HookCard>
        </div>
      </Container>
    </div>
  );
}
