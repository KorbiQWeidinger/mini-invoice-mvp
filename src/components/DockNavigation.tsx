"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  User,
  Search,
  Menu,
} from "lucide-react";
import CommandPalette from "./CommandPalette";
import ThemeSwitcherPopup from "./ThemeSwitcherPopup";
import { useSettings } from "./SettingsProvider";

export default function DockNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isThemePopupOpen, setIsThemePopupOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { dockSettings, toggleMobileDock, setMobileDockOpen } = useSettings();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
    },
    {
      name: "New Invoice",
      href: "/invoices/new",
      icon: Plus,
    },
    {
      name: "Command Palette",
      href: "#",
      icon: Search,
      isCommandPalette: true,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href;
  };

  const handleMobileToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    toggleMobileDock();

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Detect screen size after hydration
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Show dock on hover near bottom of screen (only when not sticky)
  useEffect(() => {
    if (dockSettings.isSticky) {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientY } = event;
      const windowHeight = window.innerHeight;
      const threshold = 50; // Show when within 50px of bottom

      if (clientY > windowHeight - threshold) {
        setIsVisible(true);
      } else if (clientY < windowHeight - 200) {
        // Hide when moving away from bottom
        setIsVisible(false);
      }
    };

    const handleTouchStart = () => {
      // On mobile, show dock on any touch
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [dockSettings.isSticky]);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine if we should show the dock
  const shouldShowDock = isVisible || dockSettings.isSticky;

  return (
    <>
      {/* Dock Navigation */}
      <div
        ref={dockRef}
        className={`fixed z-40 transition-all duration-300 ${
          isSmallScreen
            ? dockSettings.isMobileDockOpen
              ? "bottom-4 left-1/2 transform -translate-x-1/2"
              : "bottom-4 left-4"
            : "bottom-4 left-1/2 transform -translate-x-1/2"
        } ${
          shouldShowDock
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-bg-primary/90 backdrop-blur-md border border-border-primary rounded-2xl shadow-lg px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Mobile Toggle Button (only on mobile when collapsed) */}
            {isSmallScreen && !dockSettings.isMobileDockOpen && (
              <button
                ref={mobileToggleRef}
                onClick={handleMobileToggle}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  isAnimating ? "scale-95" : "scale-100"
                } bg-bg-hover text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:scale-105`}
                disabled={isAnimating}
                title="Open navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Close Button (only on mobile when expanded) - positioned on the left */}
            {isSmallScreen && dockSettings.isMobileDockOpen && (
              <button
                onClick={() => setMobileDockOpen(false)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-bg-hover text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:scale-105 transition-all duration-200"
                title="Close navigation"
              >
                <span className="text-lg">✕</span>
              </button>
            )}

            {/* Navigation Items (show when not mobile or when mobile dock is open) */}
            {(!isSmallScreen || dockSettings.isMobileDockOpen) &&
              navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                // Handle command palette button
                if (item.isCommandPalette) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsCommandPaletteOpen(true);
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-secondary text-text-on-primary hover:bg-brand-secondary-hover hover:scale-105 transition-all duration-200"
                      title="Command Palette (⌘K)"
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  );
                }

                // Handle regular navigation items
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-brand-primary text-text-on-primary scale-110"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:scale-105"
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenThemePopup={() => setIsThemePopupOpen(true)}
      />

      {/* Theme Switcher Popup */}
      <ThemeSwitcherPopup
        isOpen={isThemePopupOpen}
        onClose={() => setIsThemePopupOpen(false)}
      />
    </>
  );
}
