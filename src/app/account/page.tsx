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
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function AccountPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Account Settings
          </h1>
          <p className="text-text-secondary">
            Manage your account information, preferences, and billing details.
          </p>
        </div>

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accountSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-bg-secondary border border-border-primary rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    {section.title}
                  </h3>
                </div>
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
              </div>
            );
          })}
        </div>

        {/* Theme Settings */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Theme Preferences
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">
                Choose your preferred color theme
              </p>
              <p className="text-xs text-text-tertiary">
                Changes apply immediately across the application
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Security
            </h3>
          </div>
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
              <button className="px-4 py-2 bg-brand-primary text-text-on-primary rounded-lg hover:bg-brand-primary-hover transition-colors">
                Change Password
              </button>
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
              <button className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-hover transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-bg-secondary border border-red-200 rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <LogOut className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
          </div>
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
              <button className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                Sign Out
              </button>
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
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
