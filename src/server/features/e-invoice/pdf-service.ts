import { PDFDocument, PDFPage, PDFFont, rgb } from "pdf-lib";
import { InvoiceService } from "@e-invoice-eu/core";
import { type Invoice, type InvoiceItem } from "@/db/database";
import {
  createPDFHeader,
  addInvoiceDetails,
  addCustomerInfo,
  addInvoiceTable,
  addInvoiceTotals,
  DEFAULT_PDF_OPTIONS,
  type PDFGenerationOptions,
} from "./pdf-generation";
import { mapInvoiceToEInvoiceFormat } from "./e-invoice-mapping";

export class PDFService {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService(console);
  }

  async generateProfessionalPDF(
    invoice: Invoice & { invoice_items?: InvoiceItem[] },
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    // Create header and get page elements
    const {
      page,
      font,
      boldFont,
      yPosition: headerY,
    } = await createPDFHeader(pdfDoc, invoice, options);

    // Add invoice details
    let currentY = addInvoiceDetails(
      page,
      font,
      boldFont,
      invoice,
      headerY,
      options
    );

    // Add customer information
    currentY = addCustomerInfo(
      page,
      font,
      boldFont,
      invoice,
      currentY,
      options
    );

    // Add invoice table
    currentY = addInvoiceTable(
      page,
      font,
      boldFont,
      invoice,
      currentY,
      options
    );

    // Add totals
    addInvoiceTotals(page, font, boldFont, invoice, currentY, options);

    // Add footer
    this.addFooter(page, font, options);

    return await pdfDoc.save();
  }

  async generateZugferdPDF(
    invoice: Invoice & { invoice_items?: InvoiceItem[] }
  ): Promise<Uint8Array> {
    // Generate professional PDF
    const pdfBytes = await this.generateProfessionalPDF(invoice);

    // Map invoice to e-invoice format
    const invoiceData = mapInvoiceToEInvoiceFormat(invoice);

    // Generate ZUGFeRD/Factur-X e-invoice and embed into PDF
    const renderedInvoice = await this.invoiceService.generate(invoiceData, {
      format: "Factur-X-Extended", // Use Factur-X Extended format
      lang: "de-de",
      embedPDF: true,
      pdf: {
        buffer: pdfBytes,
        filename: `invoice-${invoice.invoice_number}.pdf`,
        mimetype: "application/pdf",
      },
    });

    return renderedInvoice as Uint8Array;
  }

  private addFooter(
    page: PDFPage,
    font: PDFFont,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): void {
    const footerY = options.margin!;
    const centerX = options.pageWidth! / 2;

    // Company information footer
    const footerText =
      "Your Company Name | Musterstraße 123, 12345 Musterstadt | Tel: +49 123 456789 | E-Mail: info@company.com";
    const textWidth = font.widthOfTextAtSize(footerText, 8);

    page.drawText(footerText, {
      x: centerX - textWidth / 2,
      y: footerY,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Draw footer line
    page.drawLine({
      start: { x: options.margin!, y: footerY + 15 },
      end: { x: options.pageWidth! - options.margin!, y: footerY + 15 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  }
}
