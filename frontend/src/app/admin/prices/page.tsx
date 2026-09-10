'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch, formatLKR, formatDateLK } from '../../../lib/api';
import { DollarSign, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await apiFetch('/prices?price_type=NMRA_MRP');
      if (res.success && res.data) setPrices(res.data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">
            NMRA Gazetted Maximum Retail Price (MRP) Registry
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gazetted Price Ceilings
            </h1>
            <p className="text-xs text-slate-500">
              Maximum Retail Prices published by the Minister of Health under Section 142 of the NMRA Act No. 5 of 2015.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-4">Medicine Brand</th>
                  <th className="p-4">Active Chemical Molecule</th>
                  <th className="p-4">Gazetted MRP</th>
                  <th className="p-4">Gazette Reference</th>
                  <th className="p-4">Effective Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prices.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">{p.medicine_id?.brand_name}</td>
                    <td className="p-4 text-slate-700">
                      {p.medicine_id?.active_ingredient} ({p.medicine_id?.strength})
                    </td>
                    <td className="p-4 font-extrabold text-sm text-slate-900">
                      {formatLKR(p.price)}
                    </td>
                    <td className="p-4 text-slate-500">{p.source}</td>
                    <td className="p-4 text-slate-500">{formatDateLK(p.effective_from)}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE CEILING
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
