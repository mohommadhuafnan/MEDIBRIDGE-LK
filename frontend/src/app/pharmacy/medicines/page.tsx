'use client';

import React, { useState, useEffect } from 'react';
import PharmacySidebar from '../../../components/PharmacySidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch, formatLKR } from '../../../lib/api';
import { Pill, Search, Building2, CheckCircle2 } from 'lucide-react';

export default function PharmacyMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const res = await apiFetch('/medicines');
      if (res.success && res.data) setMedicines(res.data);
    }
    load();
  }, []);

  const filtered = medicines.filter(
    (m) =>
      m.brand_name.toLowerCase().includes(search.toLowerCase()) ||
      m.active_ingredient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PharmacySidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">Pharmacy Product Catalog</span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dispensary Product Catalog
            </h1>
            <p className="text-xs text-slate-500">
              Medicines available in the national formulary and State Pharmaceuticals Corporation inventory.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product catalog..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <div
                key={m._id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{m.brand_name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {m.dosage_form}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {m.active_ingredient} ({m.strength})
                </p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">{m.pack_size}</span>
                  <span className="font-extrabold text-slate-900">
                    {m.nmra_mrp ? formatLKR(m.nmra_mrp) : 'Ref POS'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
