'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ClinicType,
  PrimarySpecialty,
  INDIAN_STATES_AND_UTS,
  UserProfile,
  Clinic,
  PrescriptionPreset,
  PrescriptionPresetMedicine,
  Doctor,
  ClinicMedicine,
  Receptionist,
} from "../../lib/types/clinic";
import {
  getCurrentUser,
  updateCurrentUser,
  createClinicTenant,
  getClinicDoctors,
  getClinicPresets,
  getClinicMedicines,
  addDoctorToClinic,
  addMedicineToClinic,
  getClinicReceptionists,
  addReceptionistToClinic,
  updateDoctorInClinic,
  deleteDoctorFromClinic,
  updateReceptionistInClinic,
  deleteReceptionistFromClinic,
  addPresetToClinic,
  updatePresetInClinic,
  deletePresetFromClinic,
  updateMedicineInClinic,
  deleteMedicineFromClinic,
} from "../../lib/store/clinicStore";

const CLINIC_TYPES: ClinicType[] = [
  "Clinic",
  "Hospital",
  "Diagnostic Center",
  "Dental Clinic",
  "Other",
];

const PRIMARY_SPECIALTIES: PrimarySpecialty[] = [
  "General Medicine",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "Orthopedics",
  "ENT",
  "Dental",
  "Physiotherapy",
  "Other",
];

export default function ClinicOnboardingPage() {
  // 1 = Owner, 2 = Clinic, 3 = Location, 4 = Created
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated Owner Context
  const [owner, setOwner] = useState<UserProfile>({
    id: "usr_auth_789412",
    name: "Dr. Aniket Mehta",
    email: "aniket.mehta@bharatclinic.in",
    phone: "9876543210",
    role: "CLINIC_OWNER",
  });
  // Clinic Form State
  const [clinicName, setClinicName] = useState("");
  const [clinicType, setClinicType] = useState<ClinicType>("Clinic");
  const [primarySpecialty, setPrimarySpecialty] = useState<PrimarySpecialty>("General Medicine");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Location Form State
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string>("Maharashtra");
  const [pincode, setPincode] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Created Clinic Result
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);
  const [clinicDoctors, setClinicDoctors] = useState<Doctor[]>([]);
  const [clinicPresets, setClinicPresets] = useState<PrescriptionPreset[]>([]);
  const [clinicMedicines, setClinicMedicines] = useState<ClinicMedicine[]>([]);
  const [clinicReceptionists, setClinicReceptionists] = useState<Receptionist[]>([]);

  // Optional Setup Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorQualification, setNewDoctorQualification] = useState("MBBS");
  const [newDoctorRegNo, setNewDoctorRegNo] = useState("");
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState("General Medicine");
  const [teamRole, setTeamRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");

  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showMedicinesModal, setShowMedicinesModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedType, setNewMedType] = useState("Tablet");
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");
  const [presetDiagnosis, setPresetDiagnosis] = useState("");
  const [presetSymptoms, setPresetSymptoms] = useState("");
  const [presetMedicine, setPresetMedicine] = useState("");
  const [presetMedicineType, setPresetMedicineType] = useState("Tablet");
  const [presetDose, setPresetDose] = useState("1-0-1");
  const [presetTiming, setPresetTiming] = useState("After Food");
  const [presetDuration, setPresetDuration] = useState(3);
  const [presetMedicines, setPresetMedicines] = useState<PrescriptionPresetMedicine[]>([]);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [showMedicineSuggestions, setShowMedicineSuggestions] = useState(false);
  const [presetSaveMessage, setPresetSaveMessage] = useState("");

  // Load current user from store on mount
  // Hydrate the simulated authenticated user after localStorage is available.
  useEffect(() => {
    const u = getCurrentUser();
    // Strip +91 for clean 10-digit input
    const cleanPhone = u.phone.replace("+91", "").replace(/\s+/g, "").trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOwner({ ...u, phone: cleanPhone });
    setPhone(cleanPhone);
  }, []);

  // Sync doctors & presets when clinic is created
  // Refresh optional tenant resources when the created tenant changes.
  useEffect(() => {
    if (createdClinic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClinicDoctors(getClinicDoctors(createdClinic.id));
      setClinicPresets(getClinicPresets(createdClinic.id));
      setClinicMedicines(getClinicMedicines(createdClinic.id));
      setClinicReceptionists(getClinicReceptionists(createdClinic.id));
    }
  }, [createdClinic]);

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "Logo must be smaller than 2MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.logo;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateOwner = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cleanPhone = owner.phone.replace(/[\s\-\+]/g, "");
    if (owner.name.trim().length < 2) newErrors.ownerName = "Enter the owner’s full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email.trim())) newErrors.ownerEmail = "Enter a valid email address";
    if (!/^(91)?[6789]\d{9}$/.test(cleanPhone)) newErrors.ownerPhone = "Enter a valid 10-digit Indian mobile number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOwnerContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOwner()) return;
    const cleanPhone = owner.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
    const nextOwner = { ...owner, name: owner.name.trim(), email: owner.email.trim(), phone: cleanPhone };
    setOwner(nextOwner);
    updateCurrentUser({ ...nextOwner, phone: `+91 ${cleanPhone}` });
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateClinic = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clinicName.trim()) {
      newErrors.clinicName = "Clinic name is required";
    } else if (clinicName.trim().length < 2) {
      newErrors.clinicName = "Clinic name must be at least 2 characters";
    } else if (clinicName.trim().length > 150) {
      newErrors.clinicName = "Clinic name cannot exceed 150 characters";
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(91)?[6789]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile or landline number";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLocation = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!state.trim()) {
      newErrors.state = "State is required";
    }

    const cleanPin = pincode.replace(/\s+/g, "");
    if (!cleanPin) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(cleanPin)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateClinic()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLocation()) return;

    setIsSubmitting(true);
    // Simulate realistic tenant creation latency
    await new Promise((res) => setTimeout(res, 800));

    const formattedPhone = phone.startsWith("+91") ? phone : `+91 ${phone.replace(/[\s\-\+]/g, "")}`;
    const formattedOwnerPhone = owner.phone.startsWith("+91") ? owner.phone : `+91 ${owner.phone.replace(/[\s\-\+]/g, "")}`;

    const { clinic, doctors, presets } = createClinicTenant({
      name: clinicName,
      type: clinicType,
      primarySpecialty,
      phone: formattedPhone,
      email: email.trim() || undefined,
      logoUrl: logoPreview || undefined,
      address: {
        addressLine1,
        addressLine2: addressLine2.trim() || undefined,
        city,
        state,
        pincode,
        country: "India",
      },
      ownerProfile: {
        ...owner,
        phone: formattedOwnerPhone,
      },
    });

    setCreatedClinic(clinic);
    setClinicDoctors(doctors);
    setClinicPresets(presets);
    setIsSubmitting(false);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdClinic || !newDoctorName.trim()) return;

    if (teamRole === 'RECEPTIONIST') {
      if (editingTeamId) {
        updateReceptionistInClinic(editingTeamId, { name: newDoctorName.trim(), email: staffEmail.trim(), phone: staffPhone.trim() });
      } else {
        addReceptionistToClinic(createdClinic.id, { name: newDoctorName.trim(), email: staffEmail.trim(), phone: staffPhone.trim() });
      }
      setClinicReceptionists(getClinicReceptionists(createdClinic.id));
      setEditingTeamId(null);
      setNewDoctorName(""); setStaffEmail(""); setStaffPhone("");
      return;
    }

    if (editingTeamId) {
      updateDoctorInClinic(editingTeamId, { name: newDoctorName.startsWith("Dr.") ? newDoctorName : `Dr. ${newDoctorName}`, qualification: newDoctorQualification, registrationNumber: newDoctorRegNo, specialty: newDoctorSpecialty, email: staffEmail, phone: staffPhone });
      setClinicDoctors(getClinicDoctors(createdClinic.id));
      setEditingTeamId(null);
      setNewDoctorName(""); setStaffEmail(""); setStaffPhone("");
      return;
    }

    const doc = addDoctorToClinic(createdClinic.id, {
      name: newDoctorName.startsWith("Dr.") ? newDoctorName : `Dr. ${newDoctorName}`,
      qualification: newDoctorQualification.trim() || "MBBS",
      registrationNumber: newDoctorRegNo.trim() || "REG-" + Math.floor(100000 + Math.random() * 900000),
      specialty: newDoctorSpecialty,
      email: staffEmail.trim() || `${newDoctorName.toLowerCase().replace(/[^a-z0-9]/g, "")}@clinic.demo`,
      phone: staffPhone.trim() || "+91 90000 00000",
    });

    setClinicDoctors((prev) => [doc, ...prev]);
    setNewDoctorName("");
    setNewDoctorRegNo("");
    setShowAddDoctorModal(false);
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdClinic || !newMedName.trim()) return;

    if (editingMedicineId) updateMedicineInClinic(editingMedicineId, { name: newMedName.trim(), type: newMedType });
    else addMedicineToClinic(createdClinic.id, newMedName, newMedType);
    setClinicMedicines(getClinicMedicines(createdClinic.id));
    setNewMedName("");
    setEditingMedicineId(null);
  };

  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdClinic || !presetName.trim() || presetMedicines.length === 0) return;
    const data = { label: presetName.trim(), diagnosis: presetDiagnosis.trim() || presetName.trim(), icon: 'prescriptions', color: '#0B57D0', symptoms: presetSymptoms.split(',').map((item) => item.trim()).filter(Boolean), advice: '', medicines: presetMedicines };
    if (editingPresetId) updatePresetInClinic(editingPresetId, data);
    else addPresetToClinic(createdClinic.id, data);
    setClinicPresets(getClinicPresets(createdClinic.id));
    setPresetSaveMessage(editingPresetId ? "Preset updated and available in Quick Templates." : "Preset saved and available in Quick Templates.");
    setPresetName(""); setPresetDiagnosis(""); setPresetSymptoms(""); setPresetMedicine(""); setPresetMedicines([]); setEditingPresetId(null); setShowMedicineSuggestions(false);
  };

  const addMedicineToPreset = () => {
    if (!presetMedicine.trim()) return;
    setPresetMedicines((items) => [...items, { name: presetMedicine.trim(), type: presetMedicineType, dose: presetDose, timing: presetTiming, duration: presetDuration }]);
    setPresetMedicine(""); setPresetMedicineType("Tablet"); setPresetDose("1-0-1"); setPresetTiming("After Food"); setPresetDuration(3); setShowMedicineSuggestions(false);
  };

  const medicineSuggestions = !showMedicineSuggestions || presetMedicine.trim().length < 2 ? [] : clinicMedicines.filter((item) => item.name.toLowerCase().includes(presetMedicine.toLowerCase())).slice(0, 6);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased font-sans">
      {/* Top Header */}
      <header className="bg-surface border-b border-outline-variant py-sm px-md md:px-lg sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-sm hover:opacity-90">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
            </div>
            <div>
              <span className="font-headline-md font-bold text-primary text-base md:text-lg tracking-tight">Bharat Clinic</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-semibold">SaaS Tenant Onboarding</span>
            </div>
          </Link>
          <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-sm py-1.5 rounded-full border border-outline-variant">Workspace setup</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-md md:p-lg flex flex-col gap-lg py-8">
        
        {/* Multi-step Progress Bar */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <div className="grid grid-cols-4 gap-sm">
            {[
              ["Your Details", "Account contact"],
              ["Clinic Details", "Name & specialty"],
              ["Location", "Address & pincode"],
              ["Launch", "Ready to use"],
            ].map(([label, caption], index) => {
              const step = index + 1;
              const complete = currentStep > step;
              const active = currentStep === step;
              return <div key={label} className={`rounded-lg px-sm py-2 flex items-center gap-sm ${active ? "bg-primary-container" : ""}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${complete || active ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"}`}>
                  {complete ? <span className="material-symbols-outlined text-[18px]">check</span> : step}
                </div>
                <div><p className="text-xs font-bold text-on-surface">{label}</p><p className="text-[10px] text-on-surface-variant">{caption}</p></div>
              </div>;
            })}
          </div>
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleOwnerContinue} className="space-y-lg animate-[slideUp_0.25s_ease-out]">
            <div className="space-y-xs">
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">Tell us about you</h2>
              <p className="text-sm md:text-base text-on-surface-variant">We’ll use these details for your account and important workspace communication.</p>
            </div>
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg space-y-md shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="sm:col-span-2 space-y-xs"><label className="block text-sm font-bold" htmlFor="ownerName">Full Name <span className="text-error">*</span></label><input id="ownerName" autoFocus value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm focus:ring-1 focus:ring-primary focus:outline-none ${errors.ownerName ? "border-error" : "border-outline-variant"}`} placeholder="e.g. Dr. Aniket Mehta" />{errors.ownerName && <p className="text-xs text-error">{errors.ownerName}</p>}</div>
                <div className="space-y-xs"><label className="block text-sm font-bold" htmlFor="ownerEmail">Email Address <span className="text-error">*</span></label><input id="ownerEmail" type="email" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm focus:ring-1 focus:ring-primary focus:outline-none ${errors.ownerEmail ? "border-error" : "border-outline-variant"}`} placeholder="name@example.com" />{errors.ownerEmail && <p className="text-xs text-error">{errors.ownerEmail}</p>}</div>
                <div className="space-y-xs"><label className="block text-sm font-bold" htmlFor="ownerPhone">Mobile Number <span className="text-error">*</span></label><div className="flex"><span className="h-touch-target px-3 bg-surface-container border border-r-0 border-outline-variant rounded-l-lg flex items-center text-sm">+91</span><input id="ownerPhone" type="tel" inputMode="numeric" maxLength={10} value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={`w-full h-touch-target bg-transparent border rounded-r-lg px-md text-sm focus:ring-1 focus:ring-primary focus:outline-none ${errors.ownerPhone ? "border-error" : "border-outline-variant"}`} placeholder="9876543210" /></div>{errors.ownerPhone && <p className="text-xs text-error">{errors.ownerPhone}</p>}</div>
              </div>
              <p className="text-xs text-on-surface-variant border-t border-outline-variant pt-sm">Your access permissions are configured automatically and are not shown in the customer-facing workspace.</p>
            </section>
            <div className="flex justify-end"><button type="submit" className="px-xl h-touch-target bg-primary text-white font-bold text-sm rounded-xl flex items-center gap-sm shadow-md">Continue to Clinic Details <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button></div>
          </form>
        )}

        {/* STEP 2: BASIC CLINIC INFORMATION */}
        {currentStep === 2 && (
          <form onSubmit={handleNextToLocation} className="space-y-lg animate-[slideUp_0.25s_ease-out]">
            {/* Header Titles */}
            <div className="space-y-xs">
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
                Set up your clinic
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant">
                Create your clinic workspace to manage patients, doctors, appointments and consultations.
              </p>
            </div>

            {/* Clinic Details Form Card */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg space-y-md shadow-xs">
              
              {/* Clinic Name */}
              <div className="space-y-xs">
                <label className="block text-sm font-bold text-on-surface" htmlFor="clinicName">
                  Clinic Name <span className="text-error">*</span>
                </label>
                <input
                  id="clinicName"
                  type="text"
                  placeholder="e.g. Sharma Multispeciality Clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                    errors.clinicName ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                  }`}
                />
                {errors.clinicName ? (
                  <p className="text-xs text-error font-medium">{errors.clinicName}</p>
                ) : (
                  <p className="text-xs text-on-surface-variant">Min 2, max 150 characters. This name appears on all prescriptions and receipts.</p>
                )}
              </div>

              {/* Type & Specialty Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                
                {/* Clinic Type */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="clinicType">
                    Clinic Type <span className="text-error">*</span>
                  </label>
                  <select
                    id="clinicType"
                    value={clinicType}
                    onChange={(e) => setClinicType(e.target.value as ClinicType)}
                    className="w-full h-touch-target bg-transparent border border-outline-variant rounded-lg px-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  >
                    {CLINIC_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Specialty */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="primarySpecialty">
                    Primary Specialty <span className="text-error">*</span>
                  </label>
                  <select
                    id="primarySpecialty"
                    value={primarySpecialty}
                    onChange={(e) => setPrimarySpecialty(e.target.value as PrimarySpecialty)}
                    className="w-full h-touch-target bg-transparent border border-outline-variant rounded-lg px-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  >
                    {PRIMARY_SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-on-surface-variant">You can add multiple department specialties later.</p>
                </div>
              </div>

              {/* Contact Info Grid: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                
                {/* Clinic Phone */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="phone">
                    Clinic Phone Number <span className="text-error">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="h-touch-target px-3 bg-surface-container border border-r-0 border-outline-variant rounded-l-lg text-sm text-on-surface-variant font-semibold flex items-center">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full h-touch-target bg-transparent border rounded-r-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                        errors.phone ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-error font-medium">{errors.phone}</p>}
                </div>

                {/* Clinic Email */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="email">
                    Clinic Email <span className="text-xs font-normal text-on-surface-variant">(Optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="contact@sharmaclinic.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                      errors.email ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-error font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Clinic Logo (Optional) */}
              <div className="space-y-xs pt-sm border-t border-outline-variant">
                <label className="block text-sm font-bold text-on-surface">
                  Clinic Logo <span className="text-xs font-normal text-on-surface-variant">(Optional)</span>
                </label>
                <div className="flex items-center gap-md">
                  {logoPreview ? (
                    <div className="relative w-16 h-16 rounded-xl border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center group shadow-xs">
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Logo"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logoUpload"
                    />
                    <label
                      htmlFor="logoUpload"
                      className="inline-flex items-center gap-1.5 px-sm py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-lg text-xs font-semibold text-primary cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="ml-2 text-xs text-error hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-[11px] text-on-surface-variant">PNG, JPG, WebP up to 2MB. Displayed on prescription headers.</p>
                    {errors.logo && <p className="text-xs text-error font-medium">{errors.logo}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex justify-between pt-sm">
              <button type="button" onClick={() => setCurrentStep(1)} className="px-lg h-touch-target border border-outline-variant text-on-surface font-semibold text-sm rounded-xl">Back</button>
              <button
                type="submit"
                className="w-full sm:w-auto px-xl h-touch-target bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-md"
              >
                <span>Continue to Location</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CLINIC LOCATION                                                   */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <form onSubmit={handleCreateClinic} className="space-y-lg animate-[slideUp_0.25s_ease-out]">
            {/* Header Titles */}
            <div className="space-y-xs">
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
                Where is your clinic located?
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant">
                This address will be featured on your printed and digital prescriptions, invoices, and official clinic records.
              </p>
            </div>

            {/* Location Form Card */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg space-y-md shadow-xs">
              
              {/* Address Line 1 */}
              <div className="space-y-xs">
                <label className="block text-sm font-bold text-on-surface" htmlFor="addr1">
                  Address Line 1 <span className="text-error">*</span>
                </label>
                <input
                  id="addr1"
                  type="text"
                  placeholder="e.g. Shop 12, Ground Floor, Galaxy Arcade, Station Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                    errors.addressLine1 ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                  }`}
                />
                {errors.addressLine1 && <p className="text-xs text-error font-medium">{errors.addressLine1}</p>}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-xs">
                <label className="block text-sm font-bold text-on-surface" htmlFor="addr2">
                  Address Line 2 <span className="text-xs font-normal text-on-surface-variant">(Optional)</span>
                </label>
                <input
                  id="addr2"
                  type="text"
                  placeholder="e.g. Near City Bus Stand, Landmark"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full h-touch-target bg-transparent border border-outline-variant rounded-lg px-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                
                {/* City */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="city">
                    City / Town <span className="text-error">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. Pune, Mumbai, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                      errors.city ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                    }`}
                  />
                  {errors.city && <p className="text-xs text-error font-medium">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="state">
                    State / UT <span className="text-error">*</span>
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-touch-target bg-transparent border border-outline-variant rounded-lg px-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pincode & Country Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                
                {/* Pincode */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface" htmlFor="pincode">
                    Pincode <span className="text-error">*</span>
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="e.g. 411001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={`w-full h-touch-target bg-transparent border rounded-lg px-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all ${
                      errors.pincode ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                    }`}
                  />
                  {errors.pincode ? (
                    <p className="text-xs text-error font-medium">{errors.pincode}</p>
                  ) : (
                    <p className="text-[11px] text-on-surface-variant">6 digits postal code</p>
                  )}
                </div>

                {/* Country (Default India) */}
                <div className="space-y-xs">
                  <label className="block text-sm font-bold text-on-surface">Country</label>
                  <div className="h-touch-target bg-surface-container-low border border-outline-variant rounded-lg px-md flex items-center justify-between text-sm text-on-surface font-semibold">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🇮🇳</span> India
                    </span>
                    <span className="text-xs text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-outline-variant">Default</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-sm">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-lg h-touch-target bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-semibold text-sm rounded-xl transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-xl h-touch-target bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Clinic Tenant...</span>
                  </>
                ) : (
                  <>
                    <span>Create Clinic</span>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CLINIC CREATED & OPTIONAL SETUP                                   */}
        {/* ========================================================================= */}
        {currentStep === 4 && createdClinic && (
          <div className="space-y-lg animate-[slideUp_0.25s_ease-out]">
            
            {/* Success Hero Banner */}
            <section className="bg-tertiary-container/20 border-2 border-tertiary/40 rounded-2xl p-md md:p-lg text-center space-y-sm shadow-sm relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-tertiary text-white tracking-wide">
                Setup complete
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">
                {createdClinic.name} is ready
              </h2>
              <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">
                Start with the receptionist desk, open the doctor dashboard, or configure your clinic settings at any time.
              </p>
              
              {/* Primary Direct Dashboard CTA */}
              <div className="pt-md flex flex-wrap items-center justify-center gap-md">
                <Link
                  href="/doctor"
                  className="px-xl h-touch-target bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                  <span>Go to Doctor OPD Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <Link
                  href="/receptionist"
                  className="px-lg h-touch-target bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">support_agent</span>
                  <span>Open Receptionist Desk</span>
                </Link>
                <Link
                  href="/settings"
                  className="px-lg h-touch-target bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">settings</span>
                  <span>Configure Clinic</span>
                </Link>
              </div>
            </section>

            {/* Clinic Details Summary Card */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg space-y-md shadow-xs">
              <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">domain</span>
                  Clinic Overview
                </h3>
                <span className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-1 rounded-full font-bold">
                  {createdClinic.type}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md text-xs">
                <div>
                  <p className="text-on-surface-variant font-medium">Primary Specialty</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{createdClinic.primarySpecialty}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium">Phone</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{createdClinic.phone}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium">Location</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{createdClinic.address.city}, {createdClinic.address.state}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium">Workspace Status</p>
                  <p className="text-sm font-bold text-tertiary mt-0.5">Active</p>
                </div>
              </div>
            </section>

            {/* Optional Setup Steps (Non-blocking) */}
            <section className="hidden" aria-hidden="true">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Finish your setup</h3>
                  <p className="text-xs text-on-surface-variant">Add staff and create prescription shortcuts now, or return later.</p>
                </div>
                <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium">Non-blocking</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                
                {/* 1. Team Card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all">
                  <div className="space-y-xs">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">person_add</span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface">Clinic Team</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {clinicDoctors.length} doctor{clinicDoctors.length !== 1 ? "s" : ""} and {clinicReceptionists.length} receptionist{clinicReceptionists.length !== 1 ? "s" : ""}.
                    </p>
                  </div>
                  <div className="pt-md">
                    <button
                      type="button"
                      onClick={() => setShowAddDoctorModal(true)}
                      className="w-full h-[38px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Manage Team</span>
                    </button>
                  </div>
                </div>

                {/* 2. Configure Presets Card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all">
                  <div className="space-y-xs">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">bolt</span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface">Prescription Presets</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {clinicPresets.length} reusable templates. Create your own shortcut with clinic medicines.
                    </p>
                  </div>
                  <div className="pt-md">
                    <button
                      type="button"
                      onClick={() => setShowPresetsModal(true)}
                      className="w-full h-[38px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-tertiary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>Manage Presets ({clinicPresets.length})</span>
                    </button>
                  </div>
                </div>

                {/* 3. Configure Medicines Card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all">
                  <div className="space-y-xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">medication</span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface">Formulary Medicines</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {clinicMedicines.length} standard clinic medicines seeded in auto-suggest catalog.
                    </p>
                  </div>
                  <div className="pt-md">
                    <button
                      type="button"
                      onClick={() => setShowMedicinesModal(true)}
                      className="w-full h-[38px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">list</span>
                      <span>View Medicines</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD DOCTOR                                                         */}
      {/* ========================================================================= */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-[28rem] w-full p-lg shadow-xl space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                Manage Clinic Team
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* List of currently registered doctors */}
            <div className="space-y-xs max-h-36 overflow-y-auto pr-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current team</p>
              {clinicDoctors.map((doc) => (
                <div key={doc.id} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-on-surface">{doc.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{doc.qualification} • {doc.specialty}</p>
                  </div>
                  <div className="flex gap-1"><button type="button" aria-label={`Edit ${doc.name}`} onClick={() => { setTeamRole('DOCTOR'); setEditingTeamId(doc.id); setNewDoctorName(doc.name); setNewDoctorQualification(doc.qualification); setNewDoctorRegNo(doc.registrationNumber); setNewDoctorSpecialty(doc.specialty); setStaffEmail(doc.email); setStaffPhone(doc.phone); }} className="p-1 text-primary"><span className="material-symbols-outlined text-[16px]">edit</span></button><button type="button" aria-label={`Delete ${doc.name}`} onClick={() => { deleteDoctorFromClinic(doc.id); if (createdClinic) setClinicDoctors(getClinicDoctors(createdClinic.id)); }} className="p-1 text-error"><span className="material-symbols-outlined text-[16px]">delete</span></button></div>
                </div>
              ))}
              {clinicReceptionists.map((person) => <div key={person.id} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between text-xs"><div><p className="font-bold">{person.name}</p><p className="text-[11px] text-on-surface-variant">Receptionist • {person.phone}</p></div><div className="flex gap-1"><button type="button" aria-label={`Edit ${person.name}`} onClick={() => { setTeamRole('RECEPTIONIST'); setEditingTeamId(person.id); setNewDoctorName(person.name); setStaffEmail(person.email); setStaffPhone(person.phone); }} className="p-1 text-primary"><span className="material-symbols-outlined text-[16px]">edit</span></button><button type="button" aria-label={`Delete ${person.name}`} onClick={() => { deleteReceptionistFromClinic(person.id); if (createdClinic) setClinicReceptionists(getClinicReceptionists(createdClinic.id)); }} className="p-1 text-error"><span className="material-symbols-outlined text-[16px]">delete</span></button></div></div>)}
            </div>

            {/* Form to add new doctor */}
            <form onSubmit={handleAddDoctorSubmit} className="space-y-sm pt-sm border-t border-outline-variant">
              <div className="grid grid-cols-2 gap-xs bg-surface-container-low p-1 rounded-lg"><button type="button" onClick={() => { setTeamRole('DOCTOR'); setEditingTeamId(null); setNewDoctorName(''); }} className={`h-8 text-xs font-bold rounded-md ${teamRole === 'DOCTOR' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}>Doctor</button><button type="button" onClick={() => { setTeamRole('RECEPTIONIST'); setEditingTeamId(null); setNewDoctorName(''); }} className={`h-8 text-xs font-bold rounded-md ${teamRole === 'RECEPTIONIST' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}>Receptionist</button></div>
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sneha Kulkarni"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {teamRole === 'DOCTOR' && <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, DNB"
                    value={newDoctorQualification}
                    onChange={(e) => setNewDoctorQualification(e.target.value)}
                    className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Medical Reg. No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MMC-98214"
                    value={newDoctorRegNo}
                    onChange={(e) => setNewDoctorRegNo(e.target.value)}
                    className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>}

              {teamRole === 'DOCTOR' && <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Specialty</label>
                <select
                  value={newDoctorSpecialty}
                  onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                  className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                >
                  {PRIMARY_SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>}
              <div className="grid grid-cols-2 gap-sm"><div><label className="text-xs font-bold block mb-1">Email</label><input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg" placeholder="name@clinic.in" /></div><div><label className="text-xs font-bold block mb-1">Mobile</label><input value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg" placeholder="9876543210" /></div></div>

              <div className="flex justify-end gap-sm pt-sm">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-md h-[38px] text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg h-[38px] bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 shadow-sm"
                >
                  {editingTeamId ? 'Update' : `Add ${teamRole === 'DOCTOR' ? 'Doctor' : 'Receptionist'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PRESETS                                                       */}
      {/* ========================================================================= */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-[44rem] max-h-[90vh] overflow-y-auto w-full p-lg shadow-xl space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">bolt</span>
                Prescription Presets
              </h3>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Create reusable shortcuts for the consultation screen. All medicines shown here are fictional demonstration data.
            </p>

            <div className="space-y-sm max-h-48 overflow-y-auto pr-1">
              {clinicPresets.map((preset) => (
                <div key={preset.id} className="p-sm bg-surface-container-low rounded-xl border border-outline-variant space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: preset.color }}>
                        <span className="material-symbols-outlined text-[14px]">{preset.icon}</span>
                      </div>
                      <h4 className="text-xs font-bold text-on-surface">{preset.label}</h4>
                    </div>
                    <div className="flex items-center gap-1"><span className="text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold">{preset.medicines.length} medicine{preset.medicines.length !== 1 ? 's' : ''}</span><button type="button" aria-label={`Edit ${preset.label}`} onClick={() => { setEditingPresetId(preset.id); setPresetName(preset.label); setPresetDiagnosis(preset.diagnosis); setPresetSymptoms(preset.symptoms.join(', ')); setPresetMedicines(preset.medicines); setPresetMedicine(''); setShowMedicineSuggestions(false); }} className="p-1 text-primary"><span className="material-symbols-outlined text-[16px]">edit</span></button><button type="button" aria-label={`Delete ${preset.label}`} onClick={() => { deletePresetFromClinic(preset.id); if (createdClinic) setClinicPresets(getClinicPresets(createdClinic.id)); }} className="p-1 text-error"><span className="material-symbols-outlined text-[16px]">delete</span></button></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant"><strong>Diagnosis:</strong> {preset.diagnosis}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    <strong>Medicines:</strong> {preset.medicines.map((m) => m.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handlePresetSubmit} className="space-y-sm border-t border-outline-variant pt-sm">
              <h4 className="text-xs font-bold">{editingPresetId ? 'Edit preset' : 'Create custom preset'}</h4>
              <div className="grid grid-cols-2 gap-sm"><div><label className="text-[11px] font-bold block mb-1">Preset name *</label><input value={presetName} onChange={(e) => setPresetName(e.target.value)} required placeholder="e.g. Viral Fever" className="w-full h-9 px-sm text-xs bg-transparent border border-outline-variant rounded-lg" /></div><div><label className="text-[11px] font-bold block mb-1">Diagnosis</label><input value={presetDiagnosis} onChange={(e) => setPresetDiagnosis(e.target.value)} placeholder="Default diagnosis" className="w-full h-9 px-sm text-xs bg-transparent border border-outline-variant rounded-lg" /></div></div>
              <div><label className="text-[11px] font-bold block mb-1">Symptoms</label><input value={presetSymptoms} onChange={(e) => setPresetSymptoms(e.target.value)} placeholder="Fever, body pain, headache" className="w-full h-9 px-sm text-xs bg-transparent border border-outline-variant rounded-lg" /><p className="text-[10px] text-on-surface-variant mt-1">Separate multiple symptoms with commas.</p></div>
              <p className="text-[11px] font-bold pt-xs">Add medicines</p>
              <div className="relative"><input value={presetMedicine} onFocus={() => setShowMedicineSuggestions(true)} onBlur={() => window.setTimeout(() => setShowMedicineSuggestions(false), 120)} onChange={(e) => { setPresetMedicine(e.target.value); setShowMedicineSuggestions(true); }} placeholder="Type ‘para’ to search medicines" autoComplete="off" className="w-full h-9 px-sm text-xs bg-transparent border border-outline-variant rounded-lg" />{medicineSuggestions.length > 0 && <div className="absolute z-10 top-10 inset-x-0 bg-surface border border-outline-variant rounded-lg shadow-lg overflow-hidden">{medicineSuggestions.map((medicine) => <button key={medicine.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setPresetMedicine(medicine.name); setPresetMedicineType(medicine.type); setShowMedicineSuggestions(false); }} className="w-full px-sm py-2 text-left text-xs hover:bg-primary-container flex justify-between"><span>{medicine.name}</span><span className="text-on-surface-variant">{medicine.type}</span></button>)}</div>}</div>
              <div className="grid grid-cols-4 gap-xs"><select aria-label="Medicine form" value={presetMedicineType} onChange={(e) => setPresetMedicineType(e.target.value)} className="h-9 px-2 text-xs bg-transparent border border-outline-variant rounded-lg"><option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Drops</option><option>Injection</option><option>Ointment</option></select><select aria-label="Frequency" value={presetDose} onChange={(e) => setPresetDose(e.target.value)} className="h-9 px-2 text-xs bg-transparent border border-outline-variant rounded-lg"><option>1-0-1</option><option>1-0-0</option><option>0-0-1</option><option>1-1-1</option><option>SOS</option></select><select aria-label="Timing" value={presetTiming} onChange={(e) => setPresetTiming(e.target.value)} className="h-9 px-2 text-xs bg-transparent border border-outline-variant rounded-lg"><option>After Food</option><option>Before Food</option><option>With Food</option><option>Any Time</option><option>SOS</option></select><div className="flex"><input aria-label="Duration in days" type="number" min={1} max={90} value={presetDuration} onChange={(e) => setPresetDuration(Number(e.target.value))} className="w-full min-w-0 h-9 px-2 text-xs bg-transparent border border-outline-variant rounded-l-lg" /><span className="h-9 px-2 flex items-center text-[10px] bg-surface-container border border-l-0 border-outline-variant rounded-r-lg">days</span></div></div>
              <button type="button" onClick={addMedicineToPreset} disabled={!presetMedicine.trim()} className="w-full h-9 border border-primary text-primary text-xs font-bold rounded-lg disabled:opacity-40"><span className="material-symbols-outlined text-[15px] align-middle mr-1">add</span>Add medicine to preset</button>
              {presetMedicines.length > 0 && <div className="space-y-xs bg-surface-container-low rounded-lg p-xs">{presetMedicines.map((medicine, index) => <div key={`${medicine.name}-${index}`} className="bg-surface px-sm py-2 rounded-md flex items-center justify-between gap-sm text-xs"><div className="min-w-0"><p className="font-bold truncate">{medicine.name} <span className="font-normal text-on-surface-variant">• {medicine.type}</span></p><p className="text-[10px] text-on-surface-variant">{medicine.dose} • {medicine.timing} • {medicine.duration} days</p></div><button type="button" aria-label={`Remove ${medicine.name}`} onClick={() => setPresetMedicines((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="text-error p-1"><span className="material-symbols-outlined text-[17px]">delete</span></button></div>)}</div>}
              {presetMedicines.length === 0 && <p className="text-[11px] text-error">Add at least one medicine before saving the preset.</p>}
              {presetSaveMessage && <p role="status" className="text-[11px] font-semibold text-tertiary bg-tertiary-container/30 rounded-lg px-sm py-2">{presetSaveMessage}</p>}
              <div className="flex justify-end"><button type="submit" disabled={presetMedicines.length === 0} className="px-lg h-9 bg-primary text-white text-xs font-bold rounded-lg disabled:opacity-40">{editingPresetId ? 'Update Preset' : 'Save Preset'}</button></div>
            </form>

            <div className="flex justify-end pt-sm border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="px-lg h-[38px] bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW / ADD MEDICINES                                               */}
      {/* ========================================================================= */}
      {showMedicinesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-[28rem] w-full p-lg shadow-xl space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
                Clinic Formulary Medicines
              </h3>
              <button
                onClick={() => setShowMedicinesModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Existing medicines catalog */}
            <div className="space-y-xs max-h-48 overflow-y-auto pr-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Catalog ({clinicMedicines.length} items)</p>
              <div className="grid grid-cols-2 gap-xs">
                {clinicMedicines.map((med) => (
                  <div key={med.id} className="p-2 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between gap-1 text-xs">
                    <span className="font-semibold text-on-surface truncate flex-1">{med.name}</span>
                    <span className="text-[10px] text-on-surface-variant bg-surface px-1 py-0.5 rounded">{med.type}</span><button type="button" aria-label={`Edit ${med.name}`} onClick={() => { setEditingMedicineId(med.id); setNewMedName(med.name); setNewMedType(med.type); }} className="text-primary"><span className="material-symbols-outlined text-[15px]">edit</span></button><button type="button" aria-label={`Delete ${med.name}`} onClick={() => { deleteMedicineFromClinic(med.id); if (createdClinic) setClinicMedicines(getClinicMedicines(createdClinic.id)); }} className="text-error"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Medicine Form */}
            <form onSubmit={handleAddMedicineSubmit} className="space-y-sm pt-sm border-t border-outline-variant">
              <h4 className="text-xs font-bold text-on-surface">{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine to Catalog'}</h4>
              <div className="flex gap-sm">
                <input
                  type="text"
                  placeholder="e.g. Telmisartan 40mg"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="flex-1 h-[38px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                  required
                />
                <select
                  value={newMedType}
                  onChange={(e) => setNewMedType(e.target.value)}
                  className="w-24 h-[38px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Drops">Drops</option>
                  <option value="Ointment">Ointment</option>
                </select>
              </div>

              <div className="flex justify-end gap-sm pt-xs">
                <button
                  type="button"
                  onClick={() => setShowMedicinesModal(false)}
                  className="px-md h-[36px] text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-lg h-[36px] bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 shadow-sm"
                >
                  {editingMedicineId ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-surface py-md border-t border-outline-variant text-center text-xs text-on-surface-variant">
        Bharat Clinic © 2026 • Multi-Tenant Clinic Management Suite
      </footer>
    </div>
  );
}
