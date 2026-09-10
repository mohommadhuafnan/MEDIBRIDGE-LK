'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { formatLKR } from '../../../lib/api';
import { Pill, CheckCircle2, TrendingDown, ArrowRight, Bell, ShieldCheck } from 'lucide-react';

const SAVED_MEDS = [
  {
    id: 'med-06',
    name: 'Lipitor 20 (Pfizer)',
    active: 'Atorvastatin',
    strength: '20 mg',
    form: 'Tablet',
    lastPrice: 3600,
    trend: 'Stable',
    safetyStatus: 'Verified Active',
    comparableOption: 'Storvas 20 (Rs. 1,350)',
    savings: 'Save Rs. 2,250',
  },
  {
    id: 'med-09',
    name: 'Glucophage 500 (Merck)',
    active: 'Metformin HCl',
    strength: '500 mg',
    form: 'Tablet',
    lastPrice: 1950,
    trend: 'Stable',
    safetyStatus: 'Verified Active',
    comparableOption: 'Metformin SPMC 500 (Rs. 650)',
    savings: 'Save Rs. 1,300',
  },
  {
    id: 'med-01',
    name: 'Panadol (GSK)',
    active: 'Paracetamol',
    strength: '500 mg',
    form: 'Tablet',
    lastPrice: 45,
    trend: '+18% (NMRA 2341/39)',
    safetyStatus: 'Verified Active',
    comparableOption: 'ParaLanka SPMC (Rs. 22)',
    savings: 'Save Rs. 23',
  },
  {
    id: 'med-13',
    name: 'Ventolin Evohaler',
    active: 'Salbutamol',
    strength: '100 mcg',
    form: 'Inhaler',
    lastPrice: 1250,
    trend: 'Stable',
    safetyStatus: 'Verified Active',
    comparableOption: 'Asthalin 100 (Rs. 680)',
    savings: 'Save Rs. 570',
  },
];

export default function MyMedicinesPage() {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">My Medicine Cabinet</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
              {SAVED_MEDS.length} Tracked Medicines
            </span>
          </div>
          <Link
            href="/dashboard/medicines"
            className="px-3.5 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold shadow-sm"
          >
            + Add Medicine
          </Link>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Saved Medicines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track your regular prescriptions, monitor NMRA price revisions, and receive automatic recall alerts.
            </p>
          </div>

          <MedicalDisclaimer compact />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SAVED_MEDS.map((med) => (
              <div
                key={med.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:border-brand-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{med.name}</h3>
                      <p className="text-xs text-slate-500">
                        {med.active} • {med.strength} ({med.form})
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {med.safetyStatus}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Current MRP</span>
                      <p className="font-bold text-slate-900">{formatLKR(med.lastPrice)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Price Trend</span>
                      <p className="font-semibold text-slate-700">{med.trend}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
                    <span className="font-semibold">Lower Option: {med.comparableOption}</span>
                    <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-xs">
                      {med.savings}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/dashboard/medicines/${med.id}`}
                    className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <span>Full Details & Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/dashboard/price-history`}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    View Trend
                  </Link>
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
