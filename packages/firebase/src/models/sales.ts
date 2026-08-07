import { BaseFirestoreModel } from './base';

export interface CustomerModel extends BaseFirestoreModel {
  companyId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  altPhone?: string;
  address: string;
  panNumber?: string;
  aadharNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
  occupation?: string;
}

export interface BookingModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  projectId: string;
  layoutId: string;
  blockId: string;
  plotId: string;
  customerId: string;
  agentId?: string;
  bookingNumber: string;
  bookingDate: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  tokenAmount: number;
  paymentPlanType: 'outright' | 'installment' | 'custom';
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  agreementDate?: string;
}

export interface PaymentModel extends BaseFirestoreModel {
  bookingId: string;
  customerId: string;
  companyId: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card';
  transactionRef?: string;
  status: 'pending' | 'verified' | 'rejected' | 'refunded';
  remarks?: string;
  invoiceUrl?: string;
}

export interface ReceiptModel extends BaseFirestoreModel {
  paymentId: string;
  bookingId: string;
  customerId: string;
  receiptNumber: string;
  issueDate: string;
  amount: number;
  pdfUrl?: string;
  remarks?: string;
}
