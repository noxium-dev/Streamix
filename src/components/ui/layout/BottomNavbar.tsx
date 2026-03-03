"use client";

import { siteConfig } from "@/config/site";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { Chip } from "@heroui/chip";

const BottomNavbar = () => {
  const { pathname: pathName } = useLocation();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);

  return (
    show && (
      <div className="fixed bottom-0 left-0 z-50 block h-fit w-full translate-y-px border-t border-secondary-background bg-background py-2 md:hidden">
          <div className="mx-auto grid h-full max-w-lg grid-cols-5">
            {siteConfig.navItems.map((item) => {
              const isActive = pathName === item.href;
              return (
                <Link
                  to={item.href}
                  key={item.href}
                  className="flex items-center justify-center text-foreground"
                >
                  <div className="flex max-h-[50px] flex-col items-center justify-center">
                    <Chip
                      size="lg"
                      variant={isActive ? "solid" : "light"}
                      classNames={{
                        base: "py-[2px] transition-all",
                        content: "size-full",
                      }}
                    >
                      {isActive ? item.activeIcon : item.icon}
                    </Chip>
                    <p className={clsx("text-[10px]", { "font-bold": isActive })}>{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
    )
  );
};

export default BottomNavbar;
