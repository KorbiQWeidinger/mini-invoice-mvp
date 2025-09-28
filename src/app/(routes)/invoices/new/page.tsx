"use client";

import { useState } from "react";
import {
  invoiceService,
  invoiceItemService,
  type InvoiceInsert,
  type InvoiceItemInsert,
} from "@/db/database";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/client/common/components/PageHeader";
import { InvoiceEditor } from "@/client/common/components/Invoice/InvoiceEditor";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    invoiceData: InvoiceInsert,
    itemsData: InvoiceItemInsert[]
  ) => {
    setLoading(true);

    try {
      // Create invoice
      const createdInvoice = await invoiceService.create(invoiceData);

      // Create invoice items
      for (const item of itemsData) {
        await invoiceItemService.create({
          ...item,
          invoice_id: createdInvoice.id,
        });
      }

      router.push("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/invoices");
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Create Invoice"
        subtitle="Create a new invoice for your customer"
      />

      <InvoiceEditor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitLabel="Create Invoice"
      />
    </div>
  );
}
