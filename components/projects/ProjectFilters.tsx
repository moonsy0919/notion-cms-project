"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  techList: string[];
  className?: string;
}

export function ProjectFilters({ techList, className }: ProjectFiltersProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={selectedTech === null ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedTech(null)}
      >
        전체
      </Button>
      {techList.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTech(tech)}
        >
          {tech}
        </Button>
      ))}
    </div>
  );
}
