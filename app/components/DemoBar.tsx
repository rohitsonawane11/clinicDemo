'use client';

import { useRouter } from 'next/navigation';
import { resetDemoState } from '../../lib/store/demoStore';

export default function DemoBar() {
  const router = useRouter();
  return <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-6 py-2 flex items-center justify-between text-sm print:hidden">
    <span><strong>Demo Mode</strong> · All patients and prescriptions are fictional demonstration data.</span>
    <button className="font-semibold hover:underline" onClick={() => { resetDemoState(); router.push('/receptionist'); router.refresh(); }}>Reset demo data</button>
  </div>;
}
