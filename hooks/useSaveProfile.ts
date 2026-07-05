"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import type { DeveloperProfile } from "@/types/profile";

/** 프로필 저장 API 호출 — ProfileForm·ProfileWizard 공용. 네비게이션은 호출부에서 반환값을 보고 처리 */
export function useSaveProfile() {
  const { setProfile } = useProfile();
  const [saving, setSaving] = useState(false);

  const save = async (formData: DeveloperProfile): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        toast.error(data.error ?? "저장에 실패했습니다.");
        return false;
      }
      setProfile(formData);
      toast.success("프로필이 저장되었습니다.");
      return true;
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, save };
}
