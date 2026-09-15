import { calculateInvoiceTotals, calculateLineSubtotal } from "@/lib/invoice-totals";
import { formatSequential } from "@/lib/format";
import type { CustomerDetail } from "@/types/customer";
import type { Invoice, InvoiceItem, InvoiceStatus, PaymentMethod } from "@/types/invoice";
import { customersMock } from "./customers";
import { productsMock } from "./products";

interface InvoiceSeed {
  id: string;
  establishmentCode: string;
  issuePointCode: string;
  sequential: number;
  issueDate: string;
  customer: CustomerDetail;
  items: Array<[mainCode: string, quantity: number]>;
  paymentMethod: PaymentMethod;
  invoiceStatus: InvoiceStatus;
}

const ISSUER_RUC = "1790011223001";

/** 49-digit access key with its module-11 check digit, as the SRI defines it. */
function buildAccessKey(seed: InvoiceSeed): string {
  const [year, month, day] = seed.issueDate.split("-");
  const base = [
    day + month + year,
    "01", // invoice
    ISSUER_RUC,
    "1", // test environment
    seed.establishmentCode + seed.issuePointCode,
    formatSequential(seed.sequential),
    "12345678",
    "1", // normal emission
  ].join("");

  let sum = 0;
  let weight = 2;
  for (let index = base.length - 1; index >= 0; index--) {
    sum += Number(base[index]) * weight;
    weight = weight === 7 ? 2 : weight + 1;
  }
  const checkDigit = 11 - (sum % 11);
  return base + (checkDigit === 11 ? 0 : checkDigit === 10 ? 1 : checkDigit);
}

function buildInvoice(seed: InvoiceSeed): Invoice {
  const items: InvoiceItem[] = seed.items.map(([mainCode, quantity], index) => {
    const product = productsMock.find((candidate) => candidate.mainCode === mainCode);
    if (!product) throw new Error(`Unknown product in invoice mock: ${mainCode}`);

    const line = { quantity, unitPrice: product.unitPrice, taxRate: product.tax.rate };
    const taxableBase = calculateLineSubtotal(line);
    return {
      id: `${seed.id}-item-${index + 1}`,
      productId: product.id,
      mainCode: product.mainCode,
      description: product.description,
      quantity,
      unitPrice: product.unitPrice,
      discount: 0,
      totalPriceWithoutTax: taxableBase,
      taxCode: product.tax.code,
      taxPercentageCode: product.tax.percentageCode,
      taxRate: product.tax.rate,
      taxableBase,
      taxAmount: calculateInvoiceTotals([line]).totalVat,
    };
  });

  const totals = calculateInvoiceTotals(items);
  const sequential = formatSequential(seed.sequential);

  return {
    id: seed.id,
    number: `${seed.establishmentCode}-${seed.issuePointCode}-${sequential}`,
    accessKey: buildAccessKey(seed),
    issueDate: seed.issueDate,
    establishmentCode: seed.establishmentCode,
    issuePointCode: seed.issuePointCode,
    sequential,
    buyerIdentificationType: seed.customer.identificationType,
    buyerIdentification: seed.customer.identification,
    buyerBusinessName: seed.customer.businessName,
    buyerAddress: seed.customer.address,
    totalWithoutTaxes: totals.totalWithoutTaxes,
    totalDiscount: totals.totalDiscount,
    totalVat: totals.totalVat,
    totalAmount: totals.totalAmount,
    paymentMethod: seed.paymentMethod,
    invoiceStatus: seed.invoiceStatus,
    status: "ACTIVE",
    items,
  };
}

const [andina, lopez, carter, finalConsumer, costaAzul] = customersMock;

export const invoicesMock: Invoice[] = [
  buildInvoice({ id: "f1e2d3c4-0042-4b5a-9c8d-7e6f5a4b3c42", establishmentCode: "001", issuePointCode: "001", sequential: 42, issueDate: "2026-09-14", customer: andina, items: [["PRD-004", 5], ["PRD-002", 1], ["PRD-003", 2]], paymentMethod: "20", invoiceStatus: "AUTHORIZED" }),
  buildInvoice({ id: "f1e2d3c4-0041-4b5a-9c8d-7e6f5a4b3c41", establishmentCode: "001", issuePointCode: "001", sequential: 41, issueDate: "2026-09-12", customer: lopez, items: [["PRD-001", 3], ["PRD-003", 1]], paymentMethod: "19", invoiceStatus: "AUTHORIZED" }),
  buildInvoice({ id: "f1e2d3c4-2017-4b5a-9c8d-7e6f5a4b3c17", establishmentCode: "002", issuePointCode: "001", sequential: 17, issueDate: "2026-09-12", customer: costaAzul, items: [["PRD-004", 2], ["PRD-001", 4]], paymentMethod: "20", invoiceStatus: "PROCESSING" }),
  buildInvoice({ id: "f1e2d3c4-2016-4b5a-9c8d-7e6f5a4b3c16", establishmentCode: "002", issuePointCode: "001", sequential: 16, issueDate: "2026-09-11", customer: andina, items: [["PRD-002", 1], ["PRD-001", 2]], paymentMethod: "20", invoiceStatus: "QUEUED" }),
  buildInvoice({ id: "f1e2d3c4-0040-4b5a-9c8d-7e6f5a4b3c40", establishmentCode: "001", issuePointCode: "001", sequential: 40, issueDate: "2026-09-10", customer: finalConsumer, items: [["PRD-001", 3]], paymentMethod: "01", invoiceStatus: "REJECTED" }),
  buildInvoice({ id: "f1e2d3c4-0039-4b5a-9c8d-7e6f5a4b3c39", establishmentCode: "001", issuePointCode: "001", sequential: 39, issueDate: "2026-09-09", customer: carter, items: [["PRD-004", 1], ["PRD-003", 1]], paymentMethod: "19", invoiceStatus: "DRAFT" }),
];
