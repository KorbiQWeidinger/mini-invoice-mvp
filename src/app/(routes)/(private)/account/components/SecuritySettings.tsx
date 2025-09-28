"use client";

import { Shield } from "lucide-react";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";

export const SecuritySettings = () => {
  return (
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
            <p className="text-sm font-medium text-text-primary">Password</p>
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
  );
};
