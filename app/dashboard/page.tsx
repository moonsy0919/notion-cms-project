import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { formatNumber, formatCurrency } from "@/lib/format";
import { formatRelativeDate } from "@/lib/date";
import type { Column } from "@/components/shared/DataTable";

export const dynamic = "force-dynamic";

async function getRecentOrders(): Promise<Order[]> {
  const now = Date.now();
  return [
    { id: "#1042", customer: "김민수", status: "완료", amount: 128000, date: new Date(now - 1000 * 60 * 30).toISOString() },
    { id: "#1041", customer: "이지은", status: "처리중", amount: 75000, date: new Date(now - 1000 * 60 * 120).toISOString() },
    { id: "#1040", customer: "박준혁", status: "완료", amount: 320000, date: new Date(now - 1000 * 60 * 60 * 5).toISOString() },
    { id: "#1039", customer: "최수연", status: "취소", amount: 56000, date: new Date(now - 1000 * 60 * 60 * 24).toISOString() },
    { id: "#1038", customer: "정태양", status: "완료", amount: 198000, date: new Date(now - 1000 * 60 * 60 * 48).toISOString() },
  ];
}

const stats = [
  { label: "총 사용자", value: 12489, icon: Users, change: "+12%", up: true },
  { label: "월 매출", value: 4820000, icon: DollarSign, change: "+8.2%", up: true, currency: true },
  { label: "신규 주문", value: 384, icon: ShoppingCart, change: "-3.1%", up: false },
  { label: "전환율", value: 3.24, icon: TrendingUp, change: "+0.4%", up: true, percent: true },
];

interface Order {
  id: string;
  customer: string;
  status: "완료" | "처리중" | "취소";
  amount: number;
  date: string;
}

const statusVariant: Record<Order["status"], "default" | "secondary" | "destructive"> = {
  완료: "default",
  처리중: "secondary",
  취소: "destructive",
};

const columns: Column<Order>[] = [
  { key: "id", label: "주문 번호", sortable: true },
  { key: "customer", label: "고객명", sortable: true },
  {
    key: "status",
    label: "상태",
    render: (v) => (
      <Badge variant={statusVariant[v as Order["status"]]}>{String(v)}</Badge>
    ),
  },
  {
    key: "amount",
    label: "금액",
    sortable: true,
    render: (v) => formatCurrency(Number(v)),
  },
  {
    key: "date",
    label: "날짜",
    render: (v) => formatRelativeDate(String(v)),
  },
];

export default async function DashboardPage() {
  const recentOrders = await getRecentOrders();

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="대시보드"
          description="서비스 현황을 한눈에 확인하세요."
          className="mb-8"
        />

        {/* 통계 카드 */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {stat.currency
                      ? formatCurrency(stat.value)
                      : stat.percent
                      ? `${stat.value}%`
                      : formatNumber(stat.value)}
                  </p>
                  <p className={`mt-1 text-xs ${stat.up ? "text-green-600" : "text-destructive"}`}>
                    {stat.change} 지난달 대비
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 최근 주문 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={recentOrders} rowKey="id" pageSize={0} />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
