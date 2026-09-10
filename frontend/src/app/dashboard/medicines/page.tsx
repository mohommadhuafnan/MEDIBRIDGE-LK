'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { useLanguage } from '../../../context/LanguageContext';
import { apiFetch, formatLKR } from '../../../lib/api';
import {
  Pill,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Layers,
  Activity,
  Building2,
} from 'lucide-react';

export default function MedicinesDirectoryPage() {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicines() {
      setLoading(true);
      let endpoint = '/medicines';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const res = await apiFetch(endpoint);
      if (res.success && res.data) {
        setMedicines(res.data);
      }

      const catRes = await apiFetch('/medicines/categories');
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }

      setLoading(false);
    }

    const timer = setTimeout(() => {
      fetchMedicines();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Medicines Directory
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              NMRA Registered
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sri Lanka Medicine & Generic Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Search by brand name, generic molecule, or active ingredient to view gazetted MRP ceilings and certified comparable options.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Panadol, Atorvastatin, Amoxil, Metformin..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-800"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 font-medium"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4">
                  <div className="w-1/2 h-5 bg-slate-200 rounded" />
                  <div className="w-3/4 h-3 bg-slate-100 rounded" />
                  <div className="w-full h-16 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No medicines match your search</h3>
              <p className="text-xs text-slate-500">
                Try searching by generic chemical name (e.g. Paracetamol, Omeprazole, Atorvastatin)
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {medicines.map((med) => (
                <Link
                  key={med._id}
                  href={`/dashboard/medicines/${med._id}`}
                  className="group p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                          {med.brand_name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Active: <strong>{med.active_ingredient}</strong> ({med.strength})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                        {med.dosage_form}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{med.manufacturer}</span>
                    </div>
                  </div>

                  {/* Price info badge */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">NMRA Gazetted MRP</p>
                      <p className="font-bold text-slate-900">
                        {med.nmra_mrp ? formatLKR(med.nmra_mrp) : 'Ref: Pharmacy Price'}
                      </p>
                    </div>

                    {med.lowest_price && med.lowest_price < (med.nmra_mrp || 99999) && (
                      <div className="text-right">
                        <p className="text-[10px] text-emerald-700 font-semibold">Lower Option from</p>
                        <p className="font-extrabold text-emerald-700">
                          {formatLKR(med.lowest_price)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700 pt-1">
                    <span>View Comparable & Guide</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
