"use client";

import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { ProfileAvatar } from "@/components/home/ProfileAvatar";
import { BasicInfoFields } from "@/components/admin/BasicInfoFields";
import { SkillsFields } from "@/components/admin/SkillsFields";
import { useProfileFields } from "@/hooks/useProfileFields";
import { useSaveProfile } from "@/hooks/useSaveProfile";
import type { DeveloperProfile } from "@/types/profile";

interface ProfileFormProps {
  initialProfile: DeveloperProfile;
  /** 저장 성공 시 호출. 없으면 홈("/")으로 이동 */
  onSuccess?: () => void;
  /** 취소 버튼 클릭 시 호출. 없으면 취소 버튼 미표시 */
  onCancel?: () => void;
}

/** 개발자 프로필 편집 폼 */
export function ProfileForm({ initialProfile, onSuccess, onCancel }: ProfileFormProps) {
  const router = useRouter();
  const { profile, avatarUrl } = useProfile();
  const { formData, updateField, updateSkill } = useProfileFields(initialProfile);
  const { saving, save } = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await save(formData);
    if (!success) return;
    router.refresh();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* 아바타 + 현재 저장 정보 */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <ProfileAvatar src={avatarUrl ?? undefined} size={80} />
        <div className="text-center">
          <p className="text-sm font-semibold">{profile.name || "이름 미설정"}</p>
          <p className="text-xs text-muted-foreground">{profile.role || "역할 미설정"}</p>
        </div>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="border-t pt-5 space-y-4">
        <h3 className="text-sm font-semibold">기본 정보</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <BasicInfoFields formData={formData} onUpdateField={updateField} />
        </div>
      </div>

      {/* 기술 스택 섹션 */}
      <div className="border-t mt-5 pt-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">기술 스택</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter 또는 쉼표(,)로 추가 · 배지 X로 삭제
          </p>
        </div>
        <div className="space-y-3">
          <SkillsFields formData={formData} onUpdateSkill={updateSkill} />
        </div>
      </div>

      {/* 하단 액션바 */}
      <div className={`border-t mt-6 pt-4 grid gap-3 ${onCancel ? "grid-cols-2" : "grid-cols-1"}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-11 w-full rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="h-11 w-full rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              저장
            </>
          )}
        </button>
      </div>
    </form>
  );
}
