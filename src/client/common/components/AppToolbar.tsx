"use client";

import { FileText } from "lucide-react";
import { PrelineDropdown } from "@/client/common/components/ui/PrelineDropdown";
import { useOrg } from "@/client/features/orgs/OrgProvider";

export function AppToolbar() {
  const { organizations, currentOrgId, setCurrentOrgId } = useOrg();
  return (
    <div className="sticky top-0 z-50 bg-bg-secondary border-b border-border-primary px-4 py-2">
      <div className="flex items-center gap-3">
        {/* App Logo */}
        <div className="w-5 h-5 bg-gradient-to-r from-icon-primary to-icon-primary-hover rounded-md flex items-center justify-center">
          <FileText className="w-3 h-3 text-text-on-primary" />
        </div>

        {/* App Name */}
        <h1 className="text-sm font-light text-text-primary tracking-wide">
          Invoice Buddy
        </h1>

        {/* Org Switcher */}
        <div className="ml-auto">
          <PrelineDropdown
            label="Organization"
            value={currentOrgId ?? ""}
            onChange={(value) => {
              if (value) void setCurrentOrgId(value);
            }}
            options={organizations.map((o) => ({ value: o.id, label: o.name }))}
          />
        </div>
      </div>
    </div>
  );
}
