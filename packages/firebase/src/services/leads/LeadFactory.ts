import { LeadCaptureRequestDTO } from './dto';
import { CampaignTouchpoint } from '@real-estate-erp/types';
import { LeadMapper } from './mapper';
import { CreateModelInput } from '../../models/base';
import { LeadModel } from '../../models/leads';

export class LeadFactory {
  public static createNewLead(
    dto: LeadCaptureRequestDTO,
    personId: string,
    touchpoint: CampaignTouchpoint,
    routingDetails: { ownerId?: string; telecallerId?: string; networkMemberId?: string; routingStrategy: string }
  ): CreateModelInput<LeadModel> & { personId: string } {
    const mapped = LeadMapper.toInternalModel(dto, personId, touchpoint, routingDetails);

    return {
      ...mapped,
      isActive: true,
    };
  }
}
