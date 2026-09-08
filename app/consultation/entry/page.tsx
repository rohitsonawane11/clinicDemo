'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// =============================================
// DATA: Medicine Database for Auto-suggest
// =============================================
const MEDICINE_DATABASE = [
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

interface PrescriptionTemplate {
  id: string;
  label: string;
  icon: string;
  color: string;
  diagnosis: string;
  symptoms: string[];
  advice: string;
  medicines: TemplateMedicine[];
}

const PRESCRIPTION_TEMPLATES: PrescriptionTemplate[] = [
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

export default function ConsultationEntry() {
  const router = useRouter();

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
  const suggestRef = useRef<HTMLDivElement>(null);

  // === Template State ===
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  // === Advice (patient-facing) ===
  const [advice, setAdvice] = useState("");

  // === Private Notes ===
  const [notes, setNotes] = useState("");

  // === Follow-up Date ===
  const [followUpDate, setFollowUpDate] = useState("");

  // === Toast State ===
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("check_circle");

  // Auto-hide toast after 3 seconds
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
      setDiagnosisSuggestion(null);
      return;
    }
    const lower = diagnosis.toLowerCase();
    const match = PRESCRIPTION_TEMPLATES.find((t) =>
      t.diagnosis.toLowerCase().includes(lower) || t.label.toLowerCase().includes(lower)
    );
    // Only suggest if a template isn't already active
    if (match && match.id !== activeTemplate) {
      setDiagnosisSuggestion(match);
    } else {
      setDiagnosisSuggestion(null);
    }
  }, [diagnosis, activeTemplate]);

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
      const filtered = MEDICINE_DATABASE.filter((m) =>
        m.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (med: { name: string; type: string }) => {
    setNewMedName(med.name);
    setNewMedType(med.type);
    setShowSuggestions(false);
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;

    const newMed: Medicine = {
      name: newMedName,
      type: newMedType,
      dose: newMedDose,
      timing: newMedTiming,
      duration: newMedDuration,
    };

    setMedicines([...medicines, newMed]);
    setNewMedName("");
    setNewMedType("Tablet");
    setNewMedDose("1-0-1");
    setNewMedTiming("After Food");
    setNewMedDuration(5);

    showToastMsg(`${newMed.name} added`, "add_circle");
  };

  const handleQuickAddMedicine = (med: TemplateMedicine) => {
    // Don't add if already in the list
    if (medicines.some((m) => m.name === med.name)) {
      showToastMsg(`${med.name} already in prescription`, "info");
      return;
    }
    setMedicines([...medicines, { ...med }]);
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

    // Merge template symptoms with selected
    const merged = new Set([...selectedSymptoms, ...template.symptoms]);
    // Also add any template symptoms not in available list
    const newAvailable = [...availableSymptoms];
    template.symptoms.forEach((s) => {
      if (!newAvailable.includes(s)) newAvailable.push(s);
    });
    setAvailableSymptoms(newAvailable);
    setSelectedSymptoms(Array.from(merged));

    showToastMsg(`"${template.label}" template applied`, "auto_fix_high");
  };

  const showToastMsg = (msg: string, icon = "check_circle") => {
    setToastMessage(msg);
    setToastIcon(icon);
    setShowToast(true);
  };

  const handleSaveVisit = () => {
    showToastMsg("Visit saved successfully! Redirecting...", "check_circle");
    setTimeout(() => {
      router.push("/doctor/queue");
    }, 1500);
  };

  const updateVital = (field: keyof typeof vitals, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  // Conditional flags
  const isTempHigh = parseFloat(vitals.temp) >= 100;
  const isSpo2Low = parseInt(vitals.spo2) < 95;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans">
      {/* TopAppBar */}
      <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-md py-xs h-touch-target sticky top-0 z-40">
        <div className="flex items-center gap-sm">
          <Link href="/patient/1" aria-label="Go Back" className="h-touch-target w-touch-target flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-lg">Rajesh Patil</h1>
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
        {/* 1. EDITABLE VITALS CARD                     */}
        {/* ============================================ */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">monitor_heart</span>
              Patient Vitals
            </h2>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs px-3 py-1 rounded-full font-semibold">Checked In</span>
          </div>
          <div className="grid grid-cols-5 gap-sm">
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
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant font-medium">Weight (kg)</label>
              <input type="text" inputMode="numeric" value={vitals.weight}
                onChange={(e) => updateVital("weight", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="h-[44px] bg-transparent border border-outline-variant rounded-lg font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg text-on-background" />
            </div>
          </div>
          {/* Temperature Quick Presets */}
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
        {/* 2. PRESCRIPTION TEMPLATES (⚡ one-click)    */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
            Quick Templates
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
            {PRESCRIPTION_TEMPLATES.map((template) => {
              const isActive = activeTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
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
                    <p className="font-semibold text-on-surface text-[14px] leading-tight">{template.label}</p>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">{template.medicines.length} medicines</p>
                  </div>
                </button>
              );
            })}
          </div>
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
            value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

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
                onClick={() => applyTemplate(diagnosisSuggestion)}
                className="px-md py-xs bg-primary text-white rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* 5. PRESCRIPTION SECTION                     */}
        {/* ============================================ */}
        <section className="space-y-sm">
          <h2 className="text-[15px] text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">prescriptions</span>
            Prescription
            {medicines.length > 0 && (
              <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{medicines.length}</span>
            )}
          </h2>

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
                      <p className="text-[11px] text-on-surface-variant">Dose</p>
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
            <p className="text-[13px] text-on-surface-variant font-medium">Frequently Used — Tap to Add</p>
            <div className="flex flex-wrap gap-xs">
              {FREQUENT_MEDICINES.map((med) => {
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
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddMedicine(); } }}
                  />
                  {/* Auto-suggest Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.slice(0, 8).map((med, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectSuggestion(med)}
                          className="w-full text-left px-sm py-2 hover:bg-primary-container/20 flex items-center justify-between transition-colors text-sm border-b border-outline-variant/50 last:border-0"
                        >
                          <span className="font-body-md text-on-surface">{med.name}</span>
                          <span className="font-label-sm text-on-surface-variant text-xs bg-surface-container-high px-1.5 py-0.5 rounded">{med.type}</span>
                        </button>
                      ))}
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

              {/* Dose + Timing + Duration Row */}
              <div className="grid grid-cols-3 gap-sm">
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Dose</label>
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
        {/* 6. ADVICE (patient-facing instructions)     */}
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
          <button onClick={handleSaveVisit}
            className="w-full h-touch-target bg-primary text-white font-headline-md text-headline-md rounded-lg shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 font-bold">
            <span className="material-symbols-outlined">save</span>
            Save Visit
          </button>
        </section>
      </main>

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
