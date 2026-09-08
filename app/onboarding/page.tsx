'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClinicType,
  PrimarySpecialty,
  INDIAN_STATES_AND_UTS,
  UserProfile,
  Clinic,
  PrescriptionPreset,
  Doctor,
  ClinicMedicine,
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
  const router = useRouter();

  // Step state: 1 = Basic Info, 2 = Location, 3 = Created / Optional Setup
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated Owner Context
  const [owner, setOwner] = useState<UserProfile>({
    id: "usr_auth_789412",
    name: "Dr. Aniket Mehta",
    email: "aniket.mehta@bharatclinic.in",
    phone: "9876543210",
    role: "CLINIC_OWNER",
  });
  const [isEditingOwner, setIsEditingOwner] = useState(false);

  // Step 1 Form State
  const [clinicName, setClinicName] = useState("");
  const [clinicType, setClinicType] = useState<ClinicType>("Clinic");
  const [primarySpecialty, setPrimarySpecialty] = useState<PrimarySpecialty>("General Medicine");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 Form State
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string>("Maharashtra");
  const [pincode, setPincode] = useState("");
  const country = "India";

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Created Clinic Result
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);
  const [clinicDoctors, setClinicDoctors] = useState<Doctor[]>([]);
  const [clinicPresets, setClinicPresets] = useState<PrescriptionPreset[]>([]);
  const [clinicMedicines, setClinicMedicines] = useState<ClinicMedicine[]>([]);

  // Optional Setup Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorQualification, setNewDoctorQualification] = useState("MBBS");
  const [newDoctorRegNo, setNewDoctorRegNo] = useState("");
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState("General Medicine");

  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showMedicinesModal, setShowMedicinesModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedType, setNewMedType] = useState("Tablet");

  // Load current user from store on mount
  useEffect(() => {
    const u = getCurrentUser();
    // Strip +91 for clean 10-digit input
    const cleanPhone = u.phone.replace("+91", "").replace(/\s+/g, "").trim();
    setOwner({ ...u, phone: cleanPhone });
    setPhone(cleanPhone);
  }, []);

  // Sync doctors & presets when clinic is created
  useEffect(() => {
    if (createdClinic) {
      setClinicDoctors(getClinicDoctors(createdClinic.id));
      setClinicPresets(getClinicPresets(createdClinic.id));
      setClinicMedicines(getClinicMedicines(createdClinic.id));
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

  // Step 1 Validation
  const validateStep1 = (): boolean => {
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

    if (!owner.name.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
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
    if (validateStep1()) {
      // Save owner profile changes if edited
      updateCurrentUser({
        name: owner.name,
        email: owner.email,
        phone: `+91 ${owner.phone.replace(/[\s\-\+]/g, "")}`,
      });
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

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
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdClinic || !newDoctorName.trim()) return;

    const doc = addDoctorToClinic(createdClinic.id, {
      name: newDoctorName.startsWith("Dr.") ? newDoctorName : `Dr. ${newDoctorName}`,
      qualification: newDoctorQualification.trim() || "MBBS",
      registrationNumber: newDoctorRegNo.trim() || "REG-" + Math.floor(100000 + Math.random() * 900000),
      specialty: newDoctorSpecialty,
      email: `${newDoctorName.toLowerCase().replace(/[^a-z0-9]/g, "")}@${createdClinic.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      phone: "+91 9" + Math.floor(100000000 + Math.random() * 900000000),
    });

    setClinicDoctors((prev) => [doc, ...prev]);
    setNewDoctorName("");
    setNewDoctorRegNo("");
    setShowAddDoctorModal(false);
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdClinic || !newMedName.trim()) return;

    const med = addMedicineToClinic(createdClinic.id, newMedName, newMedType);
    setClinicMedicines((prev) => [med, ...prev]);
    setNewMedName("");
    setShowMedicinesModal(false);
  };

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
          <div className="flex items-center gap-xs text-xs font-semibold text-on-surface-variant bg-surface-container-low px-sm py-1.5 rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Owner: <strong className="text-on-background">{owner.name}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-md md:p-lg flex flex-col gap-lg py-8">
        
        {/* Multi-step Progress Bar */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-xs">
          <div className="flex items-center justify-between">
            {/* Step 1 Indicator */}
            <div className="flex items-center gap-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep >= 1 ? "bg-primary text-white shadow-xs" : "bg-surface-container text-on-surface-variant"
              }`}>
                {currentStep > 1 ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  "1"
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Clinic Details</p>
                <p className="text-[11px] text-on-surface-variant">Name & Specialty</p>
              </div>
            </div>

            {/* Step Divider */}
            <div className={`flex-1 h-[2px] mx-sm transition-all ${
              currentStep >= 2 ? "bg-primary" : "bg-outline-variant"
            }`} />

            {/* Step 2 Indicator */}
            <div className="flex items-center gap-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep >= 2 ? "bg-primary text-white shadow-xs" : "bg-surface-container text-on-surface-variant"
              }`}>
                {currentStep > 2 ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  "2"
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Location</p>
                <p className="text-[11px] text-on-surface-variant">Address & Pincode</p>
              </div>
            </div>

            {/* Step Divider */}
            <div className={`flex-1 h-[2px] mx-sm transition-all ${
              currentStep === 3 ? "bg-primary" : "bg-outline-variant"
            }`} />

            {/* Step 3 Indicator */}
            <div className="flex items-center gap-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep === 3 ? "bg-tertiary-container text-on-tertiary-container shadow-xs" : "bg-surface-container text-on-surface-variant"
              }`}>
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Setup & Launch</p>
                <p className="text-[11px] text-on-surface-variant">Ready to use</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: BASIC CLINIC INFORMATION                                          */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
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

            {/* Owner Context Card */}
            <section className="bg-primary-container/10 border border-primary/20 rounded-xl p-md space-y-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">You&apos;re setting up this clinic as the owner.</h3>
                    <p className="text-xs text-on-surface-variant">Your user account will be assigned the <span className="font-semibold text-primary">CLINIC_OWNER</span> role.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingOwner(!isEditingOwner)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">{isEditingOwner ? "check" : "edit"}</span>
                  {isEditingOwner ? "Done" : "Edit Profile"}
                </button>
              </div>

              {isEditingOwner ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm pt-sm border-t border-primary/10">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Owner Name *</label>
                    <input
                      type="text"
                      value={owner.name}
                      onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                      className="w-full h-[38px] px-sm text-xs bg-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                    />
                    {errors.ownerName && <p className="text-[10px] text-error mt-0.5">{errors.ownerName}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Owner Email</label>
                    <input
                      type="email"
                      value={owner.email}
                      onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                      className="w-full h-[38px] px-sm text-xs bg-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Owner Mobile *</label>
                    <input
                      type="tel"
                      value={owner.phone}
                      onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                      className="w-full h-[38px] px-sm text-xs bg-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-md pt-sm border-t border-primary/10 text-xs text-on-surface-variant">
                  <span><strong>Name:</strong> {owner.name}</span>
                  <span><strong>Email:</strong> {owner.email}</span>
                  <span><strong>Mobile:</strong> +91 {owner.phone}</span>
                </div>
              )}
            </section>

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
            <div className="flex justify-end pt-sm">
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
        {/* STEP 2: CLINIC LOCATION                                                   */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
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
                  setCurrentStep(1);
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
        {currentStep === 3 && createdClinic && (
          <div className="space-y-lg animate-[slideUp_0.25s_ease-out]">
            
            {/* Success Hero Banner */}
            <section className="bg-tertiary-container/20 border-2 border-tertiary/40 rounded-2xl p-md md:p-lg text-center space-y-sm shadow-sm relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-tertiary text-white uppercase tracking-wider">
                Tenant Active & Ready
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">
                {createdClinic.name} is Live!
              </h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
                Your clinic workspace has been established with ID <code className="bg-surface-container px-2 py-0.5 rounded font-mono text-primary font-bold">{createdClinic.id}</code>. You are registered as the <strong className="text-on-background">Clinic Owner</strong>.
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
                  <p className="text-on-surface-variant font-medium">Owner</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{createdClinic.ownerName}</p>
                </div>
              </div>
            </section>

            {/* Optional Setup Steps (Non-blocking) */}
            <section className="space-y-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Optional Setup</h3>
                  <p className="text-xs text-on-surface-variant">Customize doctors, presets, and medicines at your convenience.</p>
                </div>
                <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium">Non-blocking</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                
                {/* 1. Add Doctor Card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all">
                  <div className="space-y-xs">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">person_add</span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface">Add Doctor</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {clinicDoctors.length} doctor{clinicDoctors.length > 1 ? "s" : ""} registered. Add associate consultants or specialists.
                    </p>
                  </div>
                  <div className="pt-md">
                    <button
                      type="button"
                      onClick={() => setShowAddDoctorModal(true)}
                      className="w-full h-[38px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Manage Doctors</span>
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
                      {clinicPresets.length} seeded templates (Viral Fever, Cold, Acidity, UTI, etc.).
                    </p>
                  </div>
                  <div className="pt-md">
                    <button
                      type="button"
                      onClick={() => setShowPresetsModal(true)}
                      className="w-full h-[38px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-tertiary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>View Presets ({clinicPresets.length})</span>
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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-lg shadow-xl space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                Add Doctor to Clinic
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
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current Clinic Doctors</p>
              {clinicDoctors.map((doc) => (
                <div key={doc.id} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-on-surface">{doc.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{doc.qualification} • {doc.specialty}</p>
                  </div>
                  <span className="text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded font-bold">Active</span>
                </div>
              ))}
            </div>

            {/* Form to add new doctor */}
            <form onSubmit={handleAddDoctorSubmit} className="space-y-sm pt-sm border-t border-outline-variant">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sneha Kulkarni"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  className="w-full h-[40px] px-sm text-xs bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
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
              </div>

              <div>
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
              </div>

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
                  Save Doctor
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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-lg shadow-xl space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">bolt</span>
                Seeded Prescription Templates
              </h3>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              These pre-packaged templates are automatically active on the <strong className="text-on-surface">Consultation Entry Screen</strong> for rapid 1-click prescribing.
            </p>

            <div className="space-y-sm max-h-72 overflow-y-auto pr-1">
              {clinicPresets.map((preset) => (
                <div key={preset.id} className="p-sm bg-surface-container-low rounded-xl border border-outline-variant space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: preset.color }}>
                        <span className="material-symbols-outlined text-[14px]">{preset.icon}</span>
                      </div>
                      <h4 className="text-xs font-bold text-on-surface">{preset.label}</h4>
                    </div>
                    <span className="text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold">
                      {preset.medicines.length} drugs
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant"><strong>Diagnosis:</strong> {preset.diagnosis}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    <strong>Medicines:</strong> {preset.medicines.map((m) => m.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>

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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-lg shadow-xl space-y-md">
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
                  <div key={med.id} className="p-2 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between text-xs">
                    <span className="font-semibold text-on-surface truncate">{med.name}</span>
                    <span className="text-[10px] text-on-surface-variant bg-surface px-1 py-0.5 rounded">{med.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Medicine Form */}
            <form onSubmit={handleAddMedicineSubmit} className="space-y-sm pt-sm border-t border-outline-variant">
              <h4 className="text-xs font-bold text-on-surface">Add New Medicine to Catalog</h4>
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
                  Add Medicine
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
