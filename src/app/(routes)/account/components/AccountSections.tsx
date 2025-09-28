"use client";

import { Settings, CreditCard } from "lucide-react";
import { PrelineCard } from "../../../../client/common/components/ui/PrelineCard";

interface AccountSectionsProps {
  user: {
    plan: string;
    invoicesCount: number;
    totalRevenue: string;
  };
}

export const AccountSections = ({ user }: AccountSectionsProps) => {
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
                <div key={index} className="flex justify-between items-center">
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
  );
};
