'use client';

import {
  Clinic,
  CreateClinicPayload,
  UserProfile,
  Doctor,
  PrescriptionPreset,
  ClinicMedicine,
  Receptionist,
} from '../types/clinic';

// ============================================================================
// Default Seed Presets for New Clinic Tenants
// ============================================================================
const DEFAULT_PRESET_TEMPLATES: Omit<PrescriptionPreset, 'id' | 'clinicId'>[] = [
  {
    label: "Viral Fever",
    icon: "thermostat",
    color: "#E53935",
    diagnosis: "Viral fever",
    symptoms: ["Fever", "Body pain", "Headache", "Fatigue"],
    advice: "Rest for 2-3 days. Drink plenty of warm fluids. Sponge with lukewarm water if temperature exceeds 102°F.",
    isDefault: true,
    medicines: [
      { name: "Paracetamol 650mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Cetirizine 10mg", type: "Tablet", dose: "0-0-1", timing: "After Food", duration: 5 },
      { name: "B-Complex", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 5 },
      { name: "Vitamin C 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
    ],
  },
  {
    label: "Common Cold",
    icon: "ac_unit",
    color: "#1E88E5",
    diagnosis: "Acute upper respiratory infection (Common cold)",
    symptoms: ["Cold", "Cough", "Headache"],
    advice: "Steam inhalation twice daily. Avoid cold drinks and fried food. Gargle with warm salt water.",
    isDefault: true,
    medicines: [
      { name: "Cetirizine 10mg", type: "Tablet", dose: "0-0-1", timing: "After Food", duration: 5 },
      { name: "Paracetamol 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Cough Syrup (Dextromethorphan)", type: "Syrup", dose: "1-1-1", timing: "After Food", duration: 5 },
      { name: "Nasal Drops (Xylometazoline)", type: "Drops", dose: "SOS", timing: "Before Food", duration: 3 },
    ],
  },
  {
    label: "Gastritis / Acidity",
    icon: "local_fire_department",
    color: "#FB8C00",
    diagnosis: "Acute gastritis / Dyspepsia",
    symptoms: ["Vomiting", "Fatigue"],
    advice: "Avoid spicy, oily, and fried food. Eat small frequent meals. No tea/coffee on empty stomach.",
    isDefault: true,
    medicines: [
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 7 },
      { name: "Domperidone 10mg", type: "Tablet", dose: "1-1-1", timing: "Before Food", duration: 5 },
      { name: "Ranitidine 150mg", type: "Tablet", dose: "0-0-1", timing: "Before Food", duration: 5 },
    ],
  },
  {
    label: "UTI",
    icon: "water_drop",
    color: "#8E24AA",
    diagnosis: "Urinary tract infection",
    symptoms: ["Fever"],
    advice: "Drink at least 3-4 liters of water daily. Complete the full course of antibiotics.",
    isDefault: true,
    medicines: [
      { name: "Ciprofloxacin 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
      { name: "Paracetamol 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 5 },
    ],
  },
  {
    label: "Diarrhea",
    icon: "emergency",
    color: "#00897B",
    diagnosis: "Acute diarrhea / Gastroenteritis",
    symptoms: ["Vomiting", "Diarrhea", "Fatigue"],
    advice: "Take ORS after every loose stool. Eat light — khichdi, dal, curd rice.",
    isDefault: true,
    medicines: [
      { name: "ORS Sachet", type: "Tablet", dose: "SOS", timing: "After Food", duration: 3 },
      { name: "Metronidazole 400mg", type: "Tablet", dose: "1-1-1", timing: "After Food", duration: 5 },
      { name: "Ondansetron 4mg", type: "Tablet", dose: "SOS", timing: "Before Food", duration: 3 },
      { name: "Zinc 20mg", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 10 },
    ],
  },
  {
    label: "Body Pain / Sprain",
    icon: "fitness_center",
    color: "#6D4C41",
    diagnosis: "Musculoskeletal pain / Soft tissue injury",
    symptoms: ["Body pain"],
    advice: "Apply ice pack for 15 min, 3 times a day. Avoid heavy lifting for 1 week.",
    isDefault: true,
    medicines: [
      { name: "Aceclofenac 100mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 5 },
      { name: "Diclofenac Gel", type: "Ointment", dose: "SOS", timing: "After Food", duration: 7 },
    ],
  },
];

const DEFAULT_FORMULARY_MEDICINES = [
  { name: "Paracetamol 500mg", type: "Tablet", category: "Analgesic" },
  { name: "Paracetamol 650mg", type: "Tablet", category: "Analgesic" },
  { name: "Ibuprofen 400mg", type: "Tablet", category: "NSAID" },
  { name: "Amoxicillin 500mg", type: "Capsule", category: "Antibiotic" },
  { name: "Azithromycin 500mg", type: "Tablet", category: "Antibiotic" },
  { name: "Cetirizine 10mg", type: "Tablet", category: "Antihistamine" },
  { name: "Pantoprazole 40mg", type: "Tablet", category: "Antacid" },
  { name: "Domperidone 10mg", type: "Tablet", category: "Antiemetic" },
  { name: "ORS Sachet", type: "Tablet", category: "Electrolyte" },
  { name: "B-Complex", type: "Tablet", category: "Vitamin" },
  { name: "Vitamin C 500mg", type: "Tablet", category: "Vitamin" },
];

// ============================================================================
// Default Logged-In User Profile (Simulated Auth Context)
// ============================================================================
export const DEFAULT_CURRENT_USER: UserProfile = {
  id: "usr_auth_789412",
  name: "Dr. Aniket Mehta",
  email: "aniket.mehta@bharatclinic.in",
  phone: "+91 98765 43210",
  role: "CLINIC_OWNER",
  avatarUrl: "",
};

// Initial Demo Clinic
const INITIAL_DEMO_CLINIC: Clinic = {
  id: "cln_demo_001",
  name: "Mehta Family Clinic",
  type: "Clinic",
  primarySpecialty: "General Medicine",
  specialties: ["General Medicine", "Pediatrics"],
  phone: "+91 98765 43210",
  email: "contact@mehtaclinic.in",
  address: {
    addressLine1: "Shop 4, Sunrise Arcade, MG Road",
    addressLine2: "Opp. City Central Hospital",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    country: "India",
  },
  ownerId: DEFAULT_CURRENT_USER.id,
  ownerName: DEFAULT_CURRENT_USER.name,
  ownerEmail: DEFAULT_CURRENT_USER.email,
  ownerPhone: DEFAULT_CURRENT_USER.phone,
  createdAt: "2026-08-01T08:00:00.000Z",
  updatedAt: "2026-08-29T10:00:00.000Z",
  status: "ACTIVE",
  settings: {
    currency: "INR",
    timeZone: "Asia/Kolkata",
    slotDurationMinutes: 15,
    autoPrintPrescription: true,
    smsNotificationsEnabled: true,
    whatsappNotificationsEnabled: true,
  },
};

// ============================================================================
// Storage Keys & Client Utilities
// ============================================================================
const STORAGE_KEYS = {
  CLINICS: "bharat_clinic_tenants_v1",
  ACTIVE_CLINIC_ID: "bharat_clinic_active_tenant_id",
  CURRENT_USER: "bharat_clinic_current_user",
  DOCTORS: "bharat_clinic_doctors",
  PRESETS: "bharat_clinic_presets",
  MEDICINES: "bharat_clinic_medicines",
  RECEPTIONISTS: "bharat_clinic_receptionists",
};

function safeGetJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("clinic-store-change", { detail: { key } }));
  } catch (err) {
    console.error(`Failed to save to localStorage for key: ${key}`, err);
  }
}

// Generate secure simulated unique tenant ID
export function generateClinicId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `cln_ind_${Date.now().toString(36)}_${random}`;
}

export function generateDoctorId(): string {
  return `doc_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Clinic Store API Methods
// ============================================================================

export function getCurrentUser(): UserProfile {
  return safeGetJSON<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEFAULT_CURRENT_USER);
}

export function updateCurrentUser(updated: Partial<UserProfile>): UserProfile {
  const current = getCurrentUser();
  const next = { ...current, ...updated };
  safeSetJSON(STORAGE_KEYS.CURRENT_USER, next);
  return next;
}

export function getAllClinics(): Clinic[] {
  return safeGetJSON<Clinic[]>(STORAGE_KEYS.CLINICS, [INITIAL_DEMO_CLINIC]);
}

export function getActiveClinic(): Clinic {
  const clinics = getAllClinics();
  const activeId = safeGetJSON<string>(STORAGE_KEYS.ACTIVE_CLINIC_ID, INITIAL_DEMO_CLINIC.id);
  const found = clinics.find((c) => c.id === activeId);
  return found || clinics[0] || INITIAL_DEMO_CLINIC;
}

export function setActiveClinic(clinicId: string): Clinic | null {
  const clinics = getAllClinics();
  const target = clinics.find((c) => c.id === clinicId);
  if (target) {
    safeSetJSON(STORAGE_KEYS.ACTIVE_CLINIC_ID, clinicId);
    return target;
  }
  return null;
}

export function updateActiveClinic(updated: Partial<Clinic>): Clinic {
  const active = getActiveClinic();
  const clinics = getAllClinics();
  const next: Clinic = {
    ...active,
    ...updated,
    id: active.id,
    ownerId: active.ownerId,
    address: updated.address ? { ...active.address, ...updated.address } : active.address,
    settings: updated.settings ? { ...active.settings, ...updated.settings } : active.settings,
    updatedAt: new Date().toISOString(),
  };
  safeSetJSON(STORAGE_KEYS.CLINICS, clinics.map((clinic) => clinic.id === active.id ? next : clinic));
  return next;
}

export function createClinicTenant(payload: CreateClinicPayload): {
  clinic: Clinic;
  doctors: Doctor[];
  presets: PrescriptionPreset[];
} {
  const newClinicId = generateClinicId();
  const now = new Date().toISOString();

  // 1. Construct Clinic Tenant Object
  const newClinic: Clinic = {
    id: newClinicId,
    name: payload.name.trim(),
    type: payload.type,
    primarySpecialty: payload.primarySpecialty,
    specialties: [
      payload.primarySpecialty,
      ...(payload.additionalSpecialties || []).filter((s) => s !== payload.primarySpecialty),
    ],
    phone: payload.phone.trim(),
    email: payload.email?.trim() || undefined,
    logoUrl: payload.logoUrl,
    address: {
      addressLine1: payload.address.addressLine1.trim(),
      addressLine2: payload.address.addressLine2?.trim() || undefined,
      city: payload.address.city.trim(),
      state: payload.address.state,
      pincode: payload.address.pincode.trim(),
      country: payload.address.country || "India",
    },
    ownerId: payload.ownerProfile.id,
    ownerName: payload.ownerProfile.name,
    ownerEmail: payload.ownerProfile.email,
    ownerPhone: payload.ownerProfile.phone,
    createdAt: now,
    updatedAt: now,
    status: "ACTIVE",
    settings: {
      currency: "INR",
      timeZone: "Asia/Kolkata",
      slotDurationMinutes: 15,
      autoPrintPrescription: true,
      smsNotificationsEnabled: true,
      whatsappNotificationsEnabled: true,
    },
  };

  // 2. Persist Clinic
  const existingClinics = getAllClinics();
  const updatedClinics = [newClinic, ...existingClinics.filter((c) => c.id !== newClinicId)];
  safeSetJSON(STORAGE_KEYS.CLINICS, updatedClinics);
  safeSetJSON(STORAGE_KEYS.ACTIVE_CLINIC_ID, newClinicId);

  // 3. Update Current User details if modified during onboarding
  updateCurrentUser({
    name: payload.ownerProfile.name,
    email: payload.ownerProfile.email,
    phone: payload.ownerProfile.phone,
    role: "CLINIC_OWNER",
  });

  // 4. Seed Default Doctor (The Owner)
  const initialDoctor: Doctor = {
    id: generateDoctorId(),
    clinicId: newClinicId,
    name: payload.ownerProfile.name.startsWith("Dr.") ? payload.ownerProfile.name : `Dr. ${payload.ownerProfile.name}`,
    qualification: "MBBS, MD",
    registrationNumber: "REG-" + Math.floor(100000 + Math.random() * 900000),
    specialty: payload.primarySpecialty,
    email: payload.ownerProfile.email,
    phone: payload.ownerProfile.phone,
    isActive: true,
    createdAt: now,
  };

  const existingDoctors = safeGetJSON<Doctor[]>(STORAGE_KEYS.DOCTORS, []);
  safeSetJSON(STORAGE_KEYS.DOCTORS, [initialDoctor, ...existingDoctors]);

  // 5. Seed Default Prescription Presets for this new tenant
  const tenantPresets: PrescriptionPreset[] = DEFAULT_PRESET_TEMPLATES.map((tmpl, idx) => ({
    id: `pst_${newClinicId}_${idx + 1}`,
    clinicId: newClinicId,
    ...tmpl,
  }));

  const existingPresets = safeGetJSON<PrescriptionPreset[]>(STORAGE_KEYS.PRESETS, []);
  safeSetJSON(STORAGE_KEYS.PRESETS, [...tenantPresets, ...existingPresets]);

  // 6. Seed Default Medicine Formulary for this new tenant
  const tenantMedicines: ClinicMedicine[] = DEFAULT_FORMULARY_MEDICINES.map((med, idx) => ({
    id: `med_${newClinicId}_${idx + 1}`,
    clinicId: newClinicId,
    ...med,
  }));

  const existingMedicines = safeGetJSON<ClinicMedicine[]>(STORAGE_KEYS.MEDICINES, []);
  safeSetJSON(STORAGE_KEYS.MEDICINES, [...tenantMedicines, ...existingMedicines]);

  return {
    clinic: newClinic,
    doctors: [initialDoctor],
    presets: tenantPresets,
  };
}

export function getClinicDoctors(clinicId: string): Doctor[] {
  const doctors = safeGetJSON<Doctor[]>(STORAGE_KEYS.DOCTORS, []);
  return doctors.filter((d) => d.clinicId === clinicId);
}

export function addDoctorToClinic(
  clinicId: string,
  doctorData: Omit<Doctor, "id" | "clinicId" | "createdAt" | "isActive">
): Doctor {
  const newDoctor: Doctor = {
    id: generateDoctorId(),
    clinicId,
    ...doctorData,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const existingDoctors = safeGetJSON<Doctor[]>(STORAGE_KEYS.DOCTORS, []);
  safeSetJSON(STORAGE_KEYS.DOCTORS, [newDoctor, ...existingDoctors]);
  return newDoctor;
}

export function updateDoctorInClinic(id: string, updated: Partial<Doctor>): Doctor | null {
  const doctors = safeGetJSON<Doctor[]>(STORAGE_KEYS.DOCTORS, []);
  const index = doctors.findIndex((doctor) => doctor.id === id);
  if (index < 0) return null;
  doctors[index] = { ...doctors[index], ...updated, id: doctors[index].id, clinicId: doctors[index].clinicId };
  safeSetJSON(STORAGE_KEYS.DOCTORS, doctors);
  return doctors[index];
}

export function deleteDoctorFromClinic(id: string): void {
  safeSetJSON(STORAGE_KEYS.DOCTORS, safeGetJSON<Doctor[]>(STORAGE_KEYS.DOCTORS, []).filter((doctor) => doctor.id !== id));
}

export function getClinicReceptionists(clinicId: string): Receptionist[] {
  return safeGetJSON<Receptionist[]>(STORAGE_KEYS.RECEPTIONISTS, []).filter((item) => item.clinicId === clinicId);
}

export function addReceptionistToClinic(clinicId: string, data: Pick<Receptionist, 'name' | 'email' | 'phone'>): Receptionist {
  const item: Receptionist = { ...data, id: `rec_${Date.now()}`, clinicId, isActive: true, createdAt: new Date().toISOString() };
  safeSetJSON(STORAGE_KEYS.RECEPTIONISTS, [item, ...safeGetJSON<Receptionist[]>(STORAGE_KEYS.RECEPTIONISTS, [])]);
  return item;
}

export function updateReceptionistInClinic(id: string, updated: Partial<Receptionist>): Receptionist | null {
  const items = safeGetJSON<Receptionist[]>(STORAGE_KEYS.RECEPTIONISTS, []);
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], ...updated, id: items[index].id, clinicId: items[index].clinicId };
  safeSetJSON(STORAGE_KEYS.RECEPTIONISTS, items);
  return items[index];
}

export function deleteReceptionistFromClinic(id: string): void {
  safeSetJSON(STORAGE_KEYS.RECEPTIONISTS, safeGetJSON<Receptionist[]>(STORAGE_KEYS.RECEPTIONISTS, []).filter((item) => item.id !== id));
}

export function getClinicPresets(clinicId: string): PrescriptionPreset[] {
  const presets = safeGetJSON<PrescriptionPreset[]>(STORAGE_KEYS.PRESETS, []);
  const scoped = presets.filter((p) => p.clinicId === clinicId);
  if (scoped.length > 0) return scoped;

  // Fallback to default presets mapped to clinicId
  const defaults = DEFAULT_PRESET_TEMPLATES.map((tmpl, idx) => ({
    id: `pst_${clinicId}_${idx + 1}`,
    clinicId,
    ...tmpl,
  }));
  safeSetJSON(STORAGE_KEYS.PRESETS, [...defaults, ...presets]);
  return defaults;
}

export function addPresetToClinic(clinicId: string, data: Omit<PrescriptionPreset, 'id' | 'clinicId' | 'isDefault'>): PrescriptionPreset {
  const preset: PrescriptionPreset = { ...data, id: `pst_${clinicId}_${Date.now()}`, clinicId, isDefault: false };
  safeSetJSON(STORAGE_KEYS.PRESETS, [preset, ...safeGetJSON<PrescriptionPreset[]>(STORAGE_KEYS.PRESETS, [])]);
  return preset;
}

export function updatePresetInClinic(id: string, updated: Partial<PrescriptionPreset>): PrescriptionPreset | null {
  const items = safeGetJSON<PrescriptionPreset[]>(STORAGE_KEYS.PRESETS, []);
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], ...updated, id: items[index].id, clinicId: items[index].clinicId };
  safeSetJSON(STORAGE_KEYS.PRESETS, items);
  return items[index];
}

export function deletePresetFromClinic(id: string): void {
  safeSetJSON(STORAGE_KEYS.PRESETS, safeGetJSON<PrescriptionPreset[]>(STORAGE_KEYS.PRESETS, []).filter((item) => item.id !== id));
}

export function getClinicMedicines(clinicId: string): ClinicMedicine[] {
  const meds = safeGetJSON<ClinicMedicine[]>(STORAGE_KEYS.MEDICINES, []);
  const scoped = meds.filter((m) => m.clinicId === clinicId);
  if (scoped.length > 0) return scoped;
  const defaults = DEFAULT_FORMULARY_MEDICINES.map((m, i) => ({
    id: `med_${clinicId}_${i + 1}`,
    clinicId,
    ...m,
  }));
  safeSetJSON(STORAGE_KEYS.MEDICINES, [...defaults, ...meds]);
  return defaults;
}

export function addMedicineToClinic(clinicId: string, name: string, type: string, category?: string, details?: Pick<ClinicMedicine, 'genericName' | 'brandName' | 'strength'>): ClinicMedicine {
  const newMed: ClinicMedicine = {
    id: `med_${clinicId}_${Date.now()}`,
    clinicId,
    name: name.trim(),
    type,
    category: category || "General",
    ...details,
  };
  const existing = safeGetJSON<ClinicMedicine[]>(STORAGE_KEYS.MEDICINES, []);
  safeSetJSON(STORAGE_KEYS.MEDICINES, [newMed, ...existing]);
  return newMed;
}

export function updateMedicineInClinic(id: string, updated: Partial<ClinicMedicine>): ClinicMedicine | null {
  const items = safeGetJSON<ClinicMedicine[]>(STORAGE_KEYS.MEDICINES, []);
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], ...updated, id: items[index].id, clinicId: items[index].clinicId };
  safeSetJSON(STORAGE_KEYS.MEDICINES, items);
  return items[index];
}

export function deleteMedicineFromClinic(id: string): void {
  safeSetJSON(STORAGE_KEYS.MEDICINES, safeGetJSON<ClinicMedicine[]>(STORAGE_KEYS.MEDICINES, []).filter((item) => item.id !== id));
}
