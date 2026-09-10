'use client';

import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { apiFetch, formatDateLK } from '../../../lib/api';
import { ShieldAlert, AlertTriangle, CheckCircle2, Filter, Bell, ExternalLink } from 'lucide-react';

export default function SafetyAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      let url = '/safety';
      if (selectedSeverity) url += `?severity=${selectedSeverity}`;
      const res = await apiFetch(url);
      if (res.success && res.data) {
        setAlerts(res.data);
      }
      setLoading(false);
    }
    fetchAlerts();
  }, [selectedSeverity]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              NMRA Safety & Regulatory Alerts
            </span>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Official Regulatory Feed
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medicine Safety, Quality & Recall Notices
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified public notifications published by the National Medicines Regulatory Authority (NMRA) Sri Lanka and National Medicines Quality Assurance Laboratory (NMQAL).
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* Severity filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Filter:
            </span>
            {['', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSeverity === sev
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sev || 'All Alerts'}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-36" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No safety alerts currently active under this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const isCritical = alert.severity === 'CRITICAL';
                return (
                  <div
                    key={alert._id}
                    className={`p-6 rounded-2xl border shadow-subtle space-y-3 transition-all ${
                      isCritical
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {alert.medicine_name}
                          </h3>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              isCritical ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {alert.alert_type} • {alert.severity}
                          </span>
                        </div>
                        {alert.batch_number && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            Affected Batch: <strong className="font-mono">{alert.batch_number}</strong>
                          </p>
                        )}
                      </div>

                      <span className="text-xs text-slate-500">
                        {formatDateLK(alert.published_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="p-3 bg-white/90 rounded-xl border border-black/5 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">Required Patient / Pharmacy Action:</span>
                      <p className="text-slate-600">{alert.action_required}</p>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Source: {alert.source}</span>
                      <span className="font-semibold text-brand-700">Official NMRA Sri Lanka Release</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
