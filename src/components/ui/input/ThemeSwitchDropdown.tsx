"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Switch } from "@heroui/react";

const ThemeSwitchDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <Switch
      isSelected={isDark}
      onValueChange={toggle}
      size="md"
      color="primary"
      aria-label="Toggle theme"
      startContent={<Icon icon="lucide:sun" className="text-amber-400" />}
      endContent={<Icon icon="lucide:moon" className="text-indigo-400" />}
      classNames={{
        wrapper: "group-data-[selected=true]:bg-primary",
        thumb: "group-data-[selected=true]:ml-6"
      }}
    />
  );
};

export default ThemeSwitchDropdown;
