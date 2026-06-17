import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            TradePilot
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Explainable stock research starts with a secure foundation.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Authentication, protected routes, persistence, theming, reusable UI,
            loading states, and error boundaries are ready for the research
            assistant layer.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={session?.user ? "/dashboard" : "/signup"}>
              {session?.user ? "Open dashboard" : "Create account"}
            </Link>
          </Button>
          {!session?.user ? (
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
