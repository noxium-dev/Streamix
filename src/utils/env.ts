const getEnv = (key: string, defaultValue: string = "") => {
  // Vite automatically loads env starting with VITE_ or prefixes defined in envPrefix
  return (import.meta as any).env?.[key] || defaultValue;
};

export const env = {
  NEXT_PUBLIC_TMDB_ACCESS_TOKEN: getEnv("NEXT_PUBLIC_TMDB_ACCESS_TOKEN"),
  NEXT_PUBLIC_SUPABASE_URL: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  NEXT_PUBLIC_CAPTCHA_SITE_KEY: getEnv("NEXT_PUBLIC_CAPTCHA_SITE_KEY"),
  NEXT_PUBLIC_AVATAR_PROVIDER_URL: getEnv("NEXT_PUBLIC_AVATAR_PROVIDER_URL"),
  NEXT_PUBLIC_STREAMIX_TOKEN: getEnv("NEXT_PUBLIC_STREAMIX_TOKEN", "9ad8ffefdaf72105ed051f48"),
  PROTECTED_PATHS: getEnv("PROTECTED_PATHS", "/auth/reset-password,/profile"),
  SUPABASE_SERVICE_ROLE_KEY: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
};
