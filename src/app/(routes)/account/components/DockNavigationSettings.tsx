"use client";

import { Settings } from "lucide-react";
import { PrelineCard } from "../../../../client/common/components/ui/PrelineCard";
import { PrelineToggle } from "../../../../client/common/components/ui/PrelineToggle";
import { useSettings } from "@/client/features/settings/SettingsProvider";

export const DockNavigationSettings = () => {
  const { dockSettings, setDockSticky } = useSettings();

  return (
    <PrelineCard
      title="Dock Navigation"
      icon={<Settings />}
      iconColor="primary"
      variant="outlined"
      className="mt-6"
    >
      <div className="space-y-4">
        <PrelineToggle
          checked={dockSettings.isSticky}
          onChange={setDockSticky}
          label="Sticky Dock"
          description="Keep the dock navigation always visible"
        />
        <div className="text-xs text-text-tertiary">
          When enabled, the dock will always be visible at the bottom of the
          screen. On mobile devices, the dock is always sticky regardless of
          this setting.
        </div>
      </div>
    </PrelineCard>
  );
};
