"use client";

import {
  User,
  Calendar,
  Settings,
  LogOut,
  Palette,
  Shield,
  CreditCard,
} from "lucide-react";
import ThemeSwitcherDropdown from "@/client/features/theme/ThemeSwitcherDropdown";
import { useSettings } from "@/client/features/settings/SettingsProvider";
import PageHeader from "@/client/common/components/PageHeader";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineToggle } from "@/client/common/components/ui/PrelineToggle";

export default function AccountPage() {
  const { dockSettings, setDockSticky } = useSettings();

  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
    joinDate: "January 2024",
    plan: "Pro",
    invoicesCount: 24,
    totalRevenue: "$12,450.00",
  };

  const accountSections = [
    {
      title: "Account Settings",
      icon: Settings,
      items: [
        { label: "Current Plan", value: user.plan },
        { label: "Billing Cycle", value: "Monthly" },
        { label: "Auto-renewal", value: "Enabled" },
      ],
    },
    {
      title: "Statistics",
      icon: CreditCard,
      items: [
        { label: "Total Invoices", value: user.invoicesCount.toString() },
        { label: "Total Revenue", value: user.totalRevenue },
        { label: "Active Clients", value: "12" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account information, preferences, and billing details."
          variant="centered"
        />

        {/* User Profile Card */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-text-on-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {user.name}
              </h2>
              <p className="text-text-secondary">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">
                  Member since {user.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {accountSections.map((section) => {
            const Icon = section.icon;
            return (
              <PrelineCard
                key={section.title}
                title={section.title}
                icon={<Icon />}
                iconColor="primary"
                variant="outlined"
              >
                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-text-secondary">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </PrelineCard>
            );
          })}
        </div>

        {/* Theme Settings */}
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

        {/* Dock Navigation Settings */}
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

        {/* Security Settings */}
        <PrelineCard
          title="Security"
          icon={<Shield />}
          iconColor="primary"
          variant="outlined"
          className="mt-6"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Password
                </p>
                <p className="text-xs text-text-secondary">
                  Last changed 3 months ago
                </p>
              </div>
              <PrelineButton variant="secondary" size="sm">
                Change Password
              </PrelineButton>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-text-secondary">
                  Add an extra layer of security
                </p>
              </div>
              <PrelineButton variant="secondary" size="sm">
                Enable 2FA
              </PrelineButton>
            </div>
          </div>
        </PrelineCard>

        {/* Danger Zone */}
        <PrelineCard
          title="Danger Zone"
          icon={<LogOut />}
          iconColor="danger"
          variant="outlined"
          className="mt-6 border-red-200"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Sign Out
                </p>
                <p className="text-xs text-text-secondary">
                  Sign out of your account on this device
                </p>
              </div>
              <PrelineButton variant="danger" size="sm">
                Sign Out
              </PrelineButton>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-500">
                  Delete Account
                </p>
                <p className="text-xs text-text-secondary">
                  Permanently delete your account and all data
                </p>
              </div>
              <PrelineButton variant="danger" size="sm">
                Delete Account
              </PrelineButton>
            </div>
          </div>
        </PrelineCard>
      </div>
    </div>
  );
}
