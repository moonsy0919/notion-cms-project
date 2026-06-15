"use client";

import { toast } from "sonner";
import { Info, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      <Separator className="mt-8" />
    </section>
  );
}

const tableUsers = [
  { name: "김민준", email: "minjun@example.com", role: "관리자", status: "활성" },
  { name: "이수빈", email: "subin@example.com", role: "편집자", status: "활성" },
  { name: "박지호", email: "jiho@example.com", role: "뷰어", status: "비활성" },
  { name: "최예린", email: "yerin@example.com", role: "편집자", status: "활성" },
];

export default function ComponentsPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="컴포넌트 쇼케이스"
          description="스타터킷에 포함된 모든 UI 컴포넌트의 variants와 사용법을 직접 확인하세요."
          className="mb-10"
        />

        <div className="space-y-10">
          {/* 버튼 */}
          <Section
            title="Button"
            description="variant(외형)와 size(크기)를 조합해 다양한 버튼을 만들 수 있습니다."
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </Section>

          {/* 배지 */}
          <Section
            title="Badge"
            description="상태·카테고리·태그를 표시할 때 사용합니다."
          >
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </Section>

          {/* 입력 */}
          <Section
            title="Input / Label / Textarea"
            description="텍스트 입력 필드입니다. disabled, placeholder, type 등 다양한 상태를 지원합니다."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">비활성 상태</Label>
                <Input id="disabled-input" placeholder="수정할 수 없습니다" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-input">에러 상태</Label>
                <Input
                  id="error-input"
                  placeholder="잘못된 값"
                  aria-invalid
                  className="border-destructive focus-visible:ring-destructive"
                />
                <p className="text-xs text-destructive">올바른 이메일 형식이 아닙니다.</p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio">소개</Label>
                <Textarea id="bio" placeholder="자기소개를 입력하세요..." />
              </div>
            </div>
          </Section>

          {/* 체크박스 / 스위치 */}
          <Section
            title="Checkbox / Switch"
            description="선택·토글 상태를 나타냅니다. Switch는 즉시 적용되는 설정에, Checkbox는 여러 항목 선택에 적합합니다."
          >
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">이용약관 동의</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="checked" defaultChecked />
                <Label htmlFor="checked">이미 동의됨</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="disabled-check" disabled />
                <Label htmlFor="disabled-check" className="text-muted-foreground">비활성</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">알림 수신</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="enabled" defaultChecked />
                <Label htmlFor="enabled">활성화됨</Label>
              </div>
            </div>
          </Section>

          {/* 진행바 / 스켈레톤 */}
          <Section
            title="Progress / Skeleton"
            description="Progress는 작업 진행률을, Skeleton은 로딩 중 콘텐츠 자리를 표시합니다."
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">파일 업로드</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">프로필 완성도</span>
                  <span className="font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">로딩 중 스켈레톤</p>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 아바타 */}
          <Section
            title="Avatar"
            description="사용자 프로필 이미지를 표시합니다. 이미지가 없으면 이니셜 Fallback을 보여줍니다."
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarFallback>김민</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">이수</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px]">박</AvatarFallback>
              </Avatar>
            </div>
          </Section>

          {/* 알림 */}
          <Section
            title="Alert"
            description="인라인 알림 메시지입니다. default와 destructive variant를 제공합니다."
          >
            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>안내</AlertTitle>
                <AlertDescription>기본 알림 메시지입니다. 일반 정보를 전달할 때 사용합니다.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* 카드 */}
          <Section
            title="Card"
            description="콘텐츠를 묶는 컨테이너입니다. Header / Content / Footer / Action 슬롯을 조합해 구성합니다."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>기본 카드</CardTitle>
                  <CardDescription>Header + Content 구성</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">카드 본문 내용이 여기에 들어갑니다.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>액션 카드</CardTitle>
                  <CardDescription>우측 상단 액션 버튼 포함</CardDescription>
                  <CardAction>
                    <Badge variant="secondary">New</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">CardAction으로 우측 상단에 요소를 배치합니다.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>푸터 카드</CardTitle>
                  <CardDescription>Header + Content + Footer 구성</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">CardFooter는 배경색이 있는 하단 영역입니다.</p>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button size="sm" variant="ghost">취소</Button>
                  <Button size="sm">확인</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* 테이블 */}
          <Section
            title="Table"
            description="정형 데이터를 행·열로 표시합니다. 반응형을 위해 가로 스크롤이 자동으로 적용됩니다."
          >
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableUsers.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "활성" ? "default" : "outline"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Section>

          {/* 탭 */}
          <Section
            title="Tabs"
            description="하나의 영역에서 여러 뷰를 전환할 때 사용합니다."
          >
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">개요</TabsTrigger>
                <TabsTrigger value="tab2">상세</TabsTrigger>
                <TabsTrigger value="tab3">설정</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4 text-sm text-muted-foreground">
                개요 탭 콘텐츠입니다. 요약된 정보를 여기에 표시합니다.
              </TabsContent>
              <TabsContent value="tab2" className="mt-4 text-sm text-muted-foreground">
                상세 탭 콘텐츠입니다. 더 자세한 정보를 여기에 표시합니다.
              </TabsContent>
              <TabsContent value="tab3" className="mt-4 text-sm text-muted-foreground">
                설정 탭 콘텐츠입니다. 사용자 설정 항목을 여기에 표시합니다.
              </TabsContent>
            </Tabs>
          </Section>

          {/* 아코디언 */}
          <Section
            title="Accordion"
            description="FAQ나 설명처럼 접고 펼 수 있는 콘텐츠에 사용합니다."
          >
            <Accordion type="single" collapsible>
              <AccordionItem value="faq1">
                <AccordionTrigger>스타터킷은 무료인가요?</AccordionTrigger>
                <AccordionContent>네, 완전히 무료이며 MIT 라이선스입니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq2">
                <AccordionTrigger>커스터마이징이 가능한가요?</AccordionTrigger>
                <AccordionContent>shadcn/ui 기반으로 모든 컴포넌트를 자유롭게 수정할 수 있습니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq3">
                <AccordionTrigger>TypeScript를 지원하나요?</AccordionTrigger>
                <AccordionContent>네, 프로젝트 전체가 TypeScript로 작성되어 있습니다.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* 오버레이 */}
          <Section
            title="Dialog / Dropdown / Tooltip / Toast"
            description="오버레이 UI 패턴입니다. 각각 모달 확인, 컨텍스트 메뉴, 도움말, 알림 용도로 사용합니다."
          >
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">다이얼로그 열기</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>다이얼로그 예시</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    사용자 확인이 필요한 작업에 사용합니다. Esc 또는 외부 클릭으로 닫을 수 있습니다.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="outline">취소</Button>
                    <Button size="sm">확인</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">드롭다운 열기</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>프로필</DropdownMenuItem>
                  <DropdownMenuItem>설정</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">툴팁 호버</Button>
                </TooltipTrigger>
                <TooltipContent>마우스를 올리면 보이는 도움말입니다</TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                onClick={() => toast.success("성공!", { description: "작업이 완료되었습니다." })}
              >
                성공 토스트
              </Button>

              <Button
                variant="outline"
                onClick={() => toast.error("오류 발생", { description: "다시 시도해주세요." })}
              >
                에러 토스트
              </Button>
            </div>
          </Section>

          {/* EmptyState */}
          <Section
            title="EmptyState"
            description="데이터가 없을 때 표시하는 빈 상태 컴포넌트입니다. 아이콘, 제목, 설명, 액션을 조합합니다."
          >
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={Inbox}
                  title="데이터가 없습니다"
                  description="새 항목을 추가하면 여기에 표시됩니다."
                  action={{ label: "추가하기", onClick: () => toast.info("추가 버튼 클릭") }}
                />
              </CardContent>
            </Card>
          </Section>
        </div>
      </Container>
    </div>
  );
}
