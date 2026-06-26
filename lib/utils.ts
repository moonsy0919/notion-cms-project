import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** next/image에서 허용된 아바타 호스트 목록 */
const AVATAR_ALLOWED_HOSTS = [
  "avatars.githubusercontent.com",
  "s3-us-west-2.amazonaws.com",
  "lh3.googleusercontent.com",
  "notion.so",
];

const AVATAR_FALLBACK = "https://avatars.githubusercontent.com/moonsy0919";

/**
 * Notion/GitHub avatar_url을 next/image 허용 src로 정규화합니다.
 * 허용되지 않은 호스트는 GitHub 아바타 폴백으로 대체합니다.
 */
export function resolveAvatarSrc(src?: string | null): string {
  if (!src) return AVATAR_FALLBACK;
  try {
    const { hostname } = new URL(src);
    const allowed = AVATAR_ALLOWED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`)
    );
    return allowed ? src : AVATAR_FALLBACK;
  } catch {
    return AVATAR_FALLBACK;
  }
}
