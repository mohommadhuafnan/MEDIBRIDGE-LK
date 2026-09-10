'use client';

import React, { useState } from 'react';
import PatientSidebar from '../../components/PatientSidebar';
import MobileNav from '../../components/MobileNav';
import { Lock, Bell, Shield, Trash2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [passSaved, setPassSaved] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">Account Settings</span>
        </header>

        <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your password, security, and notification alerts.
            </p>
          </div>

          {/* Notifications Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-600" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Medicine Price-Change Notifications</p>
                  <p className="text-[11px] text-slate-500">
                    Receive alert when NMRA revises maximum retail price ceilings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={priceAlerts}
                  onChange={(e) => setPriceAlerts(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Official NMRA Safety & Recall Alerts</p>
                  <p className="text-[11px] text-slate-500">
                    Get urgent warnings if a prescribed batch is recalled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={safetyAlerts}
                  onChange={(e) => setSafetyAlerts(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPassSaved(true);
              setTimeout(() => setPassSaved(false), 3000);
            }}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              <span>Security & Password</span>
            </h2>

            {passSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <h3 className="font-bold text-sm text-rose-950">Danger Zone</h3>
            <p className="text-xs text-rose-700">
              Permanently delete your MediBridge LK account and all stored prescription scans.
            </p>
            <button
              type="button"
              onClick={() => alert('Account deletion requested. Please contact support@medibridge.lk.')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
