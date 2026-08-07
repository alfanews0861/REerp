import { BaseRepository } from './BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import {
  CompanyModel,
  BranchModel,
  DepartmentModel,
  RoleModel,
  PermissionModel,
  UserModel,
  EmployeeModel,
  ProjectModel,
  LayoutModel,
  BlockModel,
  PlotModel,
  LeadSourceModel,
  LeadModel,
  LeadActivityModel,
  FollowUpModel,
  CampaignModel,
  CampaignExpenseModel,
  CustomerModel,
  BookingModel,
  PaymentModel,
  ReceiptModel,
  VehicleModel,
  DriverModel,
  VehicleTripModel,
  FuelEntryModel,
  ExpenseModel,
  AttendanceModel,
  NotificationModel,
  DocumentModel,
  MediaModel,
  SettingModel,
  AuditLogModel,
  AISuggestionModel,
} from '../models';
import {
  companyConverter,
  branchConverter,
  departmentConverter,
  roleConverter,
  permissionConverter,
  userConverter,
  employeeConverter,
  projectConverter,
  layoutConverter,
  blockConverter,
  plotConverter,
  leadSourceConverter,
  leadConverter,
  leadActivityConverter,
  followUpConverter,
  campaignConverter,
  campaignExpenseConverter,
  customerConverter,
  bookingConverter,
  paymentConverter,
  receiptConverter,
  vehicleConverter,
  driverConverter,
  vehicleTripConverter,
  fuelEntryConverter,
  expenseConverter,
  attendanceConverter,
  notificationConverter,
  documentConverter,
  mediaConverter,
  settingConverter,
  auditLogConverter,
  aiSuggestionConverter,
} from '../converters/typedConverters';

export class CompanyRepository extends BaseRepository<CompanyModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMPANIES, 'Company', companyConverter);
  }
}

export class BranchRepository extends BaseRepository<BranchModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BRANCHES, 'Branch', branchConverter);
  }
}

export class DepartmentRepository extends BaseRepository<DepartmentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.DEPARTMENTS, 'Department', departmentConverter);
  }
}

export class RoleRepository extends BaseRepository<RoleModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.ROLES, 'Role', roleConverter);
  }
}

export class PermissionRepository extends BaseRepository<PermissionModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PERMISSIONS, 'Permission', permissionConverter);
  }
}

export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.USERS, 'User', userConverter);
  }
}

export class EmployeeRepository extends BaseRepository<EmployeeModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.EMPLOYEES, 'Employee', employeeConverter);
  }
}

export class ProjectRepository extends BaseRepository<ProjectModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PROJECTS, 'Project', projectConverter);
  }
}

export class LayoutRepository extends BaseRepository<LayoutModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LAYOUTS, 'Layout', layoutConverter);
  }
}

export class BlockRepository extends BaseRepository<BlockModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BLOCKS, 'Block', blockConverter);
  }
}

export class PlotRepository extends BaseRepository<PlotModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PLOTS, 'Plot', plotConverter);
  }
}

export class LeadSourceRepository extends BaseRepository<LeadSourceModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LEAD_SOURCES, 'LeadSource', leadSourceConverter);
  }
}

export class LeadRepository extends BaseRepository<LeadModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LEADS, 'Lead', leadConverter);
  }
}

export class LeadActivityRepository extends BaseRepository<LeadActivityModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LEAD_ACTIVITIES, 'LeadActivity', leadActivityConverter);
  }
}

export class FollowUpRepository extends BaseRepository<FollowUpModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.FOLLOW_UPS, 'FollowUp', followUpConverter);
  }
}

export class CampaignRepository extends BaseRepository<CampaignModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.CAMPAIGNS, 'Campaign', campaignConverter);
  }
}

export class CampaignExpenseRepository extends BaseRepository<CampaignExpenseModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.CAMPAIGN_EXPENSES, 'CampaignExpense', campaignExpenseConverter);
  }
}

export class CustomerRepository extends BaseRepository<CustomerModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.CUSTOMERS, 'Customer', customerConverter);
  }
}

export class BookingRepository extends BaseRepository<BookingModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BOOKINGS, 'Booking', bookingConverter);
  }
}

export class PaymentRepository extends BaseRepository<PaymentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PAYMENTS, 'Payment', paymentConverter);
  }
}

export class ReceiptRepository extends BaseRepository<ReceiptModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.RECEIPTS, 'Receipt', receiptConverter);
  }
}

export class VehicleRepository extends BaseRepository<VehicleModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.VEHICLES, 'Vehicle', vehicleConverter);
  }
}

export class DriverRepository extends BaseRepository<DriverModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.DRIVERS, 'Driver', driverConverter);
  }
}

export class VehicleTripRepository extends BaseRepository<VehicleTripModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.VEHICLE_TRIPS, 'VehicleTrip', vehicleTripConverter);
  }
}

export class FuelEntryRepository extends BaseRepository<FuelEntryModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.FUEL_ENTRIES, 'FuelEntry', fuelEntryConverter);
  }
}

export class ExpenseRepository extends BaseRepository<ExpenseModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.EXPENSES, 'Expense', expenseConverter);
  }
}

export class AttendanceRepository extends BaseRepository<AttendanceModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.ATTENDANCE, 'Attendance', attendanceConverter);
  }
}

export class NotificationRepository extends BaseRepository<NotificationModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.NOTIFICATIONS, 'Notification', notificationConverter);
  }
}

export class DocumentRepository extends BaseRepository<DocumentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.DOCUMENTS, 'Document', documentConverter);
  }
}

export class MediaRepository extends BaseRepository<MediaModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.MEDIA, 'Media', mediaConverter);
  }
}

export class SettingRepository extends BaseRepository<SettingModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.SETTINGS, 'Setting', settingConverter);
  }
}

export class AuditLogRepository extends BaseRepository<AuditLogModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.AUDIT_LOGS, 'AuditLog', auditLogConverter);
  }
}

export class AISuggestionRepository extends BaseRepository<AISuggestionModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.AI_SUGGESTIONS, 'AISuggestion', aiSuggestionConverter);
  }
}
