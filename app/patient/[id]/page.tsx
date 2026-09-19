'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import DemoBar from '../../components/DemoBar';
import { formatDemoDate, getPatient, getPatientVisits, getTodayQueue } from '../../../lib/store/demoStore';
import type { Consultation, Patient, QueueEntry } from '../../../lib/types/clinic';
import { getActiveClinic } from '../../../lib/store/clinicStore';

export default function PatientProfilePage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-500">Loading patient…</div>}><PatientProfile /></Suspense>;
}

function PatientProfile() {
  const params = useParams<{ id: string }>(); const query = useSearchParams();
  const [patient, setPatient] = useState<Patient>(); const [visits, setVisits] = useState<Consultation[]>([]); const [queue, setQueue] = useState<QueueEntry>(); const [loaded, setLoaded] = useState(false); const [clinicName, setClinicName] = useState('Mehta Family Clinic');
  useEffect(() => { const timer = window.setTimeout(() => { setPatient(getPatient(params.id)); setVisits(getPatientVisits(params.id)); setQueue(getTodayQueue().find((item) => item.patientId === params.id && item.status !== 'COMPLETED')); setClinicName(getActiveClinic().name); setLoaded(true); }, 0); return () => window.clearTimeout(timer); }, [params.id]);
  if (!loaded) return <div className="min-h-screen grid place-items-center text-slate-500">Loading patient…</div>;
  if (!patient) return <div className="min-h-screen bg-slate-50"><DemoBar /><main className="max-w-2xl mx-auto py-32 text-center"><h1 className="text-3xl font-bold">Patient not found</h1><p className="text-slate-500 mt-3">This patient ID is not present in the demo data.</p><Link className="inline-block mt-6 bg-blue-700 text-white rounded-lg px-5 py-3" href="/doctor/queue">Return to queue</Link></main></div>;
  const latest = visits[0]; const queueId = query.get('queue') || queue?.id;
  return <div className="min-h-screen bg-slate-50"><DemoBar /><header className="h-16 bg-white border-b px-8 flex items-center justify-between"><Link href="/doctor/queue" className="text-blue-700 font-semibold">← Today’s queue</Link><span className="font-bold">{clinicName}</span></header>
    <main className="max-w-6xl mx-auto px-8 py-8">{query.get('saved') === '1' && <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-5 py-4">Visit saved. The patient has moved to completed and their history is updated.</div>}
      <section className="bg-white border rounded-2xl p-6 flex items-center justify-between"><div className="flex items-center gap-5"><div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-bold text-xl">{patient.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h1 className="text-3xl font-bold">{patient.name}</h1><p className="text-slate-500 mt-1">{patient.age} years · {patient.gender} · +91 {patient.mobile}</p></div></div><div className="text-right"><p className="text-xs text-slate-500 uppercase font-semibold">Allergies</p><p className="mt-1 font-semibold text-amber-800">{patient.allergies.length ? patient.allergies.join(', ') : 'No known allergies'}</p></div></section>
      <div className="grid grid-cols-[1.1fr_.9fr] gap-8 mt-8"><section className="bg-white border rounded-2xl p-6"><div className="flex justify-between items-center"><h2 className="font-bold text-xl">Latest visit</h2>{latest && <span className="text-sm text-slate-500">{formatDemoDate(latest.createdAt)}</span>}</div>{latest ? <div className="mt-5 space-y-5"><Info label="Diagnosis" value={latest.diagnosis} /><Info label="Symptoms" value={latest.symptoms.join(', ') || 'None recorded'} /><Info label="Investigations" value={latest.investigations || 'None recorded'} /><Info label="Recommended Tests" value={latest.recommendedTests?.join(', ') || 'None recommended'} /><Info label="Prescription Language" value={latest.prescriptionLanguage || 'English'} /><Info label="Prescription" value={latest.medicines.map((item) => `${item.name} · ${item.dose} · ${item.duration} days`).join('\n') || 'No medicines recorded'} /><Info label="Advice" value={latest.advice || 'None recorded'} /></div> : <p className="py-16 text-center text-slate-400">No previous consultations.</p>}
          {queueId ? <Link href={`/consultation/entry?patient=${patient.id}&queue=${queueId}`} className="mt-6 flex justify-center bg-blue-700 text-white rounded-lg py-3 font-semibold">Start consultation</Link> : <p className="mt-6 bg-slate-50 border rounded-lg p-3 text-sm text-slate-500">Add this patient to today’s queue before starting another consultation.</p>}</section>
        <aside className="bg-white border rounded-2xl p-6"><h2 className="font-bold text-xl">Visit history</h2><div className="mt-4 divide-y">{visits.map((visit) => <div key={visit.id} className="py-4"><div className="flex justify-between"><span className="font-semibold">{visit.diagnosis}</span><span className="text-sm text-slate-500">{formatDemoDate(visit.createdAt)}</span></div><p className="text-sm text-slate-500 mt-1">{visit.medicines.length} medicine{visit.medicines.length === 1 ? '' : 's'} · {visit.symptoms.join(', ') || 'No symptoms'}</p>{visit.recommendedTests?.length ? <p className="text-xs text-blue-700 mt-1">Tests: {visit.recommendedTests.join(', ')}</p> : null}</div>)}{!visits.length && <p className="py-12 text-center text-slate-400">No visit history yet.</p>}</div></aside></div>
    </main></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs uppercase font-semibold text-slate-400">{label}</p><p className="mt-1 whitespace-pre-line">{value}</p></div>; }
