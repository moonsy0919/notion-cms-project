"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { ProfileAvatar } from "@/components/home/ProfileAvatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/admin/TagInput";
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
  const { profile, setProfile, avatarUrl } = useProfile();
  const [step, setStep] = useState<StepId>(1);
  const [formData, setFormData] = useState<DeveloperProfile>(initialProfile);
  const [saving, setSaving] = useState(false);

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

  const canContinue = formData.name.trim() !== "" && formData.role.trim() !== "";

  const handleSave = async () => {
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
        return;
      }
      setProfile(formData);
      router.refresh();
      toast.success("프로필이 저장되었습니다.");
      router.push("/");
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
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
              profileName={profile.name}
              profileRole={profile.role}
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
      <div className="hidden md:flex md:flex-col">
        {STEPS.map((s, index) => {
          const state = s.id < step ? "done" : s.id === step ? "current" : "pending";
          return (
            <div key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "my-1 w-px flex-1",
                      state === "done" ? "bg-sidebar-primary" : "bg-sidebar-border"
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-8", index === STEPS.length - 1 && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    state === "pending" ? "text-sidebar-foreground/60" : "text-sidebar-foreground"
                  )}
                >
                  {s.title}
                </p>
                <p className="text-xs text-sidebar-foreground/50">{s.description}</p>
              </div>
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
        <p className="mt-2 text-xs font-medium text-sidebar-foreground/70">
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
  profileName: string;
  profileRole: string;
  canContinue: boolean;
  onUpdateField: <K extends keyof DeveloperProfile>(key: K, value: DeveloperProfile[K]) => void;
  onContinue: () => void;
}

/** 1단계 — 아바타 프리뷰 + 기본 정보 입력 */
function BasicInfoStep({
  formData,
  avatarUrl,
  profileName,
  profileRole,
  canContinue,
  onUpdateField,
  onContinue,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <ProfileAvatar src={avatarUrl ?? undefined} size={72} />
        <div className="text-center">
          <p className="text-sm font-semibold">{profileName || "이름 미설정"}</p>
          <p className="text-xs text-muted-foreground">{profileRole || "역할 미설정"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="wizard-name">
            이름 <span className="text-accent text-xs font-normal">필수</span>
          </Label>
          <Input
            id="wizard-name"
            value={formData.name}
            onChange={(e) => onUpdateField("name", e.target.value)}
            placeholder="홍길동"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wizard-role">
            역할 <span className="text-accent text-xs font-normal">필수</span>
          </Label>
          <Input
            id="wizard-role"
            value={formData.role}
            onChange={(e) => onUpdateField("role", e.target.value)}
            placeholder="Developer"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wizard-focus">주력 기술</Label>
          <Input
            id="wizard-focus"
            value={formData.focus}
            onChange={(e) => onUpdateField("focus", e.target.value)}
            placeholder="Next.js & TypeScript"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wizard-location">위치</Label>
          <Input
            id="wizard-location"
            value={formData.location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            placeholder="서울, 대한민국"
          />
        </div>
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
        <div className="space-y-1.5">
          <Label>Frontend</Label>
          <TagInput
            value={formData.skills.frontend}
            onChange={(tags) => onUpdateSkill("frontend", tags)}
            placeholder="Next.js 입력 후 Enter..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Backend</Label>
          <TagInput
            value={formData.skills.backend}
            onChange={(tags) => onUpdateSkill("backend", tags)}
            placeholder="Node.js 입력 후 Enter..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Tools</Label>
          <TagInput
            value={formData.skills.tools}
            onChange={(tags) => onUpdateSkill("tools", tags)}
            placeholder="Git 입력 후 Enter..."
          />
        </div>
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
