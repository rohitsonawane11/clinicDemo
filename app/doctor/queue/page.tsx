'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DemoBar from '../../components/DemoBar';
import { formatDemoDate, formatDemoTime, getDemoState, getTodayQueue, updateQueueStatus } from '../../../lib/store/demoStore';
import type { Patient, QueueEntry } from '../../../lib/types/clinic';
import { getActiveClinic } from '../../../lib/store/clinicStore';

export default function DoctorQueue() {
  const [queue, setQueue] = useState<QueueEntry[]>([]); const [patients, setPatients] = useState<Patient[]>([]); const [clinicName, setClinicName] = useState('Mehta Family Clinic');
  const load = () => { const state = getDemoState(); setQueue(getTodayQueue()); setPatients(state.patients); setClinicName(getActiveClinic().name); };
  useEffect(() => { const timer = window.setTimeout(load, 0); window.addEventListener('demo-state-change', load); return () => { window.clearTimeout(timer); window.removeEventListener('demo-state-change', load); }; }, []);
  const patient = (id: string) => patients.find((item) => item.id === id);
  const active = queue.find((item) => item.status === 'IN_CONSULTATION'); const waiting = queue.filter((item) => item.status === 'WAITING'); const completed = queue.filter((item) => item.status === 'COMPLETED');
  const start = (entry: QueueEntry) => { queue.filter((item) => item.status === 'IN_CONSULTATION').forEach((item) => updateQueueStatus(item.id, 'WAITING')); updateQueueStatus(entry.id, 'IN_CONSULTATION'); load(); };
  return <div className="min-h-screen bg-slate-50"><DemoBar /><header className="h-16 px-8 bg-white border-b flex justify-between items-center"><Link href="/doctor" className="font-bold text-lg text-blue-700">{clinicName}</Link><nav className="flex gap-6 text-sm"><Link href="/receptionist">Reception</Link><Link className="font-semibold text-blue-700" href="/doctor/queue">Queue</Link><Link href="/receptionist/search">Patients</Link><Link href="/settings">Settings</Link></nav></header>
    <main className="max-w-6xl mx-auto px-8 py-8"><div className="flex justify-between items-end"><div><p className="text-sm text-blue-700 font-semibold">DOCTOR WORKSPACE</p><h1 className="text-3xl font-bold">Today’s queue</h1><p className="text-slate-500 mt-1">{formatDemoDate(new Date().toISOString())}</p></div><div className="flex gap-3"><span className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm"><b>{waiting.length}</b> waiting</span><span className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-sm"><b>{completed.length}</b> completed</span></div></div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-8 mt-8"><section><h2 className="font-bold mb-3">Current consultation</h2>{active ? <QueueCard entry={active} person={patient(active.patientId)} primary /> : <div className="bg-white border border-dashed rounded-xl p-10 text-center text-slate-500">No consultation in progress. Start the next waiting patient.</div>}
        <h2 className="font-bold mt-8 mb-3">Waiting room</h2><div className="space-y-3">{waiting.map((entry) => <QueueCard key={entry.id} entry={entry} person={patient(entry.patientId)} onStart={() => start(entry)} />)}{waiting.length === 0 && <p className="bg-white border rounded-xl p-8 text-center text-slate-500">The waiting room is clear.</p>}</div></section>
        <aside className="bg-white border rounded-2xl p-6 h-fit"><h2 className="font-bold text-lg">Completed today</h2><div className="mt-4 divide-y">{completed.map((entry) => <Link key={entry.id} href={`/patient/${entry.patientId}`} className="py-4 flex justify-between hover:text-blue-700"><span>#{String(entry.token).padStart(2, '0')} · {patient(entry.patientId)?.name}</span><span className="text-sm text-slate-400">View visit →</span></Link>)}{completed.length === 0 && <p className="py-8 text-center text-slate-400">No completed visits yet.</p>}</div><Link href="/receptionist/search" className="mt-6 flex justify-center bg-blue-700 text-white rounded-lg py-3 font-semibold">Add a walk-in patient</Link></aside></div>
    </main></div>;
}

function QueueCard({ entry, person, primary, onStart }: { entry: QueueEntry; person?: Patient; primary?: boolean; onStart?: () => void }) {
  return <article className={`bg-white rounded-xl p-5 shadow-sm ${primary ? 'border-2 border-blue-600' : 'border'}`}><div className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="w-12 h-12 bg-blue-700 text-white rounded-lg grid place-items-center font-bold">#{String(entry.token).padStart(2, '0')}</span><div><h3 className="font-bold text-lg">{person?.name ?? 'Unknown patient'}</h3><p className="text-sm text-slate-500">{person?.age} years · {person?.gender} · arrived {formatDemoTime(entry.arrivedAt)}</p><p className="text-sm mt-1">{entry.complaint}</p></div></div><div className="flex gap-2">{onStart && <button onClick={onStart} className="border border-blue-700 text-blue-700 rounded-lg px-4 py-2 font-semibold text-sm">Call next</button>}<Link href={`/patient/${entry.patientId}?queue=${entry.id}`} className="bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold text-sm">Open patient</Link></div></div></article>;
}
