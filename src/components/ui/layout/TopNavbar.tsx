"use client";

import BackButton from "@/components/ui/button/BackButton";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import UserProfileButton from "../button/UserProfileButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import BrandLogo from "../other/BrandLogo";

const NavItemWithIcon = ({ item }: { item: typeof siteConfig.navItems[0] }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  return (
    <Link 
      href={item.href} 
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors",
        isActive 
          ? "text-primary bg-primary/10" 
          : "text-foreground/70 hover:text-foreground hover:bg-default-100"
      )}
    >
      <span className="size-6">{isActive ? item.activeIcon : item.icon}</span>
      <span className="hidden xl:inline">{item.label}</span>
    </Link>
  );
};

const HeaderSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <SearchInput
      value={query}
      onChange={handleSearch}
      className="w-40"
      placeholder="Search..."
    />
  );
};

const TopNavbar = () => {
  const pathName = usePathname();
  const navItems = siteConfig.navItems.filter(item => item.href !== "/search");
  const hrefs = navItems.map((item) => item.href);
  const show = hrefs.includes(pathName) || pathName === "/search" || pathName.startsWith("/watch/");
  const tv = pathName.includes("/tv/");
  const player = pathName.includes("/player");
  const auth = pathName.includes("/auth");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (auth || player) return null;

  return (
    <Navbar
      isBlurred
      position="static"
      maxWidth="full"
      classNames={{ 
        base: "border-b border-divider",
        wrapper: "max-w-[1600px] px-4 md:px-6"
      }}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/80 backdrop-blur-md"
    >
      <NavbarBrand className="flex-shrink-0">
        {show ? <BrandLogo /> : <BackButton href={tv ? "/?content=tv" : "/"} />}
      </NavbarBrand>
      
      {show && (
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavItemWithIcon key={item.href} item={item} />
          ))}
        </nav>
      )}
      
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <HeaderSearch />
        </NavbarItem>
        <NavbarItem className="flex lg:hidden">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex gap-2">
          <ThemeSwitchDropdown />
          <UserProfileButton />
        </NavbarItem>
      </NavbarContent>
      
      <NavbarMenu>
        <NavbarMenuItem className="mt-4">
          <nav className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => (
              <NavItemWithIcon key={item.href} item={item} />
            ))}
          </nav>
          <div className="mt-4 px-2">
            <HeaderSearch />
          </div>
          <div className="mt-4 flex gap-2 px-4">
            <ThemeSwitchDropdown />
            <UserProfileButton />
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default TopNavbar;
