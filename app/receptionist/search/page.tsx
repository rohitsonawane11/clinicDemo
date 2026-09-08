'use client';

import { useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  mobile: string;
  registered: boolean;
  lastVisit?: string;
  lastComplaint?: string;
}

export default function PatientSearch() {
  // Stateful mock database of patients
  const [patients, setPatients] = useState<Record<string, Patient>>({
    "9876543210": {
      id: "1",
      name: "Rajesh Patil",
      age: "42",
      gender: "Male",
      mobile: "9876543210",
      registered: true,
      lastVisit: "12 Aug 2026",
      lastComplaint: "Fever + body ache"
    }
  });

  const [mobileNumber, setMobileNumber] = useState("");
  const [searchResults, setSearchResults] = useState<Patient | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  // Form states for new patient registration
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState("Male");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(val);

    if (val.length === 10) {
      // Auto search on 10th digit
      const foundPatient = patients[val];
      if (foundPatient) {
        setSearchResults(foundPatient);
        setShowRegistration(false);
      } else {
        setSearchResults(null);
        setShowRegistration(true);
      }
    } else {
      // Reset search output when less than 10 digits
      setSearchResults(null);
      setShowRegistration(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regAge.trim()) {
      alert("Please fill out Name and Age.");
      return;
    }

    const newPatientId = String(Object.keys(patients).length + 1);
    const newPatient: Patient = {
      id: newPatientId,
      name: regName,
      age: regAge,
      gender: regGender,
      mobile: mobileNumber,
      registered: true,
      lastVisit: "29 Aug 2026 (Today)",
      lastComplaint: "First consultation registration"
    };

    // Add to the stateful list of patients
    setPatients((prev) => ({
      ...prev,
      [mobileNumber]: newPatient
    }));

    // Instantly display the newly registered patient card
    setSearchResults(newPatient);
    setShowRegistration(false);

    // Clear registration form states
    setRegName("");
    setRegAge("");
    setRegGender("Male");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[#F4F7F9] text-on-background min-h-screen pb-touch-target md:pb-0 font-sans">
      {/* TopAppBar Mobile */}
      <header className="bg-surface docked full-width top-0 border-b border-outline-variant flat no shadows transition-colors duration-200 z-40 sticky top-0 md:hidden">
        <div className="flex justify-between items-center w-full px-md py-xs h-touch-target">
          <Link href="/" className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
              AM
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md-mobile text-primary font-bold">Mehta Family Clinic</h1>
              <p className="font-label-md text-label-md text-on-surface-variant">Dr. Aniket Mehta</p>
            </div>
          </Link>
          <Link href="/doctor" className="font-label-md text-label-md text-primary bg-transparent border border-primary px-sm py-xs rounded hover:bg-surface-container-low transition-colors h-touch-target flex items-center justify-center">
            Doctor
          </Link>
        </div>
      </header>

      {/* Web TopAppBar (Hidden on mobile) */}
      <header className="hidden md:flex bg-surface docked full-width top-0 border-b border-outline-variant flat no shadows transition-colors duration-200 z-40 sticky top-0">
        <div className="flex justify-between items-center w-full px-lg py-sm">
          <Link href="/" className="flex items-center gap-md hover:opacity-90">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-headline-md">
              AM
            </div>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">Mehta Family Clinic</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Dr. Aniket Mehta</p>
            </div>
          </Link>
          <nav className="flex gap-lg h-full items-center">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-base h-touch-target" href="/receptionist">Home</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-base h-touch-target" href="/doctor/queue">Queue</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-base h-touch-target" href="/patient/1">Patients</Link>
            <Link className="font-label-md text-label-md text-primary font-bold hover:text-primary transition-colors flex items-center gap-base h-touch-target border-b-2 border-primary" href="/receptionist/search">Search</Link>
          </nav>
          <Link href="/doctor" className="font-label-md text-label-md text-primary bg-transparent border border-primary px-md py-sm rounded hover:bg-surface-container-low transition-colors h-touch-target flex items-center justify-center">
            Doctor Profile
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-md md:p-lg pt-lg">
        <div className="mb-lg">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs font-bold">Patient Search</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Find patients by mobile number to view details or add to queue.</p>
        </div>

        {/* Search Input Area */}
        <div className="bg-surface rounded-lg border border-[#E1E4E8] p-md mb-lg">
          <div className="flex flex-col md:flex-row gap-sm items-end">
            <div className="w-full">
              <label className="font-label-md text-label-md text-on-surface-variant block mb-xs" htmlFor="mobileSearch">Enter 10-digit mobile number</label>
              <div className="relative flex items-center h-touch-target">
                <span aria-hidden="true" className="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>
                <input 
                  className="w-full h-full pl-10 pr-4 rounded bg-transparent border border-outline focus:border-primary focus:border-2 font-body-lg text-body-lg text-on-background outline-none transition-all placeholder-on-surface-variant" 
                  id="mobileSearch" 
                  placeholder="e.g. 9876543210" 
                  type="tel" 
                  value={mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                />
              </div>
            </div>
          </div>
          {mobileNumber.length > 0 && mobileNumber.length < 10 && (
            <p className="text-xs text-on-surface-variant mt-xs ml-1">
              Please enter {10 - mobileNumber.length} more digit{10 - mobileNumber.length > 1 ? "s" : ""}.
            </p>
          )}
        </div>

        {/* Search Result Area: Registered Patient Card */}
        {searchResults && (
          <div className="bg-surface rounded-lg border border-[#E1E4E8] overflow-hidden shadow-sm transition-all">
            <div className="p-md border-b border-[#E1E4E8] flex justify-between items-start">
              <div className="flex items-center gap-sm">
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold border border-[#E1E4E8]">
                  {getInitials(searchResults.name)}
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md-mobile text-on-background font-semibold">{searchResults.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{searchResults.age} yrs · {searchResults.gender} · +91 {searchResults.mobile}</p>
                </div>
              </div>
              <span className="bg-tertiary-container text-on-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Registered
              </span>
            </div>
            <div className="p-md bg-surface-container-low grid grid-cols-1 md:grid-cols-2 gap-sm">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Last Visit</p>
                <p className="font-body-md text-body-md text-on-background flex items-center gap-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                  {searchResults.lastVisit || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Last Complaint / Notes</p>
                <p className="font-body-md text-body-md text-on-background flex items-center gap-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-error">sick</span>
                  {searchResults.lastComplaint || "N/A"}
                </p>
              </div>
            </div>
            <div className="p-md flex flex-col sm:flex-row gap-sm border-t border-[#E1E4E8]">
              <Link href="/doctor/queue" className="flex-grow flex-1 h-touch-target bg-[#0052CC] text-white font-label-md text-label-md rounded flex items-center justify-center gap-xs hover:bg-[#003d9b] transition-colors">
                <span aria-hidden="true" className="material-symbols-outlined">queue</span>
                Add to Queue
              </Link>
              <Link href={`/patient/${searchResults.id}`} className="flex-grow flex-1 h-touch-target bg-transparent border border-[#0052CC] text-[#0052CC] font-label-md text-label-md rounded flex items-center justify-center gap-xs hover:bg-surface-container-low transition-colors">
                <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                View Patient Profile
              </Link>
            </div>
          </div>
        )}

        {/* Search Result Area: Add Patient Registration Form */}
        {showRegistration && (
          <div className="bg-surface rounded-lg border border-[#E1E4E8] overflow-hidden shadow-sm transition-all">
            <div className="p-md border-b border-[#E1E4E8] bg-surface-container-low">
              <h3 className="font-headline-md text-headline-md-mobile text-on-background font-bold flex items-center gap-xs text-lg">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Patient Not Found — Register New Patient
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Please enter patient details to register them in the system.</p>
            </div>
            
            <form onSubmit={handleRegister} className="p-md space-y-md">
              {/* Mobile Field (prepopulated, disabled) */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base text-xs font-semibold uppercase tracking-wider">Mobile Number</label>
                <div className="relative flex items-center h-touch-target bg-surface-container-low rounded border border-outline-variant px-md">
                  <span className="font-body-md text-on-surface-variant mr-1">+91</span>
                  <input 
                    className="w-full bg-transparent font-body-md text-on-surface-variant outline-none" 
                    type="text" 
                    value={mobileNumber} 
                    disabled 
                  />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base text-xs font-semibold uppercase tracking-wider" htmlFor="regName">Full Name</label>
                <input 
                  className="w-full h-touch-target bg-transparent border border-outline focus:border-primary focus:border-2 rounded px-md font-body-md text-on-background outline-none transition-all placeholder:text-outline"
                  id="regName"
                  placeholder="e.g. Meera Patel"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              {/* Age & Gender Grid */}
              <div className="grid grid-cols-2 gap-md">
                {/* Age Field */}
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base text-xs font-semibold uppercase tracking-wider" htmlFor="regAge">Age (in years)</label>
                  <input 
                    className="w-full h-touch-target bg-transparent border border-outline focus:border-primary focus:border-2 rounded px-md font-body-md text-on-background outline-none transition-all placeholder:text-outline"
                    id="regAge"
                    placeholder="e.g. 29"
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    required
                  />
                </div>

                {/* Gender Field */}
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base text-xs font-semibold uppercase tracking-wider" htmlFor="regGender">Gender</label>
                  <select 
                    className="w-full h-touch-target bg-transparent border border-outline focus:border-primary focus:border-2 rounded px-md font-body-md text-on-background outline-none transition-all"
                    id="regGender"
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-sm">
                <button type="submit" className="w-full h-touch-target bg-[#0052CC] text-white font-label-md text-label-md rounded flex items-center justify-center gap-xs hover:bg-[#003d9b] transition-colors font-bold shadow-sm">
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-md pb-xs pt-xs bg-surface border-t border-outline-variant shadow-lg">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary transition-colors h-touch-target" href="/receptionist">
          <span aria-hidden="true" className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-xs mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary transition-colors h-touch-target" href="/doctor/queue">
          <span aria-hidden="true" className="material-symbols-outlined">reorder</span>
          <span className="font-label-sm text-xs mt-1">Queue</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary transition-colors h-touch-target" href="/patient/1">
          <span aria-hidden="true" className="material-symbols-outlined">group</span>
          <span className="font-label-sm text-xs mt-1">Patients</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-md py-1 transition-transform scale-95 h-touch-target" href="/receptionist/search">
          <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          <span className="font-label-sm text-xs mt-1 font-bold">Search</span>
        </Link>
      </nav>
    </div>
  );
}
