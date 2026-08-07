import { LeadCaptureRequestDTO } from './dto';
import { CampaignAttributionResult } from './CampaignAttributionService';

export class LeadMapper {
  public static toInternalModel(
    dto: LeadCaptureRequestDTO,
    personId: string,
    attribution: CampaignAttributionResult
  ): any {
    return {
      companyId: dto.companyId,
      branchId: dto.branchId,
      leadSourceId: dto.sourceCode,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      altPhone: dto.altPhone,
      status: 'new',
      stage: 'lead_captured',
      requirementDetails: dto.requirementDetails,
      budgetMin: dto.budgetMin,
      budgetMax: dto.budgetMax,
      preferredLocation: dto.preferredLocation,
      notes: dto.notes,
      // We will map person reference in LeadFactory or keep it in LeadModel if it had one
      // Wait, LeadModel in leads.ts doesn't have personId by default, but we matched the person.
      // Let's add it dynamically as it's required for CRM relations.
      personId: personId, 
      initialScore: attribution.initialScore,
      utmSource: attribution.utmSource,
      utmCampaign: attribution.utmCampaign,
    };
  }
}
