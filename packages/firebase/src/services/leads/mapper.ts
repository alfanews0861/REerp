import { LeadCaptureRequestDTO } from './dto';
import { CampaignTouchpoint } from '@real-estate-erp/types';

export class LeadMapper {
  public static toInternalModel(
    dto: LeadCaptureRequestDTO,
    personId: string,
    touchpoint: CampaignTouchpoint,
    routingDetails: { ownerId?: string; telecallerId?: string; networkMemberId?: string; routingStrategy: string }
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
      status: 'NEW', // Matches LeadStatus 'NEW'
      requirementDetails: dto.requirementDetails,
      budgetMin: dto.budgetMin,
      budgetMax: dto.budgetMax,
      preferredLocation: dto.preferredLocation,
      notes: dto.notes,
      personId: personId, 
      
      // Ownership and Routing
      ownerId: routingDetails.ownerId,
      telecallerId: routingDetails.telecallerId,
      networkMemberId: routingDetails.networkMemberId,
      routingStrategy: routingDetails.routingStrategy,
      
      // Campaign
      campaignId: touchpoint.campaignId,
      source: dto.sourceCode,
      
      aiIntentScore: 0,
      
      // Timestamps
      firstContactAt: new Date().toISOString()
    };
  }
}
