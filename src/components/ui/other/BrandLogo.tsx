"use client";

import { Link } from "react-router-dom";
import { PTSansNarrow } from "@/utils/fonts";
import { cn } from "@/utils/helpers";

export interface BrandLogoProps {
  animate?: boolean;
  className?: string;
  showSubtitle?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ animate = false, className, showSubtitle = false }) => {
  return (
    <Link to="/" className="group flex items-center gap-2">
      <img
        src="/logo.gif"
        alt="Streamix Logo"
        width={36}
        height={36}
        className="aspect-square rounded-lg object-cover"
      />
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "flex items-center text-2xl font-bold md:text-3xl leading-none",
            PTSansNarrow.className,
            className,
          )}
        >
          <span className="text-blue-500">S</span>
          <span className="text-white">treamix</span>
        </span>
        {showSubtitle && (
          <p className="text-[9px] md:text-[10px] text-default-400 font-bold leading-none ml-0.5 mt-0.5 uppercase tracking-wider whitespace-nowrap">
            Streaming Platform
          </p>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;
