"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Coffee } from "lucide-react";
import { PrelineDropdown } from "@/client/common/components/ui/PrelineDropdown";

export default function ThemeSwitcherDropdown() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "coffee", label: "Coffee", icon: <Coffee className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  ];

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as "light" | "coffee" | "dark");
  };

  return (
    <PrelineDropdown
      value={theme}
      onChange={handleThemeChange}
      options={themes}
      className="z-40"
      buttonClassName="shadow-sm"
    />
  );
}
