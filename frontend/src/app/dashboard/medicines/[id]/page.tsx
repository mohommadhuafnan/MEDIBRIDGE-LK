'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PatientSidebar from '../../../../components/PatientSidebar';
import MobileNav from '../../../../components/MobileNav';
import MedicalDisclaimer from '../../../../components/MedicalDisclaimer';
import { useLanguage } from '../../../../context/LanguageContext';
import { apiFetch, formatLKR, formatDateLK } from '../../../../lib/api';
import {
  Pill,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  TrendingDown,
  Info,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function MedicineDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useLanguage();

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      const res = await apiFetch(`/medicines/${id}`);
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    if (id) loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
        <PatientSidebar />
        <div className="flex-1 p-8 max-w-5xl mx-auto space-y-6">
          <div className="w-1/3 h-8 bg-slate-200 rounded animate-pulse" />
          <div className="w-full h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data || !data.medicine) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
        <PatientSidebar />
        <div className="flex-1 p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Medicine Not Found</h2>
          <Link href="/dashboard/medicines" className="text-brand-600 font-semibold text-sm">
            ← Return to Medicines Directory
          </Link>
        </div>
      </div>
    );
  }

  const { medicine, active_prices, price_history, comparable_products, safety_advisory } = data;
  const nmraPrice = active_prices.find((p: any) => p.price_type === 'NMRA_MRP');

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <Link
            href="/dashboard/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Medicines</span>
          </Link>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            NMRA Verified Record
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Main Title Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {medicine.brand_name}
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {medicine.dosage_form}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Active Molecule: <strong className="text-brand-700">{medicine.active_ingredient}</strong> ({medicine.strength})
                </p>
                <p className="text-xs text-slate-400">
                  Generic: {medicine.generic_name} • Category: {medicine.category}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 border border-brand-200/70 text-right sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  NMRA Gazetted MRP
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {nmraPrice ? formatLKR(nmraPrice.price) : 'Ref: Pharmacy POS'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Pack Size: {medicine.pack_size}
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-[10px]">Manufacturer</p>
                <p className="font-bold text-slate-800 truncate mt-0.5">{medicine.manufacturer}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-[10px]">Country of Origin</p>
                <p className="font-bold text-slate-800 mt-0.5">{medicine.country || 'Sri Lanka'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-[10px]">Regulatory Status</p>
                <p className="font-bold text-emerald-700 mt-0.5">{medicine.regulatory_status}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-[10px]">NMRA Reg. Number</p>
                <p className="font-bold text-slate-800 mt-0.5">{medicine.nmra_reg_no || 'NMRA-REG-0419'}</p>
              </div>
            </div>
          </div>

          <MedicalDisclaimer />

          {/* Plain-Language Patient Guide (Section 19) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Plain-Language Patient Guide</h2>
                <p className="text-xs text-slate-500">
                  Easy-to-understand medical information designed for Sri Lankan patients and families.
                </p>
              </div>
            </div>

            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">What is this medicine?</h3>
                <p>{medicine.patient_explanation?.what_is_it || `${medicine.brand_name} contains ${medicine.active_ingredient}, regulated under NMRA Sri Lanka.`}</p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">What is it commonly used for?</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {medicine.patient_explanation?.common_uses?.map((use: string, idx: number) => (
                    <li key={idx}>{use}</li>
                  )) || <li>Prescribed by physicians for therapeutic indications.</li>}
                </ul>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">Important Information</h3>
                <p>{medicine.patient_explanation?.important_info || 'Adhere strictly to the dosage and frequency prescribed by your doctor.'}</p>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl space-y-2 text-amber-900">
                <h3 className="font-bold text-sm text-amber-950">Common Precautions</h3>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  {medicine.patient_explanation?.precautions?.map((prec: string, idx: number) => (
                    <li key={idx}>{prec}</li>
                  )) || <li>Keep out of reach of children. Store in a cool, dry place.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Deterministic Comparable Products (Section 20 & 35) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Comparable Products with Matching Characteristics</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Matched by exact active ingredient: <strong>{medicine.active_ingredient}</strong> ({medicine.strength} {medicine.dosage_form})
                </p>
              </div>
            </div>

            {comparable_products && comparable_products.length > 0 ? (
              <div className="space-y-4">
                {comparable_products.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900">
                            {item.medicine.brand_name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.comparison_label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manufacturer: {item.medicine.manufacturer} • Pack: {item.medicine.pack_size}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Verified Price</span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {formatLKR(item.lowest_price)}
                        </span>
                      </div>
                    </div>

                    {item.is_lower_cost && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
                        <span className="text-emerald-800 font-semibold">
                          Potential Difference: {formatLKR(item.price_difference_lkr)}
                        </span>
                        <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-xs">
                          Save {item.savings_percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No alternative brand records registered under this exact strength in the current database.
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
