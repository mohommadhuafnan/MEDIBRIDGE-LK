'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { apiFetch, formatLKR, formatDateLK } from '../../../lib/api';
import { History, FileSearch, Trash2, ArrowRight, CheckCircle2, Calendar, Pill } from 'lucide-react';

export default function PrescriptionHistoryPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const res = await apiFetch('/prescriptions');
      if (res.success && res.data) {
        setPrescriptions(res.data);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await apiFetch(`/prescriptions/${id}`, { method: 'DELETE' });
    setPrescriptions(prescriptions.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Prescription History
            </span>
          </div>
          <Link
            href="/dashboard/prescription"
            className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm"
          >
            + Scan New Prescription
          </Link>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Prescription History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review previous doctor prescriptions, extracted medicine regimens, and saved price analyses.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-32" />
              ))}
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-800">No prescriptions analyzed yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload your first doctor prescription to receive AI identification, NMRA price estimation, and generic savings.
                </p>
              </div>
              <Link
                href="/dashboard/prescription"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
              >
                <FileSearch className="w-4 h-4" />
                <span>Upload First Prescription</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((p) => (
                <div
                  key={p._id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">
                          {p.clinic_name || 'Medical Clinic Prescription'}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Doctor: {p.doctor_name || 'Consulting Physician'} • Patient: {p.patient_name || 'Patient'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateLK(p.prescription_date || p.created_at)}
                      </span>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Medicines Detected */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Medicines Detected ({p.confirmed_items?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.confirmed_items?.map((item: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                        >
                          {item.detected_name} ({item.strength})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price summary row */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px]">Brand MRP Total</span>
                      <p className="font-bold text-slate-900">{formatLKR(p.total_estimated_cost)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Comparable Total</span>
                      <p className="font-bold text-emerald-700">{formatLKR(p.total_comparable_cost)}</p>
                    </div>
                    <div>
                      <span className="text-emerald-700 text-[10px] font-bold">Estimated Savings</span>
                      <p className="font-extrabold text-emerald-800">
                        {formatLKR(p.total_potential_savings)} ({p.savings_percentage}%)
                      </p>
                    </div>
                    <Link
                      href="/dashboard/savings"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                    >
                      <span>View in Calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
