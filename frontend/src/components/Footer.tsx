'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, HeartPulse, PhoneCall, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MediBridge LK Official Logo"
                className="w-10 h-10 object-contain rounded-xl bg-white p-1 shadow-sm"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                MediBridge <span className="text-brand-400">LK</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              {t('Understand Your Medicine. Know Your Cost.')}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {t('Making medicine information and affordability easier for everyone.')} Sri Lanka&apos;s AI-assisted prescription reader, NMRA Maximum Retail Price (MRP) estimator, and generic medicine equivalence platform.
            </p>

            {/* Sri Lanka Emergency Helpline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200">
              <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>National Medical Emergency: <strong>1990 Suwa Seriya</strong></span>
            </div>
          </div>

          {/* Col 3: Quick Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard/prescription" className="hover:text-brand-400 transition-colors">
                  Analyze Prescription
                </Link>
              </li>
              <li>
                <Link href="/dashboard/medicines" className="hover:text-brand-400 transition-colors">
                  Medicines Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/prices" className="hover:text-brand-400 transition-colors">
                  NMRA Price Comparison
                </Link>
              </li>
              <li>
                <Link href="/dashboard/savings" className="hover:text-brand-400 transition-colors">
                  Savings Calculator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/safety" className="hover:text-brand-400 transition-colors">
                  NMRA Safety Alerts & Recalls
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Pharmacies & Healthcare */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Providers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pharmacy/dashboard" className="hover:text-brand-400 transition-colors">
                  Pharmacy Portal
                </Link>
              </li>
              <li>
                <Link href="/pharmacy/prices" className="hover:text-brand-400 transition-colors">
                  Update Medicine Prices
                </Link>
              </li>
              <li>
                <Link href="/dashboard/pharmacies" className="hover:text-brand-400 transition-colors">
                  Partner Pharmacies
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-brand-400 transition-colors">
                  NMRA Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Languages & Trust */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Languages & Trust
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`text-left px-2.5 py-1.5 rounded transition-all ${
                  language === 'en' ? 'bg-brand-600/30 text-brand-300 font-semibold' : 'hover:text-white'
                }`}
              >
                English (Default)
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`text-left px-2.5 py-1.5 rounded transition-all ${
                  language === 'si' ? 'bg-brand-600/30 text-brand-300 font-semibold' : 'hover:text-white'
                }`}
              >
                සිංහල (Sinhala)
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`text-left px-2.5 py-1.5 rounded transition-all ${
                  language === 'ta' ? 'bg-brand-600/30 text-brand-300 font-semibold' : 'hover:text-white'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediBridge LK. All rights reserved. Sri Lanka Healthcare Technology.</p>
          <div className="flex items-center gap-6">
            <span>NMRA Sri Lanka Compliant Data</span>
            <span>GDPR & Healthcare Privacy Adherent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
