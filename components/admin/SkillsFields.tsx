import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/admin/TagInput";
import type { DeveloperProfile } from "@/types/profile";

interface SkillsFieldsProps {
  formData: DeveloperProfile;
  onUpdateSkill: (category: keyof DeveloperProfile["skills"], tags: string[]) => void;
}

/** Frontend·Backend·Tools 태그 입력 필드 — ProfileForm·ProfileWizard 공용 */
export function SkillsFields({ formData, onUpdateSkill }: SkillsFieldsProps) {
  return (
    <>
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
    </>
  );
}
