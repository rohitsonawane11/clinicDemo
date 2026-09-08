import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-container-low font-sans">
      {/* Header */}
      <header className="bg-surface border-b border-outline-variant py-md px-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Mehta Family Clinic</h1>
              <p className="text-xs text-on-surface-variant">Bharat Clinic Management Portal</p>
            </div>
          </div>
          <span className="text-sm font-medium text-on-surface-variant bg-surface px-sm py-xs rounded-full border border-outline-variant">
            29 Aug 2026
          </span>
        </div>
      </header>

      {/* Main Hub */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-md md:p-lg flex flex-col justify-center items-center gap-xl py-12">
        <div className="text-center max-w-2xl space-y-md">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed-variant tracking-wider uppercase">
            Active System Mockups
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-background md:text-5xl">
            Bharat Clinic Demo Portal
          </h2>
          <p className="text-lg text-on-surface-variant">
            Navigate through receptionist and physician dashboard workflows to manage patient queries, vitals checkups, and consultation logs.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg w-full max-w-4xl mt-6">
          {/* Receptionist Portal Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <h3 className="text-2xl font-bold text-on-background">Receptionist Workflow</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Manage appointment bookings, walk-in token generation, queue status, and general patient searches.
              </p>
              
              {/* Pages Checklist */}
              <div className="pt-sm space-y-xs">
                <Link href="/receptionist" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Receptionist Dashboard
                </Link>
                <Link href="/receptionist/search" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Patient Search Screen
                </Link>
              </div>
            </div>
            
            <div className="pt-lg">
              <Link href="/receptionist" className="w-full flex items-center justify-center gap-xs bg-primary text-white font-bold h-touch-target rounded-lg hover:opacity-90 transition-opacity">
                Enter Receptionist Flow
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Doctor Portal Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">stethoscope</span>
              </div>
              <h3 className="text-2xl font-bold text-on-background">Doctor Workflow</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Inspect active queues, review patient histories, log vitals, prescribe medications, and add consultation logs.
              </p>
              
              {/* Pages Checklist */}
              <div className="pt-sm space-y-xs">
                <Link href="/doctor" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Doctor Dashboard
                </Link>
                <Link href="/doctor/queue" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">reorder</span>
                  Today's Queue List
                </Link>
                <Link href="/patient/1" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">account_box</span>
                  Patient Profile (Rajesh Patil)
                </Link>
                <Link href="/consultation/entry" className="flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  Consultation Entry Screen
                </Link>
              </div>
            </div>
            
            <div className="pt-lg">
              <Link href="/doctor" className="w-full flex items-center justify-center gap-xs bg-tertiary text-white font-bold h-touch-target rounded-lg hover:opacity-90 transition-opacity">
                Enter Doctor Flow
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-md border-t border-outline-variant text-center text-xs text-on-surface-variant">
        Bharat Clinic © 2026 • Powered by Stitch Design Tokens & Next.js App Router
      </footer>
    </div>
  );
}
