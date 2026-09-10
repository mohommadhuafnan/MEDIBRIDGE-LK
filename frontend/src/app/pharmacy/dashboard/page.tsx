'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PharmacySidebar from '../../../components/PharmacySidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch, formatLKR, formatDateLK } from '../../../lib/api';
import {
  Building2,
  Pill,
  DollarSign,
  Package,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function PharmacyDashboardPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await apiFetch('/medicines');
      if (res.success && res.data) setMedicines(res.data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PharmacySidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              State Pharmaceuticals Corporation / Partner Pharmacy Portal
            </span>
          </div>
          <Link
            href="/pharmacy/prices"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Price CSV</span>
          </Link>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white shadow-floating space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full w-fit">
              Pharmacy Operations Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Rajya Osu Sala / Partner Pharmacy Management
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
              Manage retail medicine prices, upload batch CSV price lists, track NMRA gazetted MRP ceilings, and report real-time availability to Sri Lankan patients.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-slate-500">Active Products</span>
              <p className="text-2xl font-extrabold text-slate-900">{medicines.length || 38}</p>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-slate-500">Price Updates This Month</span>
              <p className="text-2xl font-extrabold text-brand-600">24 Records</p>
              <span className="text-[11px] text-slate-400 font-medium">History preserved</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-slate-500">In-Stock Availability</span>
              <p className="text-2xl font-extrabold text-emerald-600">94.8%</p>
              <span className="text-[11px] text-emerald-700 font-medium">High inventory health</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-slate-500">Pending Review</span>
              <p className="text-2xl font-extrabold text-amber-600">0</p>
              <span className="text-[11px] text-slate-400 font-medium">All gazetted</span>
            </div>
          </div>

          {/* Quick Price Update Action Table */}
          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900">
                Managed Products & Verified Prices
              </h2>
              <Link
                href="/pharmacy/prices"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Open Full Price Manager →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {medicines.slice(0, 5).map((med) => (
                <div key={med._id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{med.brand_name}</p>
                    <p className="text-slate-500">
                      {med.active_ingredient} • {med.strength} ({med.dosage_form})
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">NMRA Ceiling</span>
                      <p className="font-bold text-slate-800">
                        {med.nmra_mrp ? formatLKR(med.nmra_mrp) : 'N/A'}
                      </p>
                    </div>

                    <Link
                      href="/pharmacy/prices"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                    >
                      Update Price
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
