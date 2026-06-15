import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";

function LayoutSection({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <Badge variant="secondary" className="font-mono text-xs">
          {code}
        </Badge>
      </div>
      {children}
      <Separator className="mt-8" />
    </section>
  );
}

function PlaceholderCard({ label }: { label?: string }) {
  return (
    <Card className="flex h-24 items-center justify-center bg-muted/40">
      <CardContent className="p-0 text-sm text-muted-foreground">{label ?? "콘텐츠"}</CardContent>
    </Card>
  );
}

const listItems = [
  { initials: "김민", name: "김민준", description: "프론트엔드 개발자" },
  { initials: "이수", name: "이수빈", description: "백엔드 개발자" },
  { initials: "박지", name: "박지호", description: "디자이너" },
];

export default function LayoutsPage() {
  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="레이아웃 예제"
          description="그리드, 벤토, 사이드바, 반응형 스택 등 Tailwind CSS로 구현하는 다양한 레이아웃 패턴을 확인하세요."
          className="mb-10"
        />
        <div className="space-y-10">
          <LayoutSection title="1컬럼 레이아웃" code="grid grid-cols-1">
            <PlaceholderCard label="전체 너비 콘텐츠" />
          </LayoutSection>

          <LayoutSection title="2컬럼 그리드" code="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderCard label="1 / 2" />
              <PlaceholderCard label="2 / 2" />
            </div>
          </LayoutSection>

          <LayoutSection title="3컬럼 그리드" code="grid grid-cols-3 gap-4">
            <div className="grid grid-cols-3 gap-4">
              <PlaceholderCard label="1 / 3" />
              <PlaceholderCard label="2 / 3" />
              <PlaceholderCard label="3 / 3" />
            </div>
          </LayoutSection>

          <LayoutSection title="비대칭 그리드" code="col-span-2 + col-span-1">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <PlaceholderCard label="메인 (2/3)" />
              </div>
              <PlaceholderCard label="사이드 (1/3)" />
            </div>
          </LayoutSection>

          <LayoutSection title="벤토 그리드" code="grid-cols-3 + row-span-2">
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              <Card className="col-span-2 row-span-2 flex items-center justify-center bg-muted/40 h-48">
                <CardContent className="p-0 text-sm text-muted-foreground">메인 콘텐츠</CardContent>
              </Card>
              <Card className="flex items-center justify-center bg-muted/40 h-20">
                <CardContent className="p-0 text-sm text-muted-foreground">위젯 A</CardContent>
              </Card>
              <Card className="flex items-center justify-center bg-muted/40 h-20">
                <CardContent className="p-0 text-sm text-muted-foreground">위젯 B</CardContent>
              </Card>
            </div>
          </LayoutSection>

          <LayoutSection title="카드 리스트" code="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {listItems.map((item) => (
                <Card key={item.name}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <Avatar>
                      <AvatarFallback>{item.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </LayoutSection>

          <LayoutSection title="사이드바 레이아웃" code="flex gap-4">
            <div className="flex gap-4">
              <Card className="w-44 shrink-0">
                <CardContent className="py-4 px-3">
                  <nav className="flex flex-col gap-1">
                    {["대시보드", "프로젝트", "팀원", "설정"].map((item, i) => (
                      <div
                        key={item}
                        className={`rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                          i === 0
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>
                </CardContent>
              </Card>
              <Card className="flex-1 flex items-center justify-center h-40">
                <CardContent className="p-0 text-sm text-muted-foreground">
                  메인 콘텐츠 영역 (flex-1)
                </CardContent>
              </Card>
            </div>
          </LayoutSection>

          <LayoutSection title="반응형 스택 → 그리드" code="flex flex-col sm:grid sm:grid-cols-2">
            <p className="mb-3 text-xs text-muted-foreground">
              창 너비를 줄여보세요 — sm(640px) 미만에서는 세로로 쌓이고, 이상에서는 2컬럼 그리드가 됩니다.
            </p>
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <Card className="flex h-20 items-center justify-center bg-muted/40">
                <CardContent className="p-0 text-sm text-muted-foreground">카드 A</CardContent>
              </Card>
              <Card className="flex h-20 items-center justify-center bg-muted/40">
                <CardContent className="p-0 text-sm text-muted-foreground">카드 B</CardContent>
              </Card>
              <Card className="flex h-20 items-center justify-center bg-muted/40">
                <CardContent className="p-0 text-sm text-muted-foreground">카드 C</CardContent>
              </Card>
              <Card className="flex h-20 items-center justify-center bg-muted/40">
                <CardContent className="p-0 text-sm text-muted-foreground">카드 D</CardContent>
              </Card>
            </div>
          </LayoutSection>
        </div>
      </Container>
    </div>
  );
}
