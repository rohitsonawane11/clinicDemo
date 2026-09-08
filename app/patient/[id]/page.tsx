import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientProfile({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Simulate patient details (based on ID, default is Rajesh Patil)
  const patientName = id === "2" ? "Sneha Joshi" : id === "3" ? "Amit Shah" : "Rajesh Patil";
  const patientInitials = id === "2" ? "SJ" : id === "3" ? "AS" : "RP";
  const patientAge = id === "2" ? "29 yrs" : id === "3" ? "35 yrs" : "42 yrs";
  const patientGender = id === "2" ? "Female" : id === "3" ? "Male" : "Male";
  const patientMobile = id === "2" ? "+91 99887 76655" : id === "3" ? "+91 91234 56789" : "+91 98765 43210";
  const patientComplaint = id === "2" ? "Headache" : id === "3" ? "Cough" : "Fever + body ache";
  const patientDiagnosis = id === "2" ? "Migraine" : id === "3" ? "Bronchitis" : "Viral fever";
  const patientPrescription = id === "2" ? ["Sumatriptan 50mg", "Naproxen 500mg"] : id === "3" ? ["Dextromethorphan Syrup", "Amoxicillin 500mg"] : ["Paracetamol 500mg", "Azithromycin 500mg"];
  const patientNotes = id === "2" ? "Avoid bright light, stay hydrated." : id === "3" ? "Avoid cold drinks, steam inhalation twice daily." : "Rest and fluids.";

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container font-sans">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-md py-xs h-touch-target sticky top-0 z-40">
        <div className="flex items-center gap-xs">
          <Link href="/doctor/queue" aria-label="Go Back" className="w-touch-target h-touch-target flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-xs">
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0 relative">
              <img 
                alt="Dr. Aniket Mehta" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsCLY6fCHihUAcjULBEycqCuYoEK-TVBxrW9JA1mrHZbVYWiR1gcd4etJ4-aqOLB7k5z7-hdFPVDSUb-54lOtNMKK5f3pD7-60yoyH5o8B-q4PotGNYVukK0f3nqNFt45dENVotJ0SyRPb5RUb8VX94cIKfTs8cJbaTUfj9fQBKmmRziP7JYIXimlaEEihoZUSci7-4A6QiU4cxQk95iaDqno7iXewLFGmyq-4ODjxuEBGNy1IKGgpzQ"
              />
            </div>
            <Link href="/" className="hover:opacity-90">
              <h1 className="font-headline-md text-headline-md-mobile text-primary font-bold text-lg">Bharat Clinic</h1>
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <Link href="/doctor" className="px-sm py-1 border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 flex items-center gap-base text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">stethoscope</span>
            Doctor View
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow p-md md:p-lg pb-[100px] md:pb-lg md:pt-md md:px-lg max-w-4xl mx-auto w-full flex flex-col gap-lg mt-md">
        {/* Patient Header Card */}
        <section className="bg-surface-container-lowest mx-md md:mx-0 mt-md md:mt-0 p-md rounded-lg border border-outline-variant shadow-sm flex flex-col md:flex-row gap-md justify-between items-start">
          <div className="flex gap-md w-full">
            <div className="w-16 h-16 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container font-headline-lg font-bold text-2xl border border-outline-variant">
              {patientInitials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background font-bold text-xl">{patientName}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-base">{patientAge} · {patientGender}</p>
                </div>
                <div className="bg-tertiary-fixed-dim/20 border border-tertiary text-tertiary px-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-base flex-shrink-0 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  In Consultation
                </div>
              </div>
              <div className="mt-sm flex flex-wrap gap-xs">
                <div className="flex items-center gap-base text-on-surface-variant font-body-md text-body-md text-sm">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  {patientMobile}
                </div>
              </div>
              {/* Allergies Badge */}
              <div className="mt-sm bg-surface-variant/50 border border-outline-variant rounded-md px-sm py-xs flex items-start gap-sm w-fit">
                <span className="material-symbols-outlined text-[16px] text-secondary mt-[2px]">info</span>
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase block text-[10px] font-bold tracking-wider">Allergies</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-xs">No known allergies</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Layout for Medical Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md px-md md:px-0">
          
          {/* Last Visit Section */}
          <section className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-sm border-b border-outline-variant/50 pb-xs">
              <h3 className="font-headline-md text-headline-md-mobile text-on-background flex items-center gap-xs font-bold text-base">
                <span className="material-symbols-outlined text-primary">history</span>
                Last Visit
              </h3>
              <div className="text-right">
                <span className="font-label-md text-label-md text-on-surface-variant block text-xs font-semibold">12 Aug 2026</span>
                <span className="font-label-sm text-label-sm text-secondary text-[10px] uppercase font-bold">17 days ago</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-md">
              {/* Complaint & Diagnosis */}
              <div className="flex flex-col gap-sm">
                <div className="bg-surface rounded-md p-sm border border-outline-variant/30 shadow-sm">
                  <span className="font-label-sm text-label-sm text-secondary uppercase mb-base block text-[10px] font-semibold tracking-wider">Complaint</span>
                  <p className="font-body-md text-body-md text-on-background font-semibold text-sm">{patientComplaint}</p>
                </div>
                <div className="bg-surface rounded-md p-sm border border-outline-variant/30 border-l-2 border-l-error/70 shadow-sm">
                  <span className="font-label-sm text-label-sm text-secondary uppercase mb-base block text-[10px] font-semibold tracking-wider">Diagnosis</span>
                  <p className="font-body-md text-body-md text-on-background font-semibold text-sm">{patientDiagnosis}</p>
                </div>
              </div>
              {/* Prescription & Notes */}
              <div className="flex flex-col gap-sm">
                <div className="bg-surface rounded-md p-sm border border-outline-variant/30 border-l-2 border-l-tertiary/70 h-full shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-secondary uppercase mb-base block flex items-center justify-between text-[10px] font-semibold tracking-wider">
                      Prescription
                      <span className="material-symbols-outlined text-[14px]">prescriptions</span>
                    </span>
                    <ul className="font-body-md text-body-md text-on-background space-y-1 mt-xs list-disc list-inside marker:text-outline text-sm">
                      {patientPrescription.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-sm pt-sm border-t border-outline-variant/30">
                    <span className="font-label-sm text-label-sm text-secondary uppercase mb-base block text-[10px] font-semibold tracking-wider">Notes</span>
                    <p className="font-body-md text-body-md text-on-surface-variant italic text-xs">"{patientNotes}"</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-md w-full py-2 border border-outline-variant rounded-md font-label-md text-label-md text-primary hover:bg-surface-container-low transition-colors flex items-center justify-center gap-xs text-xs font-semibold">
              View Full Record
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </section>

          {/* Recent History List */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md-mobile text-on-background mb-sm pb-xs border-b border-outline-variant/50 flex items-center gap-xs font-bold text-base">
                <span className="material-symbols-outlined text-secondary">calendar_month</span>
                Past Visits
              </h3>
              <div className="overflow-y-auto">
                <ul className="flex flex-col">
                  {/* History Item 1 */}
                  <li className="py-sm border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low cursor-pointer group flex items-center justify-between">
                    <div className="flex gap-sm items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors font-bold text-xs">
                        Jul
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-background text-sm">18 Jul 2026</p>
                        <p className="font-label-sm text-label-sm text-secondary text-xs">Follow-up</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                  </li>
                  {/* History Item 2 */}
                  <li className="py-sm border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low cursor-pointer group flex items-center justify-between">
                    <div className="flex gap-sm items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors font-bold text-xs">
                        Jun
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-background text-sm">02 Jun 2026</p>
                        <p className="font-label-sm text-label-sm text-secondary text-xs">General Checkup</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                  </li>
                </ul>
              </div>
            </div>
            <button className="mt-6 pt-sm w-full font-label-md text-label-md text-secondary hover:text-primary transition-colors flex items-center justify-center gap-xs text-xs font-semibold border-t border-outline-variant/30">
              See All History
            </button>
          </section>
        </div>
      </main>

      {/* Sticky Primary Action Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant p-md md:px-lg md:py-md z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[calc(16px+env(safe-area-inset-bottom))] md:hidden">
        <Link href="/consultation/entry" className="w-full h-touch-target bg-primary text-white rounded-lg font-headline-md text-headline-md-mobile flex items-center justify-center gap-sm active:scale-[0.98] transition-transform shadow-sm font-semibold">
          <span className="material-symbols-outlined">add</span>
          Start Consultation
        </Link>
      </div>
      {/* Desktop Floating Action */}
      <div className="hidden md:block fixed bottom-lg right-lg z-50">
        <Link href="/consultation/entry" className="h-touch-target px-lg bg-primary text-white rounded-full font-headline-md text-headline-md-mobile flex items-center justify-center gap-sm hover:shadow-md hover:opacity-95 transition-all active:scale-95 shadow-lg font-semibold text-sm">
          <span className="material-symbols-outlined">add</span>
          Start Consultation
        </Link>
      </div>
    </div>
  );
}
