export type ClientType = "salaried" | "business" | "nri" | "professional";

export interface ChecklistItem {
  req_key: string;
  label: string;
}

const COMMON: ChecklistItem[] = [
  { req_key: "pan", label: "PAN Card" },
  { req_key: "aadhaar", label: "Aadhaar Card" },
  { req_key: "bank_statement", label: "Bank Statement (FY)" },
];

const TEMPLATES: Record<ClientType, ChecklistItem[]> = {
  salaried: [
    ...COMMON,
    { req_key: "form16", label: "Form 16" },
    { req_key: "rent_receipts", label: "Rent Receipts / HRA Proof" },
    { req_key: "investment_80c", label: "80C Investment Proofs" },
    { req_key: "form26as", label: "Form 26AS / AIS" },
  ],
  business: [
    ...COMMON,
    { req_key: "pl_statement", label: "Profit & Loss Statement" },
    { req_key: "balance_sheet", label: "Balance Sheet" },
    { req_key: "gst_returns", label: "GST Returns (if registered)" },
    { req_key: "purchase_sales", label: "Purchase & Sales Register" },
    { req_key: "form26as", label: "Form 26AS / AIS" },
  ],
  professional: [
    ...COMMON,
    { req_key: "receipts", label: "Professional Receipts / Invoices" },
    { req_key: "expense_ledger", label: "Expense Ledger" },
    { req_key: "form26as", label: "Form 26AS / AIS" },
    { req_key: "advance_tax", label: "Advance Tax Challans" },
  ],
  nri: [
    ...COMMON,
    { req_key: "passport", label: "Passport / Visa Copy" },
    { req_key: "nre_nro", label: "NRE / NRO Account Statements" },
    { req_key: "foreign_income", label: "Foreign Income Proof" },
    { req_key: "trc", label: "Tax Residency Certificate" },
  ],
};

export function checklistFor(type: ClientType): ChecklistItem[] {
  return TEMPLATES[type] ?? COMMON;
}

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  salaried: "Salaried",
  business: "Business",
  professional: "Professional",
  nri: "NRI",
};
