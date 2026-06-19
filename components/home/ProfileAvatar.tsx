import Image from "next/image";

interface ProfileAvatarProps {
  /** Phase 3에서 Notion avatar_url로 교체 */
  src?: string;
  alt?: string;
  size?: number;
}

/**
 * 프로필 아바타 — 원형 이미지 + teal ring
 * Phase 2.5: GitHub 아바타 플레이스홀더
 * Phase 3: Notion users.list()의 avatar_url로 교체
 */
export function ProfileAvatar({
  src = "https://avatars.githubusercontent.com/moonsy0919",
  alt = "프로필 사진",
  size = 96,
}: ProfileAvatarProps) {
  return (
    <div
      className="rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
}
