'use client';

import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { useLanguage } from '../../../context/LanguageContext';
import { apiFetch, formatLKR, formatDateLK } from '../../../lib/api';
import {
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function PriceComparisonPage() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      const [pRes, mRes] = await Promise.all([
        apiFetch('/prices?active_only=true'),
        apiFetch('/medicines'),
      ]);

      if (pRes.success && pRes.data) setPrices(pRes.data);
      if (mRes.success && mRes.data) setMedicines(mRes.data);
      setLoading(false);
    }
    loadPrices();
  }, []);

  const filteredPrices = prices.filter((p) => {
    if (selectedMedId && p.medicine_id?._id !== selectedMedId) return false;
    if (selectedType && p.price_type !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Price Comparison
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
              NMRA Gazette 2341/39
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medicine Price Comparison Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare NMRA Maximum Retail Price (MRP) ceilings with verified retail prices across State Pharmaceuticals Corporation (Rajya Osu Sala), Healthguard, and private pharmacies.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Filter by Medicine
              </label>
              <select
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800 font-medium"
              >
                <option value="">All Medicines ({medicines.length})</option>
                {medicines.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.brand_name} ({m.active_ingredient} {m.strength})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Price Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800 font-medium"
              >
                <option value="">All Price Types</option>
                <option value="NMRA_MRP">NMRA MRP (Gazetted Maximum)</option>
                <option value="PHARMACY_SELLING_PRICE">Pharmacy Selling Price</option>
              </select>
            </div>
          </div>

          {/* Price Comparison Cards / Table */}
          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900">
                Verified Medicine Price Records ({filteredPrices.length})
              </h2>
              <span className="text-xs text-slate-500">Historical records safely preserved</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Medicine & Active Ingredient</th>
                    <th className="p-4">Pharmacy / Price Source</th>
                    <th className="p-4">Price Type</th>
                    <th className="p-4">Pack Price</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Verified Date</th>
                    <th className="p-4">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrices.map((price) => {
                    const isNMRA = price.price_type === 'NMRA_MRP';
                    const isSpc = price.pharmacy_name?.includes('Rajya Osu Sala');

                    return (
                      <tr key={price._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900 text-sm">
                            {price.medicine_id?.brand_name || 'Medicine'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {price.medicine_id?.active_ingredient} ({price.medicine_id?.strength} {price.medicine_id?.dosage_form})
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-slate-800">{price.pharmacy_name}</p>
                          <p className="text-[10px] text-slate-400">{price.source}</p>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isNMRA
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-brand-50 text-brand-700 border border-brand-200'
                            }`}
                          >
                            {price.price_type.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4 font-extrabold text-sm text-slate-900">
                          {formatLKR(price.price)}
                        </td>

                        <td className="p-4 font-semibold text-slate-600">
                          {formatLKR(price.unit_price)}
                        </td>

                        <td className="p-4 text-slate-500">
                          {formatDateLK(price.verified_at || price.effective_from)}
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
