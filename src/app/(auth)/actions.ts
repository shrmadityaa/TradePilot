"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role
    }
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/dashboard"
  });

  redirect("/dashboard");
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { error: "Invalid email or password." };
    }

    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
