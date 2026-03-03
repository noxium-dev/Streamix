"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import UserProfileButton from "../button/UserProfileButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import BrandLogo from "../other/BrandLogo";

const NavItemWithIcon = ({ item }: { item: typeof siteConfig.navItems[0] }) => {
  const { pathname } = useLocation();
  const isActive = pathname === item.href;
  
  return (
    <Link 
      to={item.href} 
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <SearchInput
      value={query}
      onChange={handleSearch}
      className="w-48 md:w-64 lg:w-80"
      placeholder="Search..."
    />
  );
};

const TopNavbar = () => {
  const { pathname: pathName } = useLocation();
  const navItems = siteConfig.navItems.filter(item => item.href !== "/search");
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
        <BrandLogo />
      </NavbarBrand>
      
      <nav className="hidden lg:flex items-center gap-2">
        {navItems.map((item) => (
          <NavItemWithIcon key={item.href} item={item} />
        ))}
      </nav>
      
      <NavbarContent justify="end" className="gap-4 md:gap-6">
        <NavbarItem className="mr-2 md:mr-4">
          <HeaderSearch />
        </NavbarItem>
        <NavbarItem className="flex lg:hidden">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex gap-4">
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
