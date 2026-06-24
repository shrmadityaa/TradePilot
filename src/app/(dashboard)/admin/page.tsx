import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UserTable } from "@/components/admin/user-table";
import { getUsers } from "./actions";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "PLATFORM_ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <DashboardShell userName={session.user.name} userRole={session.user.role}>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            User Management
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            View all registered users and manage their roles.
          </p>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 text-sm shadow-sm inline-block">
          <p className="text-muted-foreground">Total users</p>
          <p className="text-2xl font-semibold">{users.length}</p>
        </div>

        <UserTable users={users} currentUserId={session.user.id} />
      </div>
    </DashboardShell>
  );
}
