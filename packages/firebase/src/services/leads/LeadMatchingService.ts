import { DuplicateDetectionService } from './DuplicateDetectionService';
import { PersonService } from '../PersonService';
import { LeadCaptureRequestDTO, LeadMatchingResultDTO } from './dto';


export class LeadMatchingService {
  private duplicateDetectionService: DuplicateDetectionService;
  private personService: PersonService;

  constructor() {
    this.duplicateDetectionService = new DuplicateDetectionService();
    this.personService = new PersonService();
  }

  public async matchOrCreatePerson(dto: LeadCaptureRequestDTO, userId: string): Promise<LeadMatchingResultDTO> {
    const duplicateResult = await this.duplicateDetectionService.detectDuplicate({
      phone: dto.phone,
      email: dto.email,
      pan: dto.pan,
      aadhaar: dto.aadhaar,
    });

    if (duplicateResult.isDuplicate && duplicateResult.matchedPersonId) {
      return {
        personId: duplicateResult.matchedPersonId,
        isNewPerson: false,
        confidenceScore: duplicateResult.confidenceScore,
      };
    }

    // Create new Person
    const newPersonInput = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: `${dto.firstName} ${dto.lastName}`.trim(),
      displayName: `${dto.firstName} ${dto.lastName}`.trim(),
      gender: 'PREFER_NOT_TO_SAY' as const,
      classifications: ['LEAD' as const],
      tags: [],
      mobileNumbers: [dto.phone],
      emailAddresses: dto.email ? [dto.email] : [],
      primaryMobile: dto.phone,
      primaryEmail: dto.email,
      socialProfiles: [],
      addresses: [],
      identities: [] as any[],
      communicationPreferences: {
        phone: true,
        whatsapp: !!dto.whatsappNumber,
        sms: true,
        email: !!dto.email,
        doNotDisturb: false,
      },
      relationships: [],
    };

    if (dto.pan || dto.aadhaar) {
      if (dto.pan) {
        newPersonInput.identities.push({
          type: 'PAN',
          idNumber: dto.pan,
        });
      }
      if (dto.aadhaar) {
        newPersonInput.identities.push({
          type: 'AADHAAR',
          idNumber: dto.aadhaar,
        });
      }
    }

    const createdPerson = await this.personService.createPerson(newPersonInput, userId);

    return {
      personId: createdPerson.id,
      isNewPerson: true,
      confidenceScore: 100,
    };
  }
}
