"use client";

import { createContext, useContext, useState } from "react";
import type { DeveloperProfile } from "@/types/profile";

interface DeveloperProfileContextValue {
  profile: DeveloperProfile;
  setProfile: (profile: DeveloperProfile) => void;
}

const DeveloperProfileContext = createContext<DeveloperProfileContextValue | null>(null);

interface DeveloperProfileProviderProps {
  initialProfile: DeveloperProfile;
  children: React.ReactNode;
}

/** 개발자 프로필 전역 상태 Provider — (main)/layout.tsx에서 주입 */
export function DeveloperProfileProvider({
  initialProfile,
  children,
}: DeveloperProfileProviderProps) {
  const [profile, setProfile] = useState<DeveloperProfile>(initialProfile);

  return (
    <DeveloperProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </DeveloperProfileContext.Provider>
  );
}

/** 개발자 프로필 읽기/수정 훅 */
export function useProfile(): DeveloperProfileContextValue {
  const ctx = useContext(DeveloperProfileContext);
  if (!ctx) throw new Error("useProfile must be used within DeveloperProfileProvider");
  return ctx;
}
