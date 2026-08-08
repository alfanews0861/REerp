import { LeadCaptureRequestDTO } from './dto';
import { CampaignAttribution, CampaignTouchpoint, CampaignChannel, AttributionModel } from '@real-estate-erp/types';

export class CampaignAttributionService {
  /**
   * Generates a new touchpoint from a lead capture request.
   */
  public createTouchpoint(dto: LeadCaptureRequestDTO, leadId: string): CampaignTouchpoint {
    return {
      id: `touch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      campaignId: dto.campaignId || 'ORGANIC',
      sourceCode: dto.sourceCode,
      medium: dto.utmMedium || 'none',
      channel: (dto.campaignChannel as CampaignChannel) || 'OTHER',
      touchpoint: dto.utmSource || dto.sourceCode,
      timestamp: new Date().toISOString(),
      actor: dto.capturedByUserId || 'SYSTEM',
      metadata: {
        utmCampaign: dto.utmCampaign,
        referralCode: dto.referralCode,
      }
    };
  }

  /**
   * Computes the attribution model for a lead given its touchpoints.
   */
  public computeAttribution(
    leadId: string, 
    existingAttribution: CampaignAttribution | null, 
    newTouchpoint: CampaignTouchpoint,
    model: AttributionModel = 'FIRST_TOUCH'
  ): CampaignAttribution {
    const touchpoints = existingAttribution ? [...existingAttribution.touchpoints, newTouchpoint] : [newTouchpoint];
    
    // Sort touchpoints chronologically safely without mutating original if it was somehow frozen
    const sortedTouchpoints = [...touchpoints].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const firstTouch = sortedTouchpoints[0];
    const lastTouch = sortedTouchpoints[sortedTouchpoints.length - 1];
    
    // NOTE: For POSITION_BASED and TIME_DECAY, the underlying structure tracks all touchpoints.
    // The actual fractional value per touchpoint (e.g. 40-20-40) is calculated dynamically in reporting layers 
    // to preserve immutable touchpoint history here.
    
    return {
      leadId,
      firstTouchId: firstTouch.id,
      lastTouchId: lastTouch.id,
      touchpoints: sortedTouchpoints,
      attributionModel: model
    };
  }
}
