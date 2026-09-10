'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch } from '../../../lib/api';
import { ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminSafetyPage() {
  const [medName, setMedName] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [alertType, setAlertType] = useState('RECALL');
  const [severity, setSeverity] = useState('HIGH');
  const [desc, setDesc] = useState('');
  const [action, setAction] = useState('');
  const [published, setPublished] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch('/safety', {
      method: 'POST',
      body: JSON.stringify({
        medicine_name: medName,
        batch_number: batchNo,
        alert_type: alertType,
        severity,
        description: desc,
        action_required: action,
        source: 'NMRA National Quality Control Release',
      }),
    });

    if (res.success) {
      setPublished(true);
      setMedName('');
      setBatchNo('');
      setDesc('');
      setAction('');
      setTimeout(() => setPublished(false), 4000);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">
            Regulatory Safety Broadcast Publisher
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Publish NMRA Safety Notice or Batch Recall
            </h1>
            <p className="text-xs text-slate-500">
              Immediately alerts hospitals, registered pharmacies, and patients prescribed this product.
            </p>
          </div>

          {published && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Safety notice successfully broadcast to all registered endpoints!</span>
            </div>
          )}

          <form
            onSubmit={handlePublish}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Paracetamol Syrup 120mg/5ml"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Batch Number</label>
                <input
                  type="text"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  placeholder="e.g. LK-2025-099"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Alert Type</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="RECALL">RECALL (Batch Withdrawal)</option>
                  <option value="REVOCATION">REVOCATION (Registration Cancelled)</option>
                  <option value="QUALITY_SAFETY">QUALITY SAFETY NOTICE</option>
                  <option value="ADVISORY">PUBLIC ADVISORY</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Quarantine)</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Description of Defect / Reason</label>
              <textarea
                rows={3}
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Explain test failure, out-of-specification result, or contamination risk..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Required Pharmacy & Patient Action</label>
              <textarea
                rows={2}
                required
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Immediate quarantine instructions, return procedures, or alternatives..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Broadcast Regulatory Notice
              </button>
            </div>
          </form>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
