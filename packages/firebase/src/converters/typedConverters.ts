import { createBaseConverter } from './baseConverter';
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

export const companyConverter = createBaseConverter<CompanyModel>();
export const branchConverter = createBaseConverter<BranchModel>();
export const departmentConverter = createBaseConverter<DepartmentModel>();
export const roleConverter = createBaseConverter<RoleModel>();
export const permissionConverter = createBaseConverter<PermissionModel>();
export const userConverter = createBaseConverter<UserModel>();
export const employeeConverter = createBaseConverter<EmployeeModel>();
export const projectConverter = createBaseConverter<ProjectModel>();
export const layoutConverter = createBaseConverter<LayoutModel>();
export const blockConverter = createBaseConverter<BlockModel>();
export const plotConverter = createBaseConverter<PlotModel>();
export const leadSourceConverter = createBaseConverter<LeadSourceModel>();
export const leadConverter = createBaseConverter<LeadModel>();
export const leadActivityConverter = createBaseConverter<LeadActivityModel>();
export const followUpConverter = createBaseConverter<FollowUpModel>();
export const campaignConverter = createBaseConverter<CampaignModel>();
export const campaignExpenseConverter = createBaseConverter<CampaignExpenseModel>();
export const customerConverter = createBaseConverter<CustomerModel>();
export const bookingConverter = createBaseConverter<BookingModel>();
export const paymentConverter = createBaseConverter<PaymentModel>();
export const receiptConverter = createBaseConverter<ReceiptModel>();
export const vehicleConverter = createBaseConverter<VehicleModel>();
export const driverConverter = createBaseConverter<DriverModel>();
export const vehicleTripConverter = createBaseConverter<VehicleTripModel>();
export const fuelEntryConverter = createBaseConverter<FuelEntryModel>();
export const expenseConverter = createBaseConverter<ExpenseModel>();
export const attendanceConverter = createBaseConverter<AttendanceModel>();
export const notificationConverter = createBaseConverter<NotificationModel>();
export const documentConverter = createBaseConverter<DocumentModel>();
export const mediaConverter = createBaseConverter<MediaModel>();
export const settingConverter = createBaseConverter<SettingModel>();
export const auditLogConverter = createBaseConverter<AuditLogModel>();
export const aiSuggestionConverter = createBaseConverter<AISuggestionModel>();
