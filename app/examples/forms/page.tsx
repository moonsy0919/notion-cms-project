"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";

type LoginFields = {
  email: string;
  password: string;
};

type RegisterFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ContactFields = {
  name: string;
  email: string;
  category: string;
  message: string;
  agreed: boolean;
};

type SearchFields = {
  keyword: string;
  category: string;
  period: string;
};

const MAX_MESSAGE_LENGTH = 500;

function LoginFormSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>();

  const onSubmit = async (data: LoginFields) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("로그인 성공!", { description: `${data.email}으로 로그인됐습니다.` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">로그인 폼</CardTitle>
        <CardDescription>
          이메일 형식 검증, 필수 입력 검증, 제출 로딩 상태를 포함합니다.
          빈 칸으로 제출하거나 잘못된 이메일을 입력해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">이메일</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="example@email.com"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: { value: /\S+@\S+\.\S+/, message: "올바른 이메일 형식이 아닙니다." },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">비밀번호</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="8자 이상"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterFormSection() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>();

  const onSubmit = async (data: RegisterFields) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("회원가입 완료!", { description: `${data.name}님, 환영합니다.` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">회원가입 폼</CardTitle>
        <CardDescription>
          비밀번호 일치 검증, 여러 필드 처리 패턴을 포함합니다.
          비밀번호 확인란에 다른 값을 입력해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="reg-name">이름</Label>
            <Input
              id="reg-name"
              placeholder="홍길동"
              aria-invalid={!!errors.name}
              {...register("name", { required: "이름을 입력해주세요." })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">이메일</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="example@email.com"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: { value: /\S+@\S+\.\S+/, message: "올바른 이메일 형식이 아닙니다." },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">비밀번호</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="8자 이상"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-confirm">비밀번호 확인</Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="비밀번호 재입력"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "비밀번호를 다시 입력해주세요.",
                validate: (v) => v === getValues("password") || "비밀번호가 일치하지 않습니다.",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ContactFormSection() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({
    defaultValues: { category: "", message: "", agreed: false },
  });

  const messageValue = useWatch({ control, name: "message", defaultValue: "" });
  const agreedValue = useWatch({ control, name: "agreed", defaultValue: false });

  const onSubmit = async (data: ContactFields) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("문의가 접수됐습니다!", { description: `${data.category} 문의를 확인 후 답변드리겠습니다.` });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">문의하기 폼</CardTitle>
        <CardDescription>
          Select, Textarea, Checkbox를 조합한 문의 폼입니다.
          글자 수 카운터와 개인정보 동의 검증 패턴을 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact-name">이름</Label>
              <Input
                id="contact-name"
                placeholder="홍길동"
                aria-invalid={!!errors.name}
                {...register("name", { required: "이름을 입력해주세요." })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">이메일</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="example@email.com"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: { value: /\S+@\S+\.\S+/, message: "올바른 형식이 아닙니다." },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>문의 분류</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "문의 분류를 선택해주세요." }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.category}>
                    <SelectValue placeholder="분류 선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반">일반 문의</SelectItem>
                    <SelectItem value="기술지원">기술 지원</SelectItem>
                    <SelectItem value="버그">버그 신고</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-message">문의 내용</Label>
              <span className={`text-xs ${messageValue.length > MAX_MESSAGE_LENGTH ? "text-destructive" : "text-muted-foreground"}`}>
                {messageValue.length} / {MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <Textarea
              id="contact-message"
              placeholder="문의 내용을 입력해주세요..."
              rows={4}
              aria-invalid={!!errors.message}
              {...register("message", {
                required: "문의 내용을 입력해주세요.",
                maxLength: { value: MAX_MESSAGE_LENGTH, message: `${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요.` },
              })}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Controller
                name="agreed"
                control={control}
                rules={{ validate: (v) => v || "개인정보 처리에 동의해주세요." }}
                render={({ field }) => (
                  <Checkbox
                    id="contact-agree"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!errors.agreed}
                  />
                )}
              />
              <Label htmlFor="contact-agree" className="cursor-pointer font-normal leading-snug">
                개인정보 수집 및 이용에 동의합니다.
              </Label>
            </div>
            {errors.agreed && (
              <p className="text-sm text-destructive">{errors.agreed.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !agreedValue}>
            {isSubmitting ? "제출 중..." : "문의 보내기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type ActiveFilters = {
  keyword?: string;
  category?: string;
  period?: string;
};

function SearchFilterSection() {
  const { register, handleSubmit, reset, control } = useForm<SearchFields>({
    defaultValues: { keyword: "", category: "전체", period: "all" },
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters | null>(null);

  const onSubmit = (data: SearchFields) => {
    const filters: ActiveFilters = {};
    if (data.keyword) filters.keyword = data.keyword;
    if (data.category && data.category !== "전체") filters.category = data.category;
    if (data.period !== "all") {
      const labels: Record<string, string> = { week: "최근 1주", month: "최근 1개월", year: "최근 1년" };
      filters.period = labels[data.period];
    }
    setActiveFilters(filters);
    toast.info("검색 필터 적용됨");
  };

  const handleReset = () => {
    reset();
    setActiveFilters(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">검색 필터 폼</CardTitle>
        <CardDescription>
          키워드 + Select + RadioGroup을 조합한 복합 필터 패턴입니다.
          적용된 필터를 Badge로 요약 표시하고 초기화할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-keyword">키워드</Label>
            <Input
              id="search-keyword"
              placeholder="검색어 입력..."
              {...register("keyword")}
            />
          </div>

          <div className="space-y-2">
            <Label>카테고리</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="Next.js">Next.js</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>기간</Label>
            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-x-5 gap-y-2"
                >
                  {[
                    { value: "all", label: "전체" },
                    { value: "week", label: "최근 1주" },
                    { value: "month", label: "최근 1개월" },
                    { value: "year", label: "최근 1년" },
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`period-${value}`} />
                      <Label htmlFor={`period-${value}`} className="cursor-pointer font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">검색</Button>
            <Button type="button" variant="outline" onClick={handleReset}>초기화</Button>
          </div>

          {activeFilters && Object.keys(activeFilters).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">적용된 필터</p>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.keyword && (
                    <Badge variant="secondary">키워드: {activeFilters.keyword}</Badge>
                  )}
                  {activeFilters.category && (
                    <Badge variant="secondary">카테고리: {activeFilters.category}</Badge>
                  )}
                  {activeFilters.period && (
                    <Badge variant="secondary">기간: {activeFilters.period}</Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {activeFilters && Object.keys(activeFilters).length === 0 && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground">적용된 필터 없음 (전체 결과)</p>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function FormsPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="폼 예제"
          description="로그인·회원가입·문의·검색 필터 등 다양한 폼 패턴과 react-hook-form 검증을 확인하세요."
          className="mb-10"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <LoginFormSection />
          <RegisterFormSection />
          <ContactFormSection />
          <SearchFilterSection />
        </div>
      </Container>
    </div>
  );
}
