import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signupAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start with secure access before research tools are added.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm action={signupAction} mode="signup" />
      </CardContent>
    </Card>
  );
}
