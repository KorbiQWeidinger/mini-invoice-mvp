import { PageHeader } from "@/client/common/components/PageHeader";
import { UserProfileCard } from "@/app/(routes)/(private)/account/components/UserProfileCard";
import { AccountSections } from "@/app/(routes)/(private)/account/components/AccountSections";
import { ThemeSettings } from "@/app/(routes)/(private)/account/components/ThemeSettings";
import { DockNavigationSettings } from "@/app/(routes)/(private)/account/components/DockNavigationSettings";
import { SecuritySettings } from "@/app/(routes)/(private)/account/components/SecuritySettings";
import { DangerZone } from "@/app/(routes)/(private)/account/components/DangerZone";
import { redirect } from "next/navigation";
import { createServerClient } from "@/server/supabase/createServerClient";

export const AccountPage = async () => {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account information, preferences, and billing details."
          variant="centered"
        />

        <UserProfileCard user={data.user} />
        <AccountSections />
        <ThemeSettings />
        <DockNavigationSettings />
        <SecuritySettings />
        <DangerZone />
      </div>
    </div>
  );
};

export default AccountPage;
