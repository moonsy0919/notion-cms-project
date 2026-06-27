"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { ProfileAvatar } from "@/components/home/ProfileAvatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { DeveloperProfile } from "@/types/profile";

/** 태그 입력 — Enter 또는 쉼표로 추가, X로 제거 */
function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputText, setInputText] = useState("");

  const addTag = () => {
    const trimmed = inputText.trim().replace(/,+$/, "");
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputText("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputText && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1.5">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  );
}

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
  const { profile, setProfile, avatarUrl } = useProfile();
  const [formData, setFormData] = useState<DeveloperProfile>(initialProfile);
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof DeveloperProfile>(
    key: K,
    value: DeveloperProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = (
    category: keyof DeveloperProfile["skills"],
    tags: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: tags },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? "저장에 실패했습니다.");
        return;
      }
      setProfile(formData);
      toast.success("프로필이 저장되었습니다.");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
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
          <div className="space-y-1.5">
            <Label htmlFor="name">
              이름{" "}
              <span className="text-accent text-xs font-normal">필수</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="홍길동"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">
              역할{" "}
              <span className="text-accent text-xs font-normal">필수</span>
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="Frontend Developer"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="focus">주력 기술</Label>
            <Input
              id="focus"
              value={formData.focus}
              onChange={(e) => updateField("focus", e.target.value)}
              placeholder="Next.js & TypeScript"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">위치</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="서울, 대한민국"
            />
          </div>
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
          <div className="space-y-1.5">
            <Label>Frontend</Label>
            <TagInput
              value={formData.skills.frontend}
              onChange={(tags) => updateSkill("frontend", tags)}
              placeholder="Next.js 입력 후 Enter..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Backend</Label>
            <TagInput
              value={formData.skills.backend}
              onChange={(tags) => updateSkill("backend", tags)}
              placeholder="Node.js 입력 후 Enter..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tools</Label>
            <TagInput
              value={formData.skills.tools}
              onChange={(tags) => updateSkill("tools", tags)}
              placeholder="Git 입력 후 Enter..."
            />
          </div>
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
