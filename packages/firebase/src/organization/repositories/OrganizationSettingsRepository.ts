import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { OrganizationSettingsModel } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { organizationSettingsConverter } from '../../converters/typedConverters';

export class OrganizationSettingsRepository extends BaseRepository<OrganizationSettingsModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.ORGANIZATION_SETTINGS, 'OrganizationSettings', organizationSettingsConverter);
  }

  public async findByCompanyId(companyId: string): Promise<OrganizationSettingsModel | null> {
    const results = await this.findAll([where('companyId', '==', companyId)]);
    return results.length > 0 ? results[0] : null;
  }

  public async upsertForCompany(
    companyId: string,
    settingsData: Partial<OrganizationSettingsModel>,
    userId: string
  ): Promise<OrganizationSettingsModel> {
    const existing = await this.findByCompanyId(companyId);
    if (existing) {
      return this.update(existing.id, settingsData, userId);
    }

    const defaultSettings: Omit<OrganizationSettingsModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'> = {
      companyId,
      currency: settingsData.currency || { code: 'INR', symbol: '₹' },
      timezone: settingsData.timezone || 'Asia/Kolkata',
      dateFormat: settingsData.dateFormat || 'DD/MM/YYYY',
      fiscalYearStartMonth: settingsData.fiscalYearStartMonth || 4,
      taxSettings: settingsData.taxSettings || { gstEnabled: true, panRequired: true, reraRequired: true },
      features: settingsData.features || { enabledModules: ['company', 'branch', 'department', 'team', 'leads', 'sales', 'projects'] },
      notifications: settingsData.notifications || { emailNotifications: true, smsNotifications: false, whatsappNotifications: false },
    };

    return this.create(defaultSettings as OrganizationSettingsModel, userId);
  }
}
