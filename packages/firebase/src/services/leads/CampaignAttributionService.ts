import { LeadCaptureRequestDTO } from './dto';

export interface CampaignAttributionResult {
  initialScore: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
}

export class CampaignAttributionService {
  public calculateAttribution(dto: LeadCaptureRequestDTO): CampaignAttributionResult {
    let initialScore = 0;

    // Base score by source
    switch (dto.sourceCode.toUpperCase()) {
      case 'WALK_IN':
        initialScore += 50;
        break;
      case 'REFERRAL':
        initialScore += 60;
        break;
      case 'GOOGLE_SEARCH':
        initialScore += 40;
        break;
      case 'FACEBOOK_ADS':
      case 'INSTAGRAM_ADS':
        initialScore += 30;
        break;
      case '99ACRES':
      case 'MAGICBRICKS':
      case 'HOUSING_COM':
        initialScore += 45;
        break;
      default:
        initialScore += 20;
    }

    // Weight by campaign attribution
    if (dto.utmCampaign) {
      initialScore += 10;
    }

    if (dto.referralCode) {
      initialScore += 20;
    }

    return {
      initialScore: Math.min(initialScore, 100),
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      referralCode: dto.referralCode,
    };
  }
}
