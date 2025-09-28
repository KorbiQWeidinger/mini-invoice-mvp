"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Command,
  ArrowRight,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  User,
  LogOut,
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useBreakpoint } from "@/client/common/hooks/useBreakpoint";
import { PrelineModal } from "@/client/common/components/ui/PrelineModal";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemePopup: () => void;
}

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: string;
  keywords?: string[];
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenThemePopup,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isTablet } = useBreakpoint();

  const commands: Command[] = [
    // Navigation Commands
    {
      id: "dashboard",
      title: "Go to Dashboard",
      description: "View your dashboard",
      icon: LayoutDashboard,
      category: "Navigation",
      keywords: ["home", "main", "overview"],
      action: () => {
        router.push("/dashboard");
        onClose();
      },
    },
    {
      id: "invoices",
      title: "View Invoices",
      description: "Browse all invoices",
      icon: FileText,
      category: "Navigation",
      keywords: ["list", "browse", "all"],
      action: () => {
        router.push("/invoices");
        onClose();
      },
    },
    {
      id: "create_invoice",
      title: "Create Invoice",
      description: "Start creating a new invoice",
      icon: Plus,
      category: "Actions",
      keywords: ["new", "add", "create"],
      action: () => {
        router.push("/invoices/new");
        onClose();
      },
    },

    // Settings Commands
    {
      id: "theme",
      title: "Change Theme",
      description: "Switch between light, dark, and coffee themes",
      icon: Palette,
      category: "Settings",
      keywords: ["dark", "light", "coffee", "color"],
      action: () => {
        onOpenThemePopup();
        onClose();
      },
    },
    {
      id: "settings",
      title: "Open Settings",
      description: "Access application settings",
      icon: Settings,
      category: "Settings",
      keywords: ["preferences", "config", "options"],
      action: () => {
        router.push("/account");
        onClose();
      },
    },

    // Account Commands
    {
      id: "profile",
      title: "View Profile",
      description: "View your user profile",
      icon: User,
      category: "Account",
      keywords: ["user", "me", "profile"],
      action: () => {
        router.push("/account");
        onClose();
      },
    },
    {
      id: "logout",
      title: "Sign Out",
      description: "Sign out of your account",
      icon: LogOut,
      category: "Account",
      keywords: ["exit", "quit", "signout"],
      action: async () => {
        onClose();
        try {
          const { logout } = await import(
            "@/app/(routes)/(private)/account/actions"
          );
          await logout();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    },
  ];

  const categories = Array.from(new Set(commands.map((cmd) => cmd.category)));

  // Function to determine if a command should be highlighted based on current route
  const isCommandActive = (commandId: string) => {
    const result = (() => {
      switch (commandId) {
        case "dashboard":
          return pathname === "/dashboard" || pathname === "/";
        case "invoices":
          return pathname === "/invoices";
        case "create_invoice":
          return pathname === "/invoices/new";
        case "profile":
          return pathname === "/account";
        default:
          return false;
      }
    })();

    // Debug logging
    if (result) {
      console.log(`Command ${commandId} is active for pathname: ${pathname}`);
    }

    return result;
  };

  const filteredCommands = commands.filter((command) => {
    const searchTerm = query.toLowerCase();
    const matchesQuery =
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.id.toLowerCase().includes(searchTerm) ||
      command.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm)
      );

    if (selectedCategory) {
      return matchesQuery && command.category === selectedCategory;
    }

    return matchesQuery;
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
      setSelectedCategory(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case "Tab":
          event.preventDefault();
          if (selectedCategory) {
            setSelectedCategory(null);
          } else {
            const currentCommand = filteredCommands[selectedIndex];
            if (currentCommand) {
              setSelectedCategory(currentCommand.category);
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose, selectedCategory]);

  if (!isOpen) return null;

  return (
    <PrelineModal
      isOpen={isOpen}
      onClose={onClose}
      placement={0.1}
      closeOnBackdrop
    >
      <PrelineModal.Body noPadding>
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border-primary">
          <Search className="w-5 h-5 text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-hover rounded transition-colors duration-200"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Category Filter */}
        {query && (
          <div className="px-4 py-2 border-b border-border-primary">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                  !selectedCategory
                    ? "bg-brand-primary text-text-on-primary"
                    : "bg-bg-hover text-text-secondary hover:text-text-primary"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-brand-primary text-text-on-primary"
                      : "bg-bg-hover text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto">
          {Object.keys(groupedCommands).length > 0 ? (
            Object.entries(groupedCommands).map(
              ([category, categoryCommands]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div className="px-4 py-2 bg-bg-tertiary border-b border-border-primary">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      {category}
                    </div>
                  </div>

                  {/* Category Commands */}
                  {categoryCommands.map((command) => {
                    const globalIndex = filteredCommands.findIndex(
                      (c) => c.id === command.id
                    );
                    const Icon = command.icon;
                    const isActive = isCommandActive(command.id);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={command.id}
                        onClick={command.action}
                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-bg-hover transition-colors duration-200 ${
                          isSelected ? "bg-bg-hover" : ""
                        } ${
                          isActive
                            ? "border-l-2 border-brand-primary bg-brand-primary/5"
                            : ""
                        }`}
                      >
                        <Icon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary">
                            {command.title}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {command.description}
                          </div>
                        </div>
                        {command.id === "theme" && (
                          <div className="opacity-0 group-hover:opacity-100">
                            <span className="text-xs text-text-tertiary">
                              Click to switch
                            </span>
                          </div>
                        )}
                        <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )
            )
          ) : (
            <div className="p-4 text-center text-text-secondary">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div>No commands found</div>
              <div className="text-xs mt-1">Try a different search term</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isTablet && (
          <div className="flex items-center justify-between p-3 border-t border-border-primary text-xs text-text-tertiary">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-tertiary px-1 py-0.5 rounded border border-border-secondary">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-tertiary px-1 py-0.5 rounded border border-border-secondary">
                  ↵
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-tertiary px-1 py-0.5 rounded border border-border-secondary">
                  tab
                </kbd>
                filter
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-tertiary px-1 py-0.5 rounded border border-border-secondary">
                  esc
                </kbd>
                close
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        )}
      </PrelineModal.Body>
    </PrelineModal>
  );
}
