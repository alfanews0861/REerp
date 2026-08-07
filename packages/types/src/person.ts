import { BaseEntity } from './common';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

export type Classification = 
  | 'INDIVIDUAL' 
  | 'CUSTOMER' 
  | 'LEAD' 
  | 'BROKER' 
  | 'CHANNEL_PARTNER' 
  | 'INVESTOR' 
  | 'BUILDER' 
  | 'VENDOR' 
  | 'LEGAL_ADVISOR' 
  | 'EMPLOYEE';

export type PersonTag = 
  | 'VIP' 
  | 'HOT' 
  | 'WARM' 
  | 'COLD' 
  | 'NRI' 
  | 'HNI' 
  | 'REPEAT_BUYER' 
  | 'REFERRAL' 
  | 'BLACKLISTED';

export interface Address {
  type?: 'PERMANENT' | 'CURRENT' | 'OFFICE' | 'OTHER';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  geoCoordinates?: { latitude: number; longitude: number };
  googleMapsLink?: string;
}

export interface Identity {
  type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'RERA_LICENSE' | 'OTHER';
  idNumber: string;
  documentUrl?: string;
  verified?: boolean;
}

export interface SocialProfile {
  platform: 'LINKEDIN' | 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'OTHER';
  url: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface CommunicationPreferences {
  phone: boolean;
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
  bestTimeToCall?: string;
  doNotDisturb: boolean;
}

export interface Relationship {
  relatedPersonId?: string;
  relation: 'FAMILY_MEMBER' | 'NOMINEE' | 'REFERENCE' | 'REFERRAL' | 'BUSINESS_CONTACT' | 'OTHER';
  name?: string;
  notes?: string;
}

export interface Person extends BaseEntity {
  // Core
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  gender: Gender;
  dateOfBirth?: string; // ISO date string
  occupation?: string;
  company?: string;
  designation?: string;
  photoUrl?: string;
  preferredLanguage?: string;
  nationality?: string;
  maritalStatus?: MaritalStatus;

  // Classification & Tags
  classifications: Classification[];
  tags: PersonTag[];

  // Contact
  mobileNumbers: string[];
  emailAddresses: string[];
  primaryMobile?: string;
  primaryEmail?: string;
  whatsappNumber?: string;
  telegram?: string;
  socialProfiles: SocialProfile[];
  emergencyContact?: EmergencyContact;

  // Address
  addresses: Address[]; // Permanent, Current, Office etc. can be distinguished by type

  // Identity
  identities: Identity[];

  // Preferences
  communicationPreferences: CommunicationPreferences;

  // Relationships
  relationships: Relationship[];

  // Merge History & Auditing
  mergedWith?: string[]; // IDs of persons merged into this one
  mergedInto?: string; // Target person ID if this one was merged
  isDeleted: boolean; // Soft delete flag
  isActive: boolean;
  version: number;
}
