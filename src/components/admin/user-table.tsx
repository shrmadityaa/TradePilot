"use client";

import { useState, useTransition } from "react";
import type { UserRole } from "@prisma/client";
import { updateUserRole } from "@/app/(dashboard)/admin/actions";
import { ROLE_LABELS } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
};

const ALL_ROLES: UserRole[] = [
  "RETAIL_INVESTOR",
  "TRADER",
  "LEARNER",
  "ANALYST",
  "PLATFORM_ADMIN"
];

export function UserTable({
  users,
  currentUserId
}: {
  users: User[];
  currentUserId: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleRoleChange(newRole: UserRole) {
    setMessage("");
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);
      setMessage(result.message);
    });
  }

  return (
    <tr className={cn("border-b last:border-0", isPending && "opacity-50")}>
      <td className="px-4 py-3 font-medium">
        {user.name ?? "—"}
        {isSelf && (
          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
            {ROLE_LABELS[user.role]}
          </span>
        ) : (
          <select
            className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            defaultValue={user.role}
            disabled={isPending}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        )}
        {message && (
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}
