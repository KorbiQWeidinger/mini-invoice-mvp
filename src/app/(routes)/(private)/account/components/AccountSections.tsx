"use client";

import { useState, useEffect } from "react";
import { Settings, CreditCard } from "lucide-react";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { invoiceApiService } from "@/client/api/invoices";
import type { Invoice } from "@/db/database";

export const AccountSections = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

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
