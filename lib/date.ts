import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

/** 날짜를 지정 포맷으로 변환 (기본: yyyy.MM.dd) */
export function formatDate(date: Date | string, pattern = "yyyy.MM.dd"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: ko });
}

/** 날짜와 시간 포맷 (yyyy.MM.dd HH:mm) */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, "yyyy.MM.dd HH:mm");
}

/** 현재 시각으로부터 상대 시간 ("3일 전", "방금 전") */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ko });
}
