"use client";

import { useEffect } from "react";
import { Sun, Moon, Coffee } from "lucide-react";
import { useTheme, type Theme } from "./ThemeProvider";
import { usePrelineReinit } from "@/client/common/hooks/usePrelineReinit";
import { PrelineModal } from "@/client/common/components/ui/PrelineModal";

interface ThemeSwitcherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeOption {
  value: string;
  label: string;
  icon: typeof Sun;
  description: string;
}

const themes: ThemeOption[] = [
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
];

function useKeyboardNavigation(
  isOpen: boolean,
  onClose: () => void,
  setTheme: (theme: Theme) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "1":
          setTheme("light" as Theme);
          onClose();
          break;
        case "2":
          setTheme("coffee" as Theme);
          onClose();
          break;
        case "3":
          setTheme("dark" as Theme);
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, setTheme]);
}

function ThemeOptionButton({
  themeOption,
  index,
  isSelected,
  onSelect,
}: {
  themeOption: ThemeOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = themeOption.icon;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? "border-brand-primary bg-brand-primary/10"
          : "border-border-primary hover:border-border-secondary hover:bg-bg-hover"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isSelected
            ? "bg-brand-primary text-text-on-primary"
            : "bg-bg-tertiary text-text-secondary"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text-primary">{themeOption.label}</h3>
          {isSelected && (
            <span className="text-xs bg-brand-primary text-text-on-primary px-2 py-1 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary">{themeOption.description}</p>
      </div>
      <div className="text-xs text-text-tertiary">{index + 1}</div>
    </button>
  );
}

export function ThemeSwitcherPopup({
  isOpen,
  onClose,
}: ThemeSwitcherPopupProps) {
  const { theme, setTheme } = useTheme();
  usePrelineReinit();

  useKeyboardNavigation(isOpen, onClose, setTheme);

  return (
    <PrelineModal isOpen={isOpen} onClose={onClose} placement="center">
      <PrelineModal.Header title="Choose Theme" onClose={onClose} />
      <PrelineModal.Body>
        <div className="space-y-3">
          {themes.map((themeOption, index) => (
            <ThemeOptionButton
              key={themeOption.value}
              themeOption={themeOption}
              index={index}
              isSelected={theme === themeOption.value}
              onSelect={() => {
                setTheme(themeOption.value as Theme);
                onClose();
              }}
            />
          ))}
        </div>
      </PrelineModal.Body>
      <PrelineModal.Footer>
        <div className="flex items-center justify-between w-full text-xs text-text-tertiary">
          <span>Press 1, 2, or 3 to quickly select</span>
          <span>ESC to close</span>
        </div>
      </PrelineModal.Footer>
    </PrelineModal>
  );
}
