"use client";

import { useState, useEffect } from "react";
import { Settings, CreditCard, Users, Link2 } from "lucide-react";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineInput } from "@/client/common/components/ui/PrelineInput";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { invoiceApiService } from "@/client/api/invoices";
import type { Invoice } from "@/db/database";
import { useOrg } from "@/client/features/orgs/OrgProvider";
import { orgApi } from "@/client/api/orgs";

export const AccountSections = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { organizations, currentOrgId, refresh } = useOrg();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceApiService.getAll();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Calculate statistics from actual invoice data
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const activeClients = new Set(
    invoices.map((invoice) => invoice.customer_name)
  ).size;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const accountSections = [
    {
      title: "Account Settings",
      icon: Settings,
      items: [
        { label: "Current Plan", value: "Premium" },
        { label: "Billing Cycle", value: "Monthly" },
        { label: "Auto-renewal", value: "Enabled" },
      ],
    },
    {
      title: "Organization Members",
      icon: Users,
      items: [
        { label: "Orgs", value: organizations.map((o) => o.name).join(", ") || "None" },
        { label: "Current Org", value: organizations.find((o) => o.id === currentOrgId)?.name || "Not selected" },
      ],
    },
    {
      title: "Invite Member",
      icon: Link2,
      items: [],
    },
    {
      title: "Statistics",
      icon: CreditCard,
      items: [
        {
          label: "Total Invoices",
          value: loading ? "..." : totalInvoices.toString(),
        },
        {
          label: "Total Revenue",
          value: loading ? "..." : formatCurrency(totalRevenue),
        },
        {
          label: "Active Clients",
          value: loading ? "..." : activeClients.toString(),
        },
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
            {section.title === "Invite Member" ? (
              <div className="space-y-3">
                <PrelineInput
                  type="email"
                  label="Email"
                  value={inviteEmail}
                  onChange={setInviteEmail}
                />
                <PrelineButton
                  onClick={async () => {
                    if (!currentOrgId || !inviteEmail) return;
                    try {
                      setInviteLoading(true);
                      await orgApi.invite({ organization_id: currentOrgId, email: inviteEmail, role: 'member' });
                      setInviteEmail("");
                      await refresh();
                      alert("Invite created. Share the link from your database or email workflow.");
                    } finally {
                      setInviteLoading(false);
                    }
                  }}
                  loading={inviteLoading}
                >
                  Send Invite
                </PrelineButton>
              </div>
            ) : (
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
            )}
          </PrelineCard>
        );
      })}
    </div>
  );
};
