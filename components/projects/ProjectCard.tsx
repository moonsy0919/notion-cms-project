import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import type { Project } from "@/types/notion";
import { formatDate } from "@/lib/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 프로젝트 상태에 따른 배지 색상 */
function getStatusVariant(status: Project["status"]) {
  if (status === "진행중") return "default";
  if (status === "유지보수") return "secondary";
  return "outline";
}

/** 개발 기간 문자열 반환 */
function getPeriodLabel(periodStart: string | null, periodEnd: string | null): string {
  if (!periodStart) return "기간 미정";
  const start = formatDate(periodStart);
  if (!periodEnd) return `${start} ~ 진행중`;
  return `${start} ~ ${formatDate(periodEnd)}`;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const {
    id,
    title,
    description,
    category,
    status,
    techStack,
    periodStart,
    periodEnd,
    githubUrl,
    demoUrl,
  } = project;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex flex-wrap gap-1.5">
          {status && (
            <Badge variant={getStatusVariant(status)}>{status}</Badge>
          )}
          {category && (
            <Badge variant="secondary">{category}</Badge>
          )}
        </div>
        <CardTitle>
          <Link
            href={`/projects/${id}`}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          {getPeriodLabel(periodStart, periodEnd)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      {(githubUrl || demoUrl) && (
        <CardFooter className="gap-2">
          {githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <FaGithub />
                GitHub
              </a>
            </Button>
          )}
          {demoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Demo
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
