'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { Clinic, ClinicMedicine, Doctor, PrescriptionPreset, Receptionist } from '../../lib/types/clinic';
import {
  addDoctorToClinic,
  addReceptionistToClinic,
  getActiveClinic,
  getClinicDoctors,
  getClinicMedicines,
  getClinicPresets,
  getClinicReceptionists,
  updateActiveClinic,
  updateDoctorInClinic,
  updateReceptionistInClinic,
} from '../../lib/store/clinicStore';
import { resetDemoState } from '../../lib/store/demoStore';

type Section = 'profile' | 'team' | 'presets' | 'medicines' | 'print' | 'demo';

const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'profile', label: 'Clinic Profile', icon: 'domain' },
  { id: 'team', label: 'Team & Roles', icon: 'groups' },
  { id: 'presets', label: 'Prescription Presets', icon: 'prescriptions' },
  { id: 'medicines', label: 'Medicine Catalog', icon: 'medication' },
  { id: 'print', label: 'Print Settings', icon: 'print' },
  { id: 'demo', label: 'Demo Controls', icon: 'restart_alt' },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('profile');
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [presets, setPresets] = useState<PrescriptionPreset[]>([]);
  const [medicines, setMedicines] = useState<ClinicMedicine[]>([]);
  const [message, setMessage] = useState('');
  const [teamRole, setTeamRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamPhone, setTeamPhone] = useState('');

  const refresh = () => {
    const active = getActiveClinic();
    setClinic(active);
    setDoctors(getClinicDoctors(active.id));
    setReceptionists(getClinicReceptionists(active.id));
    setPresets(getClinicPresets(active.id));
    setMedicines(getClinicMedicines(active.id));
  };

  useEffect(() => {
    // Hydrate the local demo store after localStorage becomes available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const notify = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 2600); };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clinic) return;
    setClinic(updateActiveClinic(clinic));
    notify('Clinic profile saved.');
  };

  const addTeamMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clinic || !teamName.trim()) return;
    if (teamRole === 'DOCTOR') {
      addDoctorToClinic(clinic.id, { name: teamName.startsWith('Dr.') ? teamName : `Dr. ${teamName}`, qualification: 'MBBS', registrationNumber: `REG-${Date.now().toString().slice(-6)}`, specialty: clinic.primarySpecialty, email: teamEmail, phone: teamPhone });
    } else {
      addReceptionistToClinic(clinic.id, { name: teamName.trim(), email: teamEmail, phone: teamPhone });
    }
    setTeamName(''); setTeamEmail(''); setTeamPhone(''); refresh(); notify(`${teamRole === 'DOCTOR' ? 'Doctor' : 'Receptionist'} added.`);
  };

  if (!clinic) return <div className="min-h-screen grid place-items-center text-on-surface-variant">Loading clinic settings…</div>;

  return <div className="min-h-screen bg-background text-on-background">
    <header className="h-16 bg-surface border-b border-outline-variant px-lg flex items-center justify-between sticky top-0 z-20">
      <Link href="/" className="flex items-center gap-sm font-bold text-primary"><span className="material-symbols-outlined">local_hospital</span>Bharat Clinic</Link>
      <div className="flex items-center gap-sm"><span className="text-xs text-on-surface-variant">{clinic.name}</span><Link href="/doctor/queue" className="h-9 px-md rounded-lg bg-primary text-white text-xs font-bold flex items-center">Back to dashboard</Link></div>
    </header>

    {message && <div role="status" className="fixed top-20 right-6 z-50 bg-on-surface text-surface px-md py-sm rounded-lg shadow-lg text-sm font-semibold">{message}</div>}

    <main className="max-w-6xl mx-auto p-lg grid grid-cols-[240px_minmax(0,1fr)] gap-xl">
      <aside>
        <h1 className="text-2xl font-extrabold mb-xs">Clinic Settings</h1>
        <p className="text-xs text-on-surface-variant mb-lg">Manage your workspace without repeating onboarding.</p>
        <nav className="space-y-xs">{sections.map((item) => <button key={item.id} onClick={() => setSection(item.id)} className={`w-full h-11 px-sm rounded-lg flex items-center gap-sm text-sm font-semibold ${section === item.id ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}><span className="material-symbols-outlined text-[19px]">{item.icon}</span>{item.label}</button>)}</nav>
      </aside>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-xs min-h-[620px]">
        {section === 'profile' && <form onSubmit={saveProfile} className="space-y-lg">
          <PageTitle title="Clinic Profile" text="Details shown on prescriptions, receipts, and clinic screens." />
          <div className="grid grid-cols-2 gap-md"><Field label="Clinic name" value={clinic.name} onChange={(value) => setClinic({ ...clinic, name: value })} /><Field label="Phone" value={clinic.phone} onChange={(value) => setClinic({ ...clinic, phone: value })} /><Field label="Email" type="email" value={clinic.email || ''} onChange={(value) => setClinic({ ...clinic, email: value })} /><Field label="Primary specialty" value={clinic.primarySpecialty} onChange={(value) => setClinic({ ...clinic, primarySpecialty: value as Clinic['primarySpecialty'] })} /><Field label="Address" value={clinic.address.addressLine1} onChange={(value) => setClinic({ ...clinic, address: { ...clinic.address, addressLine1: value } })} /><Field label="City" value={clinic.address.city} onChange={(value) => setClinic({ ...clinic, address: { ...clinic.address, city: value } })} /></div>
          <SaveButton label="Save Profile" />
        </form>}

        {section === 'team' && <div className="space-y-lg">
          <PageTitle title="Team & Roles" text="Add staff and deactivate access without removing historical records." />
          <form onSubmit={addTeamMember} className="grid grid-cols-[130px_1fr_1fr_1fr_auto] gap-sm items-end bg-surface-container-low p-md rounded-xl"><label className="text-xs font-bold">Role<select value={teamRole} onChange={(e) => setTeamRole(e.target.value as typeof teamRole)} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-2 bg-surface"><option value="DOCTOR">Doctor</option><option value="RECEPTIONIST">Receptionist</option></select></label><MiniField label="Name" value={teamName} setValue={setTeamName} /><MiniField label="Email" value={teamEmail} setValue={setTeamEmail} type="email" /><MiniField label="Mobile" value={teamPhone} setValue={setTeamPhone} /><button className="h-10 px-md bg-primary text-white rounded-lg text-xs font-bold">Add</button></form>
          <div className="border border-outline-variant rounded-xl overflow-hidden"><div className="grid grid-cols-[1.4fr_110px_1fr_100px_110px] gap-sm bg-surface-container px-md py-sm text-xs font-bold"><span>Name</span><span>Role</span><span>Contact</span><span>Status</span><span>Action</span></div>{doctors.map((doctor) => <TeamRow key={doctor.id} name={doctor.name} role="Doctor" contact={doctor.email || doctor.phone} active={doctor.isActive} onToggle={() => { updateDoctorInClinic(doctor.id, { isActive: !doctor.isActive }); refresh(); }} />)}{receptionists.map((person) => <TeamRow key={person.id} name={person.name} role="Receptionist" contact={person.email || person.phone} active={person.isActive} onToggle={() => { updateReceptionistInClinic(person.id, { isActive: !person.isActive }); refresh(); }} />)}</div>
        </div>}

        {section === 'presets' && <div className="space-y-lg"><PageTitle title="Prescription Presets" text="Clinic-specific shortcuts available in consultation Quick Templates." /><div className="flex items-center justify-between bg-primary-container/30 border border-primary/20 rounded-xl p-md"><div><p className="font-bold">Create and manage full presets</p><p className="text-xs text-on-surface-variant mt-1">Configure symptoms, diagnosis, multiple medicines, frequency, timing, advice, order, and preview.</p></div><Link href="/settings/presets" className="h-10 px-md bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-xs">Open Preset Manager<span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div><div className="grid grid-cols-2 gap-sm">{presets.map((preset) => <div key={preset.id} className="border border-outline-variant rounded-xl p-md"><div className="flex gap-xs items-center"><h3 className="font-bold">{preset.label}</h3><span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container">{preset.isDefault ? 'Default' : 'Custom'}</span></div><p className="text-xs text-on-surface-variant mt-1">{preset.medicines.length} medicines · {preset.symptoms.length} symptoms</p></div>)}</div></div>}

        {section === 'medicines' && <div className="space-y-lg"><PageTitle title="Medicine Catalog" text="Medicines used by autocomplete in presets and consultations. Fictional demo content only." /><div className="flex items-center justify-between bg-primary-container/30 border border-primary/20 rounded-xl p-md"><div><p className="font-bold">Manage the structured formulary</p><p className="text-xs text-on-surface-variant mt-1">Add generic and brand names, strength, form, and category with duplicate protection.</p></div><Link href="/settings/medicines" className="h-10 px-md bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-xs">Open Medicine Catalog<span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div><div className="grid grid-cols-2 gap-xs max-h-[450px] overflow-y-auto">{medicines.map((medicine) => <div key={medicine.id} className="border border-outline-variant rounded-lg px-sm py-2"><p className="text-sm font-semibold">{medicine.name}</p><p className="text-[10px] text-on-surface-variant">{medicine.type} · {medicine.category || 'General'}</p></div>)}</div></div>}

        {section === 'print' && <div className="space-y-lg"><PageTitle title="Print Settings" text="Configure the default prescription printing experience." /><label className="flex items-center justify-between border border-outline-variant rounded-xl p-md"><div><p className="font-bold">Print after consultation</p><p className="text-xs text-on-surface-variant">Open the browser print dialog after a visit is saved.</p></div><input type="checkbox" checked={clinic.settings.autoPrintPrescription} onChange={(e) => { const next = updateActiveClinic({ settings: { ...clinic.settings, autoPrintPrescription: e.target.checked } }); setClinic(next); notify('Print preference saved.'); }} className="w-5 h-5" /></label><div className="grid grid-cols-2 gap-md"><div className="border border-outline-variant rounded-xl p-md"><p className="text-xs text-on-surface-variant">Paper size</p><p className="font-bold mt-1">A4</p></div><div className="border border-outline-variant rounded-xl p-md"><p className="text-xs text-on-surface-variant">Prescription header</p><p className="font-bold mt-1">Clinic name and address</p></div></div></div>}

        {section === 'demo' && <div className="space-y-lg"><PageTitle title="Demo Controls" text="Restore fictional patients, today’s queue, and visit history." /><div className="border border-error/30 bg-error/5 rounded-xl p-lg"><h3 className="font-bold">Reset demo patient data</h3><p className="text-xs text-on-surface-variant mt-1 mb-md">This restores the original fictional patients, queue entries, and consultations. Clinic profile and settings are retained.</p><button onClick={() => { resetDemoState(); notify('Demo patient data restored.'); }} className="h-10 px-md border border-error text-error rounded-lg text-xs font-bold">Reset Demo Data</button></div></div>}
      </section>
    </main>
  </div>;
}

function PageTitle({ title, text }: { title: string; text: string }) { return <div className="border-b border-outline-variant pb-md"><h2 className="text-xl font-extrabold">{title}</h2><p className="text-sm text-on-surface-variant mt-1">{text}</p></div>; }
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="text-xs font-bold">{label}<input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-11 border border-outline-variant rounded-lg px-sm font-normal text-sm" /></label>; }
function MiniField({ label, value, setValue, type = 'text' }: { label: string; value: string; setValue: (value: string) => void; type?: string }) { return <label className="text-xs font-bold">{label}<input required type={type} value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-2 font-normal" /></label>; }
function SaveButton({ label }: { label: string }) { return <div className="flex justify-end"><button className="h-10 px-lg bg-primary text-white rounded-lg text-xs font-bold">{label}</button></div>; }
function TeamRow({ name, role, contact, active, onToggle }: { name: string; role: string; contact: string; active: boolean; onToggle: () => void }) { return <div className="grid grid-cols-[1.4fr_110px_1fr_100px_110px] gap-sm items-center px-md py-sm border-t border-outline-variant text-xs"><span className="font-bold">{name}</span><span>{role}</span><span className="truncate text-on-surface-variant">{contact || 'Not provided'}</span><span className={active ? 'text-tertiary font-bold' : 'text-on-surface-variant'}>{active ? 'Active' : 'Inactive'}</span><button onClick={onToggle} className="text-primary font-bold text-left">{active ? 'Deactivate' : 'Reactivate'}</button></div>; }
