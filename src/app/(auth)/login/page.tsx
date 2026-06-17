import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Log in to continue to your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm action={loginAction} mode="login" />
      </CardContent>
    </Card>
  );
}
