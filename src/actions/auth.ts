import type {
  LoginFormInput,
  RegisterFormInput,
} from "@/schemas/auth";

type AuthResult = { success: boolean; message?: string };

export const signIn = async (data: LoginFormInput): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

export const signUp = async (data: RegisterFormInput): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

// Disabled functionality (no longer using Supabase for password reset)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sendResetPasswordEmail = async (_data: any): Promise<AuthResult> => {
  return { success: true, message: "Password reset is currently unavailable." };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resetPassword = async (_data: any): Promise<AuthResult> => {
  return { success: true, message: "Password reset is currently unavailable." };
};

export const signOut = async (): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

export const changeUsername = async (data: { username: string }): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/change-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

export const deleteAccount = async (): Promise<AuthResult> => {
  try {
    const res = await fetch("/api/auth/delete-account", {
      method: "POST",
    });
    return (await res.json()) as AuthResult;
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};
