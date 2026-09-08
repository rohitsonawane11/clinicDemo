'use client';

import Link from "next/link";

export default function DoctorDashboard() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased font-sans">
      {/* TopAppBar */}
      <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-md py-xs h-touch-target sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-sm hover:opacity-90">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Bharat Clinic</h1>
        </Link>
        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-lg">
          <Link className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded-md" href="/receptionist">
            <span className="material-symbols-outlined">home</span>
            <span className="font-label-md text-label-md">Home</span>
          </Link>
          <Link className="flex items-center gap-base text-primary font-bold hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded-md" href="/doctor/queue">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>reorder</span>
            <span className="font-label-md text-label-md">Queue</span>
          </Link>
          <Link className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded-md" href="/patient/1">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-md text-label-md">Patients</span>
          </Link>
          <Link className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded-md" href="/receptionist/search">
            <span className="material-symbols-outlined">search</span>
            <span className="font-label-md text-label-md">Search</span>
          </Link>
        </nav>
        {/* Trailing Action / Avatar */}
        <div className="flex items-center gap-sm">
          <div className="hidden sm:flex flex-col items-end mr-sm">
            <span className="font-label-md text-label-md text-on-background font-semibold">Dr. Aniket Mehta</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">Doctor</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm">
            AM
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-md pb-[80px] md:pb-lg flex flex-col gap-lg mt-md">
        {/* Header / Date Context */}
        <div className="flex justify-between items-end border-b border-outline-variant pb-sm">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background text-2xl font-bold">Current Queue</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">29 Aug 2026</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs flex items-center gap-xs shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">visibility</span>
            <span className="font-label-md text-label-md text-on-background text-sm">Total Seen: <strong className="text-primary font-bold">18</strong></span>
          </div>
        </div>

        {/* Next Patient Card (Bento Focus) */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs font-semibold">Up Next</h3>
          <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary rounded-lg p-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md shadow-sm">
            <div className="flex items-start gap-md w-full">
              {/* Token / Identifier */}
              <div className="bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-lg w-12 h-12 flex items-center justify-center shrink-0 font-bold">
                #04
              </div>
              {/* Patient Details */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between w-full">
                  <h4 className="font-headline-md text-headline-md text-on-background font-semibold text-lg">Rajesh Patil</h4>
                  <span className="bg-error-container text-on-error-container font-label-sm text-label-sm text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    8 min wait
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">42 yrs • Male</p>
                <div className="flex items-center gap-xs mt-sm bg-surface-container py-1 px-2 rounded w-fit">
                  <span className="material-symbols-outlined text-on-secondary-container text-[16px]">sick</span>
                  <span className="font-label-md text-label-md text-on-secondary-container text-xs font-medium">Fever + body ache</span>
                </div>
              </div>
            </div>
            {/* Action */}
            <Link href="/patient/1" className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md px-lg h-touch-target rounded-full flex items-center justify-center gap-sm transition-colors w-full sm:w-auto shrink-0 shadow-sm font-semibold">
              Open Patient
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Upcoming List */}
        <section className="flex flex-col gap-sm mt-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs font-semibold">Waiting Room</h3>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-outline-variant shadow-sm">
            {/* List Item 1 */}
            <Link href="/patient/2" className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer min-h-[48px] group">
              <div className="flex items-center gap-md">
                <span className="font-label-md text-label-md text-on-surface-variant w-6 text-sm">#05</span>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-background font-medium group-hover:text-primary transition-colors">Sneha Joshi</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">Headache</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </Link>
            {/* List Item 2 */}
            <Link href="/patient/3" className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer min-h-[48px] group">
              <div className="flex items-center gap-md">
                <span className="font-label-md text-label-md text-on-surface-variant w-6 text-sm">#06</span>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-background font-medium group-hover:text-primary transition-colors">Amit Shah</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">Cough</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </Link>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-md pb-xs pt-xs bg-surface border-t border-outline-variant shadow-lg">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary" href="/receptionist">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-xs mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-md py-1 scale-95 active:scale-90 transition-transform" href="/doctor/queue">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>reorder</span>
          <span className="font-label-sm text-xs mt-1 font-bold">Queue</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary" href="/patient/1">
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-sm text-xs mt-1">Patients</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary" href="/receptionist/search">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-xs mt-1">Search</span>
        </Link>
      </nav>
    </div>
  );
}
