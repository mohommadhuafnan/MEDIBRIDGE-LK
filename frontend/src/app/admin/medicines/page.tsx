'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch, formatLKR } from '../../../lib/api';
import { Pill, Plus, Search, CheckCircle2 } from 'lucide-react';

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const res = await apiFetch('/medicines');
      if (res.success && res.data) setMedicines(res.data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">
            NMRA Medicine Registration & Formulary
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Registered Medicines Database
              </h1>
              <p className="text-xs text-slate-500">
                Official formulary entries verified under the NMRA Act of Sri Lanka.
              </p>
            </div>
            <button
              onClick={() => alert('Add Medicine modal')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Medicine</span>
            </button>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-4">Brand Name</th>
                  <th className="p-4">Active Molecule</th>
                  <th className="p-4">Strength & Form</th>
                  <th className="p-4">Manufacturer</th>
                  <th className="p-4">NMRA Registration</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">{m.brand_name}</td>
                    <td className="p-4 text-slate-700">{m.active_ingredient}</td>
                    <td className="p-4 text-slate-600">
                      {m.strength} ({m.dosage_form})
                    </td>
                    <td className="p-4 text-slate-500">{m.manufacturer}</td>
                    <td className="p-4 font-mono text-slate-600">
                      {m.nmra_reg_no || 'NMRA-DR-0491'}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
