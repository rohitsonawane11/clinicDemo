'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { ClinicMedicine, PrescriptionPreset, PrescriptionPresetMedicine } from '../../../lib/types/clinic';
import { addPresetToClinic, deletePresetFromClinic, getActiveClinic, getClinicMedicines, getClinicPresets, updatePresetInClinic } from '../../../lib/store/clinicStore';

const emptyMedicine = (): PrescriptionPresetMedicine => ({ name: '', type: 'Tablet', dose: '1-0-1', timing: 'After Food', duration: 3 });

export default function PresetSettingsPage() {
  const [presets, setPresets] = useState<PrescriptionPreset[]>([]);
  const [catalog, setCatalog] = useState<ClinicMedicine[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicine, setMedicine] = useState<PrescriptionPresetMedicine>(emptyMedicine());
  const [medicines, setMedicines] = useState<PrescriptionPresetMedicine[]>([]);
  const [editingMedicineIndex, setEditingMedicineIndex] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PrescriptionPreset | null>(null);

  const refresh = () => {
    const clinic = getActiveClinic();
    setPresets(getClinicPresets(clinic.id));
    setCatalog(getClinicMedicines(clinic.id));
  };

  useEffect(() => {
    // Hydrate clinic-scoped data after localStorage is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchOpen || medicine.name.trim().length < 2) return [];
    const query = medicine.name.toLowerCase();
    return catalog.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 7);
  }, [catalog, medicine.name, searchOpen]);

  const resetEditor = () => {
    setEditingId(null); setName(''); setDiagnosis(''); setSymptoms(''); setAdvice(''); setMedicine(emptyMedicine()); setMedicines([]); setEditingMedicineIndex(null); setErrors({}); setSearchOpen(false);
  };

  const editPreset = (preset: PrescriptionPreset) => {
    setEditingId(preset.id); setName(preset.label); setDiagnosis(preset.diagnosis); setSymptoms(preset.symptoms.join(', ')); setAdvice(preset.advice); setMedicines(preset.medicines); setMedicine(emptyMedicine()); setEditingMedicineIndex(null); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addMedicine = () => {
    const medName = medicine.name.trim();
    if (!medName) { setErrors((current) => ({ ...current, medicine: 'Choose or enter a medicine.' })); return; }
    if (medicines.some((item, index) => index !== editingMedicineIndex && item.name.toLowerCase() === medName.toLowerCase())) { setErrors((current) => ({ ...current, medicine: 'This medicine is already in the preset.' })); return; }
    const nextMedicine = { ...medicine, name: medName, duration: Math.max(1, medicine.duration) };
    setMedicines((items) => editingMedicineIndex === null ? [...items, nextMedicine] : items.map((item, index) => index === editingMedicineIndex ? nextMedicine : item));
    setMedicine(emptyMedicine()); setEditingMedicineIndex(null); setSearchOpen(false); setErrors((current) => ({ ...current, medicine: '' }));
  };

  const moveMedicine = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= medicines.length) return;
    setMedicines((items) => { const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; return next; });
    setEditingMedicineIndex(null);
    setMedicine(emptyMedicine());
  };

  const savePreset = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter a preset name.';
    if (!diagnosis.trim()) nextErrors.diagnosis = 'Enter the default diagnosis.';
    if (medicines.length === 0) nextErrors.medicines = 'Add at least one medicine.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const data = { label: name.trim(), diagnosis: diagnosis.trim(), symptoms: symptoms.split(',').map((item) => item.trim()).filter(Boolean), advice: advice.trim(), medicines, icon: 'prescriptions', color: '#0B57D0' };
    if (editingId) updatePresetInClinic(editingId, data);
    else addPresetToClinic(getActiveClinic().id, data);
    refresh(); resetEditor(); setMessage(editingId ? 'Preset updated.' : 'Preset created and added to Quick Templates.');
    window.setTimeout(() => setMessage(''), 3000);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deletePresetFromClinic(deleteTarget.id); setDeleteTarget(null); refresh(); setMessage('Preset deleted.');
  };

  return <div className="min-h-screen bg-background text-on-background">
    <header className="h-16 bg-surface border-b border-outline-variant px-lg flex items-center justify-between sticky top-0 z-30"><Link href="/settings" className="flex items-center gap-xs font-bold text-primary"><span className="material-symbols-outlined">arrow_back</span>Clinic Settings</Link><Link href="/consultation/entry" className="text-xs font-bold text-primary">Open Consultation</Link></header>
    {message && <div role="status" className="fixed top-20 right-6 z-50 bg-on-surface text-surface px-md py-sm rounded-lg shadow-lg text-sm font-semibold">{message}</div>}

    <main className="max-w-7xl mx-auto p-lg space-y-lg">
      <div><p className="text-xs font-bold text-primary uppercase tracking-wider">Clinic Settings</p><h1 className="text-2xl font-extrabold">Prescription Presets</h1><p className="text-sm text-on-surface-variant mt-1">Create reusable clinical shortcuts. All medication data in this demo is fictional.</p></div>

      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)] gap-lg items-start">
        <form onSubmit={savePreset} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg space-y-md shadow-xs">
          <div className="flex justify-between items-center"><h2 className="font-extrabold">{editingId ? 'Edit preset' : 'Create preset'}</h2>{editingId && <button type="button" onClick={resetEditor} className="text-xs font-bold text-primary">Cancel editing</button>}</div>
          <div className="grid grid-cols-2 gap-md"><Field label="Preset name *" value={name} onChange={setName} placeholder="e.g. Viral Fever" error={errors.name} /><Field label="Diagnosis *" value={diagnosis} onChange={setDiagnosis} placeholder="Default clinical diagnosis" error={errors.diagnosis} /></div>
          <Field label="Symptoms" value={symptoms} onChange={setSymptoms} placeholder="Fever, headache, body pain" hint="Separate symptoms with commas." />

          <div className="border-t border-outline-variant pt-md space-y-sm"><h3 className="text-sm font-extrabold">Add medicine</h3>
            <div className="relative"><label className="text-xs font-bold">Medicine name<input value={medicine.name} onFocus={() => setSearchOpen(true)} onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)} onChange={(e) => { setMedicine({ ...medicine, name: e.target.value }); setSearchOpen(true); }} placeholder="Type ‘para’ to search" autoComplete="off" className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-sm font-normal" /></label>{suggestions.length > 0 && <div className="absolute top-[62px] inset-x-0 z-20 bg-surface border border-outline-variant rounded-lg shadow-lg overflow-hidden">{suggestions.map((item) => <button key={item.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setMedicine({ ...medicine, name: item.name, type: item.type }); setSearchOpen(false); }} className="w-full px-sm py-2 text-left hover:bg-primary-container flex justify-between text-xs"><span className="font-semibold">{item.name}</span><span className="text-on-surface-variant">{item.type} · {item.category || 'General'}</span></button>)}</div>}</div>
            {errors.medicine && <p className="text-xs text-error">{errors.medicine}</p>}
            <div className="grid grid-cols-4 gap-sm"><Select label="Form" value={medicine.type} onChange={(value) => setMedicine({ ...medicine, type: value })} options={['Tablet','Capsule','Syrup','Drops','Injection','Ointment','Inhaler','Sachet','Other']} /><Select label="Frequency" value={medicine.dose} onChange={(value) => setMedicine({ ...medicine, dose: value })} options={['1-0-1','1-0-0','0-0-1','1-1-1','0-1-0','SOS']} /><Select label="Timing" value={medicine.timing} onChange={(value) => setMedicine({ ...medicine, timing: value })} options={['After Food','Before Food','With Food','Any Time','SOS']} /><label className="text-xs font-bold">Duration<input type="number" min={1} max={90} value={medicine.duration} onChange={(e) => setMedicine({ ...medicine, duration: Number(e.target.value) })} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-sm font-normal" /></label></div>
            <button type="button" onClick={addMedicine} className="w-full h-10 border border-primary text-primary rounded-lg text-xs font-bold"><span className="material-symbols-outlined text-[16px] align-middle mr-1">{editingMedicineIndex === null ? 'add' : 'save'}</span>{editingMedicineIndex === null ? 'Add medicine' : 'Update medicine'}</button>
          </div>

          <div className="space-y-xs"><h3 className="text-sm font-extrabold">Medicines in preset ({medicines.length})</h3>{medicines.length === 0 ? <div className="border border-dashed border-outline-variant rounded-xl py-lg text-center text-xs text-on-surface-variant">No medicines added yet.</div> : medicines.map((item, index) => <div key={`${item.name}-${index}`} className={`border rounded-lg px-sm py-2 flex items-center gap-sm ${editingMedicineIndex === index ? 'border-primary bg-primary-container/20' : 'border-outline-variant'}`}><span className="w-6 h-6 rounded-full bg-primary-container text-primary text-[11px] font-bold grid place-items-center">{index + 1}</span><div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{item.name} · {item.type}</p><p className="text-[10px] text-on-surface-variant">{item.dose} · {item.timing} · {item.duration} days</p></div><button type="button" onClick={() => { setMedicine(item); setEditingMedicineIndex(index); window.scrollTo({ top: 220, behavior: 'smooth' }); }} aria-label={`Edit ${item.name}`} className="p-1 text-primary"><span className="material-symbols-outlined text-[17px]">edit</span></button><button type="button" disabled={index === 0} onClick={() => moveMedicine(index, -1)} aria-label={`Move ${item.name} up`} className="p-1 text-primary disabled:opacity-25"><span className="material-symbols-outlined text-[17px]">arrow_upward</span></button><button type="button" disabled={index === medicines.length - 1} onClick={() => moveMedicine(index, 1)} aria-label={`Move ${item.name} down`} className="p-1 text-primary disabled:opacity-25"><span className="material-symbols-outlined text-[17px]">arrow_downward</span></button><button type="button" onClick={() => { setMedicines((items) => items.filter((_, itemIndex) => itemIndex !== index)); if (editingMedicineIndex === index) { setEditingMedicineIndex(null); setMedicine(emptyMedicine()); } }} aria-label={`Remove ${item.name}`} className="p-1 text-error"><span className="material-symbols-outlined text-[17px]">delete</span></button></div>)}{errors.medicines && <p className="text-xs text-error">{errors.medicines}</p>}</div>
          <label className="text-xs font-bold">Advice / instructions<textarea value={advice} onChange={(e) => setAdvice(e.target.value)} rows={3} placeholder="Rest, fluids, warning signs, follow-up instructions…" className="mt-1 w-full border border-outline-variant rounded-lg p-sm font-normal resize-none" /></label>
          <div className="flex justify-end"><button type="submit" className="h-11 px-xl bg-primary text-white rounded-lg text-sm font-bold">{editingId ? 'Update Preset' : 'Save Preset'}</button></div>
        </form>

        <div className="space-y-md sticky top-20"><section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-xs"><h2 className="font-extrabold mb-sm">Live preview</h2><div className="border border-outline-variant rounded-xl p-md space-y-sm"><div><p className="text-[10px] text-on-surface-variant uppercase">Preset</p><p className="font-extrabold">{name || 'Untitled preset'}</p></div><div><p className="text-[10px] text-on-surface-variant uppercase">Symptoms</p><p className="text-xs">{symptoms || 'No symptoms selected'}</p></div><div><p className="text-[10px] text-on-surface-variant uppercase">Diagnosis</p><p className="text-xs">{diagnosis || 'No diagnosis entered'}</p></div><div><p className="text-[10px] text-on-surface-variant uppercase">Prescription</p>{medicines.length === 0 ? <p className="text-xs text-on-surface-variant">No medicines added</p> : <ol className="space-y-xs">{medicines.map((item, index) => <li key={`${item.name}-preview-${index}`} className="text-xs"><strong>{index + 1}. {item.name}</strong><br/><span className="text-on-surface-variant">{item.dose} · {item.timing} · {item.duration} days</span></li>)}</ol>}</div>{advice && <div><p className="text-[10px] text-on-surface-variant uppercase">Advice</p><p className="text-xs">{advice}</p></div>}</div></section></div>
      </div>

      <section className="space-y-sm"><div className="flex justify-between items-end"><div><h2 className="text-lg font-extrabold">Saved presets</h2><p className="text-xs text-on-surface-variant">These appear in consultation Quick Templates.</p></div><span className="text-xs font-bold text-on-surface-variant">{presets.length} presets</span></div><div className="grid grid-cols-3 gap-sm">{presets.map((preset) => <article key={preset.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md"><div className="flex justify-between gap-sm"><div><div className="flex items-center gap-xs"><h3 className="font-bold text-sm">{preset.label}</h3><span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${preset.isDefault ? 'bg-surface-container text-on-surface-variant' : 'bg-primary-container text-primary'}`}>{preset.isDefault ? 'Default' : 'Custom'}</span></div><p className="text-xs text-on-surface-variant mt-1">{preset.medicines.length} medicines · {preset.symptoms.length} symptoms</p></div><div className="flex"><button onClick={() => editPreset(preset)} aria-label={`Edit ${preset.label}`} className="p-1 text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button><button onClick={() => setDeleteTarget(preset)} aria-label={`Delete ${preset.label}`} className="p-1 text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button></div></div></article>)}</div></section>
    </main>

    {deleteTarget && <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-md"><div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="bg-surface rounded-2xl p-lg max-w-[26rem] w-full shadow-xl"><h2 id="delete-title" className="text-lg font-extrabold">Delete “{deleteTarget.label}”?</h2><p className="text-sm text-on-surface-variant mt-xs">It will be removed from Quick Templates. Existing consultations will not change.</p><div className="flex justify-end gap-sm mt-lg"><button onClick={() => setDeleteTarget(null)} className="h-10 px-md rounded-lg border border-outline-variant text-xs font-bold">Cancel</button><button onClick={confirmDelete} className="h-10 px-md rounded-lg bg-error text-white text-xs font-bold">Delete Preset</button></div></div></div>}
  </div>;
}

function Field({ label, value, onChange, placeholder, hint, error }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; hint?: string; error?: string }) { return <label className="text-xs font-bold">{label}<input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1 w-full h-10 border rounded-lg px-sm font-normal ${error ? 'border-error' : 'border-outline-variant'}`} />{error ? <span className="block mt-1 text-[10px] text-error">{error}</span> : hint ? <span className="block mt-1 text-[10px] text-on-surface-variant">{hint}</span> : null}</label>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="text-xs font-bold">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-10 border border-outline-variant rounded-lg px-2 bg-surface font-normal">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
