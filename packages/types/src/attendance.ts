export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | 'ON_FIELD_DUTY';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  staffType?: 'FIELD_STAFF' | 'OFFICE_STAFF';
  assignedLocationName?: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  punchInTime?: string; // ISO string
  punchOutTime?: string; // ISO string
  punchInLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  punchOutLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  punchInSelfieUrl?: string;
  punchOutSelfieUrl?: string;
  isGeoFenceVerified: boolean;
  status: AttendanceStatus;
  workSummary?: string;
  totalHoursWorked?: number;
  approvedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @deprecated Use SiteVisit from './visit' instead. This legacy type will be removed.
 */
export interface SiteVisitRecord {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  projectId: string;
  projectName: string;
  assignedExecutiveId: string;
  assignedExecutiveName: string;
  vehicleId?: string;
  driverId?: string;
  driverName?: string;
  scheduledTime: string;
  actualVisitTime?: string;
  pickupAddress?: string;
  numberOfVisitors: number;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  feedbackNotes?: string;
  customerRating?: number; // 1-5
  isInterestedInBooking: boolean;
  interestedPlotIds?: string[];
  createdAt: string;
  updatedAt: string;
}
