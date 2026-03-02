"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoIosSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";

const ThemeSwitchDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark" || theme === "system";

  return (
    <div className="flex items-center">
      <Switch
        defaultSelected={isDark}
        size="lg"
        color="primary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <IoMoon className={className} />
          ) : (
            <IoIosSunny className={className} />
          )
        }
        onChange={(e) => {
          setTheme(e.target.checked ? "dark" : "light");
        }}
        aria-label="Toggle theme"
      />
    </div>
  );
};

export default ThemeSwitchDropdown;
