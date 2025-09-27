"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface DockSettings {
  isSticky: boolean;
  isCollapsed: boolean;
}

interface SettingsContextType {
  dockSettings: DockSettings;
  setDockSticky: (isSticky: boolean) => void;
  setDockCollapsed: (isCollapsed: boolean) => void;
  toggleDockCollapsed: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [dockSettings, setDockSettings] = useState<DockSettings>({
    isSticky: false,
    isCollapsed: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("dockSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setDockSettings({
          isSticky: parsed.isSticky ?? false,
          isCollapsed: parsed.isCollapsed ?? false,
        });
      } catch (error) {
        console.error("Failed to parse dock settings:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("dockSettings", JSON.stringify(dockSettings));
  }, [dockSettings]);

  const setDockSticky = (isSticky: boolean) => {
    setDockSettings((prev) => ({ ...prev, isSticky }));
  };

  const setDockCollapsed = (isCollapsed: boolean) => {
    setDockSettings((prev) => ({ ...prev, isCollapsed }));
  };

  const toggleDockCollapsed = () => {
    setDockSettings((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  return (
    <SettingsContext.Provider
      value={{
        dockSettings,
        setDockSticky,
        setDockCollapsed,
        toggleDockCollapsed,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
