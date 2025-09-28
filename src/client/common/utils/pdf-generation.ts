import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from "pdf-lib";
import { type Invoice, type InvoiceItem } from "@/db/database";

export interface PDFGenerationOptions {
  fontSize?: number;
  headerFontSize?: number;
  margin?: number;
  lineHeight?: number;
  pageWidth?: number;
  pageHeight?: number;
}

export const DEFAULT_PDF_OPTIONS: PDFGenerationOptions = {
  fontSize: 10,
  headerFontSize: 16,
  margin: 50,
  lineHeight: 14,
  pageWidth: 595.28, // A4 width
  pageHeight: 841.89, // A4 height
};

export const formatCurrency = (amount: number, currency = "EUR"): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("de-DE");
};

export const formatDateISO = (dateString: string): string => {
  return new Date(dateString).toISOString().split("T")[0];
};

export const calculateTableColumnWidths = (
  pageWidth: number,
  margin: number
) => {
  const availableWidth = pageWidth - 2 * margin;
  return {
    description: availableWidth * 0.4,
    quantity: availableWidth * 0.15,
    unitPrice: availableWidth * 0.2,
    total: availableWidth * 0.25,
  };
};

export const createPDFHeader = async (
  pdfDoc: PDFDocument,
  invoice: Invoice & { invoice_items?: InvoiceItem[] },
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
) => {
  const page = pdfDoc.addPage([options.pageWidth!, options.pageHeight!]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();

  let yPosition = height - options.margin!;

  // Company header
  page.drawText("Your Company Name", {
    x: options.margin!,
    y: yPosition,
    size: options.headerFontSize!,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  yPosition -= options.lineHeight! * 2;

  // Invoice title
  page.drawText("RECHNUNG", {
    x: options.margin!,
    y: yPosition,
    size: options.headerFontSize! + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Invoice number (right aligned)
  const invoiceNumberText = `Rechnungsnummer: ${invoice.invoice_number}`;
  const textWidth = font.widthOfTextAtSize(
    invoiceNumberText,
    options.fontSize!
  );
  page.drawText(invoiceNumberText, {
    x: options.pageWidth! - options.margin! - textWidth,
    y: yPosition,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= options.lineHeight! * 3;

  return { page, font, boldFont, yPosition };
};

export const addInvoiceDetails = (
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  invoice: Invoice & { invoice_items?: InvoiceItem[] },
  yPosition: number,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): number => {
  let currentY = yPosition;

  // Invoice dates
  page.drawText("Rechnungsdatum:", {
    x: options.margin!,
    y: currentY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(formatDate(invoice.issue_date), {
    x: options.margin! + 120,
    y: currentY,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight!;

  page.drawText("Fälligkeitsdatum:", {
    x: options.margin!,
    y: currentY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(formatDate(invoice.due_date), {
    x: options.margin! + 120,
    y: currentY,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight! * 2;

  return currentY;
};

export const addCustomerInfo = (
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  invoice: Invoice & { invoice_items?: InvoiceItem[] },
  yPosition: number,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): number => {
  let currentY = yPosition;

  // Customer section
  page.drawText("Rechnungsempfänger:", {
    x: options.margin!,
    y: currentY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight! * 1.5;

  page.drawText(invoice.customer_name, {
    x: options.margin!,
    y: currentY,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight!;

  if (invoice.customer_email) {
    page.drawText(invoice.customer_email, {
      x: options.margin!,
      y: currentY,
      size: options.fontSize!,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= options.lineHeight!;
  }

  if (invoice.customer_address) {
    const addressLines = invoice.customer_address.split("\n");
    addressLines.forEach((line) => {
      page.drawText(line, {
        x: options.margin!,
        y: currentY,
        size: options.fontSize!,
        font,
        color: rgb(0, 0, 0),
      });
      currentY -= options.lineHeight!;
    });
  }

  currentY -= options.lineHeight!;

  return currentY;
};

export const addInvoiceTable = (
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  invoice: Invoice & { invoice_items?: InvoiceItem[] },
  yPosition: number,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): number => {
  let currentY = yPosition;
  const columns = calculateTableColumnWidths(
    options.pageWidth!,
    options.margin!
  );

  // Table header
  const headerY = currentY;

  page.drawText("Beschreibung", {
    x: options.margin!,
    y: headerY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Menge", {
    x: options.margin! + columns.description,
    y: headerY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Einzelpreis", {
    x: options.margin! + columns.description + columns.quantity,
    y: headerY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Gesamtpreis", {
    x:
      options.margin! +
      columns.description +
      columns.quantity +
      columns.unitPrice,
    y: headerY,
    size: options.fontSize!,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight! * 1.5;

  // Draw header line
  page.drawLine({
    start: { x: options.margin!, y: currentY },
    end: { x: options.pageWidth! - options.margin!, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  currentY -= options.lineHeight!;

  // Table rows
  invoice.invoice_items?.forEach((item: InvoiceItem) => {
    page.drawText(item.description, {
      x: options.margin!,
      y: currentY,
      size: options.fontSize!,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(item.quantity.toString(), {
      x: options.margin! + columns.description,
      y: currentY,
      size: options.fontSize!,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(formatCurrency(item.unit_price), {
      x: options.margin! + columns.description + columns.quantity,
      y: currentY,
      size: options.fontSize!,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(formatCurrency(item.line_total), {
      x:
        options.margin! +
        columns.description +
        columns.quantity +
        columns.unitPrice,
      y: currentY,
      size: options.fontSize!,
      font,
      color: rgb(0, 0, 0),
    });

    currentY -= options.lineHeight!;
  });

  currentY -= options.lineHeight!;

  return currentY;
};

export const addInvoiceTotals = (
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  invoice: Invoice & { invoice_items?: InvoiceItem[] },
  yPosition: number,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): number => {
  let currentY = yPosition;
  const rightAlign = options.pageWidth! - options.margin!;

  // Draw totals line
  page.drawLine({
    start: { x: options.pageWidth! * 0.6, y: currentY },
    end: { x: rightAlign, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  currentY -= options.lineHeight! * 1.5;

  // Subtotal
  const subtotalText = `Zwischensumme: ${formatCurrency(invoice.subtotal)}`;
  const subtotalWidth = font.widthOfTextAtSize(subtotalText, options.fontSize!);
  page.drawText(subtotalText, {
    x: rightAlign - subtotalWidth,
    y: currentY,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight!;

  // Tax
  const taxText = `MwSt. (${invoice.tax_rate}%): ${formatCurrency(
    invoice.tax_amount
  )}`;
  const taxWidth = font.widthOfTextAtSize(taxText, options.fontSize!);
  page.drawText(taxText, {
    x: rightAlign - taxWidth,
    y: currentY,
    size: options.fontSize!,
    font,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight! * 1.5;

  // Total
  const totalText = `Gesamtbetrag: ${formatCurrency(invoice.total_amount)}`;
  const totalWidth = boldFont.widthOfTextAtSize(
    totalText,
    options.fontSize! + 2
  );
  page.drawText(totalText, {
    x: rightAlign - totalWidth,
    y: currentY,
    size: options.fontSize! + 2,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  currentY -= options.lineHeight! * 2;

  return currentY;
};
