'use client';

import type { Consultation, Patient, QueueEntry, QueueStatus } from '../types/clinic';

const VERSION = 1;
const KEY = 'bharat_clinic_demo_state_v1';
const CLINIC_ID = 'cln_demo_001';

export interface DemoState {
  version: number;
  patients: Patient[];
  queue: QueueEntry[];
  consultations: Consultation[];
}

const day = (offset = 0) => {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  return value.toISOString().slice(0, 10);
};

const at = (offset: number, hour: number, minute: number) => {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  value.setHours(hour, minute, 0, 0);
  return value.toISOString();
};

function seedState(): DemoState {
  const patients: Patient[] = [
    { id: '1', clinicId: CLINIC_ID, name: 'Rajesh Patil', age: 42, gender: 'Male', mobile: '9876543210', allergies: [], createdAt: at(-120, 9, 0) },
    { id: '2', clinicId: CLINIC_ID, name: 'Sita Devi', age: 68, gender: 'Female', mobile: '9820012345', allergies: ['Penicillin'], createdAt: at(-200, 9, 0) },
    { id: '3', clinicId: CLINIC_ID, name: 'Sneha Joshi', age: 29, gender: 'Female', mobile: '9765432109', allergies: [], createdAt: at(-30, 9, 0) },
    { id: '4', clinicId: CLINIC_ID, name: 'Amit Shah', age: 36, gender: 'Male', mobile: '9988776655', allergies: [], createdAt: at(-45, 9, 0) },
  ];
  const queue: QueueEntry[] = [
    { id: 'queue-1', clinicId: CLINIC_ID, patientId: '1', token: 4, date: day(), arrivedAt: at(0, 9, 45), status: 'IN_CONSULTATION', complaint: 'Fever and body ache' },
    { id: 'queue-2', clinicId: CLINIC_ID, patientId: '3', token: 5, date: day(), arrivedAt: at(0, 10, 5), status: 'WAITING', complaint: 'Headache' },
    { id: 'queue-3', clinicId: CLINIC_ID, patientId: '4', token: 6, date: day(), arrivedAt: at(0, 10, 15), status: 'WAITING', complaint: 'Cough' },
  ];
  const consultations: Consultation[] = [
    {
      id: 'visit-1', clinicId: CLINIC_ID, patientId: '1', createdAt: at(-17, 11, 30),
      vitals: { temp: '101.2', bp: '120/80', pulse: '88', spo2: '97', weight: '72' },
      symptoms: ['Fever', 'Body pain'], diagnosis: 'Viral fever',
      investigations: 'Febrile, throat congestion, no respiratory distress.',
      recommendedTests: ['CBC', 'Malaria Test'],
      medicines: [{ name: 'Sample Medicine 500mg', type: 'Tablet', dose: '1-0-1', timing: 'After Food', duration: 3 }],
      advice: 'Rest and stay hydrated.', prescriptionLanguage: 'English', notes: 'Demo visit record.',
    },
    {
      id: 'visit-2', clinicId: CLINIC_ID, patientId: '2', createdAt: at(-28, 10, 15),
      vitals: { temp: '98.4', bp: '142/88', pulse: '76', spo2: '98', weight: '61' },
      symptoms: ['Fatigue'], diagnosis: 'Routine follow-up', medicines: [],
      investigations: 'Blood pressure elevated compared with prior visit.',
      recommendedTests: ['Blood Sugar', 'ECG'],
      advice: 'Continue monitoring.', prescriptionLanguage: 'English', notes: 'Demo visit record.',
    },
  ];
  return { version: VERSION, patients, queue, consultations };
}

function valid(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') return false;
  const state = value as DemoState;
  return state.version === VERSION && Array.isArray(state.patients) && Array.isArray(state.queue) && Array.isArray(state.consultations);
}

export function getDemoState(): DemoState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (valid(parsed)) return parsed;
  } catch { /* reset malformed demo data below */ }
  const seed = seedState();
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function save(state: DemoState) {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('demo-state-change'));
  return state;
}

export function resetDemoState() { return save(seedState()); }
export function formatDemoDate(value: string) { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }
export function formatDemoTime(value: string) { return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
export function getPatient(id: string) { return getDemoState().patients.find((item) => item.id === id); }
export function findPatientByMobile(mobile: string) { return getDemoState().patients.find((item) => item.mobile === mobile.replace(/\D/g, '')); }
export function getPatientVisits(patientId: string) { return getDemoState().consultations.filter((item) => item.patientId === patientId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function getTodayQueue() { return getDemoState().queue.filter((item) => item.date === day()).sort((a, b) => a.token - b.token); }
export function getQueueEntry(id: string) { return getDemoState().queue.find((item) => item.id === id); }

export function registerPatient(input: Pick<Patient, 'name' | 'age' | 'gender' | 'mobile'>) {
  const state = getDemoState();
  const mobile = input.mobile.replace(/\D/g, '');
  if (state.patients.some((item) => item.mobile === mobile)) throw new Error('A patient with this mobile number already exists.');
  const patient: Patient = { ...input, mobile, id: `patient-${Date.now()}`, clinicId: CLINIC_ID, allergies: [], createdAt: new Date().toISOString() };
  state.patients.push(patient);
  save(state);
  return patient;
}

export function addPatientToQueue(patientId: string, complaint: string) {
  const state = getDemoState();
  const duplicate = state.queue.find((item) => item.patientId === patientId && item.date === day() && item.status !== 'COMPLETED');
  if (duplicate) throw new Error(`Patient already has active token #${String(duplicate.token).padStart(2, '0')}.`);
  const todays = state.queue.filter((item) => item.date === day());
  const entry: QueueEntry = {
    id: `queue-${Date.now()}`, clinicId: CLINIC_ID, patientId,
    token: Math.max(0, ...todays.map((item) => item.token)) + 1,
    date: day(), arrivedAt: new Date().toISOString(), status: 'WAITING', complaint: complaint.trim() || 'General consultation',
  };
  state.queue.push(entry);
  save(state);
  return entry;
}

export function updateQueueStatus(id: string, status: QueueStatus) {
  const state = getDemoState();
  const entry = state.queue.find((item) => item.id === id);
  if (!entry) throw new Error('Queue entry not found.');
  entry.status = status;
  save(state);
  return entry;
}

export function saveConsultation(input: Omit<Consultation, 'id' | 'clinicId' | 'createdAt'>) {
  const state = getDemoState();
  const consultation: Consultation = { ...input, id: `visit-${Date.now()}`, clinicId: CLINIC_ID, createdAt: new Date().toISOString() };
  state.consultations.push(consultation);
  if (input.queueEntryId) {
    const entry = state.queue.find((item) => item.id === input.queueEntryId);
    if (entry) entry.status = 'COMPLETED';
  }
  save(state);
  return consultation;
}
