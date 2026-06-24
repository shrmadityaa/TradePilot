"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

async function requirePlatformAdmin() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "PLATFORM_ADMIN") {
    throw new Error("Unauthorized: Platform Admin access required.");
  }

  return session.user.id;
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  const adminId = await requirePlatformAdmin();

  if (userId === adminId) {
    return { ok: false, message: "You cannot change your own role." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/admin");

  return { ok: true, message: "Role updated successfully." };
}

export async function getUsers() {
  await requirePlatformAdmin();

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}
