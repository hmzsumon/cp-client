// ── Zod schemas & types
import { z } from "zod";

export const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Malaysia",
  "Singapore",
  "United Kingdom",
  "United States",
] as const;

export const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(15, "Must be at most 15 characters")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Required"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const registerSchema = z.object({
  country: z.string().trim().min(1, "Required"),
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
  partnerCode: z.string().optional().or(z.literal("")),
  // boolean input & output; must be true
  notUSTaxPayer: z.boolean().refine((v) => v === true, {
    message: "Please confirm the declaration",
  }),
});
export type RegisterValues = z.infer<typeof registerSchema>;
