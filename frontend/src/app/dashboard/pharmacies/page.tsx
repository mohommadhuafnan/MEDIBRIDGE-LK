'use client';

import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { apiFetch, formatDateLK } from '../../../lib/api';
import { Building2, MapPin, Phone, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PharmaciesDirectoryPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPharmacies() {
      setLoading(true);
      let url = '/pharmacies';
      if (selectedDistrict) url += `?district=${selectedDistrict}`;
      const res = await apiFetch(url);
      if (res.success && res.data) {
        setPharmacies(res.data);
      }
      setLoading(false);
    }
    loadPharmacies();
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Participating Pharmacies
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            NMRA Licensed Pharmacies
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Pharmacies Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Find participating state and private pharmacies providing verified price lists and stock availability across Sri Lanka.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* District filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              District:
            </span>
            {['', 'Colombo', 'Kandy', 'Galle'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDistrict === d
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d || 'All Sri Lanka'}
              </button>
            ))}
          </div>

          {/* Pharmacy Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-44" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pharmacies.map((p) => (
                <div
                  key={p._id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-300 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{p.name}</h3>
                        <p className="text-xs font-medium text-brand-600">{p.chain}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        License: {p.license_number}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {p.address}, {p.city}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{p.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{p.opening_hours}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-500">
                      Catalog: <strong>{p.available_medicines_count || 48} medicines</strong>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Price Feed Connected
                    </span>
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
