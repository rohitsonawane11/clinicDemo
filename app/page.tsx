import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* BEGIN: StickyNavbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-bordercol">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link className="flex items-center space-x-3" href="/">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">Bharat Clinic</span>
              <span className="badge-saas px-2 py-0.5 rounded uppercase tracking-wider font-semibold">SAAS</span>
            </div>
          </Link>
          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a className="hover:text-brand-500 transition-colors" href="#features">Features</a>
            <a className="hover:text-brand-500 transition-colors" href="#pipeline">How It Works</a>
            <a className="hover:text-brand-500 transition-colors" href="#presets">Rx Presets</a>
            <a className="hover:text-brand-500 transition-colors" href="#roles">For Clinics</a>
            <a className="hover:text-brand-500 transition-colors" href="#security">Security &amp; RBAC</a>
          </nav>
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:inline-block" href="/doctor">Log in</Link>
            <Link className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 transition shadow-sm shadow-blue-500/20" href="/onboarding">Start for Free</Link>
          </div>
        </div>
      </header>
      {/* END: StickyNavbar */}
      <main>
        {/* BEGIN: HeroSection */}
        <section className="pt-12 pb-20 lg:pt-18 lg:pb-28 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Copy */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              {/* Live Status Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-600 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Built for Indian Single-Doctor &amp; Multispeciality Clinics
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your clinic, finally running <span className="text-brand-500">at your pace.</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">Manage patients, appointments, consultations and prescriptions from one simple workspace built for busy Indian clinics.</p>
              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/25 transition" href="/onboarding">
                  Start for Free
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </Link>
                <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-base font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition" href="#interactive-preview">
                  See How It Works
                </a>
              </div>
              {/* Micro-Trust Note */}
              <p className="mt-5 text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                </svg>
                Free to get started • 2-minute onboarding • Built for Indian clinics
              </p>
            </div>
            {/* Realistic Product UI Workspace Mockup (Mehta Family Clinic) */}
            <div className="relative max-w-6xl mx-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden" id="interactive-preview">
              {/* Mockup App Header */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono ml-2">app.bharatclinic.in/workspace/cln_pun_88421</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE WORKSPACE
                  </span>
                  <span className="text-xs text-slate-300 font-medium">Mehta Family Clinic, Pune</span>
                </div>
              </div>
              {/* Internal Workspace Top Nav */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-brand-600 flex items-center justify-center font-bold text-sm">
                    DM
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Mehta Family Clinic
                      <span className="bg-brand-50 text-brand-600 text-[11px] font-semibold px-2 py-0.5 rounded border border-brand-100">CLINIC_OWNER</span>
                    </div>
                    <div className="text-xs text-slate-500">Dr. Aniket Mehta (General Physician) • ID: cln_pun_88421</div>
                  </div>
                </div>
                {/* Quick Action & Patient Search Mock */}
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </span>
                    <input className="block w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono" readOnly type="text" value="+91 98765 43210" />
                  </div>
                  <Link href="/receptionist" className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    Walk-in Token
                  </Link>
                </div>
              </div>
              {/* Two-Column Active Clinic Board */}
              <div className="p-6 bg-slate-50/70 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Today's Queue (Screen 8 Data) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Today&apos;s Queue</h3>
                        <p className="text-xs text-slate-500">29 Aug 2026 • Live clinic stream</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-brand-600 font-semibold border border-blue-100">12 Waiting</span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">8 Done</span>
                      </div>
                    </div>
                    {/* Active Consultation item */}
                    <div className="mb-3 p-3.5 rounded-lg border-2 border-brand-500 bg-blue-50/40 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-brand-500 text-white flex flex-col items-center justify-center font-black leading-none">
                            <span className="text-[9px] uppercase font-bold tracking-tight opacity-80">TOKEN</span>
                            <span className="text-base">03</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">Meera Sharma</h4>
                              <span className="text-xs text-slate-500 font-medium">34 yrs</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">Severe migraine, nausea</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                              <span>🕒 In room: 12 min</span>
                              <span>• Arrived 09:45 AM</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-600 uppercase">In Consultation</span>
                      </div>
                    </div>
                    {/* Next in Queue #04 Rajesh Patil */}
                    <div className="space-y-2.5">
                      <Link href="/patient/1" className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">#04</span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Rajesh Patil <span className="font-normal text-slate-500">(42 yrs)</span></div>
                            <div className="text-[11px] text-slate-500">Fever + body ache</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Waiting 14m</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">10:05 AM</div>
                        </div>
                      </Link>
                      {/* Queue #05 Sita Devi */}
                      <Link href="/patient/2" className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">#05</span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Sita Devi <span className="font-normal text-slate-500">(68 yrs)</span></div>
                            <div className="text-[11px] text-slate-500">Routine checkup, BP refill</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500">Waiting 8m</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">10:11 AM</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  {/* Quick Walk-in Callout */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Receptionist counter synced</span>
                    <Link href="/doctor/queue" className="font-semibold text-brand-600 flex items-center gap-1 cursor-pointer">View full queue →</Link>
                  </div>
                </div>
                {/* Right: Patient Profile & 5-Second Clinical Memory (Screen 7 Data) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-brand-600 font-bold flex items-center justify-center text-sm">
                        RP
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">Rajesh Patil</h3>
                          <span className="text-xs text-slate-500">42 yrs • Male</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">📞 +91 98765 43210</div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded text-xs flex items-center gap-1.5">
                      <span className="font-bold">⚠️ Allergies:</span> No known drug allergies
                    </div>
                  </div>
                  {/* Last Visit Summary Box */}
                  <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        Last Visit: 12 Aug 2026 (17 days ago)
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Follow-up Complete</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <div className="text-slate-400 font-medium uppercase text-[10px]">Primary Complaint &amp; Diagnosis</div>
                        <div className="text-slate-800 font-semibold mt-0.5">Viral Fever + Body Ache</div>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <div className="text-slate-400 font-medium uppercase text-[10px]">Prescribed Dosage</div>
                        <div className="text-slate-800 font-semibold mt-0.5">Paracetamol 500mg, Azithromycin 500mg</div>
                      </div>
                    </div>
                    <div className="mt-2.5 text-xs text-slate-600 italic bg-white p-2.5 rounded border border-slate-200">
                      Doctor Notes: &ldquo;Advised rest, hydration, blood test if fever spikes beyond day 3.&rdquo;
                    </div>
                  </div>
                  {/* Active Action Bar */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Past visits logged: <strong>4 consultations</strong></span>
                    <Link href="/consultation/entry" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      Start New Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: ProblemSolutionSection */}
        <section className="py-20 bg-white border-t border-b border-bordercol" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">Designed For Everyday Practice</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Less paperwork. More time with patients.
              </p>
              <p className="mt-4 text-slate-600 text-base">
                Replace chaotic notepads and complicated software with a lightweight workspace built specifically around how Indian doctors examine and prescribe.
              </p>
            </div>
            {/* 4 Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-surface/50 hover:bg-white hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">✕</span>
                  <span className="text-sm font-semibold text-slate-500 line-through">Paper prescriptions &amp; lost pads</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Legible e-prescriptions with 1-click presets</h3>
                    <p className="text-sm text-slate-600 mt-1">Generate clear digital prescriptions with structured dosages (1-0-1), food instructions, and clinic branding. Print immediately or send via SMS/WhatsApp.</p>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-surface/50 hover:bg-white hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">✕</span>
                  <span className="text-sm font-semibold text-slate-500 line-through">Scattered patient records across notebooks</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Instant patient memory in under 5 seconds</h3>
                    <p className="text-sm text-slate-600 mt-1">Search any 10-digit mobile number to view past diagnoses, allergies, and prescribed drugs instantly before the patient even sits down.</p>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-surface/50 hover:bg-white hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">✕</span>
                  <span className="text-sm font-semibold text-slate-500 line-through">Chaos and crowding in the waiting room</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Real-time token queue with live waiting tracking</h3>
                    <p className="text-sm text-slate-600 mt-1">Receptionists issue instant walk-in tokens. Doctors call the next patient with a single tap. Everyone knows their turn without arguments.</p>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-surface/50 hover:bg-white hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">✕</span>
                  <span className="text-sm font-semibold text-slate-500 line-through">Bloated, multi-step hospital EMR systems</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">High-speed consultation workflow</h3>
                    <p className="text-sm text-slate-600 mt-1">Zero clutter. Designed to be operated in real time during consultations with rapid symptom chips and minimal keystrokes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: ProblemSolutionSection */}

        {/* BEGIN: ProductCapabilitiesGrid */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">Capabilities</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Everything a modern clinic requires</p>
              <p className="mt-3 text-slate-600">Engineered from ground up for fast outpatient consulting rooms.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cap 1 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Consultation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Quick symptom chip selector, rapid diagnosis tagging, and instant clinical remarks with auto-suggest.
                </p>
              </div>
              {/* Cap 2 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart E-Prescription</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clear dosages, Indian standard timings (1-0-1, Morning-Night), duration, and post/pre-meal instructions in regional clarity.
                </p>
              </div>
              {/* Cap 3 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Prescription Presets</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Custom clinic bundles: Viral Fever, Gastritis, URI, Hypertension protocols. Populate medications in 1 tap.
                </p>
              </div>
              {/* Cap 4 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Patient Records by Phone</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Zero paper folder retrieval. Complete medical timeline, past encounters, and vitals indexed by 10-digit mobile number.
                </p>
              </div>
              {/* Cap 5 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Queue &amp; Walk-ins</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Front-desk receptionist token generator connected live with the doctor’s desk. Transparent waiting time metrics.
                </p>
              </div>
              {/* Cap 6 */}
              <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:border-brand-500/50 transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Tenant Isolation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Strict clinic-level database isolation. Role-based security ensuring doctors, owners, and desk staff only access permitted data.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* END: ProductCapabilitiesGrid */}

        {/* BEGIN: InteractiveConsultationShowcase */}
        <section className="py-20 bg-white border-t border-bordercol" id="pipeline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 inline-block">High-Speed Workflow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">From patient to prescription in seconds</h2>
              <p className="mt-3 text-slate-600 text-base">Designed for peak OPD hours when doctors consult 40+ patients in a morning.</p>
            </div>
            {/* Visual Pipeline Steps */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-semibold text-slate-600 mb-10">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-brand-700">1. Patient Arrives</div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-brand-700">2. Vitals &amp; Chips</div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-brand-700">3. Diagnosis</div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-brand-700">4. Apply Rx Preset</div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-brand-700">5. Save Visit</div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">6. Updated History</div>
            </div>
            {/* Consultation Card Simulation */}
            <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-sm font-semibold">Active Consultation • Dr. Aniket Mehta seeing Rajesh Patil (42y / M)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✓ Saved in 28 seconds
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Quick Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Chief Symptoms Selected</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white">Fever (3 days) ✕</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white">Severe Body Ache ✕</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white">Mild Cough ✕</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">+ Headache</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">+ Throat Pain</span>
                  </div>
                </div>
                {/* Diagnosis & Presets Used */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Diagnosis</label>
                    <input className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg py-2 px-3" readOnly type="text" value="Acute Viral Fever with Myalgia" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Applied Preset</label>
                    <div className="w-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg py-2 px-3 flex items-center justify-between">
                      <span>Viral Fever Protocol (Adult)</span>
                      <span className="text-xs bg-emerald-200/60 px-2 py-0.5 rounded font-bold">3 Meds</span>
                    </div>
                  </div>
                </div>
                {/* Auto-generated Prescriptions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Generated Prescription Table</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="p-3">Medicine</th>
                          <th className="p-3">Dosage &amp; Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        <tr>
                          <td className="p-3 font-bold text-brand-600">Paracetamol 650mg</td>
                          <td className="p-3">1 - 0 - 1 (Morning, Night)</td>
                          <td className="p-3">3 Days</td>
                          <td className="p-3 text-slate-500">After food</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-brand-600">Azithromycin 500mg</td>
                          <td className="p-3">0 - 0 - 1 (Night only)</td>
                          <td className="p-3">3 Days</td>
                          <td className="p-3 text-slate-500">Post dinner</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-brand-600">Pantoprazole 40mg</td>
                          <td className="p-3">1 - 0 - 0 (Morning only)</td>
                          <td className="p-3">3 Days</td>
                          <td className="p-3 text-slate-500">Empty stomach</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Doctor Notes & Actions */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-600"><strong>Doctor Advice:</strong> &ldquo;Drink 3L warm water daily. Review on Saturday if fever persists.&rdquo;</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-100">Print Rx</button>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700">Send WhatsApp</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: InteractiveConsultationShowcase */}

        {/* BEGIN: PresetsConfigSection */}
        <section className="py-20 bg-surface" id="presets">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 inline-block">Protocols &amp; Efficiency</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Prescriptions that work the way your doctors work</h2>
              <p className="mt-3 text-slate-600">Your clinic, your protocols. Create clinic-specific medicine presets or customize on the fly.</p>
              <div className="mt-3 inline-block px-3 py-1 rounded bg-slate-200/70 text-slate-700 text-xs font-mono">
                Clinic Settings → Prescription Presets → Seeded (4) or fully customized
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preset Card 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded">PRESET #1</span>
                  <span className="text-xs text-slate-400 font-mono">3 Days Duration</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Viral Fever Protocol</h3>
                <p className="text-xs text-slate-500 mb-4">Standard outpatient fever management template</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Paracetamol 650mg</span>
                    <span className="font-bold text-slate-500">1-0-1</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Levocetirizine 5mg</span>
                    <span className="font-bold text-slate-500">0-0-1</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Pantoprazole 40mg</span>
                    <span className="font-bold text-slate-500">1-0-0</span>
                  </li>
                </ul>
              </div>
              {/* Preset Card 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded">PRESET #2</span>
                  <span className="text-xs text-slate-400 font-mono">5 Days Duration</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Acute Gastroenteritis</h3>
                <p className="text-xs text-slate-500 mb-4">Dehydration &amp; abdominal comfort protocol</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>ORS Sachets (1L Solution)</span>
                    <span className="font-bold text-slate-500">Ad lib</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Ofloxacin + Ornidazole</span>
                    <span className="font-bold text-slate-500">1-0-1</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Dicyclomine 20mg</span>
                    <span className="font-bold text-slate-500">SOS</span>
                  </li>
                </ul>
              </div>
              {/* Preset Card 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">PRESET #3</span>
                  <span className="text-xs text-slate-400 font-mono">5 Days Duration</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Upper Respiratory Infection</h3>
                <p className="text-xs text-slate-500 mb-4">Targeted bronchitis &amp; URI recovery</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Azithromycin 500mg</span>
                    <span className="font-bold text-slate-500">1-0-0</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Montelukast + Levocet</span>
                    <span className="font-bold text-slate-500">0-0-1</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                    <span>Ambroxol Cough Syrup</span>
                    <span className="font-bold text-slate-500">10ml TDS</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* END: PresetsConfigSection */}

        {/* BEGIN: RBACAndArchitectureSection */}
        <section className="py-20 bg-white border-t border-bordercol" id="roles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 inline-block">Role-Based Clinic Workspace</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">One workspace for your entire clinic</h2>
              <p className="mt-3 text-slate-600">Everyone gets exactly the access they need without getting in each other&apos;s way.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role: Clinic Owner */}
              <div className="bg-surface rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-brand-700 mb-4">
                    ROLE: CLINIC_OWNER
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Clinic Owner</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Complete administrative authority. Manage subscription, configure clinic brand logo, invite visiting doctors and desk staff, and inspect analytics.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">✓ Multi-doctor schedule management</li>
                    <li className="flex items-center gap-2">✓ Prescription header &amp; logo customization</li>
                    <li className="flex items-center gap-2">✓ Revenue &amp; daily OPD throughput stats</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 font-mono">
                  Access level: Full Admin
                </div>
              </div>
              {/* Role: Doctor */}
              <div className="bg-surface rounded-xl border-2 border-brand-500/40 p-6 flex flex-col justify-between relative shadow-sm">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-4">
                    ROLE: DOCTOR
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Consulting Doctor</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Queue-first consultation experience. Instant 5-second medical timeline retrieval, rapid drug suggestions, and private clinical notes.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">✓ Live queue call &amp; consultation mode</li>
                    <li className="flex items-center gap-2">✓ 1-click personal prescription presets</li>
                    <li className="flex items-center gap-2">✓ Private doctor remarks &amp; vitals trends</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 font-mono">
                  Access level: Clinical Writer
                </div>
              </div>
              {/* Role: Receptionist */}
              <div className="bg-surface rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 mb-4">
                    ROLE: RECEPTIONIST
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Front Desk &amp; Receptionist</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    High-speed patient check-in. Search patients by mobile number, issue queue tokens, and collect consultation fees with zero medical clutter.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">✓ Instant walk-in token generation</li>
                    <li className="flex items-center gap-2">✓ Quick demographic creation (Name, Age, Phone)</li>
                    <li className="flex items-center gap-2">✓ Masked medical history for patient privacy</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 font-mono">
                  Access level: Front-Desk Operator
                </div>
              </div>
            </div>
            {/* Security Boundary Callout */}
            <div className="mt-12 p-6 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4" id="security">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-600 flex items-center justify-center font-bold">
                  🔒
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Encrypted Multi-Tenant Isolation (Tenant Boundary)</h4>
                  <p className="text-xs text-slate-600">Every clinic operates in its own sandboxed partition with strict tenant IDs. Your patients and clinical data never leak.</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider bg-white px-3 py-1.5 rounded border border-blue-200 shadow-sm whitespace-nowrap">
                Bharat Clinic Cloud Shield
              </span>
            </div>
          </div>
        </section>
        {/* END: RBACAndArchitectureSection */}

        {/* BEGIN: HowItWorksSection */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 inline-block">Simple Setup</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Up and running in 2 minutes</h2>
              <p className="mt-3 text-slate-600">No software installation. No expensive servers. Works on any browser, tablet, or PC.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-sm flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Create Clinic Workspace</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your clinic name (e.g. Mehta Family Clinic), specialty, location, and clinic contact number. Takes under 90 seconds.
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-sm flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Configure Presets &amp; Staff</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enable seeded prescription templates or tailor custom medicine dosages. Add receptionists and consulting associates with 1 click.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-sm flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Start Seeing Patients</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate walk-in tokens at the desk, consult on the desktop or tablet, print or share legible prescriptions in real time.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* END: HowItWorksSection */}

        {/* BEGIN: PersonaTailoredSection */}
        <section className="py-20 bg-white border-t border-bordercol">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* For the Doctor */}
              <div className="bg-surface p-8 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded uppercase">Built Around The Doctor</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">Minimal typing, maximum patient attention</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Bharat Clinic doesn&apos;t turn doctors into data entry operators. With our rapid chip selectors, past diagnosis recall, and dosage templates, you finish complete electronic consultations in less time than handwriting a paper pad.
                </p>
                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">✓ Less than 30 seconds per average routine prescription</div>
                  <div className="flex items-center gap-2">✓ Automatic patient allergy and drug interaction reminders</div>
                  <div className="flex items-center gap-2">✓ Instant print format formatted for standard clinic letterheads</div>
                </div>
              </div>
              {/* For the Clinic Owner */}
              <div className="bg-surface p-8 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded uppercase">Built For The Clinic Owner</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">Total operational visibility with zero maintenance</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Track exactly how many patients were seen, manage queue wait times to avoid walk-aways, and ensure every prescription carrying your clinic’s name is crisp, professional, and branded.
                </p>
                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">✓ Clear daily patient registration and visit metrics</div>
                  <div className="flex items-center gap-2">✓ No local database installations, backups are 100% automated</div>
                  <div className="flex items-center gap-2">✓ Retain patient loyalty with SMS/WhatsApp visit summaries</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: PersonaTailoredSection */}

        {/* BEGIN: FinalConversionCTA */}
        <section className="py-20 bg-brand-500 text-white relative overflow-hidden" id="signup">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to simplify your clinic?
            </h2>
            <p className="mt-5 text-lg text-blue-100 max-w-2xl mx-auto">Start managing your clinic with Bharat Clinic — free to get started.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-bold text-brand-600 bg-white hover:bg-blue-50 shadow-lg transition" href="/onboarding">Start for Free</Link>
              <Link className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-semibold text-white border border-white/40 hover:bg-white/10 transition" href="/doctor">
                Talk to Us / Request Demo
              </Link>
            </div>
            <p className="mt-6 text-xs text-blue-200">Free to get started • Dedicated onboarding support</p>
          </div>
        </section>
        {/* END: FinalConversionCTA */}
      </main>
      {/* BEGIN: Footer */}
      <footer className="bg-white border-t border-bordercol py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand Info */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <span className="text-base font-bold text-slate-900">Bharat Clinic</span>
                <span className="badge-saas px-1.5 py-0.5 rounded text-[10px]">SAAS</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm mb-3">
                Lightweight, high-speed clinical management system built specifically for Indian outpatient clinics, family doctors, and multispeciality centers.
              </p>
              <div className="text-[11px] text-slate-400">
                Proudly Made for Indian Healthcare • Pune • Mumbai • Bengaluru
              </div>
            </div>
            {/* Col 1 */}
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-3">Product</div>
              <ul className="space-y-2">
                <li><a className="hover:text-brand-500" href="#pipeline">Fast Consultation</a></li>
                <li><a className="hover:text-brand-500" href="#pipeline">Smart E-Prescriptions</a></li>
                <li><a className="hover:text-brand-500" href="#presets">Prescription Presets</a></li>
                <li><a className="hover:text-brand-500" href="#interactive-preview">Token Queue System</a></li>
              </ul>
            </div>
            {/* Col 2 */}
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-3">For Clinics</div>
              <ul className="space-y-2">
                <li><a className="hover:text-brand-500" href="#roles">Single Doctor Practice</a></li>
                <li><a className="hover:text-brand-500" href="#roles">Multispeciality Clinics</a></li>
                <li><a className="hover:text-brand-500" href="#roles">Front-desk Receptionists</a></li>
                <li><a className="hover:text-brand-500" href="#presets">Medicine Catalog</a></li>
              </ul>
            </div>
            {/* Col 3 */}
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-3">Security &amp; Legal</div>
              <ul className="space-y-2">
                <li><a className="hover:text-brand-500" href="#security">Tenant Isolation</a></li>
                <li><a className="hover:text-brand-500" href="#security">Data Privacy Policy</a></li>
                <li><a className="hover:text-brand-500" href="#">Terms of Service</a></li>
                <li><a className="hover:text-brand-500" href="#">Clinic Data Ownership</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <div>
              © 2026 Bharat Clinic Cloud Technologies Private Limited. All rights reserved.
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-4">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> All systems operational
              </span>
              <span>Encrypted 256-bit TLS</span>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </>
  );
}
