'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getPatient, saveConsultation } from "../../../lib/store/demoStore";
import { getActiveClinic, getClinicDoctors, getClinicMedicines, getClinicPresets } from "../../../lib/store/clinicStore";
import type { PrescriptionPreset } from "../../../lib/types/clinic";
import { createPrescriptionPdf, estimateQuantity } from "../../../lib/utils/prescriptionPdf";

// =============================================
// DATA: Medicine Database for Auto-suggest
// =============================================
interface SearchMedicine { name: string; type: string; genericName?: string; brandName?: string; strength?: string; category?: string }
const MEDICINE_DATABASE: SearchMedicine[] = [
  { name: "Paracetamol 500mg", type: "Tablet" },
  { name: "Paracetamol 650mg", type: "Tablet" },
  { name: "Ibuprofen 400mg", type: "Tablet" },
  { name: "Amoxicillin 500mg", type: "Capsule" },
  { name: "Amoxicillin 250mg", type: "Capsule" },
  { name: "Azithromycin 500mg", type: "Tablet" },
  { name: "Azithromycin 250mg", type: "Tablet" },
  { name: "Cetirizine 10mg", type: "Tablet" },
  { name: "Levocetirizine 5mg", type: "Tablet" },
  { name: "Montelukast 10mg", type: "Tablet" },
  { name: "Pantoprazole 40mg", type: "Tablet" },
  { name: "Omeprazole 20mg", type: "Capsule" },
  { name: "Ranitidine 150mg", type: "Tablet" },
  { name: "Domperidone 10mg", type: "Tablet" },
  { name: "Ondansetron 4mg", type: "Tablet" },
  { name: "Metformin 500mg", type: "Tablet" },
  { name: "Amlodipine 5mg", type: "Tablet" },
  { name: "Atenolol 50mg", type: "Tablet" },
  { name: "Cough Syrup (Dextromethorphan)", type: "Syrup" },
  { name: "ORS Sachet", type: "Tablet" },
  { name: "Zinc 20mg", type: "Tablet" },
  { name: "Vitamin C 500mg", type: "Tablet" },
  { name: "B-Complex", type: "Tablet" },
  { name: "Iron + Folic Acid", type: "Tablet" },
  { name: "Calcium + Vitamin D3", type: "Tablet" },
  { name: "Ciprofloxacin 500mg", type: "Tablet" },
  { name: "Norfloxacin 400mg", type: "Tablet" },
  { name: "Metronidazole 400mg", type: "Tablet" },
  { name: "Ranitidine 300mg", type: "Tablet" },
  { name: "Diclofenac 50mg", type: "Tablet" },
  { name: "Aceclofenac 100mg", type: "Tablet" },
  { name: "Salbutamol Inhaler", type: "Inhaler" },
  { name: "Budesonide Inhaler", type: "Inhaler" },
  { name: "Nasal Drops (Xylometazoline)", type: "Drops" },
  { name: "Eye Drops (Moxifloxacin)", type: "Drops" },
  { name: "Betadine Ointment", type: "Ointment" },
  { name: "Mupirocin Ointment", type: "Ointment" },
  { name: "Tramadol 50mg", type: "Capsule" },
  { name: "Rabeprazole 20mg", type: "Tablet" },
  { name: "Dolo 650", type: "Tablet" },
];

// =============================================
// DATA: Prescription Templates
// =============================================
interface TemplateMedicine {
  name: string;
  type: string;
  dose: string;
  timing: string;
  duration: number;
}

type PrescriptionTemplate = Omit<PrescriptionPreset, 'clinicId' | 'isDefault'> & { isDefault?: boolean };

const FALLBACK_PRESCRIPTION_TEMPLATES: PrescriptionTemplate[] = [
  {
    id: "viral_fever",
    label: "Viral Fever",
    icon: "thermostat",
    color: "#E53935",
    diagnosis: "Viral fever",
    symptoms: ["Fever", "Body pain", "Headache", "Fatigue"],
    advice: "Rest for 2-3 days. Drink plenty of warm fluids. Sponge with lukewarm water if temperature exceeds 102°F.",
    medicines: [
      { name: "Paracetamol 650mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Cetirizine 10mg", type: "Tablet", dose: "0-0-1", timing: "After Food", duration: 5 },
      { name: "B-Complex", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 5 },
      { name: "Vitamin C 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
    ],
  },
  {
    id: "common_cold",
    label: "Common Cold",
    icon: "ac_unit",
    color: "#1E88E5",
    diagnosis: "Acute upper respiratory infection (Common cold)",
    symptoms: ["Cold", "Cough", "Headache"],
    advice: "Steam inhalation twice daily. Avoid cold drinks and fried food. Gargle with warm salt water.",
    medicines: [
      { name: "Cetirizine 10mg", type: "Tablet", dose: "0-0-1", timing: "After Food", duration: 5 },
      { name: "Paracetamol 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Cough Syrup (Dextromethorphan)", type: "Syrup", dose: "1-1-1", timing: "After Food", duration: 5 },
      { name: "Nasal Drops (Xylometazoline)", type: "Drops", dose: "SOS", timing: "Before Food", duration: 3 },
    ],
  },
  {
    id: "gastritis",
    label: "Gastritis / Acidity",
    icon: "local_fire_department",
    color: "#FB8C00",
    diagnosis: "Acute gastritis / Dyspepsia",
    symptoms: ["Vomiting", "Fatigue"],
    advice: "Avoid spicy, oily, and fried food. Eat small frequent meals. No tea/coffee on empty stomach. Avoid lying down immediately after meals.",
    medicines: [
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 7 },
      { name: "Domperidone 10mg", type: "Tablet", dose: "1-1-1", timing: "Before Food", duration: 5 },
      { name: "Ranitidine 150mg", type: "Tablet", dose: "0-0-1", timing: "Before Food", duration: 5 },
    ],
  },
  {
    id: "uti",
    label: "UTI",
    icon: "water_drop",
    color: "#8E24AA",
    diagnosis: "Urinary tract infection",
    symptoms: ["Fever"],
    advice: "Drink at least 3-4 liters of water daily. Complete the full course of antibiotics. Follow up if symptoms persist after 3 days.",
    medicines: [
      { name: "Ciprofloxacin 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
      { name: "Paracetamol 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 5 },
    ],
  },
  {
    id: "diarrhea",
    label: "Diarrhea",
    icon: "emergency",
    color: "#00897B",
    diagnosis: "Acute diarrhea / Gastroenteritis",
    symptoms: ["Vomiting", "Diarrhea", "Fatigue"],
    advice: "Take ORS after every loose stool. Eat light — khichdi, dal, curd rice. Avoid milk, raw fruits, and outside food.",
    medicines: [
      { name: "ORS Sachet", type: "Tablet", dose: "SOS", timing: "After Food", duration: 3 },
      { name: "Metronidazole 400mg", type: "Tablet", dose: "1-1-1", timing: "After Food", duration: 5 },
      { name: "Ondansetron 4mg", type: "Tablet", dose: "SOS", timing: "Before Food", duration: 3 },
      { name: "Zinc 20mg", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 10 },
    ],
  },
  {
    id: "body_pain",
    label: "Body Pain / Sprain",
    icon: "fitness_center",
    color: "#6D4C41",
    diagnosis: "Musculoskeletal pain / Soft tissue injury",
    symptoms: ["Body pain"],
    advice: "Apply ice pack for 15 min, 3 times a day. Avoid heavy lifting for 1 week. Rest the affected area.",
    medicines: [
      { name: "Aceclofenac 100mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
      { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 5 },
      { name: "Diclofenac Gel", type: "Ointment", dose: "SOS", timing: "After Food", duration: 7 },
    ],
  },
];

// =============================================
// DATA: Frequently used medicines (quick-add)
// =============================================
const FREQUENT_MEDICINES: TemplateMedicine[] = [
  { name: "Paracetamol 650mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 3 },
  { name: "Cetirizine 10mg", type: "Tablet", dose: "0-0-1", timing: "After Food", duration: 5 },
  { name: "Pantoprazole 40mg", type: "Tablet", dose: "1-0-0", timing: "Before Food", duration: 7 },
  { name: "Azithromycin 500mg", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 3 },
  { name: "B-Complex", type: "Tablet", dose: "1-0-0", timing: "After Food", duration: 10 },
  { name: "Vitamin C 500mg", type: "Tablet", dose: "1-0-1", timing: "After Food", duration: 5 },
];

const RECOMMENDED_TEST_OPTIONS = [
  "CBC",
  "ESR",
  "CRP",
  "LFT",
  "KFT",
  "Blood Sugar",
  "Urine Routine",
  "Malaria Test",
  "Dengue NS1",
  "Typhoid Test",
  "X-Ray Chest",
  "ECG",
  "Ultrasound",
];

const PRESCRIPTION_LANGUAGE_OPTIONS = ["English", "Hindi", "Marathi"];

// =============================================
// COMPONENT
// =============================================
interface Medicine {
  name: string;
  type: string;
  dose: string;
  timing: string;
  duration: number;
}

export default function ConsultationEntryPage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-500">Loading consultation…</div>}><ConsultationEntry /></Suspense>;
}

function ConsultationEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patient") || "1";
  const queueEntryId = searchParams.get("queue") || undefined;
  const patient = getPatient(patientId);
  const [prescriptionTemplates, setPrescriptionTemplates] = useState<PrescriptionTemplate[]>(FALLBACK_PRESCRIPTION_TEMPLATES);

  // === Vitals State (Editable) ===
  const [vitals, setVitals] = useState({
    temp: "101.2",
    bp: "120/80",
    pulse: "88",
    spo2: "97",
    weight: "72",
  });

  // === Symptoms State ===
  const allDefaultSymptoms = ["Fever", "Cough", "Cold", "Headache", "Body pain", "Vomiting", "Diarrhea", "Fatigue"];
  const [availableSymptoms, setAvailableSymptoms] = useState(allDefaultSymptoms);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showCustomSymptomInput, setShowCustomSymptomInput] = useState(false);
  const [customSymptom, setCustomSymptom] = useState("");

  // === Diagnosis State ===
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisSuggestion, setDiagnosisSuggestion] = useState<PrescriptionTemplate | null>(null);
  const [investigations, setInvestigations] = useState("");
  const [recommendedTests, setRecommendedTests] = useState<string[]>([]);

  // === Medicines List State ===
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // === Form State for Add Medicine ===
  const [newMedName, setNewMedName] = useState("");
  const [newMedType, setNewMedType] = useState("Tablet");
  const [newMedDose, setNewMedDose] = useState("1-0-1");
  const [newMedTiming, setNewMedTiming] = useState("After Food");
  const [newMedDuration, setNewMedDuration] = useState(5);

  // === Auto-suggest State ===
  const [suggestions, setSuggestions] = useState<typeof MEDICINE_DATABASE>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [medicineDatabase, setMedicineDatabase] = useState(MEDICINE_DATABASE);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [recentMedicineNames, setRecentMedicineNames] = useState<string[]>([]);
  const suggestRef = useRef<HTMLDivElement>(null);

  // === Template State ===
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [recentTemplateIds, setRecentTemplateIds] = useState<string[]>([]);
  const [pendingTemplate, setPendingTemplate] = useState<PrescriptionTemplate | null>(null);

  // === Advice (patient-facing) ===
  const [advice, setAdvice] = useState("");
  const [prescriptionLanguage, setPrescriptionLanguage] = useState("English");

  // === Private Notes ===
  const [notes, setNotes] = useState("");

  // === Follow-up Date ===
  const [followUpDate, setFollowUpDate] = useState("");

  // === Toast State ===
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("check_circle");
  const [validationError, setValidationError] = useState("");
  const [visitSaved, setVisitSaved] = useState(false);
  const [showPrescriptionActions, setShowPrescriptionActions] = useState(false);
  const [savedPrescriptionId, setSavedPrescriptionId] = useState("");

  useEffect(() => {
    const refreshTemplates = () => {
      const activeClinic = getActiveClinic();
      const templates = getClinicPresets(activeClinic.id);
      if (templates.length > 0) {
        setPrescriptionTemplates(templates);
        setAvailableSymptoms((current) => Array.from(new Set([...current, ...templates.flatMap((template) => template.symptoms)])));
      }
      const clinicMedicines = getClinicMedicines(activeClinic.id);
      if (clinicMedicines.length > 0) setMedicineDatabase(clinicMedicines);
    };
    refreshTemplates();
    // Hydrate recent template usage after localStorage becomes available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setRecentTemplateIds(JSON.parse(localStorage.getItem('bharat_clinic_recent_templates') || '[]')); } catch { setRecentTemplateIds([]); }
    try { setRecentMedicineNames(JSON.parse(localStorage.getItem('bharat_clinic_recent_medicines') || '[]')); } catch { setRecentMedicineNames([]); }
    window.addEventListener('clinic-store-change', refreshTemplates);
    window.addEventListener('storage', refreshTemplates);
    window.addEventListener('focus', refreshTemplates);
    return () => {
      window.removeEventListener('clinic-store-change', refreshTemplates);
      window.removeEventListener('storage', refreshTemplates);
      window.removeEventListener('focus', refreshTemplates);
    };
  }, []);

  const matchingTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();
    return [...prescriptionTemplates]
      .filter((template) => !query || template.label.toLowerCase().includes(query) || template.diagnosis.toLowerCase().includes(query) || template.symptoms.some((symptom) => symptom.toLowerCase().includes(query)))
      .sort((a, b) => {
        const aIndex = recentTemplateIds.indexOf(a.id);
        const bIndex = recentTemplateIds.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
  }, [prescriptionTemplates, recentTemplateIds, templateQuery]);

  const visibleTemplates = showAllTemplates || templateQuery.trim() ? matchingTemplates : matchingTemplates.slice(0, 6);
  const quickMedicines = useMemo(() => {
    const recent = recentMedicineNames.map((name) => medicineDatabase.find((item) => item.name === name)).filter((item): item is SearchMedicine => Boolean(item)).map((item) => ({ name: item.name, type: item.type, dose: '1-0-1', timing: 'After Food', duration: 3 }));
    return [...recent, ...FREQUENT_MEDICINES.filter((item) => !recent.some((recentItem) => recentItem.name === item.name))].slice(0, 6);
  }, [medicineDatabase, recentMedicineNames]);

  // Auto-hide toast after 3 seconds
  // This derives a dismissible UI suggestion whenever the diagnosis input changes.
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Diagnosis → Template suggestion
  useEffect(() => {
    if (!diagnosis.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiagnosisSuggestion(null);
      return;
    }
    const lower = diagnosis.toLowerCase();
    const match = prescriptionTemplates.find((t) =>
      t.diagnosis.toLowerCase().includes(lower) || t.label.toLowerCase().includes(lower)
    );
    // Only suggest if a template isn't already active
    if (match && match.id !== activeTemplate) {
      setDiagnosisSuggestion(match);
    } else {
      setDiagnosisSuggestion(null);
    }
  }, [diagnosis, activeTemplate, prescriptionTemplates]);

  // --- Handlers ---

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (!trimmed) return;
    if (!availableSymptoms.includes(trimmed)) {
      setAvailableSymptoms([...availableSymptoms, trimmed]);
    }
    if (!selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
    }
    setCustomSymptom("");
    setShowCustomSymptomInput(false);
  };

  const handleMedNameChange = (value: string) => {
    setNewMedName(value);
    if (value.trim().length >= 2) {
      const filtered = medicineDatabase.filter((m) =>
        [m.name, m.genericName, m.brandName, m.strength, m.category].some((field) => field?.toLowerCase().includes(value.toLowerCase()))
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestionIndex(filtered.length > 0 ? 0 : -1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (med: SearchMedicine) => {
    setNewMedName(med.name);
    setNewMedType(med.type);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const rememberMedicine = (name: string) => {
    const next = [name, ...recentMedicineNames.filter((item) => item !== name)].slice(0, 6);
    setRecentMedicineNames(next);
    localStorage.setItem('bharat_clinic_recent_medicines', JSON.stringify(next));
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    if (medicines.some((item) => item.name.toLowerCase() === newMedName.trim().toLowerCase())) {
      showToastMsg(`${newMedName.trim()} already in prescription`, "info");
      return;
    }

    const newMed: Medicine = {
      name: newMedName,
      type: newMedType,
      dose: newMedDose,
      timing: newMedTiming,
      duration: newMedDuration,
    };

    setMedicines([...medicines, newMed]);
    setValidationError("");
    setNewMedName("");
    setNewMedType("Tablet");
    setNewMedDose("1-0-1");
    setNewMedTiming("After Food");
    setNewMedDuration(5);
    rememberMedicine(newMed.name);

    showToastMsg(`${newMed.name} added`, "add_circle");
  };

  const handleQuickAddMedicine = (med: TemplateMedicine) => {
    // Don't add if already in the list
    if (medicines.some((m) => m.name === med.name)) {
      showToastMsg(`${med.name} already in prescription`, "info");
      return;
    }
    setMedicines([...medicines, { ...med }]);
    rememberMedicine(med.name);
    setValidationError("");
    showToastMsg(`${med.name} added`, "add_circle");
  };

  const handleRemoveMedicine = (index: number) => {
    const removed = medicines[index];
    setMedicines(medicines.filter((_, idx) => idx !== index));
    showToastMsg(`${removed.name} removed`, "delete");
  };

  const applyTemplate = (template: PrescriptionTemplate) => {
    setActiveTemplate(template.id);
    setDiagnosis(template.diagnosis);
    setAdvice(template.advice);
    setMedicines([...template.medicines]);
    setDiagnosisSuggestion(null);
    setValidationError("");

    // Add template symptoms to the available choices and select the template set.
    const newAvailable = [...availableSymptoms];
    template.symptoms.forEach((s) => {
      if (!newAvailable.includes(s)) newAvailable.push(s);
    });
    setAvailableSymptoms(newAvailable);
    setSelectedSymptoms([...template.symptoms]);
    const recentMedicines = [...template.medicines.map((item) => item.name), ...recentMedicineNames.filter((name) => !template.medicines.some((item) => item.name === name))].slice(0, 6);
    setRecentMedicineNames(recentMedicines);
    localStorage.setItem('bharat_clinic_recent_medicines', JSON.stringify(recentMedicines));

    const nextRecent = [template.id, ...recentTemplateIds.filter((id) => id !== template.id)].slice(0, 8);
    setRecentTemplateIds(nextRecent);
    localStorage.setItem('bharat_clinic_recent_templates', JSON.stringify(nextRecent));
    setPendingTemplate(null);

    showToastMsg(`"${template.label}" template applied`, "auto_fix_high");
  };

  const requestTemplate = (template: PrescriptionTemplate) => {
    const hasExistingWork = medicines.length > 0 || Boolean(diagnosis.trim()) || Boolean(advice.trim());
    if (hasExistingWork && activeTemplate !== template.id) setPendingTemplate(template);
    else applyTemplate(template);
  };

  const showToastMsg = (msg: string, icon = "check_circle") => {
    setToastMessage(msg);
    setToastIcon(icon);
    setShowToast(true);
  };

  const toggleRecommendedTest = (test: string) => {
    setRecommendedTests((current) => current.includes(test) ? current.filter((item) => item !== test) : [...current, test]);
  };

  const handleSaveVisit = () => {
    if (!patient) return setValidationError("Patient could not be found.");
    if (!diagnosis.trim()) return setValidationError("Enter a diagnosis before saving the visit.");
    if (medicines.length === 0) return setValidationError("Add at least one medicine before saving the visit.");
    setValidationError("");
    if (!visitSaved) {
      const visit = saveConsultation({ patientId, queueEntryId, vitals, symptoms: selectedSymptoms, diagnosis: diagnosis.trim(), investigations: investigations.trim(), recommendedTests, medicines, advice: advice.trim(), prescriptionLanguage, notes: notes.trim(), followUpDate: followUpDate || undefined });
      setSavedPrescriptionId(`RX-${visit.id.replace(/\D/g, '').slice(-8) || visit.id.slice(-8).toUpperCase()}`);
    }
    setVisitSaved(true);
    setShowPrescriptionActions(true);
    showToastMsg("Visit saved. Prescription is ready.", "check_circle");
  };

  const previewPrescription = () => {
    if (!diagnosis.trim()) return setValidationError('Enter a diagnosis before previewing the prescription.');
    if (medicines.length === 0) return setValidationError('Add at least one medicine before previewing the prescription.');
    setValidationError('');
    setShowPrescriptionActions(true);
  };

  const prescriptionData = () => {
    const clinic = getActiveClinic();
    const doctor = getClinicDoctors(clinic.id).find((item) => item.isActive) || getClinicDoctors(clinic.id)[0];
    return { clinicName: clinic.name, clinicAddress: `${clinic.address.addressLine1}, ${clinic.address.city}, ${clinic.address.state} ${clinic.address.pincode}`, clinicPhone: clinic.phone, doctorName: doctor?.name || clinic.ownerName, doctorQualification: doctor ? `${doctor.qualification}, ${doctor.specialty}` : clinic.primarySpecialty, doctorRegistration: doctor?.registrationNumber || 'Not configured', patientName: patient?.name || 'Patient', patientDetails: patient ? `${patient.age} years / ${patient.gender}` : '', patientMobile: patient?.mobile || 'Not recorded', patientId: patient?.id || patientId, prescriptionId: savedPrescriptionId || 'DRAFT', date: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()), diagnosis: diagnosis.trim(), symptoms: selectedSymptoms, investigations: investigations.trim(), recommendedTests, prescriptionLanguage, medicines, advice: advice.trim() };
  };

  const downloadPrescription = () => {
    const blob = createPrescriptionPdf(prescriptionData());
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `prescription-${(patient?.name || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToastMsg('Prescription PDF downloaded.', 'download');
  };

  const printPrescription = () => {
    const data = prescriptionData();
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
    const clinicalDetailsPrint = `<section class="grid"><div><strong>Investigations:</strong> ${escape(data.investigations || 'Not recorded')}</div><div><strong>Recommended tests:</strong> ${escape(data.recommendedTests.join(', ') || 'Not recommended')}</div></section>`;
    const popup = window.open('', '_blank', 'width=800,height=900');
    if (!popup) return showToastMsg('Allow pop-ups to print the prescription.', 'info');
    popup.document.write(`<html><head><title>Prescription - ${escape(data.patientName)}</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;margin:0;font-size:12px}header{display:flex;justify-content:space-between;border-bottom:2px solid #173b74;padding-bottom:14px}h1{color:#173b74;margin:0;text-transform:uppercase}.right{text-align:right}.muted{color:#61708a}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 0;border-bottom:1px solid #cbd5e1}.rx{font:italic bold 30px Georgia;color:#173b74;margin:18px 0 8px}table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid #dbe2ea;padding:10px 6px;vertical-align:top}th{color:#61708a}.signature{width:230px;margin:55px 0 0 auto;border-top:1px solid #334155;text-align:center;padding-top:6px}.demo{margin-top:30px;padding:9px;border:2px solid #e5a000;background:#fff8df;color:#805b00;text-align:center;font-weight:bold;text-transform:uppercase}</style></head><body><header><div><h1>${escape(data.clinicName)}</h1><p class="muted">${escape(data.clinicAddress)}<br>Tel: ${escape(data.clinicPhone)}</p></div><div class="right"><strong>${escape(data.doctorName)}</strong><br><span class="muted">${escape(data.doctorQualification)}</span><br><strong>Reg. No: ${escape(data.doctorRegistration)}</strong></div></header><section class="grid"><div><span class="muted">Patient</span><br><strong>${escape(data.patientName)}</strong> · ${escape(data.patientDetails)}<br>ID: ${escape(data.patientId)} · Mobile: ${escape(data.patientMobile)}</div><div class="right"><span class="muted">Rx No.</span> ${escape(data.prescriptionId)}<br><span class="muted">Date & time</span> ${escape(data.date)}<br><span class="muted">Language</span> ${escape(data.prescriptionLanguage)}</div></section><section class="grid"><div><strong>Symptoms:</strong> ${escape(data.symptoms.join(', ') || 'Not recorded')}</div><div><strong>Diagnosis:</strong> ${escape(data.diagnosis)}</div></section>${clinicalDetailsPrint}<div class="rx">℞</div><table><thead><tr><th>Medicine / formulation</th><th>Frequency</th><th>Instructions</th><th>Duration</th><th>Quantity</th></tr></thead><tbody>${data.medicines.map((item, index) => `<tr><td><strong>${index + 1}. ${escape(item.name.toUpperCase())}</strong><br><span class="muted">${escape(item.type)}</span></td><td>${escape(item.dose)}</td><td>${escape(item.timing)}</td><td>${item.duration} days</td><td>${escape(estimateQuantity(item))}</td></tr>`).join('')}</tbody></table><p><strong>Advice:</strong> ${escape(data.advice || 'As discussed during consultation.')}</p><div class="signature"><strong>${escape(data.doctorName)}</strong><br><span class="muted">Signature / digital authentication</span><br>Reg. No: ${escape(data.doctorRegistration)}</div><div class="demo">Fictional demonstration prescription — not valid for dispensing</div><script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  };

  const openWhatsApp = () => {
    const clinic = getActiveClinic();
    const mobile = patient?.mobile.replace(/\D/g, '') || '';
    const number = mobile.length === 10 ? `91${mobile}` : mobile;
    const text = `Hello ${patient?.name || ''}, your prescription from ${clinic.name} is ready. Please attach the downloaded PDF to this WhatsApp conversation. This is fictional demonstration content.`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const updateVital = (field: keyof typeof vitals, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  // Conditional flags
  const isTempHigh = parseFloat(vitals.temp) >= 100;
  const isSpo2Low = parseInt(vitals.spo2) < 95;
  const rxPreview = prescriptionData();

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans">
      {/* TopAppBar */}
      <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-md py-xs h-touch-target sticky top-0 z-40">
        <div className="flex items-center gap-sm">
          <Link href={`/patient/${patientId}${queueEntryId ? `?queue=${queueEntryId}` : ''}`} aria-label="Go Back" className="h-touch-target w-touch-target flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-lg">{patient?.name ?? 'Patient not found'}</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant text-xs font-semibold">Consultation Entry</p>
          </div>
        </div>
        <div className="flex items-center gap-xs">
          <button className="h-touch-target w-touch-target flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-md max-w-3xl mx-auto space-y-lg mt-sm">

        {/* ============================================ */}
        {/* 1. PRESCRIPTION TEMPLATES (one-click)       */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <div className="flex items-center justify-between gap-md"><h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary">bolt</span>Quick Templates</h2><div className="relative w-64"><span className="material-symbols-outlined absolute left-2.5 top-2 text-[17px] text-on-surface-variant">search</span><input value={templateQuery} onChange={(event) => setTemplateQuery(event.target.value)} placeholder="Search templates" className="w-full h-9 pl-8 pr-sm text-xs bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:outline-none" /></div></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
            {visibleTemplates.map((template) => {
              const isActive = activeTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => requestTemplate(template)}
                  className={`relative p-sm rounded-lg border-2 transition-all text-left flex items-start gap-sm group ${
                    isActive
                      ? "border-primary bg-primary-container/30 shadow-md"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: template.color }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{template.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 pr-md"><p className="font-semibold text-on-surface text-[14px] leading-tight">{template.label}</p><span className={`text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-full font-bold ${template.isDefault === false ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant'}`}>{template.isDefault === false ? 'Custom' : 'Default'}</span></div>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">{template.medicines.length} medicines</p>
                  </div>
                </button>
              );
            })}
          </div>
          {visibleTemplates.length === 0 && <div className="border border-dashed border-outline-variant rounded-xl py-lg text-center"><span className="material-symbols-outlined text-on-surface-variant">search_off</span><p className="text-sm font-semibold mt-xs">No matching templates</p><p className="text-xs text-on-surface-variant">Try searching by preset name, diagnosis, or symptom.</p></div>}
          {!templateQuery.trim() && matchingTemplates.length > 6 && <button type="button" onClick={() => setShowAllTemplates((value) => !value)} className="text-xs font-bold text-primary flex items-center gap-1 mx-auto">{showAllTemplates ? 'Show fewer' : `Show all ${matchingTemplates.length} templates`}<span className="material-symbols-outlined text-[16px]">{showAllTemplates ? 'expand_less' : 'expand_more'}</span></button>}
        </section>

        {/* ============================================ */}
        {/* 3. SYMPTOMS SECTION (with custom entry)     */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">symptoms</span>
            Symptoms
          </h2>
          <div className="flex flex-wrap gap-xs">
            {availableSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`h-touch-target px-md rounded-full border transition-all text-[13px] font-semibold flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary-container text-on-primary-container border-primary shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                  {symptom}
                </button>
              );
            })}

            {showCustomSymptomInput ? (
              <div className="flex items-center gap-1">
                <input type="text" autoFocus value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomSymptom(); } }}
                  placeholder="Type symptom..."
                  className="h-touch-target px-sm border border-primary rounded-full text-[13px] w-36 focus:outline-none focus:ring-1 focus:ring-primary bg-transparent text-on-background" />
                <button onClick={handleAddCustomSymptom}
                  className="h-touch-target w-touch-target rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
                <button onClick={() => { setShowCustomSymptomInput(false); setCustomSymptom(""); }}
                  className="h-touch-target w-touch-target rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ) : (
              <button onClick={() => setShowCustomSymptomInput(true)}
                className="h-touch-target w-touch-target rounded-full bg-surface-container-lowest text-primary border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">add</span>
              </button>
            )}
          </div>
        </section>

        {/* ============================================ */}
        {/* 3. PATIENT VITALS                           */}
        {/* ============================================ */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">monitor_heart</span>
              Patient Vitals
            </h2>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs px-3 py-1 rounded-full font-semibold">Checked In</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-sm">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant font-medium">Temp (°F)</label>
              <input type="text" inputMode="decimal" value={vitals.temp}
                onChange={(e) => updateVital("temp", e.target.value)}
                onFocus={(e) => e.target.select()}
                className={`h-[44px] bg-transparent border rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg ${isTempHigh ? "border-error text-error" : "border-outline-variant text-on-background"}`} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant font-medium">BP (mmHg)</label>
              <input type="text" value={vitals.bp}
                onChange={(e) => updateVital("bp", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="h-[44px] bg-transparent border border-outline-variant rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg text-on-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant font-medium">Pulse (bpm)</label>
              <input type="text" inputMode="numeric" value={vitals.pulse}
                onChange={(e) => updateVital("pulse", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="h-[44px] bg-transparent border border-outline-variant rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg text-on-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant font-medium">SpO2 (%)</label>
              <input type="text" inputMode="numeric" value={vitals.spo2}
                onChange={(e) => updateVital("spo2", e.target.value)}
                onFocus={(e) => e.target.select()}
                className={`h-[44px] bg-transparent border rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg ${isSpo2Low ? "border-error text-error" : "border-outline-variant text-on-background"}`} />
            </div>
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
              <label className="text-[12px] text-on-surface-variant font-medium">Weight (kg)</label>
              <input type="text" inputMode="numeric" value={vitals.weight}
                onChange={(e) => updateVital("weight", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="h-[44px] bg-transparent border border-outline-variant rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg text-on-background" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-sm flex-wrap">
            <span className="text-[11px] text-on-surface-variant font-medium">Temp:</span>
            {["98.6", "99", "100", "101", "102", "103", "104"].map((t) => (
              <button key={t} type="button"
                onClick={() => updateVital("temp", t)}
                className={`h-[28px] px-2 rounded-full text-[12px] font-semibold border transition-all ${
                  vitals.temp === t
                    ? "bg-primary text-white border-primary"
                    : parseFloat(t) >= 100
                      ? "border-error/30 text-error bg-error/5 hover:bg-error/10"
                      : "border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low"
                }`}
              >
                {t}°
              </button>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 4. DIAGNOSIS FIELD + Template Suggestion     */}
        {/* ============================================ */}
        <section className="space-y-xs">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="diagnosis">
            <span className="material-symbols-outlined text-[20px] text-primary">diagnosis</span>
            Diagnosis
          </label>
          <input
            className="w-full h-touch-target bg-surface-container-lowest border border-outline-variant rounded-lg px-md text-[15px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline shadow-sm"
            id="diagnosis" placeholder="Enter clinical diagnosis" type="text"
            value={diagnosis} onChange={(e) => { setDiagnosis(e.target.value); setValidationError(""); }} />

          {/* Diagnosis → Template suggestion banner */}
          {diagnosisSuggestion && (
            <div className="flex items-center justify-between bg-primary-container/20 border border-primary/30 rounded-lg p-sm animate-[slideUp_0.2s_ease-out]">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">auto_fix_high</span>
                <p className="text-[14px] text-on-surface">
                  Use <strong>&ldquo;{diagnosisSuggestion.label}&rdquo;</strong> template?
                </p>
              </div>
              <button
                onClick={() => requestTemplate(diagnosisSuggestion)}
                className="px-md py-xs bg-primary text-white rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* 5. INVESTIGATIONS + RECOMMENDED TESTS       */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="investigations">
            <span className="material-symbols-outlined text-[20px] text-primary">clinical_notes</span>
            Investigations
          </label>
          <textarea
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline resize-none shadow-sm"
            id="investigations"
            placeholder="Doctor findings, examination notes, provisional observations..."
            rows={3}
            value={investigations}
            onChange={(e) => setInvestigations(e.target.value)}
          />

          <div className="space-y-xs">
            <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="recommended-tests">
              <span className="material-symbols-outlined text-[20px] text-primary">biotech</span>
              Recommended Tests
            </label>
            <select
              id="recommended-tests"
              value=""
              onChange={(e) => {
                if (e.target.value) toggleRecommendedTest(e.target.value);
              }}
              className="w-full h-touch-target bg-surface-container-lowest border border-outline-variant rounded-lg px-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
            >
              <option value="">Select tests to add</option>
              {RECOMMENDED_TEST_OPTIONS.map((test) => (
                <option key={test} value={test}>{recommendedTests.includes(test) ? `✓ ${test}` : test}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-xs min-h-[2.25rem] pt-xs">
              {recommendedTests.length === 0 ? (
                <p className="text-xs text-on-surface-variant">No tests recommended yet.</p>
              ) : recommendedTests.map((test) => (
                <button
                  key={test}
                  type="button"
                  onClick={() => toggleRecommendedTest(test)}
                  className="h-8 px-sm rounded-full border border-primary/40 bg-primary-container/20 text-primary text-xs font-bold flex items-center gap-1"
                  aria-label={`Remove ${test}`}
                >
                  {test}
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 6. PRESCRIPTION SECTION                     */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <div className="flex items-center justify-between"><h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">prescriptions</span>
            Prescription
            {medicines.length > 0 && (
              <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{medicines.length}</span>
            )}
          </h2><button type="button" onClick={previewPrescription} className="h-9 px-sm border border-primary text-primary rounded-lg text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>Preview · Print · WhatsApp</button></div>

          {/* Existing Medicines */}
          {medicines.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant border-dashed rounded-lg p-lg flex flex-col items-center justify-center text-center gap-sm shadow-sm">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">medication</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">No medicines added yet.</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant text-xs">Select a template above or add medicines manually below.</p>
            </div>
          ) : (
            <div className="space-y-xs">
              {medicines.map((med, index) => (
                <div key={index} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[16px]">medication</span>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-on-surface">{med.name}</h3>
                        <p className="text-[12px] text-on-surface-variant">{med.type}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveMedicine(index)}
                      className="text-error hover:bg-error-container p-1 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-sm border-t border-outline-variant pt-sm">
                    <div>
                      <p className="text-[11px] text-on-surface-variant">Frequency</p>
                      <p className="text-[14px] font-semibold text-on-surface">{med.dose}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-on-surface-variant">Timing</p>
                      <p className="text-[14px] font-semibold text-on-surface">{med.timing}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-on-surface-variant">Duration</p>
                      <p className="text-[14px] font-semibold text-on-surface">{med.duration} Days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Frequently Used — Quick Add Chips */}
          <div className="space-y-xs">
            <p className="text-[13px] text-on-surface-variant font-medium">Recent & Frequently Used — Tap to Add</p>
            <div className="flex flex-wrap gap-xs">
              {quickMedicines.map((med) => {
                const alreadyAdded = medicines.some((m) => m.name === med.name);
                return (
                  <button
                    key={med.name}
                    onClick={() => handleQuickAddMedicine(med)}
                    disabled={alreadyAdded}
                    className={`h-[34px] px-sm rounded-full border text-[12px] font-semibold flex items-center gap-1 transition-all ${
                      alreadyAdded
                        ? "border-outline-variant bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed line-through"
                        : "border-primary/40 bg-surface-container-lowest text-primary hover:bg-primary-container hover:text-on-primary-container hover:border-primary"
                    }`}
                  >
                    {alreadyAdded ? (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    )}
                    {med.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Medicine Form with Auto-suggest */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md shadow-sm">
            <h3 className="text-[14px] text-primary mb-sm flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Add Medicine Manually
            </h3>
            <div className="space-y-sm">
              {/* Medicine Name (with auto-suggest) + Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div className="relative" ref={suggestRef}>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Medicine Name</label>
                  <input
                    className="w-full h-[42px] bg-surface-container-lowest border border-outline-variant rounded-lg px-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-[14px]"
                    placeholder="Start typing... e.g. Para"
                    type="text"
                    value={newMedName}
                    onChange={(e) => handleMedNameChange(e.target.value)}
                    onFocus={() => { if (newMedName.trim().length >= 2) setShowSuggestions(true); }}
                    onKeyDown={(e) => {
                      if (showSuggestions && suggestions.length > 0 && e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex((index) => Math.min(index + 1, suggestions.length - 1)); }
                      else if (showSuggestions && suggestions.length > 0 && e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex((index) => Math.max(index - 1, 0)); }
                      else if (showSuggestions && suggestions.length > 0 && e.key === 'Enter') { e.preventDefault(); handleSelectSuggestion(suggestions[Math.max(0, activeSuggestionIndex)]); }
                      else if (e.key === 'Escape') { setShowSuggestions(false); }
                      else if (e.key === 'Enter') { e.preventDefault(); handleAddMedicine(); }
                    }}
                  />
                  {/* Auto-suggest Dropdown */}
                  {showSuggestions && newMedName.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.length > 0 ? suggestions.slice(0, 8).map((med, i) => (
                        <button
                          key={`${med.name}-${i}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(med)}
                          className={`w-full text-left px-sm py-2 flex items-center justify-between transition-colors text-sm border-b border-outline-variant/50 last:border-0 ${activeSuggestionIndex === i ? 'bg-primary-container/30' : 'hover:bg-primary-container/20'}`}
                        >
                          <span><span className="font-body-md font-semibold text-on-surface">{med.name}</span><span className="block text-[10px] text-on-surface-variant">{med.genericName || med.name}{med.brandName ? ` · ${med.brandName}` : ''}{med.strength ? ` · ${med.strength}` : ''}</span></span>
                          <span className="font-label-sm text-on-surface-variant text-xs bg-surface-container-high px-1.5 py-0.5 rounded">{med.type}{med.category ? ` · ${med.category}` : ''}</span>
                        </button>
                      )) : <div className="p-sm text-center"><p className="text-xs font-bold">No medicine found</p><p className="text-[10px] text-on-surface-variant mt-0.5">You can enter it manually or add it to the clinic catalog.</p><Link href="/settings/medicines" className="inline-block mt-2 text-xs font-bold text-primary">Open Medicine Catalog</Link></div>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Type</label>
                  <select className="w-full h-[42px] bg-surface-container-lowest border border-outline-variant rounded-lg px-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface text-[14px]"
                    value={newMedType} onChange={(e) => setNewMedType(e.target.value)}>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Drops">Drops</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              {/* Frequency + Timing + Duration Row */}
              <div className="grid grid-cols-3 gap-sm">
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Frequency</label>
                  <select className="w-full h-[42px] bg-surface-container-lowest border border-outline-variant rounded-lg px-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface text-[14px]"
                    value={newMedDose} onChange={(e) => setNewMedDose(e.target.value)}>
                    <option value="1-0-0">1-0-0</option>
                    <option value="0-1-0">0-1-0</option>
                    <option value="0-0-1">0-0-1</option>
                    <option value="1-0-1">1-0-1</option>
                    <option value="0-1-1">0-1-1</option>
                    <option value="1-1-0">1-1-0</option>
                    <option value="1-1-1">1-1-1</option>
                    <option value="1-1-1-1">1-1-1-1 (QID)</option>
                    <option value="SOS">SOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Timing</label>
                  <select className="w-full h-[42px] bg-surface-container-lowest border border-outline-variant rounded-lg px-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface text-[14px]"
                    value={newMedTiming} onChange={(e) => setNewMedTiming(e.target.value)}>
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                    <option value="With Food">With Food</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="At Bedtime">At Bedtime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Duration</label>
                  <div className="flex items-center gap-2">
                    <input className="w-16 h-[42px] bg-surface-container-lowest border border-outline-variant rounded-lg px-sm text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-[14px]"
                      type="number" min={1} value={newMedDuration} onChange={(e) => setNewMedDuration(parseInt(e.target.value) || 0)} />
                    <span className="text-[13px] text-on-surface-variant">Days</span>
                  </div>
                </div>
              </div>

              <button onClick={handleAddMedicine}
                className="w-full h-[42px] mt-sm bg-transparent border border-primary text-primary rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-[13px] font-semibold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                Add to Prescription
              </button>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 7. PRESCRIPTION LANGUAGE                    */}
        {/* ============================================ */}
        <section className="space-y-xs">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="prescription-language">
            <span className="material-symbols-outlined text-[20px] text-primary">translate</span>
            Prescription Language
          </label>
          <select
            id="prescription-language"
            value={prescriptionLanguage}
            onChange={(e) => setPrescriptionLanguage(e.target.value)}
            className="w-full h-touch-target bg-surface-container-lowest border border-outline-variant rounded-lg px-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
          >
            {PRESCRIPTION_LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </section>

        {/* ============================================ */}
        {/* 8. ADVICE (patient-facing instructions)     */}
        {/* ============================================ */}
        <section className="space-y-xs">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="advice">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            Advice / Instructions for Patient
          </label>
          <textarea
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline resize-none shadow-sm"
            id="advice" placeholder="e.g. Drink warm water, avoid cold food, light diet..."
            rows={2} value={advice} onChange={(e) => setAdvice(e.target.value)}></textarea>
        </section>

        {/* ============================================ */}
        {/* 7. DOCTOR NOTES (private/internal)          */}
        {/* ============================================ */}
        <section className="space-y-xs">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="notes">
            <span className="material-symbols-outlined text-[20px] text-secondary">lock</span>
            Doctor Notes (Internal — Not Printed)
          </label>
          <textarea
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline resize-none shadow-sm"
            id="notes" placeholder="Private observations, differential diagnosis notes..."
            rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
        </section>

        {/* ============================================ */}
        {/* 8. FOLLOW-UP DATE                           */}
        {/* ============================================ */}
        <section className="space-y-xs">
          <label className="block text-[15px] text-on-surface font-semibold flex items-center gap-2" htmlFor="followup">
            <span className="material-symbols-outlined text-[20px] text-primary">event</span>
            Next Follow-up (Optional)
          </label>
          <input
            className="w-full h-touch-target bg-surface-container-lowest border border-outline-variant rounded-lg px-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
            id="followup" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
        </section>

        {/* ============================================ */}
        {/* 9. PRIMARY ACTION — SAVE VISIT              */}
        {/* ============================================ */}
        <section className="pt-lg">
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm">Fictional demonstration data only. This is not clinical guidance.</div>
          {validationError && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{validationError}</div>}
          <div className="grid grid-cols-[1fr_auto] gap-3">
          <button onClick={handleSaveVisit}
            className="w-full h-touch-target bg-primary text-white font-headline-md text-headline-md rounded-lg shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 font-bold">
            <span className="material-symbols-outlined">save</span>
            Save Visit
          </button>
          <button onClick={previewPrescription} className="h-touch-target border border-primary text-primary rounded-lg px-6 font-semibold print:hidden">Preview / Share Rx</button>
          </div>
        </section>
      </main>

      {showPrescriptionActions && <PrescriptionActionsDialog data={rxPreview} visitSaved={visitSaved} onClose={() => setShowPrescriptionActions(false)} onDownload={downloadPrescription} onPrint={printPrescription} onWhatsApp={openWhatsApp} onDone={() => router.push(`/patient/${patientId}?saved=1`)} />}

      {pendingTemplate && <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-md"><div role="dialog" aria-modal="true" aria-labelledby="replace-template-title" className="bg-surface rounded-2xl p-lg max-w-[28rem] w-full shadow-xl"><div className="w-11 h-11 rounded-full bg-primary-container text-primary grid place-items-center mb-md"><span className="material-symbols-outlined">difference</span></div><h2 id="replace-template-title" className="text-lg font-extrabold">Replace current prescription?</h2><p className="text-sm text-on-surface-variant mt-xs">Applying <strong className="text-on-surface">{pendingTemplate.label}</strong> will replace the current symptoms, diagnosis, medicines, and patient advice.</p><div className="flex justify-end gap-sm mt-lg"><button type="button" onClick={() => setPendingTemplate(null)} className="h-10 px-md rounded-lg border border-outline-variant text-xs font-bold">Keep Current</button><button type="button" onClick={() => applyTemplate(pendingTemplate)} className="h-10 px-md rounded-lg bg-primary text-white text-xs font-bold">Replace and Apply</button></div></div></div>}

      {/* ============================================ */}
      {/* TOAST NOTIFICATION                           */}
      {/* ============================================ */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded-full shadow-lg flex items-center gap-sm font-label-md text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{toastIcon}</span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}

type RxPreviewData = {
  clinicName: string; clinicAddress: string; clinicPhone: string;
  doctorName: string; doctorQualification: string; doctorRegistration: string;
  patientName: string; patientDetails: string; patientMobile: string; patientId: string;
  prescriptionId: string; date: string; diagnosis: string; symptoms: string[];
  investigations: string; recommendedTests: string[];
  prescriptionLanguage: string;
  medicines: Medicine[]; advice: string;
};

function PrescriptionActionsDialog({ data, visitSaved, onClose, onDownload, onPrint, onWhatsApp, onDone }: { data: RxPreviewData; visitSaved: boolean; onClose: () => void; onDownload: () => void; onPrint: () => void; onWhatsApp: () => void; onDone: () => void }) {
  return <div className="fixed inset-0 z-50 bg-black/55 grid place-items-center p-md">
    <div role="dialog" aria-modal="true" aria-labelledby="rx-actions-title" className="bg-surface rounded-2xl max-w-[62rem] w-full max-h-[94vh] overflow-y-auto shadow-2xl">
      <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10"><div><h2 id="rx-actions-title" className="text-lg font-extrabold">Prescription preview</h2><p className="text-xs text-on-surface-variant">Compliance-oriented Indian Rx layout · fictional demo only</p></div><button onClick={onClose} aria-label="Close prescription preview" className="p-1"><span className="material-symbols-outlined">close</span></button></div>
      <div className="p-lg grid grid-cols-[minmax(0,1fr)_240px] gap-lg">
        <article className="border border-slate-300 rounded-sm p-xl bg-white text-slate-900 shadow-sm min-h-[720px]">
          <header className="grid grid-cols-[1fr_auto] gap-md border-b-2 border-blue-900 pb-md"><div><h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight">{data.clinicName}</h3><p className="text-xs text-slate-600 mt-1 max-w-lg">{data.clinicAddress}</p><p className="text-xs text-slate-600">Tel: {data.clinicPhone}</p></div><div className="text-right"><p className="font-extrabold">{data.doctorName}</p><p className="text-xs text-slate-600">{data.doctorQualification}</p><p className="text-xs font-bold text-blue-900 mt-1">Reg. No: {data.doctorRegistration}</p></div></header>
          <section className="grid grid-cols-2 gap-x-lg gap-y-xs py-md border-b border-slate-300 text-xs"><p><span className="text-slate-500">Rx No.</span><br/><strong>{data.prescriptionId}</strong></p><p className="text-right"><span className="text-slate-500">Date & time</span><br/><strong>{data.date}</strong></p><p><span className="text-slate-500">Patient</span><br/><strong className="text-sm">{data.patientName}</strong> · {data.patientDetails}</p><p className="text-right"><span className="text-slate-500">Patient ID / Mobile</span><br/><strong>{data.patientId}</strong> · {data.patientMobile}<br/><span className="text-slate-500">Language</span> · {data.prescriptionLanguage}</p></section>
          <section className="py-md text-xs border-b border-slate-200"><div className="grid grid-cols-2 gap-md"><p><strong>Symptoms:</strong> {data.symptoms.join(', ') || 'Not recorded'}</p><p><strong>Diagnosis:</strong> {data.diagnosis}</p><p><strong>Investigations:</strong> {data.investigations || 'Not recorded'}</p><p><strong>Recommended tests:</strong> {data.recommendedTests.join(', ') || 'Not recommended'}</p></div></section>
          <section className="py-md"><h4 className="text-3xl font-serif italic font-bold text-blue-900">℞</h4><table className="w-full mt-sm text-xs border-collapse"><thead><tr className="text-left border-b border-slate-300 text-slate-500"><th className="py-2">Medicine / formulation</th><th>Frequency</th><th>Instructions</th><th>Duration</th><th>Quantity</th></tr></thead><tbody>{data.medicines.map((item, index) => <tr key={`${item.name}-legal-rx-${index}`} className="border-b border-slate-200 align-top"><td className="py-3 pr-2"><strong className="uppercase">{index + 1}. {item.name}</strong><br/><span className="text-slate-500">{item.type}</span></td><td className="py-3 pr-2 font-semibold">{item.dose}</td><td className="py-3 pr-2">{item.timing}</td><td className="py-3 pr-2">{item.duration} days</td><td className="py-3">{estimateQuantity(item)}</td></tr>)}</tbody></table></section>
          <section className="mt-md text-xs"><p><strong>Advice:</strong> {data.advice || 'As discussed during consultation.'}</p></section>
          <footer className="mt-xl grid grid-cols-[1fr_220px] gap-lg items-end"><div className="text-[10px] text-slate-500"><p>Use medicines only as directed. Seek medical attention for worsening symptoms or adverse reactions.</p><p className="mt-1">This electronic preview must be signed/authenticated by the registered medical practitioner before it is valid for dispensing.</p></div><div className="text-center border-t border-slate-500 pt-2"><p className="font-bold text-xs">{data.doctorName}</p><p className="text-[10px]">Signature / digital authentication</p><p className="text-[10px] font-semibold">Reg. No: {data.doctorRegistration}</p></div></footer>
          <div className="mt-lg border-2 border-amber-400 bg-amber-50 text-amber-900 rounded p-2 text-[10px] font-bold text-center uppercase tracking-wide">Fictional demonstration prescription — not valid for dispensing</div>
        </article>
        <aside className="space-y-sm sticky top-20 self-start"><button onClick={onDownload} className="w-full h-11 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-xs"><span className="material-symbols-outlined text-[19px]">download</span>Download PDF</button><button onClick={onPrint} className="w-full h-11 border border-primary text-primary rounded-lg font-bold text-sm flex items-center justify-center gap-xs"><span className="material-symbols-outlined text-[19px]">print</span>Print Rx</button><button onClick={onWhatsApp} className="w-full h-11 bg-[#128C7E] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-xs"><span className="material-symbols-outlined text-[19px]">chat</span>Open WhatsApp</button><div className="bg-surface-container-low rounded-lg p-sm text-[11px] text-on-surface-variant"><strong className="text-on-surface">Before real-world use</strong><ul className="list-disc pl-4 mt-1 space-y-1"><li>Configure a valid doctor registration number.</li><li>Capture patient address where legally required.</li><li>Use generic drug names and verify quantities.</li><li>Add a compliant signature or digital-signature workflow.</li><li>Obtain India-specific legal and clinical review.</li></ul></div><div className="bg-surface-container-low rounded-lg p-sm text-[11px] text-on-surface-variant"><strong className="text-on-surface">WhatsApp without API</strong><p className="mt-1">Download the PDF, open WhatsApp, then attach it manually. Confirm patient consent and the recipient before sending.</p></div>{visitSaved && <button onClick={onDone} className="w-full h-10 text-primary font-bold text-xs">Done — View Patient History</button>}</aside>
      </div>
    </div>
  </div>;
}
