"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useIsMounted } from "usehooks-ts";
import { toast } from "sonner";
import { Laptop, LogOut, Shield } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">테마 설정</CardTitle>
        <CardDescription>
          next-themes의 useTheme을 사용한 라이트/다크/시스템 테마 전환 예제입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* isMounted() 전에는 빈 문자열로 controlled 상태를 유지해 hydration 불일치 방지 */}
        <RadioGroup value={isMounted() ? (theme ?? "") : ""} onValueChange={setTheme} className="space-y-3">
          {[
            { value: "light", label: "라이트 모드" },
            { value: "dark", label: "다크 모드" },
            { value: "system", label: "시스템 설정 따르기" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-3">
              <RadioGroupItem value={value} id={`theme-${value}`} />
              <Label htmlFor={`theme-${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

const notificationItems = [
  { key: "email", label: "이메일 알림", description: "새 활동에 대한 이메일 수신" },
  { key: "push", label: "푸시 알림", description: "브라우저 푸시 알림" },
  { key: "marketing", label: "마케팅 수신", description: "이벤트·업데이트 정보 수신" },
] as const;

function NotificationCard() {
  const [state, setState] = useState({ email: true, push: false, marketing: false });

  const toggle = (key: keyof typeof state) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info("알림 설정이 변경됐습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">알림 설정</CardTitle>
        <CardDescription>
          Switch 컴포넌트로 알림 항목을 개별 토글하는 패턴입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationItems.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch checked={state[key]} onCheckedChange={() => toggle(key)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DisplayCard() {
  const [language, setLanguage] = useState("ko");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">표시 설정</CardTitle>
        <CardDescription>
          Select 컴포넌트를 사용한 언어/지역 설정 패턴입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>언어</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => toast.success("설정이 저장됐습니다.")}>
          저장
        </Button>
      </CardContent>
    </Card>
  );
}

function ProfileCard() {
  const [name, setName] = useState("김민준");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    toast.success("프로필이 저장됐습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">프로필 설정</CardTitle>
        <CardDescription>
          Avatar, Input, Textarea를 조합한 프로필 편집 패턴입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{name || "이름 없음"}</p>
            <p className="text-xs text-muted-foreground">이름 입력 시 이니셜이 업데이트됩니다</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="profile-name">이름</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">이메일</Label>
          <Input
            id="profile-email"
            type="email"
            defaultValue="minjun@example.com"
            disabled
          />
          <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-bio">소개</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="간단한 자기소개를 입력하세요..."
            rows={3}
          />
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </CardContent>
    </Card>
  );
}

const sessionItems = [
  { device: "현재 기기", info: "Chrome · macOS", current: true },
  { device: "다른 기기", info: "Safari · iPhone", current: false },
  { device: "다른 기기", info: "Firefox · Windows", current: false },
];

function SecurityCard() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleTwoFactor = (checked: boolean) => {
    setTwoFactor(checked);
    toast.info(checked ? "2단계 인증이 활성화됐습니다." : "2단계 인증이 비활성화됐습니다.");
  };

  const handleChangePassword = async () => {
    setIsChangingPw(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsChangingPw(false);
    toast.success("비밀번호가 변경됐습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">보안 설정</CardTitle>
        <CardDescription>
          2단계 인증 토글, 비밀번호 변경, 세션 관리 패턴을 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">2단계 인증</p>
              <p className="text-xs text-muted-foreground">로그인 시 추가 인증 요구</p>
            </div>
          </div>
          <Switch checked={twoFactor} onCheckedChange={handleTwoFactor} />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium">비밀번호 변경</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleChangePassword}
            disabled={isChangingPw}
          >
            {isChangingPw ? "처리 중..." : "비밀번호 변경"}
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">활성 세션</p>
          {sessionItems.map((session) => (
            <div key={session.info} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium">{session.device}</p>
                    {session.current && <Badge variant="secondary" className="text-[10px] py-0">현재</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{session.info}</p>
                </div>
              </div>
              {!session.current && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => toast.info(`${session.info} 세션이 종료됐습니다.`)}
                >
                  <LogOut className="h-3 w-3" />
                  종료
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="설정 & 최적화"
          description="테마·알림·프로필·보안 등 실제 앱 설정 페이지에서 자주 쓰이는 UI 패턴을 확인하세요."
          className="mb-10"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <ThemeCard />
          <NotificationCard />
          <ProfileCard />
          <SecurityCard />
          <DisplayCard />
        </div>
      </Container>
    </div>
  );
}
