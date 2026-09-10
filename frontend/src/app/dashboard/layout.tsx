'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-brand-600 animate-pulse" />
        </div>
        <div className="w-6 h-6 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">Verifying MediBridge LK Session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
