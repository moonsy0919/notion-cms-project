import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DeveloperProfile } from "@/types/profile";

interface BasicInfoFieldsProps {
  formData: DeveloperProfile;
  onUpdateField: <K extends keyof DeveloperProfile>(key: K, value: DeveloperProfile[K]) => void;
}

/** 이름·역할·주력 기술·위치 입력 필드 — ProfileForm·ProfileWizard 공용 */
export function BasicInfoFields({ formData, onUpdateField }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="name">
          이름 <span className="text-accent text-xs font-normal">필수</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onUpdateField("name", e.target.value)}
          placeholder="홍길동"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">
          역할 <span className="text-accent text-xs font-normal">필수</span>
        </Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => onUpdateField("role", e.target.value)}
          placeholder="Developer"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="focus">주력 기술</Label>
        <Input
          id="focus"
          value={formData.focus}
          onChange={(e) => onUpdateField("focus", e.target.value)}
          placeholder="Next.js & TypeScript"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">위치</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          placeholder="서울, 대한민국"
        />
      </div>
    </>
  );
}
