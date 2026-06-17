import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <BarChart3 className="h-5 w-5 text-primary" />
          TradePilot
        </Link>
        <ModeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </div>
    </main>
  );
}
