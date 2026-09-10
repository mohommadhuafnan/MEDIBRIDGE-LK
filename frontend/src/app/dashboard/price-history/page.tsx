'use client';

import React, { useState } from 'react';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { formatLKR } from '../../../lib/api';
import { LineChart, Clock, TrendingUp, ShieldCheck, Building2, ChevronRight } from 'lucide-react';

const PRICE_HISTORY_DATA = [
  {
    medicine: 'Panadol 500mg (10 Tablets Strip)',
    active: 'Paracetamol',
    currentPrice: 45.0,
    previousPrice: 38.0,
    changePercent: '+18.4%',
    effectiveDate: 'October 2024 (Gazette 2341/39)',
    source: 'Ministry of Health / NMRA Gazette Extraordinary',
    historyPoints: [
      { date: 'Jan 2024', price: 32 },
      { date: 'Apr 2024', price: 38 },
      { date: 'Oct 2024', price: 45 },
      { date: 'Current', price: 45 },
    ],
  },
  {
    medicine: 'Amoxil 500mg (10 Capsules)',
    active: 'Amoxicillin',
    currentPrice: 480.0,
    previousPrice: 440.0,
    changePercent: '+9.1%',
    effectiveDate: 'October 2024 (Gazette 2341/39)',
    source: 'NMRA Gazetted Price Revision',
    historyPoints: [
      { date: 'Jan 2024', price: 390 },
      { date: 'Apr 2024', price: 440 },
      { date: 'Oct 2024', price: 480 },
      { date: 'Current', price: 480 },
    ],
  },
  {
    medicine: 'Lipitor 20mg (30 Tablets)',
    active: 'Atorvastatin',
    currentPrice: 3600.0,
    previousPrice: 3450.0,
    changePercent: '+4.3%',
    effectiveDate: 'August 2024',
    source: 'NMRA Price Ceiling Registry',
    historyPoints: [
      { date: 'Jan 2024', price: 3200 },
      { date: 'Apr 2024', price: 3450 },
      { date: 'Oct 2024', price: 3600 },
      { date: 'Current', price: 3600 },
    ],
  },
];

export default function PriceHistoryPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = PRICE_HISTORY_DATA[selectedIdx];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Price History & Regulatory Trends
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medicine Price History Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Historical records of official NMRA Maximum Retail Price (MRP) revisions in Sri Lanka.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* Medicine Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {PRICE_HISTORY_DATA.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedIdx === idx
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.medicine.split(' ')[0]} ({item.active})
              </button>
            ))}
          </div>

          {/* Detailed History Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{selected.medicine}</h2>
                <p className="text-xs text-slate-500">
                  Active molecule: <strong>{selected.active}</strong> • Source: {selected.source}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-right">
                  <span className="text-[10px] text-slate-400 block">Current Price</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatLKR(selected.currentPrice)}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-right text-amber-900">
                  <span className="text-[10px] text-amber-700 block">Recent Change</span>
                  <span className="text-lg font-extrabold text-amber-900">
                    {selected.changePercent}
                  </span>
                </div>
              </div>
            </div>

            {/* Clean SVG Interactive Trend Chart */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>NMRA Gazetted Price Trend Over Time</span>
                <span className="text-slate-400">Effective: {selected.effectiveDate}</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4">
                {selected.historyPoints.map((pt, i) => {
                  const maxPrice = Math.max(...selected.historyPoints.map((p) => p.price));
                  const heightPercent = Math.round((pt.price / maxPrice) * 100);

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-bold text-slate-800">{formatLKR(pt.price)}</span>
                      <div
                        className="w-full max-w-[50px] bg-gradient-to-t from-brand-600 to-sky-400 rounded-t-lg shadow-sm transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-500">{pt.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notice */}
            <p className="text-[11px] text-slate-400 text-center">
              * Historical prices reflect past NMRA gazetted revisions and do not guarantee future retail prices.
            </p>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
