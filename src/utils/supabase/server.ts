import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/utils/env";

/**
 * Creates a Supabase client for use in the browser.
 * In a Vite SPA, we don't use server-side cookies like Next.js.
 * 
 * @param admin - Whether to use the service role key (CAUTION: Only use in secure environments)
 * @returns A Supabase client.
 */
export const createClient = async (admin: boolean = false) => {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = admin ? env.SUPABASE_SERVICE_ROLE_KEY : env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase URL or Key is missing");
  }

  return createBrowserClient(url, key);
};
