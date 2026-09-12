export type ExpenseCategory =
  | 'SITE_VISIT'
  | 'VEHICLE_FUEL'
  | 'MARKETING_CAMPAIGN'
  | 'EMPLOYEE_CLAIM'
  | 'SITE_DEVELOPMENT'
  | 'OFFICE_ADMIN';

export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export type ExpensePaymentMode = 'CASH' | 'UPI' | 'COMPANY_CARD' | 'BANK_TRANSFER' | 'PETTY_CASH';

export interface ExpenseClaim {
  id: string;
  claimNumber: string;
  category: ExpenseCategory;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMode: ExpensePaymentMode;
  status: ExpenseStatus;
  submittedBy: {
    id: string;
    name: string;
    role: string;
    phone?: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    approvedAt: string;
    remarks?: string;
  };
  rejectedReason?: string;
  receiptUrl?: string;
  receiptName?: string;
  linkedSiteVisitId?: string;
  linkedVehicleId?: string;
  linkedCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}
