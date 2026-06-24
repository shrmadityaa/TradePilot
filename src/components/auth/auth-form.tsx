"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "@/components/auth/role-selector";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    previousState: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
};

const initialState: AuthActionState = {};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4">
      {isSignup ? (
        <Input
          autoComplete="name"
          error={state.fieldErrors?.name?.[0]}
          label="Name"
          name="name"
          required
          type="text"
        />
      ) : null}
      <Input
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
        label="Email"
        name="email"
        required
        type="email"
      />
      <Input
        autoComplete={isSignup ? "new-password" : "current-password"}
        error={state.fieldErrors?.password?.[0]}
        label="Password"
        name="password"
        required
        type="password"
      />
      {isSignup ? (
        <RoleSelector error={state.fieldErrors?.role?.[0]} />
      ) : null}
      {state.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label={isSignup ? "Create account" : "Log in"} />
      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href={isSignup ? "/login" : "/signup"}
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? "Please wait..." : label}
    </Button>
  );
}
