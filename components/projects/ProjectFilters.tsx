"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  techList: string[];
  /** 서버 컴포넌트에서 searchParams.tech를 초기값으로 전달 */
  selectedTech?: string;
  className?: string;
}

export function ProjectFilters({ techList, selectedTech, className }: ProjectFiltersProps) {
  const router = useRouter();

  const handleSelect = (tech: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (tech) {
      params.set("tech", tech);
    } else {
      params.delete("tech");
    }
    router.replace(`/projects?${params.toString()}`);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={!selectedTech ? "default" : "outline"}
        size="sm"
        onClick={() => handleSelect(null)}
      >
        전체
      </Button>
      {techList.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(tech)}
        >
          {tech}
        </Button>
      ))}
    </div>
  );
}
