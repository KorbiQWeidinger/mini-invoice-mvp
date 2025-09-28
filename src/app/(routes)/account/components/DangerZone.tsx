"use client";

import { LogOut } from "lucide-react";
import { PrelineCard } from "../../../../client/common/components/ui/PrelineCard";
import { PrelineButton } from "../../../../client/common/components/ui/PrelineButton";

export const DangerZone = () => {
  return (
    <PrelineCard
      title="Danger Zone"
      icon={<LogOut />}
      iconColor="danger"
      variant="outlined"
      className="mt-6 border-error"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-text-primary">Sign Out</p>
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
            <p className="text-sm font-medium text-error">Delete Account</p>
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
  );
};
