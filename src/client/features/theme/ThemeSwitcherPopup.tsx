"use client";

import { useEffect } from "react";
import { Sun, Moon, Coffee } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PrelineModal } from "@/client/common/components/ui/PrelineModal";

interface ThemeSwitcherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSwitcherPopup({
  isOpen,
  onClose,
}: ThemeSwitcherPopupProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Clean and bright",
    },
    {
      value: "coffee",
      label: "Coffee",
      icon: Coffee,
      description: "Warm and cozy",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
  ] as const;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "1":
          setTheme("light");
          onClose();
          break;
        case "2":
          setTheme("coffee");
          onClose();
          break;
        case "3":
          setTheme("dark");
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, setTheme]);

  return (
    <PrelineModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Theme"
      size="md"
    >
      <div className="space-y-3">
        {themes.map((themeOption, index) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;

          return (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "border-brand-primary bg-brand-primary/10"
                  : "border-border-primary hover:border-border-secondary hover:bg-bg-hover"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? "bg-brand-primary text-white"
                    : "bg-bg-tertiary text-text-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-text-primary">
                    {themeOption.label}
                  </h3>
                  {isSelected && (
                    <span className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {themeOption.description}
                </p>
              </div>
              <div className="text-xs text-text-tertiary">{index + 1}</div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border-primary">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>Press 1, 2, or 3 to quickly select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </PrelineModal>
  );
}
