"use client";

import { useEffect, useRef } from "react";
import { Sun, Moon, Coffee, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeSwitcherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSwitcherPopup({
  isOpen,
  onClose,
}: ThemeSwitcherPopupProps) {
  const { theme, setTheme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);

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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div
        ref={popupRef}
        className="bg-bg-primary border border-border-primary rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-text-primary">
            Choose Theme
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-hover rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Theme Options */}
        <div className="p-6">
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
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-brand-primary text-text-on-primary"
                        : "bg-bg-secondary text-text-secondary"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text-primary">
                        {themeOption.label}
                      </h3>
                      {isSelected && (
                        <span className="text-xs bg-brand-primary text-text-on-primary px-2 py-1 rounded-full">
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-primary bg-bg-tertiary rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Press 1, 2, or 3 to quickly select</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
