'use client';

import Link from "next/link";
import Image from "next/image";

export default function ReceptionistDashboard() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pb-[80px] md:pb-0 font-sans">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-md py-xs h-touch-target">
          <Link href="/" className="flex items-center gap-sm hover:opacity-90">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
            </div>
            <h1 className="font-headline-md text-primary dark:text-inverse-primary font-bold">Bharat Clinic</h1>
          </Link>
          <div className="flex items-center gap-sm">
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">29 Aug 2026</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant relative">
              <img 
                className="w-full h-full object-cover" 
                alt="A professional headshot of an Indian female receptionist" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKMpVrwk0MQDAJNDkocVeUvmAMjfUIPG5dV9BwvWeUczlvYrW8OVvwmPQRZ64_i2mhwpG7uxilduTvSUV8LWDqfvQUux4mORfI-QuJJ_oWLyMmeDzFDCcisreSOMTxGSAMSmTGjJb-6kCkDJaCq49Co41CPz-aSqg-owbnxtujsuSQTVSE4hbGeA8LlAlXj-o1TrglfnhfLq7qGaltPPhtcPg1NPnfPN_Gd2MjVSzsu1eYVS3Rj3G9BA"
              />
            </div>
            <Link href="/doctor" className="text-primary font-label-md hidden md:block hover:underline">
              Doctor View
            </Link>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-md px-md border-t border-outline-variant py-xs bg-surface">
          <Link className="text-primary font-bold font-label-md flex items-center gap-xs px-sm py-2 rounded hover:bg-surface-container-low transition-colors duration-200" href="/receptionist">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span> Home
          </Link>
          <Link className="text-on-surface-variant font-label-md flex items-center gap-xs px-sm py-2 rounded hover:bg-surface-container-low transition-colors duration-200" href="/doctor/queue">
            <span className="material-symbols-outlined">reorder</span> Queue
          </Link>
          <Link className="text-on-surface-variant font-label-md flex items-center gap-xs px-sm py-2 rounded hover:bg-surface-container-low transition-colors duration-200" href="/patient/1">
            <span className="material-symbols-outlined">group</span> Patients
          </Link>
          <Link className="text-on-surface-variant font-label-md flex items-center gap-xs px-sm py-2 rounded hover:bg-surface-container-low transition-colors duration-200" href="/receptionist/search">
            <span className="material-symbols-outlined">search</span> Search
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-md md:p-lg md:max-w-7xl md:mx-auto md:w-full space-y-lg">
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          <button className="flex items-center justify-center gap-xs bg-primary-container text-on-primary h-touch-target rounded-lg font-label-md hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">person_add</span> New Patient Registration
          </button>
          <Link href="/receptionist/search" className="flex items-center justify-center gap-xs bg-surface text-primary border border-primary h-touch-target rounded-lg font-label-md hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">search</span> Search Patients
          </Link>
          <Link href="/doctor/queue" className="flex items-center justify-center gap-xs bg-surface text-primary border border-primary h-touch-target rounded-lg font-label-md hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">reorder</span> View Queue status
          </Link>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-sm">
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant flex flex-col justify-center items-start h-24 shadow-sm">
            <span className="font-label-md text-on-surface-variant">Waiting Patients</span>
            <span className="font-headline-lg text-primary text-3xl font-bold">6</span>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant flex flex-col justify-center items-start h-24 border-l-4 border-l-tertiary-container shadow-sm">
            <span className="font-label-md text-on-surface-variant">In Consultation</span>
            <span className="font-headline-lg text-tertiary text-3xl font-bold">1</span>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant flex flex-col justify-center items-start h-24 col-span-2 md:col-span-1 shadow-sm">
            <span className="font-label-md text-on-surface-variant">Completed Today</span>
            <span className="font-headline-lg text-on-background text-3xl font-bold">18</span>
          </div>
        </section>

        {/* Next Up Queue */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
          <div className="px-md py-sm border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h2 className="font-headline-md text-on-background font-bold text-lg">Next Patients in Line</h2>
            <Link href="/doctor/queue" className="text-primary font-label-md hover:underline">
              View All Queue
            </Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {/* Queue Item 1 */}
            <Link href="/patient/1" className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-headline-md">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
                </div>
                <div>
                  <p className="font-headline-md text-on-background group-hover:text-primary transition-colors font-semibold">Aarav Sharma</p>
                  <p className="font-body-md text-on-surface-variant">Token #102 • Routine Checkup</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full font-label-sm text-xs">Next</span>
                <span className="font-body-md text-on-surface-variant mt-1">~5 mins</span>
              </div>
            </Link>

            {/* Queue Item 2 */}
            <Link href="/patient/2" className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <p className="font-headline-md text-on-background group-hover:text-primary transition-colors font-semibold">Meera Patel</p>
                  <p className="font-body-md text-on-surface-variant">Token #103 • Follow-up</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-body-md text-on-surface-variant mt-1">~15 mins</span>
              </div>
            </Link>

            {/* Queue Item 3 */}
            <Link href="/patient/3" className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <p className="font-headline-md text-on-background group-hover:text-primary transition-colors font-semibold">Rohan Desai</p>
                  <p className="font-body-md text-on-surface-variant">Token #104 • Vaccination</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-body-md text-on-surface-variant mt-1">~30 mins</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-md pb-xs pt-xs bg-surface dark:bg-inverse-surface border-t border-outline-variant dark:border-outline shadow-lg">
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-md py-1 scale-95 active:scale-90 transition-transform" href="/receptionist">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-sm text-xs mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary scale-95 active:scale-90 transition-transform" href="/doctor/queue">
          <span className="material-symbols-outlined">reorder</span>
          <span className="font-label-sm text-xs mt-1">Queue</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary scale-95 active:scale-90 transition-transform" href="/patient/1">
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-sm text-xs mt-1">Patients</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 hover:text-primary scale-95 active:scale-90 transition-transform" href="/receptionist/search">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-xs mt-1">Search</span>
        </Link>
      </nav>
    </div>
  );
}
