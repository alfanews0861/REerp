export type BookingStatus = 'DRAFT' | 'TOKEN_PAID' | 'AGREEMENT_DONE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
export type PaymentMode = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI' | 'CARD';

export interface PaymentInstallment {
  id: string;
  bookingId: string;
  installmentNumber: number;
  description: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  status: PaymentStatus;
  paymentDate?: string;
  paymentMode?: PaymentMode;
  transactionReference?: string;
  receiptNumber?: string;
  receiptPdfUrl?: string;
  verifiedByAccountantId?: string;
}

export interface PlotBooking {
  id: string;
  bookingNumber: string;
  projectId: string;
  projectName: string;
  plotId: string;
  plotNumber: string;
  plotSizeSqFt: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerPan?: string;
  customerAadhar?: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  marketingExecutiveId?: string;
  branchId: string;
  agreedPricePerSqFt: number;
  totalPlotAmount: number;
  discountAmount: number;
  finalSaleAmount: number;
  tokenAmountPaid: number;
  tokenPaidDate: string;
  agreementDate?: string;
  registrationDate?: string;
  status: BookingStatus;
  paymentSchedule: PaymentInstallment[];
  commissionAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralExpense {
  id: string;
  expenseCategory: 'MARKETING' | 'OFFICE_MAINTENANCE' | 'SITE_DEVELOPMENT' | 'TRAVEL' | 'EVENT' | 'MISC';
  amount: number;
  spentByUserId: string;
  spentByUserName: string;
  branchId: string;
  expenseDate: string;
  description: string;
  receiptUrl?: string;
  isApproved: boolean;
  approvedByUserId?: string;
  createdAt: string;
}
