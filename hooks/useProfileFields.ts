"use client";

import { useState } from "react";
import type { DeveloperProfile } from "@/types/profile";

/** 프로필 폼 필드 상태 관리 — ProfileForm·ProfileWizard 공용 */
export function useProfileFields(initialProfile: DeveloperProfile) {
  const [formData, setFormData] = useState<DeveloperProfile>(initialProfile);

  const updateField = <K extends keyof DeveloperProfile>(
    key: K,
    value: DeveloperProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = (category: keyof DeveloperProfile["skills"], tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: tags },
    }));
  };

  return { formData, updateField, updateSkill };
}
