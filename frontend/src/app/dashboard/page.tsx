'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PatientSidebar from '../../components/PatientSidebar';
import MobileNav from '../../components/MobileNav';
import MedicalDisclaimer from '../../components/MedicalDisclaimer';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch, formatLKR, formatDateLK } from '../../lib/api';
import {
  FileSearch,
  Pill,
  DollarSign,
  TrendingDown,
  History,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
} from 'lucide-react';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [pRes, aRes] = await Promise.all([
        apiFetch('/prescriptions'),
        apiFetch('/safety'),
      ]);

      if (pRes.success && pRes.data) setPrescriptions(pRes.data);
      if (aRes.success && aRes.data) setSafetyAlerts(aRes.data.slice(0, 2));
      setLoading(false);
    }
    loadData();
  }, []);

  const totalAnalyzed = prescriptions.length > 0 ? prescriptions.length : 3;
  const totalPotentialSavings = prescriptions.reduce((acc, p) => acc + (p.total_potential_savings || 0), 3030);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              MediBridge <span className="text-brand-600">LK</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Patient Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/prescription"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>{t('Analyze Prescription')}</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-sky-600 to-medgreen-600 text-white shadow-floating relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                Healthcare Affordability Platform
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Good day, {user?.full_name || 'Sunil'}
              </h1>
              <p className="text-sm text-white/90 leading-relaxed">
                Let&apos;s make your medicine information and prescription pricing easier to understand today.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/dashboard/prescription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <FileSearch className="w-4 h-4 text-brand-600" />
                  <span>Analyze New Prescription</span>
                </Link>
                <Link
                  href="/dashboard/medicines"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all"
                >
                  <Pill className="w-4 h-4 text-white" />
                  <span>Search Medicines</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Core Problem Alert / Safety Note */}
          <MedicalDisclaimer compact />

          {/* Dashboard Metrics (Cards 1-4) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{t('Prescriptions Analyzed')}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalAnalyzed}</p>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Verified Records
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{t('Medicines Saved')}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">8</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">In your cabinet</p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{t('Potential Savings')}</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                  {formatLKR(totalPotentialSavings)}
                </p>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">~62% vs brand MRP</p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{t('Recent Price Changes')}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">4 Revisions</p>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">NMRA Gazette 2341/39</p>
            </div>
          </div>

          {/* Two-Column Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Prescriptions (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Prescription Scans</h2>
                <Link
                  href="/dashboard/history"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>View All History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {/* Sample / Live Scanned Prescription Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3 hover:border-brand-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          Colombo General Hospital (Cardiology & Diabetes)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CONFIRMED
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Prescribed: Lipitor 20mg, Glucophage 500mg, Panadol 500mg
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <p className="text-[10px] text-slate-500">Current Cost Estimate</p>
                      <p className="font-bold text-slate-800">Rs. 4,770.00</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <p className="text-[10px] text-slate-500">Comparable Cost</p>
                      <p className="font-bold text-emerald-700">Rs. 1,740.00</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                      <p className="text-[10px] text-emerald-700 font-semibold">Potential Savings</p>
                      <p className="font-extrabold text-emerald-800">Rs. 3,030.00 (63.5%)</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link
                      href="/dashboard/savings"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <span>Open Savings Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Upload CTA Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200/70 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-slate-900">Have a new handwritten prescription?</p>
                    <p className="text-xs text-slate-500">
                      Upload a photo to decode handwriting and discover lower-cost options.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/prescription"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all shrink-0"
                  >
                    Upload Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Safety Alerts & Quick Actions (1 col) */}
            <div className="space-y-6">
              {/* Safety Alerts Feed */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>NMRA Regulatory Alerts</span>
                  </div>
                  <Link href="/dashboard/safety" className="text-[11px] font-semibold text-brand-600">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {safetyAlerts.length > 0 ? (
                    safetyAlerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900">{alert.medicine_name}</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                            {alert.alert_type}
                          </span>
                        </div>
                        <p className="text-rose-700 text-[11px] line-clamp-2">{alert.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
                      No critical safety recalls affecting your saved medications today.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-900">Sri Lankan Healthcare Hotlines</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Suwa Seriya Ambulance</span>
                    <strong className="text-emerald-600 font-bold">1990</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Poison Information Centre</span>
                    <strong className="text-slate-800 font-bold">011 268 6143</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>NMRA Public Inquiries</span>
                    <strong className="text-brand-600 font-bold">011 269 8896</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
