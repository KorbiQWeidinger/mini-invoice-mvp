import { Invoice as EInvoiceInvoice } from "@e-invoice-eu/core";
import { type Invoice, type InvoiceItem } from "@/db/database";
import { formatDateISO } from "./pdf-generation";

export const mapInvoiceToEInvoiceFormat = (
  invoice: Invoice & { invoice_items?: InvoiceItem[] }
): EInvoiceInvoice => {
  // Create properly typed invoice lines with at least one item
  const invoiceLines = invoice.invoice_items?.length
    ? invoice.invoice_items.map((item: InvoiceItem) => ({
        "cbc:ID": item.id,
        "cbc:InvoicedQuantity": item.quantity.toString(),
        "cbc:InvoicedQuantity@unitCode": "C62" as const,
        "cbc:LineExtensionAmount": item.line_total.toString(),
        "cbc:LineExtensionAmount@currencyID": "EUR" as const,
        "cac:Item": {
          "cbc:Name": item.description,
          "cbc:Description": item.description,
          "cac:ClassifiedTaxCategory": {
            "cbc:ID": "S" as const,
            "cbc:Percent": invoice.tax_rate.toString(),
            "cac:TaxScheme": {
              "cbc:ID": "VAT",
            },
          },
        },
        "cac:Price": {
          "cbc:PriceAmount": item.unit_price.toString(),
          "cbc:PriceAmount@currencyID": "EUR" as const,
        },
      }))
    : [
        {
          "cbc:ID": "1",
          "cbc:InvoicedQuantity": "1",
          "cbc:InvoicedQuantity@unitCode": "C62" as const,
          "cbc:LineExtensionAmount": "0",
          "cbc:LineExtensionAmount@currencyID": "EUR" as const,
          "cac:Item": {
            "cbc:Name": "No items",
            "cbc:Description": "No items",
            "cac:ClassifiedTaxCategory": {
              "cbc:ID": "S" as const,
              "cbc:Percent": "0",
              "cac:TaxScheme": {
                "cbc:ID": "VAT",
              },
            },
          },
          "cac:Price": {
            "cbc:PriceAmount": "0",
            "cbc:PriceAmount@currencyID": "EUR" as const,
          },
        },
      ];

  return {
    "ubl:Invoice": {
      "cbc:CustomizationID":
        "urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:extended" as const,
      "cbc:ProfileID": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0" as const,
      "cbc:ID": invoice.invoice_number,
      "cbc:IssueDate": formatDateISO(invoice.issue_date),
      "cbc:DueDate": formatDateISO(invoice.due_date),
      "cbc:InvoiceTypeCode": "380" as const, // Invoice
      "cbc:DocumentCurrencyCode": "EUR" as const,

      // Supplier (Seller) information
      "cac:AccountingSupplierParty": {
        "cac:Party": {
          "cbc:EndpointID": "123456789",
          "cbc:EndpointID@schemeID": "2" as const,
          "cac:PartyName": {
            "cbc:Name": "Your Company Name",
          },
          "cac:PostalAddress": {
            "cbc:StreetName": "123 Business Street",
            "cbc:CityName": "City",
            "cbc:PostalZone": "12345",
            "cac:Country": {
              "cbc:IdentificationCode": "DE" as const,
            },
          },
          "cac:PartyLegalEntity": {
            "cbc:RegistrationName": "Your Company Name",
          },
        },
      },

      // Customer (Buyer) information
      "cac:AccountingCustomerParty": {
        "cac:Party": {
          "cbc:EndpointID": "987654321",
          "cbc:EndpointID@schemeID": "2" as const,
          "cac:PartyName": {
            "cbc:Name": invoice.customer_name,
          },
          "cac:PostalAddress": {
            "cbc:StreetName":
              invoice.customer_address?.split("\n")[0] || "Customer Address",
            "cbc:CityName": invoice.customer_address?.split("\n")[1] || "City",
            "cbc:PostalZone":
              invoice.customer_address?.split("\n")[2] || "12345",
            "cac:Country": {
              "cbc:IdentificationCode": "DE" as const,
            },
          },
          "cac:PartyLegalEntity": {
            "cbc:RegistrationName": invoice.customer_name,
          },
        },
      },

      // Invoice lines - using properly typed array with at least one element
      "cac:InvoiceLine": invoiceLines as [
        (typeof invoiceLines)[0],
        ...(typeof invoiceLines)[0][]
      ],

      // Tax totals
      "cac:TaxTotal": [
        {
          "cbc:TaxAmount": invoice.tax_amount.toString(),
          "cbc:TaxAmount@currencyID": "EUR" as const,
          "cac:TaxSubtotal": [
            {
              "cbc:TaxableAmount": invoice.subtotal.toString(),
              "cbc:TaxableAmount@currencyID": "EUR" as const,
              "cbc:TaxAmount": invoice.tax_amount.toString(),
              "cbc:TaxAmount@currencyID": "EUR" as const,
              "cac:TaxCategory": {
                "cbc:ID": "S" as const,
                "cbc:Percent": invoice.tax_rate.toString(),
                "cac:TaxScheme": {
                  "cbc:ID": "VAT",
                },
              },
            },
          ],
        },
        {
          "cbc:TaxAmount": "0",
          "cbc:TaxAmount@currencyID": "EUR" as const,
          "cac:TaxSubtotal": [
            {
              "cbc:TaxableAmount": "0",
              "cbc:TaxableAmount@currencyID": "EUR" as const,
              "cbc:TaxAmount": "0",
              "cbc:TaxAmount@currencyID": "EUR" as const,
              "cac:TaxCategory": {
                "cbc:ID": "Z" as const,
                "cbc:Percent": "0",
                "cac:TaxScheme": {
                  "cbc:ID": "VAT",
                },
              },
            },
          ],
        },
      ] as const,

      // Legal monetary totals
      "cac:LegalMonetaryTotal": {
        "cbc:LineExtensionAmount": invoice.subtotal.toString(),
        "cbc:LineExtensionAmount@currencyID": "EUR" as const,
        "cbc:TaxExclusiveAmount": invoice.subtotal.toString(),
        "cbc:TaxExclusiveAmount@currencyID": "EUR" as const,
        "cbc:TaxInclusiveAmount": invoice.total_amount.toString(),
        "cbc:TaxInclusiveAmount@currencyID": "EUR" as const,
        "cbc:PayableAmount": invoice.total_amount.toString(),
        "cbc:PayableAmount@currencyID": "EUR" as const,
      },
    },
  } satisfies EInvoiceInvoice;
};
