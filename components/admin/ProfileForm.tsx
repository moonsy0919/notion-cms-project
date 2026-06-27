"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/DeveloperProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
}

/** 개발자 프로필 편집 폼 */
export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { setProfile } = useProfile();
  const [formData, setFormData] = useState<DeveloperProfile>(initialProfile);
  const [saving, setSaving] = useState(false);

  /** 단일 최상위 필드 업데이트 */
  const updateField = <K extends keyof DeveloperProfile>(
    key: K,
    value: DeveloperProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /** 기술 스택 카테고리 업데이트 */
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
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="홍길동"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">역할 *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Frontend Developer"
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* 기술 스택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기술 스택</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Enter 또는 쉼표(,)로 항목 추가 · 배지 X로 삭제
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
