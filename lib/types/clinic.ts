// ============================================================================
// Multi-Tenant Clinic Domain Types & Schemas
// ============================================================================

export type ClinicType =
  | 'Clinic'
  | 'Hospital'
  | 'Diagnostic Center'
  | 'Dental Clinic'
  | 'Other';

export type PrimarySpecialty =
  | 'General Medicine'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Gynecology'
  | 'Orthopedics'
  | 'ENT'
  | 'Dental'
  | 'Physiotherapy'
  | 'Other';

export const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export type IndianState = typeof INDIAN_STATES_AND_UTS[number];

export type UserRole = 'CLINIC_OWNER' | 'DOCTOR' | 'RECEPTIONIST' | 'STAFF';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ClinicAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: IndianState | string;
  pincode: string;
  country: string; // Default: 'India'
}

export interface ClinicSettings {
  currency: string; // Default: 'INR'
  timeZone: string; // Default: 'Asia/Kolkata'
  slotDurationMinutes: number; // Default: 15
  autoPrintPrescription: boolean;
  smsNotificationsEnabled: boolean;
  whatsappNotificationsEnabled: boolean;
}

export interface Clinic {
  id: string; // Tenant Boundary ID (e.g., 'cln_ind_9a8b7c')
  name: string;
  type: ClinicType;
  primarySpecialty: PrimarySpecialty;
  specialties: string[]; // Allows extensible multi-specialty support
  phone: string;
  email?: string;
  logoUrl?: string;
  
  // Location
  address: ClinicAddress;
  
  // Ownership & RBAC
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  
  // Timestamps & Configuration
  createdAt: string; // ISO String
  updatedAt: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'SUSPENDED';
  settings: ClinicSettings;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  qualification: string; // e.g. MBBS, MD
  registrationNumber: string; // e.g. MMC-2018-99823
  specialty: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Receptionist {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface PrescriptionPresetMedicine {
  name: string;
  type: string;
  dose: string;
  timing: string;
  duration: number;
}

export interface PrescriptionPreset {
  id: string;
  clinicId: string;
  label: string;
  icon: string;
  color: string;
  diagnosis: string;
  symptoms: string[];
  advice: string;
  medicines: PrescriptionPresetMedicine[];
  isDefault: boolean;
}

export interface ClinicMedicine {
  id: string;
  clinicId: string;
  name: string;
  type: string;
  category?: string;
  genericName?: string;
  brandName?: string;
  strength?: string;
}

export interface CreateClinicPayload {
  name: string;
  type: ClinicType;
  primarySpecialty: PrimarySpecialty;
  additionalSpecialties?: string[];
  phone: string;
  email?: string;
  logoUrl?: string;
  address: ClinicAddress;
  ownerProfile: UserProfile;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type QueueStatus = 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED';

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  age: number;
  gender: Gender;
  mobile: string;
  allergies: string[];
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  clinicId: string;
  patientId: string;
  token: number;
  date: string;
  arrivedAt: string;
  status: QueueStatus;
  complaint: string;
}

export interface ConsultationMedicine {
  name: string;
  type: string;
  dose: string;
  timing: string;
  duration: number;
}

export interface Consultation {
  id: string;
  clinicId: string;
  patientId: string;
  queueEntryId?: string;
  createdAt: string;
  vitals: { temp: string; bp: string; pulse: string; spo2: string; weight: string };
  symptoms: string[];
  diagnosis: string;
  investigations?: string;
  recommendedTests?: string[];
  medicines: ConsultationMedicine[];
  advice: string;
  prescriptionLanguage?: string;
  notes: string;
  followUpDate?: string;
}
