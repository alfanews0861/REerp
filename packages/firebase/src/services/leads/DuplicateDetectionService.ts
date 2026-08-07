import { PersonRepository } from '../../repositories/PersonRepository';
import { PersonModel } from '../../models/person';

export interface DuplicateDetectionContext {
  phone: string;
  email?: string;
  pan?: string;
  aadhaar?: string;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedPersonId?: string;
  confidenceScore: number;
}

export class DuplicateDetectionService {
  private personRepository: PersonRepository;

  constructor() {
    this.personRepository = new PersonRepository();
  }

  public async detectDuplicate(context: DuplicateDetectionContext): Promise<DuplicateDetectionResult> {
    let matchedPerson: PersonModel | null = null;
    let confidenceScore = 0;

    // 1. Check Mobile (Highest priority)
    if (context.phone) {
      const persons = await this.personRepository.findByMobile(context.phone);
      if (persons.length > 0) {
        matchedPerson = persons[0];
        confidenceScore += 50; // High confidence for mobile match
      }
    }

    // 2. Check Email (If not already matched by mobile, or to increase confidence)
    if (context.email) {
      const persons = await this.personRepository.findByEmail(context.email);
      if (persons.length > 0) {
        if (!matchedPerson) {
          matchedPerson = persons[0];
        }
        confidenceScore += 30;
      }
    }

    // 3. Check Exact matches for PAN / Aadhaar
    // Assuming PersonModel has identities array
    if ((context.pan || context.aadhaar) && matchedPerson) {
      const hasIdentity = matchedPerson.identities?.some(
        id => 
          (context.pan && id.type === 'PAN' && id.idNumber === context.pan) ||
          (context.aadhaar && id.type === 'AADHAAR' && id.idNumber === context.aadhaar)
      );
      if (hasIdentity) {
        confidenceScore += 20;
      }
    }

    // Fallback search for Identity if not matched yet
    if (!matchedPerson && (context.pan || context.aadhaar)) {
      // In a real app we might have a specific query for identities array
      // Due to Firestore array-of-objects querying limitations, 
      // strict identity matching usually requires a separate indexed structure or Cloud Function handling.
      // For now, we rely on Phone & Email which are indexed.
    }

    if (matchedPerson) {
      return {
        isDuplicate: true,
        matchedPersonId: matchedPerson.id,
        confidenceScore: Math.min(confidenceScore, 100),
      };
    }

    return {
      isDuplicate: false,
      confidenceScore: 0,
    };
  }
}
