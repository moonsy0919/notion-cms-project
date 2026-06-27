import { NextRequest, NextResponse } from "next/server";

/** 인증 없이 접근 가능한 경로 */
const PUBLIC_PATHS = ["/setup", "/api/auth/setup", "/api/auth/logout"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 공개 경로는 쿠키 없이 통과
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const hasApiKey = !!req.cookies.get("notion-api-key")?.value;
  const hasProfile = !!req.cookies.get("developer-profile")?.value;

  // API Key 미설정 → /setup으로 리다이렉트 (공개 경로는 제외)
  if (!hasApiKey && !isPublic) {
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  // API Key 있음 + 프로필 미설정 → /admin으로 리다이렉트
  // /admin 자체, 공개 경로, API 경로는 통과 허용 (API는 핸들러 자체가 인증 처리)
  if (hasApiKey && !hasProfile && !isPublic && pathname !== "/admin" && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 온보딩 완료 후 /setup 또는 /admin 직접 접근 → 홈으로 리다이렉트
  if (hasApiKey && hasProfile && (pathname === "/setup" || pathname === "/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
