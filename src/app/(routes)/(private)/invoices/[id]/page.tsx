"use client";

import { invoiceApiService } from "@/client/api/invoices";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/client/common/components/PageHeader";
import { InvoiceView } from "@/client/features/invoice/InvoiceView";
import { DownloadPDFButton } from "@/client/features/invoice/DownloadPDFButton";
import { useState, useEffect } from "react";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { type Invoice, type InvoiceItem } from "@/db/database";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<
    (Invoice & { invoice_items?: InvoiceItem[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const { id } = await params;
        const invoiceData = await invoiceApiService.getById(id);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("Error loading invoice:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [params]);

  const handleEdit = () => {
    if (invoice) {
      router.push(`/invoices/${invoice.id}/edit`);
    }
  };

  const handleBack = () => {
    router.push("/invoices");
  };

  if (loading) {
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
      <PageHeader
        title={`Invoice ${invoice.invoice_number}`}
        subtitle={`Created on ${new Date(
          invoice.created_at
        ).toLocaleDateString()}`}
        actions={
          <div className="flex flex-wrap gap-3">
            <PrelineButton variant="secondary" onClick={handleBack}>
              Back to Invoices
            </PrelineButton>
            <DownloadPDFButton
              invoiceId={invoice.id}
              invoiceNumber={invoice.invoice_number}
              variant="secondary"
            />
            <PrelineButton onClick={handleEdit}>Edit Invoice</PrelineButton>
          </div>
        }
      />

      <InvoiceView invoice={invoice} />
    </div>
  );
}
