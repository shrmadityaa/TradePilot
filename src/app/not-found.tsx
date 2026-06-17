import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you requested does not exist.
        </p>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
