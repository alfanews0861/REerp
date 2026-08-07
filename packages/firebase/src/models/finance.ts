import { BaseFirestoreModel } from './base';

export interface ExpenseModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  category: string;
  amount: number;
  date: string;
  paidByUserId: string;
  approvedByUserId?: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  receiptUrl?: string;
}

export interface AttendanceModel extends BaseFirestoreModel {
  employeeId: string;
  companyId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  verifiedBy?: string;
}
