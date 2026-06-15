"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortState } from "@/types";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** 각 행의 고유 키로 사용할 필드명 */
  rowKey: keyof T & string;
  /** 행당 항목 수 (0이면 페이지네이션 없음) */
  pageSize?: number;
  className?: string;
}

function SortIcon({ column, sort }: { column: string; sort: SortState | null }) {
  if (!sort || sort.column !== column) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return sort.direction === "asc"
    ? <ChevronUp className="h-3 w-3" />
    : <ChevronDown className="h-3 w-3" />;
}

/** 정렬 및 페이지네이션이 포함된 범용 데이터 테이블 */
export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);

  const sorted = sort
    ? [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sort.column];
        const bVal = (b as Record<string, unknown>)[sort.column];
        const cmp = String(aVal).localeCompare(String(bVal), "ko");
        return sort.direction === "asc" ? cmp : -cmp;
      })
    : data;

  const totalPages = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
  const paginated = pageSize > 0 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  function handleSort(column: string) {
    setSort((prev) => {
      if (prev?.column !== column) return { column, direction: "asc" };
      if (prev.direction === "asc") return { column, direction: "desc" };
      return null;
    });
    setPage(1);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      {col.label}
                      <SortIcon column={col.key} sort={sort} />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row) => (
                <TableRow key={String((row as Record<string, unknown>)[rowKey])}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                    ? col.render((row as Record<string, unknown>)[col.key], row)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageSize > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{sorted.length}개 중 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)}</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
