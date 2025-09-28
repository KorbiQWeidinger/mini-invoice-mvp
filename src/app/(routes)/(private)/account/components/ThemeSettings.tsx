"use client";

import { Palette } from "lucide-react";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import ThemeSwitcherDropdown from "@/client/features/theme/ThemeSwitcherDropdown";

export const ThemeSettings = () => {
  return (
    <PrelineCard
      title="Theme Preferences"
      icon={<Palette />}
      iconColor="primary"
      variant="outlined"
      className="mt-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">
            Choose your preferred color theme
          </p>
          <p className="text-xs text-text-tertiary">
            Changes apply immediately across the application
          </p>
        </div>
        <ThemeSwitcherDropdown />
      </div>
    </PrelineCard>
  );
};
