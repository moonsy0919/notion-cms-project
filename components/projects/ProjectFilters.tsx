"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 태그 접기 임계값 — 이보다 많으면 "더보기" 버튼으로 축약 */
const VISIBLE_TECH_LIMIT = 8;

interface ProjectFiltersProps {
  techList: string[];
  /** 서버 컴포넌트에서 searchParams.tech를 초기값으로 전달 */
  selectedTech?: string;
  className?: string;
}

export function ProjectFilters({ techList, selectedTech, className }: ProjectFiltersProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (tech: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (tech) {
      params.set("tech", tech);
    } else {
      params.delete("tech");
    }
    router.replace(`/projects?${params.toString()}`);
  };

  const isCollapsible = techList.length > VISIBLE_TECH_LIMIT;
  const visibleTechList =
    isCollapsible && !expanded ? techList.slice(0, VISIBLE_TECH_LIMIT) : techList;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={!selectedTech ? "default" : "outline"}
        size="sm"
        onClick={() => handleSelect(null)}
      >
        전체
      </Button>
      {visibleTechList.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(tech)}
        >
          {tech}
        </Button>
      ))}
      {isCollapsible && (
        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "접기" : `+${techList.length - VISIBLE_TECH_LIMIT}개 더`}
        </Button>
      )}
    </div>
  );
}
