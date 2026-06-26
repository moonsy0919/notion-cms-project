import Image from "next/image";

interface ProfileAvatarProps {
  /** Phase 3에서 Notion avatar_url로 교체 */
  src?: string;
  alt?: string;
  size?: number;
}

/** Notion avatar URL로 허용된 호스트 목록 */
const ALLOWED_HOSTS = [
  "avatars.githubusercontent.com",
  "s3-us-west-2.amazonaws.com",
  "lh3.googleusercontent.com",
  "notion.so",
];

/** src가 next/image에서 허용된 호스트인지 확인 */
function isAllowedHost(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/**
 * 프로필 아바타 — 원형 이미지 + teal ring
 * Notion avatar_url 또는 GitHub 아바타 URL을 받아 렌더링
 * 허용되지 않은 호스트는 기본 GitHub 아바타로 폴백
 */
export function ProfileAvatar({
  src,
  alt = "프로필 사진",
  size = 96,
}: ProfileAvatarProps) {
  const fallback = "https://avatars.githubusercontent.com/moonsy0919";
  const imgSrc = src && isAllowedHost(src) ? src : fallback;

  return (
    <div
      className="rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
}
