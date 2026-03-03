"use client";

import { useQuery } from "@tanstack/react-query";

type AuthUserData = {
  id: string;
  username: string;
  email: string;
  fullName: string;
};

const fetchUser = async (): Promise<AuthUserData | null> => {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const result = await res.json() as { success: boolean; user?: AuthUserData };
    return result.user || null;
  } catch {
    return null;
  }
};

const useSupabaseUser = () => {
  const query = useQuery({
    queryKey: ["supabase-user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });

  return query;
};

export default useSupabaseUser;
