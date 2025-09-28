"use client";

import { useState } from "react";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { Download } from "lucide-react";

interface DownloadPDFButtonProps {
  invoiceId: string;
  invoiceNumber: string;
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function DownloadPDFButton({
  invoiceId,
  invoiceNumber,
  variant = "secondary",
  size = "sm",
}: DownloadPDFButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // You could add a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PrelineButton
      variant={variant}
      size={size}
      onClick={handleDownloadPDF}
      loading={isDownloading}
      icon={<Download />}
    >
      Download PDF
    </PrelineButton>
  );
}
