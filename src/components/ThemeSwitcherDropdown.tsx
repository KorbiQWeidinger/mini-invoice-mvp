"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Coffee, ChevronDown } from "lucide-react";

export default function ThemeSwitcherDropdown() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "coffee", label: "Coffee", icon: Coffee },
    { value: "dark", label: "Dark", icon: Moon },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id="hs-dropdown-theme"
        type="button"
        className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-border-primary bg-bg-primary text-text-primary shadow-sm hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none"
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="hidden sm:block">{currentTheme?.label}</span>
        <ChevronDown className="hs-dropdown-open:rotate-180 w-4 h-4" />
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-bg-primary shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dropdown-theme"
      >
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                theme === themeOption.value ? "bg-bg-hover" : ""
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {themeOption.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
