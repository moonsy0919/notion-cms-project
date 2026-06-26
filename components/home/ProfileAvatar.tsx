import Image from "next/image";
import { resolveAvatarSrc } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
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
  const imgSrc = resolveAvatarSrc(src);

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
