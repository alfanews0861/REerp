export interface LeadCaptureRequestDTO {
  companyId: string;
  branchId: string;
  sourceCode: string; // From LeadSource
  campaignId?: string;
  
  // Person Identifiers
  firstName: string;
  lastName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  whatsappNumber?: string;
  
  // Identity for strict duplication check
  pan?: string;
  aadhaar?: string;
  
  // Context
  projectId?: string; // Preferred project
  requirementDetails?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  notes?: string;
  
  // Campaign Attribution
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
  campaignChannel?: string;
  
  // Ownership preservation
  ownerId?: string;
  telecallerId?: string;
  networkMemberId?: string;
  
  // Audit
  capturedByUserId?: string;
}

export interface LeadMatchingResultDTO {
  personId: string;
  isNewPerson: boolean;
  confidenceScore: number;
}
