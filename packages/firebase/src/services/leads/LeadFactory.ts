import { LeadCaptureRequestDTO } from './dto';
import { CampaignAttributionResult } from './CampaignAttributionService';
import { LeadMapper } from './mapper';
import { CreateModelInput } from '../../models/base';
import { LeadModel } from '../../models/leads';

export class LeadFactory {
  public static createNewLead(
    dto: LeadCaptureRequestDTO,
    personId: string,
    attribution: CampaignAttributionResult
  ): CreateModelInput<LeadModel> & { personId: string } {
    const mapped = LeadMapper.toInternalModel(dto, personId, attribution);

    // Any default initializations can go here
    return {
      ...mapped,
      isActive: true,
    };
  }
}
