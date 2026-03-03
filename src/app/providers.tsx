"use client";

import { PropsWithChildren } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";

export const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { pathname: pathName } = useLocation();
  const { content } = useDiscoverFilters();
  const isVideo = pathName.includes("/watch/") || content === "movie";

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={navigate}>
        <ToastProvider
          placement="top-right"
          maxVisibleToasts={1}
          toastOffset={10}
          toastProps={{
            shouldShowTimeoutProgress: true,
            timeout: 5000,
            classNames: {
              content: "mr-7",
              closeButton:
                "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto",
            },
          }}
        />
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
