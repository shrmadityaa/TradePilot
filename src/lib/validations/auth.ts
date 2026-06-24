import { z } from "zod";

export const SIGNUP_ROLES = [
  "RETAIL_INVESTOR",
  "TRADER",
  "LEARNER"
] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Enter a valid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  role: z.enum(SIGNUP_ROLES, {
    errorMap: () => ({ message: "Select a role to continue." })
  })
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required")
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
