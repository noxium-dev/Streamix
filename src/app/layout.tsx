import React, { Suspense } from "react";
import { Poppins } from "@/utils/fonts";
import "./styles/globals.css";
import "./styles/lightbox.css";
import Providers from "./providers";
import TopNavbar from "@/components/ui/layout/TopNavbar";
import Footer from "@/components/ui/layout/Footer";
import BottomNavbar from "@/components/ui/layout/BottomNavbar";
import { cn } from "@/utils/helpers";

const Disclaimer = React.lazy(() => import("@/components/ui/overlay/Disclaimer"));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("bg-background min-h-dvh antialiased select-none", Poppins.className)}>
      <Suspense>
        <Providers>
          <Suspense fallback={null}>
            <Disclaimer />
          </Suspense>
          <TopNavbar />
          <main className="mx-auto max-w-[1600px] px-4 md:px-6 py-6">
            {children}
          </main>
          <BottomNavbar />
          <Footer />
        </Providers>
      </Suspense>
    </div>
  );
}
