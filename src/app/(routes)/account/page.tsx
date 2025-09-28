"use client";

import { PageHeader } from "@/client/common/components/PageHeader";
import { UserProfileCard } from "@/app/(routes)/account/components/UserProfileCard";
import { AccountSections } from "@/app/(routes)/account/components/AccountSections";
import { ThemeSettings } from "@/app/(routes)/account/components/ThemeSettings";
import { DockNavigationSettings } from "@/app/(routes)/account/components/DockNavigationSettings";
import { SecuritySettings } from "@/app/(routes)/account/components/SecuritySettings";
import { DangerZone } from "@/app/(routes)/account/components/DangerZone";

export const AccountPage = () => {
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

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account information, preferences, and billing details."
          variant="centered"
        />

        <UserProfileCard user={user} />
        <AccountSections user={user} />
        <ThemeSettings />
        <DockNavigationSettings />
        <SecuritySettings />
        <DangerZone />
      </div>
    </div>
  );
};

export default AccountPage;
