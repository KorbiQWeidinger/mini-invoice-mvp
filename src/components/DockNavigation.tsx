"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Plus, User, Search } from "lucide-react";
import CommandPalette from "./CommandPalette";
import ThemeSwitcherPopup from "./ThemeSwitcherPopup";

export default function DockNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isThemePopupOpen, setIsThemePopupOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Show dock on hover near bottom of screen
  useEffect(() => {
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
  }, []);

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

  return (
    <>
      {/* Dock Navigation */}
      <div
        ref={dockRef}
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-bg-primary/90 backdrop-blur-md border border-border-primary rounded-2xl shadow-lg px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Navigation Items */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

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

            {/* Command Palette Button (Center) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-secondary text-text-on-primary hover:bg-brand-secondary-hover hover:scale-105 transition-all duration-200"
              title="Command Palette (⌘K)"
            >
              <Search className="w-6 h-6" />
            </button>
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
