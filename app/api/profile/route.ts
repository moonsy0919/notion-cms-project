import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_PROFILE } from "@/types/profile";
import type { DeveloperProfile } from "@/types/profile";

/** 현재 프로필 조회 */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  let profile: DeveloperProfile = DEFAULT_PROFILE;
  if (raw) {
    try {
      profile = JSON.parse(raw) as DeveloperProfile;
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }
  return Response.json({ profile });
}

/** 프로필 저장 — developer-profile httpOnly 쿠키 설정 */
export async function POST(request: NextRequest) {
  let body: DeveloperProfile;
  try {
    body = (await request.json()) as DeveloperProfile;
  } catch {
    return Response.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.role?.trim()) {
    return Response.json({ error: "이름과 역할은 필수입니다." }, { status: 400 });
  }

  const profile: DeveloperProfile = {
    name: body.name.trim(),
    role: body.role.trim(),
    focus: body.focus?.trim() ?? "",
    location: body.location?.trim() ?? "",
    skills: {
      frontend: Array.isArray(body.skills?.frontend) ? body.skills.frontend : [],
      backend: Array.isArray(body.skills?.backend) ? body.skills.backend : [],
      tools: Array.isArray(body.skills?.tools) ? body.skills.tools : [],
    },
  };

  const res = NextResponse.json({ success: true });
  res.cookies.set("developer-profile", JSON.stringify(profile), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return res;
}
