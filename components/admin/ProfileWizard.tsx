"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { SiNotion } from "react-icons/si";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { ProfileAvatar } from "@/components/home/ProfileAvatar";
import { BasicInfoFields } from "@/components/admin/BasicInfoFields";
import { SkillsFields } from "@/components/admin/SkillsFields";
import { useProfileFields } from "@/hooks/useProfileFields";
import { useSaveProfile } from "@/hooks/useSaveProfile";
import { cn } from "@/lib/utils";
import type { DeveloperProfile } from "@/types/profile";

const STEPS = [
  { id: 1, title: "기본 정보", description: "이름과 기본 정보를 입력해주세요" },
  { id: 2, title: "기술 스택", description: "사용하는 기술을 태그로 추가해주세요" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface ProfileWizardProps {
  initialProfile: DeveloperProfile;
}

/** 개발자 프로필 관리 2단계 위저드 (기본 정보 → 기술 스택) */
export function ProfileWizard({ initialProfile }: ProfileWizardProps) {
  const router = useRouter();
  const { avatarUrl } = useProfile();
  const [step, setStep] = useState<StepId>(1);
  const { formData, updateField, updateSkill } = useProfileFields(initialProfile);
  const { saving, save } = useSaveProfile();

  const canContinue = formData.name.trim() !== "" && formData.role.trim() !== "";

  const handleSave = async () => {
    const success = await save(formData);
    if (!success) return;
    router.refresh();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <WizardSidebar step={step} />
      <div className="flex flex-1 items-center justify-center px-4 py-10 md:py-0">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <BasicInfoStep
              formData={formData}
              avatarUrl={avatarUrl}
              canContinue={canContinue}
              onUpdateField={updateField}
              onContinue={() => setStep(2)}
            />
          ) : (
            <SkillsStep
              formData={formData}
              saving={saving}
              onUpdateSkill={updateSkill}
              onBack={() => setStep(1)}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** 좌측 스텝 리스트 — 데스크톱은 세로 목록, 모바일은 상단 축약 바 */
function WizardSidebar({ step }: { step: StepId }) {
  const activeStep = STEPS[step - 1];

  return (
    <aside className="flex shrink-0 flex-col gap-6 border-b border-sidebar-border bg-sidebar px-6 py-6 md:w-72 md:border-b-0 md:border-r md:px-8 md:py-12">
      <div className="mb-20 flex items-center gap-2 md:mb-[202px]">
        <SiNotion className="h-7 w-7 shrink-0 text-sidebar-foreground" />
        <span className="text-2xl font-bold whitespace-nowrap text-sidebar-foreground">Notion Portfolio</span>
      </div>

      <div className="hidden md:flex md:flex-col md:items-center">
        {STEPS.map((s, index) => {
          const state = s.id < step ? "done" : s.id === step ? "current" : "pending";
          return (
            <div key={s.id} className="flex flex-col items-center text-center">
              <StepIcon state={state} />
              <p
                className={cn(
                  "mt-3 text-base font-semibold",
                  state === "pending" ? "text-sidebar-foreground/60" : "text-sidebar-foreground"
                )}
              >
                {s.title}
              </p>
              <p className="mt-1 text-sm text-sidebar-foreground/50">{s.description}</p>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "my-4 h-6 w-px",
                    state === "done" ? "bg-sidebar-primary" : "bg-sidebar-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                s.id <= step ? "bg-sidebar-primary" : "bg-sidebar-border"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-medium text-sidebar-foreground/70">
          {step}/{STEPS.length} · {activeStep.title}
        </p>
      </div>
    </aside>
  );
}

function StepIcon({ state }: { state: "done" | "current" | "pending" }) {
  if (state === "done") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-sidebar-primary">
        <span className="h-2 w-2 rounded-full bg-sidebar-primary" />
      </span>
    );
  }
  return <span className="h-6 w-6 rounded-full border-2 border-sidebar-border" />;
}

interface BasicInfoStepProps {
  formData: DeveloperProfile;
  avatarUrl: string | null;
  canContinue: boolean;
  onUpdateField: <K extends keyof DeveloperProfile>(key: K, value: DeveloperProfile[K]) => void;
  onContinue: () => void;
}

/** 1단계 — 아바타 프리뷰 + 기본 정보 입력 */
function BasicInfoStep({
  formData,
  avatarUrl,
  canContinue,
  onUpdateField,
  onContinue,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <ProfileAvatar src={avatarUrl ?? undefined} size={112} />
      </div>

      <div className="space-y-4">
        <BasicInfoFields formData={formData} onUpdateField={onUpdateField} />
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue
      </button>
    </div>
  );
}

interface SkillsStepProps {
  formData: DeveloperProfile;
  saving: boolean;
  onUpdateSkill: (category: keyof DeveloperProfile["skills"], tags: string[]) => void;
  onBack: () => void;
  onSave: () => void;
}

/** 2단계 — 기술 스택 태그 입력 + 저장 */
function SkillsStep({ formData, saving, onUpdateSkill, onBack, onSave }: SkillsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">기술 스택</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Enter 또는 쉼표(,)로 추가 · 배지 X로 삭제
        </p>
      </div>

      <div className="space-y-4">
        <SkillsFields formData={formData} onUpdateSkill={onUpdateSkill} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-11 w-full rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}
