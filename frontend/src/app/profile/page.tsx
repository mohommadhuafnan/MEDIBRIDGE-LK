'use client';

import React, { useState } from 'react';
import PatientSidebar from '../../components/PatientSidebar';
import MobileNav from '../../components/MobileNav';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { User, Mail, MapPin, Globe, Shield, Bell, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || 'Sunil Jayawardena');
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [city, setCity] = useState(user?.city || 'Colombo 03');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">User Profile</span>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-medgreen-500 text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-md">
              {fullName.charAt(0)}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{fullName}</h1>
              <p className="text-xs text-slate-500">{user?.email || 'patient@medibridge.lk'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                  {user?.role || 'PATIENT'}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Sri Lanka • {district}
                </span>
              </div>
            </div>
          </div>

          {saved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'patient@medibridge.lk'}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">City / Town</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Interface Language
              </label>
              <div className="flex gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'si', label: 'සිංහල (Sinhala)' },
                  { code: 'ta', label: 'தமிழ் (Tamil)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code as Language)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      language === l.code
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
