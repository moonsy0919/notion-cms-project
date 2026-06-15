"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Menu,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/types";

const sidebarItems: NavItem[] = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "사용자", href: "/dashboard/users", icon: Users },
  { label: "분석", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "설정", href: "/dashboard/settings", icon: Settings },
];

function SidebarNav({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            asChild
            onClick={onNavClick}
          >
            <Link href={item.href}>
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

/** 데스크탑: 고정 사이드바 / 모바일: Sheet 드로어 */
export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 768px)", { initializeWithValue: false });

  if (isDesktop) {
    return (
      <aside className="w-56 shrink-0 border-r bg-background">
        <SidebarNav />
      </aside>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  );
}
