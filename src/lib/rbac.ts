import type { UserRole } from "@prisma/client";

export const ROLE_LABELS: Record<UserRole, string> = {
  RETAIL_INVESTOR: "Retail Investor",
  TRADER: "Trader",
  LEARNER: "Learner",
  ANALYST: "Analyst",
  PLATFORM_ADMIN: "Platform Admin"
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  RETAIL_INVESTOR: "Understand stocks and market events",
  TRADER: "Track signals and alerts",
  LEARNER: "Understand trading concepts",
  ANALYST: "Manage data and reports",
  PLATFORM_ADMIN: "Manage safety and disclaimers"
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  LEARNER: 0,
  RETAIL_INVESTOR: 1,
  TRADER: 2,
  ANALYST: 3,
  PLATFORM_ADMIN: 4
};

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isAdmin(role: UserRole): boolean {
  return role === "PLATFORM_ADMIN";
}

export function isAnalystOrAbove(role: UserRole): boolean {
  return hasMinRole(role, "ANALYST");
}

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export function getNavItemsForRole(role: UserRole): NavItem[] {
  const items: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  ];

  if (hasMinRole(role, "RETAIL_INVESTOR")) {
    items.push({ label: "Portfolio", href: "/portfolio", icon: "Briefcase" });
    items.push({ label: "Analytics", href: "/analytics", icon: "PieChart" });
  }

  if (hasMinRole(role, "TRADER")) {
    items.push({ label: "Alerts", href: "/alerts", icon: "Bell" });
  }

  if (role === "LEARNER" || role === "RETAIL_INVESTOR") {
    items.push({ label: "Learn", href: "/learn", icon: "GraduationCap" });
  }

  if (isAnalystOrAbove(role)) {
    items.push({ label: "Reports", href: "/reports", icon: "FileText" });
  }

  if (isAdmin(role)) {
    items.push({ label: "Admin", href: "/admin", icon: "Shield" });
  }

  return items;
}
