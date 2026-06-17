import Link from "next/link";
import { BarChart3, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  children,
  userName
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <BarChart3 className="h-5 w-5 text-primary" />
            TradePilot
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName ?? "Researcher"}
            </span>
            <ModeToggle />
            <form action={logoutAction}>
              <Button aria-label="Log out" size="icon" type="submit" variant="ghost">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
