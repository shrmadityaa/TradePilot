"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Briefcase,
  Eye,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Shield,
  X
} from "lucide-react";
import type { UserRole } from "@prisma/client";
import { logoutAction } from "@/app/(auth)/actions";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { getNavItemsForRole, ROLE_LABELS } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/use-ui-store";

const ICON_MAP: Record<string, typeof BarChart3> = {
  LayoutDashboard,
  Eye,
  Briefcase,
  Bell,
  GraduationCap,
  FileText,
  PieChart,
  Shield
};

export function DashboardShell({
  children,
  userName,
  userRole
}: {
  children: React.ReactNode;
  userName?: string | null;
  userRole?: UserRole;
}) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore();
  const role = userRole ?? "RETAIL_INVESTOR";
  const navItems = getNavItemsForRole(role);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
              <BarChart3 className="h-5 w-5 text-primary" />
              TradePilot
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href as Route}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Button
              aria-label="Toggle menu"
              size="icon"
              type="button"
              variant="ghost"
              className="sm:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted-foreground">{userName ?? "Researcher"}</span>
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <ModeToggle />
            <form action={logoutAction}>
              <Button aria-label="Log out" size="icon" type="submit" variant="ghost">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-20 mt-16 w-60 border-r bg-card sm:hidden">
            <div className="flex h-full flex-col justify-between">
              <nav className="space-y-1 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Menu</span>
                  <Button
                    aria-label="Close menu"
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {navItems.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href as Route}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t p-3">
                <p className="text-xs text-muted-foreground">{userName ?? "Researcher"}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </aside>
        </>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
