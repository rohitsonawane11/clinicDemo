import { redirect } from 'next/navigation';

export default function DoctorDashboard() {
  redirect('/doctor/queue');
}
