"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  invoiceService,
  invoiceItemService,
  type InvoiceInsert,
  type InvoiceItemInsert,
  type Invoice,
  type InvoiceItem,
} from "@/db/database";
import { PageHeader } from "@/client/common/components/PageHeader";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { InvoiceEditor } from "@/client/features/invoice/InvoiceEditor";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const { id } = await params;
        const invoiceData = await invoiceService.getById(id);
        setInvoice(invoiceData);
        setItems(invoiceData.invoice_items || []);
      } catch (error) {
        console.error("Error loading invoice:", error);
        router.push("/invoices");
      } finally {
        setInitialLoading(false);
      }
    };

    loadInvoice();
  }, [params, router]);

  const handleSubmit = async (
    invoiceData: InvoiceInsert,
    itemsData: InvoiceItemInsert[]
  ) => {
    if (!invoice) return;

    setLoading(true);

    try {
      // Update invoice
      await invoiceService.update(invoice.id, invoiceData);

      // Delete existing items
      for (const item of items) {
        await invoiceItemService.delete(item.id);
      }

      // Create new items
      for (const item of itemsData) {
        await invoiceItemService.create({
          ...item,
          invoice_id: invoice.id,
        });
      }

      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Failed to update invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (invoice) {
      router.push(`/invoices/${invoice.id}`);
    } else {
      router.push("/invoices");
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-tertiary rounded mb-4"></div>
          <div className="h-4 bg-bg-tertiary rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-bg-tertiary rounded"></div>
            <div className="h-32 bg-bg-tertiary rounded"></div>
            <div className="h-32 bg-bg-tertiary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <PageHeader
          title="Invoice Not Found"
          subtitle="The requested invoice could not be found"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title={`Edit Invoice ${invoice.invoice_number}`}
          subtitle="Update invoice details and items"
        />
        <PrelineButton type="button" variant="secondary" onClick={handleCancel}>
          Cancel
        </PrelineButton>
      </div>

      <InvoiceEditor
        initialInvoice={invoice}
        initialItems={items}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Update Invoice"
      />
    </div>
  );
}
