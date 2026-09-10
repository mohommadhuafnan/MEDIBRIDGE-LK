'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-amber-600 animate-pulse" />
        </div>
        <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">Verifying NMRA Administrative Credentials...</p>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
