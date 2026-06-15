/** 숫자를 로케일 포맷으로 변환 (1234567 → "1,234,567") */
export function formatNumber(value: number, locale = "ko-KR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** 통화 포맷 (1234567 → "₩1,234,567") */
export function formatCurrency(
  value: number,
  currency = "KRW",
  locale = "ko-KR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** 퍼센트 포맷 (0.1234 → "12.3%") */
export function formatPercent(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
