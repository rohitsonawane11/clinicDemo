'use client';

import Link from "next/link";

export default function TodaysQueue() {
  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col font-sans pb-[80px] md:pb-0">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline sticky top-0 z-40 transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-md py-xs h-touch-target">
          <Link href="/" className="flex items-center gap-sm hover:opacity-90">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-outline-variant relative">
              <img 
                alt="Dr. Aniket Mehta" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACzi1Ykz0KCJJVwSdGTaZICvAPiwn1KMYBkke68Xtzx4DoWk6rYVUpmUy4rAFJ5LaMAyAR_a9EmUxgCrBWlV3oMT9BLyC1rY-LkbpK0OPfhSFCY1WjnFfm-HOt_MCk_VztcQGlYFgkGNhNJfKmb6mZTn-j7J_2WOu08uUh7idzBJOiK1TEzx9lbN2S6TsZKIK8n9L84PSrCecufZ6hk5YRoZR8dVSCapbN8a6bA_4RqlkNXgPAycZ4rg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary dark:text-inverse-primary font-bold text-lg leading-tight">Bharat Clinic</span>
              <span className="font-label-md text-label-md text-on-surface-variant text-xs">Dr. Aniket Mehta</span>
            </div>
          </Link>

          {/* Desktop Nav Cluster */}
          <nav className="hidden md:flex items-center gap-lg">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded flex flex-col items-center" href="/receptionist">
              <span className="material-symbols-outlined mb-1">home</span>
              Home
            </Link>
            <Link className="font-label-md text-label-md text-primary font-bold hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded flex flex-col items-center" href="/doctor/queue">
              <span className="material-symbols-outlined mb-1 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>reorder</span>
              Queue
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded flex flex-col items-center" href="/patient/1">
              <span className="material-symbols-outlined mb-1">group</span>
              Patients
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded flex flex-col items-center" href="/receptionist/search">
              <span className="material-symbols-outlined mb-1">search</span>
              Search
            </Link>
            <Link href="/doctor" className="font-label-md text-label-md bg-primary-container text-on-primary-container px-md py-xs rounded-full h-[32px] flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-semibold">
              Doctor
            </Link>
          </nav>
          <Link href="/doctor" className="md:hidden font-label-md text-label-md bg-primary-container text-on-primary-container px-sm py-1 rounded-full flex items-center justify-center text-xs">
            Doctor
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-md md:p-lg pb-32 mt-md">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-sm border-b border-outline-variant pb-sm">
            <div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary font-bold text-2xl">Today's Queue</h1>
              <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                29 Aug 2026
              </p>
            </div>
            {/* Quick Stats */}
            <div className="flex gap-sm w-full md:w-auto">
              <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant flex-1 md:flex-none flex items-center gap-sm shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md font-bold">12</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant text-xs">Waiting</div>
                </div>
              </div>
              <div className="bg-tertiary-container/10 rounded-lg p-sm border border-tertiary-fixed-dim/30 flex-1 md:flex-none flex items-center gap-sm shadow-sm">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md font-bold">8</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant text-xs">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Queue List Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md">
            {/* Main Queue (In Progress / Next up) */}
            <div className="md:col-span-8 flex flex-col gap-sm">
              
              {/* Active Consultation */}
              <div className="bg-surface rounded-xl border-l-4 border-l-primary border-t border-r border-b border-outline-variant p-md relative overflow-hidden shadow-sm">
                <div className="absolute top-2 right-2">
                  <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    In Consultation
                  </span>
                </div>
                <div className="flex items-start gap-md mt-4">
                  <div className="flex flex-col items-center justify-center bg-surface-container-highest rounded-lg w-16 h-16 shrink-0 border border-outline-variant">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Queue</span>
                    <span className="font-headline-lg text-headline-lg text-primary text-2xl font-bold">03</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-md text-headline-md text-on-background mb-1 font-bold text-lg">
                      Meera Sharma <span className="font-body-md text-body-md text-on-surface-variant ml-2 font-normal text-sm">34 yrs</span>
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-3 text-sm">Severe migraine, nausea</p>
                    <div className="flex flex-wrap gap-x-lg gap-y-2 font-label-md text-label-md text-on-surface-variant text-xs">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        Arrived 09:45 AM
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">timer</span>
                        In room: 12 min
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-md border-t border-outline-variant pt-md flex justify-end">
                  <Link href="/consultation/entry" className="bg-primary text-white text-xs font-semibold px-md py-xs rounded hover:opacity-90 transition-opacity flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    Resume Consultation
                  </Link>
                </div>
              </div>

              {/* Next in Queue */}
              <Link href="/patient/1" className="bg-surface rounded-xl border border-outline-variant p-md hover:border-primary/50 transition-colors cursor-pointer group shadow-sm flex flex-col gap-sm">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-sm">
                    <div className="bg-surface-container-low rounded px-2 py-1 border border-outline-variant group-hover:bg-primary-container/10 transition-colors">
                      <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary font-bold">#04</span>
                    </div>
                    <span className="bg-secondary-container/30 text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm text-xs">
                      Waiting
                    </span>
                  </div>
                  <div className="font-label-sm text-label-sm text-error flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Waiting 14 min
                  </div>
                </div>
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-background group-hover:text-primary transition-colors">
                      Rajesh Patil <span className="font-body-md text-body-md font-normal text-on-surface-variant ml-2">42 yrs</span>
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Fever + body ache</p>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    10:05 AM
                  </div>
                </div>
              </Link>

              {/* Waiting List Items */}
              <Link href="/patient/2" className="bg-surface rounded-xl border border-outline-variant p-md hover:border-primary/50 transition-colors cursor-pointer group shadow-sm flex flex-col gap-sm">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-sm">
                    <div className="bg-surface-container-low rounded px-2 py-1 border border-outline-variant group-hover:bg-primary-container/10 transition-colors">
                      <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary font-bold">#05</span>
                    </div>
                    <span className="bg-secondary-container/30 text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm text-xs">
                      Waiting
                    </span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant text-xs">
                    Waiting 8 min
                  </div>
                </div>
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-background group-hover:text-primary transition-colors">
                      Sita Devi <span className="font-body-md text-body-md font-normal text-on-surface-variant ml-2">68 yrs</span>
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Routine checkup, BP refill</p>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    10:11 AM
                  </div>
                </div>
              </Link>

              <Link href="/patient/3" className="bg-surface rounded-xl border border-outline-variant p-md hover:border-primary/50 transition-colors cursor-pointer group shadow-sm flex flex-col gap-sm">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-sm">
                    <div className="bg-surface-container-low rounded px-2 py-1 border border-outline-variant group-hover:bg-primary-container/10 transition-colors">
                      <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary font-bold">#06</span>
                    </div>
                    <span className="bg-secondary-container/30 text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm text-xs">
                      Waiting
                    </span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant text-xs">
                    Waiting 2 min
                  </div>
                </div>
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-background group-hover:text-primary transition-colors">
                      Aarav Kumar <span className="font-body-md text-body-md font-normal text-on-surface-variant ml-2">8 yrs</span>
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Cough and cold</p>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    10:17 AM
                  </div>
                </div>
              </Link>
            </div>

            {/* Side Panel (Completed / Actions) */}
            <div className="md:col-span-4 flex flex-col gap-sm">
              <div className="bg-surface rounded-xl p-md flex flex-col items-center justify-center text-center py-xl border border-outline-variant border-dashed shadow-sm">
                <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center mb-sm text-on-surface-variant border border-outline-variant">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <h4 className="font-headline-md text-on-background mb-1 font-bold text-base">Add Walk-in Patient</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-xs">Register a new patient to the queue.</p>
                <Link href="/receptionist/search" className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-full h-[40px] hover:opacity-90 transition-opacity w-full flex items-center justify-center text-sm font-semibold">
                  Register Now
                </Link>
              </div>

              {/* Completed List (Simplified) */}
              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase text-xs font-semibold tracking-wider">Recently Completed</h4>
                </div>
                <div className="flex flex-col divide-y divide-outline-variant">
                  <div className="px-md py-sm flex justify-between items-center opacity-70">
                    <div className="flex items-center">
                      <span className="font-label-md text-label-md text-on-surface-variant mr-2 text-xs">#02</span>
                      <span className="font-body-md text-body-md text-on-background text-sm">Vikram Singh</span>
                    </div>
                    <span className="material-symbols-outlined text-success text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <div className="px-md py-sm flex justify-between items-center opacity-70">
                    <div className="flex items-center">
                      <span className="font-label-md text-label-md text-on-surface-variant mr-2 text-xs">#01</span>
                      <span className="font-body-md text-body-md text-on-background text-sm">Priya Patel</span>
                    </div>
                    <span className="material-symbols-outlined text-success text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-md pb-xs pt-xs bg-surface dark:bg-inverse-surface border-t border-outline-variant dark:border-outline shadow-lg">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary dark:hover:text-inverse-primary" href="/receptionist">
          <span className="material-symbols-outlined mb-1 text-[24px]">home</span>
          <span className="font-label-sm text-xs mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container rounded-full px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary dark:hover:text-inverse-primary" href="/doctor/queue">
          <span className="material-symbols-outlined mb-1 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>reorder</span>
          <span className="font-label-sm text-xs mt-1 font-bold">Queue</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary dark:hover:text-inverse-primary" href="/patient/1">
          <span className="material-symbols-outlined mb-1 text-[24px]">group</span>
          <span className="font-label-sm text-xs mt-1">Patients</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-md py-1 scale-95 active:scale-90 transition-transform hover:text-primary dark:hover:text-inverse-primary" href="/receptionist/search">
          <span className="material-symbols-outlined mb-1 text-[24px]">search</span>
          <span className="font-label-sm text-xs mt-1">Search</span>
        </Link>
      </nav>
    </div>
  );
}
