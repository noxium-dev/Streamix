import * as z from "zod";

// Login schema - simple email + password
const LoginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Register schema - full name, username, email, password + confirm
const RegisterFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(25, "Username must not exceed 20 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirm: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const ForgotPasswordFormSchema = z.object({
  email: z.email("Invalid email address"),
});

const ResetPasswordFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirm: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type LoginFormInput = z.infer<typeof LoginFormSchema>;
type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
type ForgotPasswordFormInput = z.infer<typeof ForgotPasswordFormSchema>;
type ResetPasswordFormInput = z.infer<typeof ResetPasswordFormSchema>;

export {
  LoginFormSchema,
  RegisterFormSchema,
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
};

export type {
  LoginFormInput,
  RegisterFormInput,
  ForgotPasswordFormInput,
  ResetPasswordFormInput,
};
