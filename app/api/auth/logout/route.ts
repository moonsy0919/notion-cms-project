import { NextResponse } from "next/server";

const EXPIRED_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 0,
  path: "/",
};

/** 세션 쿠키 5개를 즉시 만료시켜 로그아웃 처리합니다. */
export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("notion-api-key", "", EXPIRED_COOKIE);
  res.cookies.set("notion-db-id", "", EXPIRED_COOKIE);
  res.cookies.set("anthropic-api-key", "", EXPIRED_COOKIE);
  res.cookies.set("github-token", "", EXPIRED_COOKIE);
  res.cookies.set("developer-profile", "", EXPIRED_COOKIE);

  return res;
}
