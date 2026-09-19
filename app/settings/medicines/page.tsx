'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { ClinicMedicine } from '../../../lib/types/clinic';
import { addMedicineToClinic, deleteMedicineFromClinic, getActiveClinic, getClinicMedicines, updateMedicineInClinic } from '../../../lib/store/clinicStore';

const FORMS = ['Tablet', 'Capsule', 'Syrup', 'Drops', 'Injection', 'Ointment', 'Inhaler', 'Sachet', 'Other'];

export default function MedicineCatalogPage() {
  const [medicines, setMedicines] = useState<ClinicMedicine[]>([]);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [strength, setStrength] = useState('');
  const [form, setForm] = useState('Tablet');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refresh = () => setMedicines(getClinicMedicines(getActiveClinic().id));
  useEffect(() => {
    // Hydrate the client-side clinic formulary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return medicines;
    return medicines.filter((medicine) => [medicine.name, medicine.genericName, medicine.brandName, medicine.strength, medicine.type, medicine.category].some((field) => field?.toLowerCase().includes(value)));
  }, [medicines, query]);

  const resetForm = () => { setEditingId(null); setGenericName(''); setBrandName(''); setStrength(''); setForm('Tablet'); setCategory('General'); setError(''); };
  const displayName = [brandName.trim() || genericName.trim(), strength.trim()].filter(Boolean).join(' ');

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!genericName.trim()) return setError('Generic name is required.');
    if (!strength.trim()) return setError('Strength is required.');
    const duplicate = medicines.find((item) => item.id !== editingId && (item.genericName || item.name).toLowerCase() === genericName.trim().toLowerCase() && (item.strength || '').toLowerCase() === strength.trim().toLowerCase() && item.type === form);
    if (duplicate) return setError('This generic, strength, and form already exist in the catalog.');
    const details = { name: displayName, genericName: genericName.trim(), brandName: brandName.trim() || undefined, strength: strength.trim(), type: form, category: category.trim() || 'General' };
    if (editingId) updateMedicineInClinic(editingId, details);
    else addMedicineToClinic(getActiveClinic().id, displayName, form, details.category, details);
    const wasEditing = Boolean(editingId); resetForm(); refresh(); setMessage(wasEditing ? 'Medicine updated.' : 'Medicine added to autocomplete.'); window.setTimeout(() => setMessage(''), 2600);
  };

  const edit = (medicine: ClinicMedicine) => {
    setEditingId(medicine.id); setGenericName(medicine.genericName || medicine.name.replace(/\s+\d+(?:\.\d+)?\s*(?:mg|ml|mcg|g|%)$/i, '')); setBrandName(medicine.brandName || ''); setStrength(medicine.strength || medicine.name.match(/\d+(?:\.\d+)?\s*(?:mg|ml|mcg|g|%)/i)?.[0] || ''); setForm(medicine.type); setCategory(medicine.category || 'General'); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className="min-h-screen bg-background text-on-background">
    <header className="h-16 bg-surface border-b border-outline-variant px-lg flex items-center justify-between sticky top-0 z-30"><Link href="/settings" className="flex items-center gap-xs font-bold text-primary"><span className="material-symbols-outlined">arrow_back</span>Clinic Settings</Link><span className="text-xs text-on-surface-variant">Fictional demonstration catalog</span></header>
    {message && <div role="status" className="fixed top-20 right-6 z-50 bg-on-surface text-surface px-md py-sm rounded-lg shadow-lg text-sm font-semibold">{message}</div>}
    <main className="max-w-6xl mx-auto p-lg space-y-lg"><div><p className="text-xs font-bold text-primary uppercase tracking-wider">Clinic Settings</p><h1 className="text-2xl font-extrabold">Medicine Catalog</h1><p className="text-sm text-on-surface-variant mt-1">Manage structured medicines used by preset and consultation autocomplete.</p></div>
      <form onSubmit={save} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg space-y-md"><div className="flex justify-between"><h2 className="font-extrabold">{editingId ? 'Edit medicine' : 'Add medicine'}</h2>{editingId && <button type="button" onClick={resetForm} className="text-xs font-bold text-primary">Cancel editing</button>}</div><div className="grid grid-cols-5 gap-sm"><Input label="Generic name *" value={genericName} setValue={setGenericName} placeholder="Paracetamol" /><Input label="Brand name" value={brandName} setValue={setBrandName} placeholder="Dolo (optional)" /><Input label="Strength *" value={strength} setValue={setStrength} placeholder="500mg" /><label className="text-xs font-bold">Form<select value={form} onChange={(e) => setForm(e.target.value)} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-2 bg-surface font-normal">{FORMS.map((item) => <option key={item}>{item}</option>)}</select></label><Input label="Category" value={category} setValue={setCategory} placeholder="Analgesic" /></div>{error && <p className="text-xs text-error">{error}</p>}<div className="flex justify-between items-center"><p className="text-xs text-on-surface-variant">Display: <strong className="text-on-surface">{displayName || 'Medicine strength'}</strong> · {form}</p><button className="h-10 px-lg bg-primary text-white rounded-lg text-xs font-bold">{editingId ? 'Update Medicine' : 'Add Medicine'}</button></div></form>
      <section className="space-y-md"><div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Catalog</h2><p className="text-xs text-on-surface-variant">{filtered.length} of {medicines.length} medicines</p></div><div className="relative w-80"><span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search generic, brand, strength, form…" className="w-full h-10 pl-9 pr-sm border border-outline-variant rounded-lg text-xs" /></div></div>{filtered.length === 0 ? <div className="border border-dashed border-outline-variant rounded-xl py-xl text-center"><span className="material-symbols-outlined text-on-surface-variant">search_off</span><p className="font-bold text-sm">No medicines found</p><p className="text-xs text-on-surface-variant">Clear the search or add this medicine above.</p></div> : <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"><div className="grid grid-cols-[1.2fr_1fr_100px_120px_90px] gap-sm bg-surface-container px-md py-sm text-xs font-bold"><span>Medicine</span><span>Generic / Brand</span><span>Form</span><span>Category</span><span>Actions</span></div>{filtered.map((medicine) => <div key={medicine.id} className="grid grid-cols-[1.2fr_1fr_100px_120px_90px] gap-sm items-center px-md py-sm border-t border-outline-variant text-xs"><div><p className="font-bold">{medicine.name}</p><p className="text-[10px] text-on-surface-variant">{medicine.strength || 'Strength included in name'}</p></div><span>{medicine.genericName || medicine.name}{medicine.brandName ? ` / ${medicine.brandName}` : ''}</span><span>{medicine.type}</span><span>{medicine.category || 'General'}</span><div className="flex"><button onClick={() => edit(medicine)} className="p-1 text-primary" aria-label={`Edit ${medicine.name}`}><span className="material-symbols-outlined text-[17px]">edit</span></button><button onClick={() => { deleteMedicineFromClinic(medicine.id); refresh(); }} className="p-1 text-error" aria-label={`Delete ${medicine.name}`}><span className="material-symbols-outlined text-[17px]">delete</span></button></div></div>)}</div>}</section>
    </main>
  </div>;
}

function Input({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label className="text-xs font-bold">{label}<input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-2 font-normal" /></label>; }
