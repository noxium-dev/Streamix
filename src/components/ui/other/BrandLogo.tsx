"use client";

import Image from "next/image";
import Link from "next/link";
import { PTSansNarrow } from "@/utils/fonts";
import { cn } from "@/utils/helpers";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";

export interface BrandLogoProps {
  animate?: boolean;
  className?: string;
  subtitle?: React.ReactNode;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ animate = false, className, subtitle }) => {
  const { content } = useDiscoverFilters();

  return (
    <Link href="/" className="group flex items-center gap-2">
      <Image
        src="/logo.gif"
        alt="Streamix Logo"
        width={36}
        height={36}
        className="aspect-square rounded-lg object-cover"
        unoptimized
      />
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "flex items-center text-2xl font-bold md:text-3xl",
            PTSansNarrow.className,
            className,
          )}
        >
          <span className="text-blue-500">S</span>
          <span className="text-white">treamix</span>
        </span>
        {subtitle && (
          <span className="text-[9px] text-default-400 font-bold leading-none mt-0.5 uppercase tracking-wider whitespace-nowrap items-start text-left">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;
