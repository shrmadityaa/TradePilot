import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foundationItems = [
  "Authenticated user session",
  "PostgreSQL-ready Prisma persistence",
  "Protected dashboard routing",
  "Dark and light theme support",
  "Reusable component primitives",
  "Route loading and error states"
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          The research assistant surface is intentionally empty until stock
          features are introduced.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {foundationItems.map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle className="text-base">{item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Foundation layer configured and ready for product-specific work.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
