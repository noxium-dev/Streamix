"use client";

import { siteConfig } from "@/config/site";
import { Link } from "@heroui/react";
import BrandLogo from "../other/BrandLogo";
import { Icon } from "@iconify/react";

const Footer: React.FC = () => {
  const legalLinks = [
    { label: "Terms", href: "/tos", icon: "solar:document-text-bold" },
    { label: "Privacy", href: "/privacy", icon: "solar:shield-keyhole-bold" },
    { label: "DMCA", href: "/dmca", icon: "solar:copyright-bold" },
  ];

  return (
    <footer
      className="w-full border-t border-divider bg-background flex items-center shrink-0 overflow-hidden h-16 min-h-16"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo, Name & Subheading */}
          <div className="flex justify-center min-w-fit">
            <BrandLogo
              className="!text-xl md:!text-2xl leading-none"
              subtitle="Streaming Platform"
            />
          </div>

          {/* Center: Copyright */}
          <div className="hidden lg:flex flex-1 justify-center">
            <p className="text-sm text-default-500 font-medium">
              © 2026 {siteConfig.name}. All rights reserved.
            </p>
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-1">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-base font-medium text-foreground/70 hover:text-primary transition-colors hover:bg-default-100"
              >
                <Icon icon={item.icon} className="size-6" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
