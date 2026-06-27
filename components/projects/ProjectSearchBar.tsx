"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProjectSearchBarProps {
  /** 서버 컴포넌트에서 searchParams.q를 초기값으로 전달 */
  initialQuery?: string;
  className?: string;
}

export function ProjectSearchBar({ initialQuery = "", className }: ProjectSearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 마운트 시점엔 URL 업데이트를 건너뜀 (초기값이 이미 URL과 일치)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      // 콜백 내부에서 현재 URL 읽어 다른 파라미터(tech 등)를 보존
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`/projects?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="프로젝트 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
