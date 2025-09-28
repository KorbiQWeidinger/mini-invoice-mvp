import { NextRequest, NextResponse } from "next/server";
import { invoiceService } from "@/db/database";
import { type Invoice, type InvoiceItem } from "@/db/database";
import { PDFService } from "@/client/common/utils/pdf-service";

// GET /api/invoices/[id]/pdf - Generate and download ZUGFeRD/Factur-X PDF
export async function GET(
  __request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceWithItems(id);

    if (!invoice) {
      return createErrorResponse("Invoice not found", 404);
    }

    // Generate ZUGFeRD/Factur-X PDF using the service
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Return PDF as response
    return createPDFResponse(pdfBuffer, invoice.invoice_number);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return createErrorResponse("Failed to generate PDF", 500);
  }
}

const getInvoiceWithItems = async (
  id: string
): Promise<(Invoice & { invoice_items?: InvoiceItem[] }) | null> => {
  return await invoiceService.getById(id);
};

const generateInvoicePDF = async (
  invoice: Invoice & { invoice_items?: InvoiceItem[] }
): Promise<Uint8Array> => {
  const pdfService = new PDFService();
  return await pdfService.generateZugferdPDF(invoice);
};

const createPDFResponse = (
  pdfBuffer: Uint8Array,
  invoiceNumber: string
): NextResponse => {
  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
};

const createErrorResponse = (message: string, status: number): NextResponse => {
  return NextResponse.json({ error: message }, { status });
};
