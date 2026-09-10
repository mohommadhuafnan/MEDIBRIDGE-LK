'use client';

import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../../components/PatientSidebar';
import MobileNav from '../../../components/MobileNav';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { useLanguage } from '../../../context/LanguageContext';
import { apiFetch, formatLKR } from '../../../lib/api';
import {
  TrendingDown,
  Calculator,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface CalcItem {
  id: string;
  name: string;
  active_ingredient: string;
  strength: string;
  dosage_form: string;
  quantity: number;
}

export default function SavingsCalculatorPage() {
  const { t } = useLanguage();

  const [items, setItems] = useState<CalcItem[]>([
    {
      id: '1',
      name: 'Lipitor (Pfizer)',
      active_ingredient: 'Atorvastatin',
      strength: '20 mg',
      dosage_form: 'Tablet',
      quantity: 30,
    },
    {
      id: '2',
      name: 'Glucophage (Merck)',
      active_ingredient: 'Metformin',
      strength: '500 mg',
      dosage_form: 'Tablet',
      quantity: 60,
    },
    {
      id: '3',
      name: 'Losec (AstraZeneca)',
      active_ingredient: 'Omeprazole',
      strength: '20 mg',
      dosage_form: 'Capsule',
      quantity: 14,
    },
  ]);

  const [calculation, setCalculation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (calcItems: CalcItem[]) => {
    setLoading(true);
    const res = await apiFetch('/prices/calculate-savings', {
      method: 'POST',
      body: JSON.stringify({ items: calcItems }),
    });

    if (res.success && res.data) {
      setCalculation(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    calculate(items);
  }, []);

  const handleUpdateQty = (id: string, qty: number) => {
    const updated = items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
    setItems(updated);
    calculate(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    calculate(updated);
  };

  const handleAddItem = () => {
    const newItem: CalcItem = {
      id: String(Date.now()),
      name: 'Amoxil (GSK)',
      active_ingredient: 'Amoxicillin',
      strength: '500 mg',
      dosage_form: 'Capsule',
      quantity: 15,
    };
    const updated = [...items, newItem];
    setItems(updated);
    calculate(updated);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800">
              Prescription Savings Calculator
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              LKR Affordability Engine
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Prescription Savings Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare your current prescription medication costs against NMRA verified comparable generic options to calculate monthly household savings.
            </p>
          </div>

          <MedicalDisclaimer compact />

          {/* Top Summary Cards */}
          {calculation && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
                <span className="text-[11px] font-semibold text-slate-500">Current Estimate</span>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {formatLKR(calculation.total_current_cost)}
                </p>
                <span className="text-[10px] text-slate-400">Brand name baseline</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
                <span className="text-[11px] font-semibold text-slate-500">Comparable Estimate</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
                  {formatLKR(calculation.total_comparable_cost)}
                </p>
                <span className="text-[10px] text-slate-400">Matching generic option</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-floating">
                <span className="text-[11px] font-semibold text-white/80">Potential Difference</span>
                <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {formatLKR(calculation.total_potential_savings)}
                </p>
                <span className="text-[10px] text-white/80">Saved per prescription</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
                <span className="text-[11px] font-semibold text-slate-500">Potential Savings</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
                  {calculation.savings_percentage}%
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Cost reduction</span>
              </div>
            </div>
          )}

          {/* Interactive Calculator Table */}
          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900">Prescription Medicines in Basket</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold border border-brand-200 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {calculation?.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.dosage_form}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Molecule: <strong>{item.active_ingredient}</strong> ({item.strength})
                    </p>

                    {item.comparable_name && (
                      <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 mt-1 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Lower-cost option: {item.comparable_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Pricing info */}
                  <div className="flex items-center gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Tablets / Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQty(items[idx]?.id, Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-center"
                      />
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Estimated Cost</span>
                      <span className="font-bold text-sm text-slate-900">
                        {formatLKR(item.current_total_price)}
                      </span>
                      {item.item_savings_lkr > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600 block">
                          Save {formatLKR(item.item_savings_lkr)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(items[idx]?.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer in Calculator */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              * Potential savings are calculated from available verified NMRA and partner pharmacy price data and may differ from the actual pharmacy checkout price. Consult a qualified doctor or pharmacist before making any changes to your prescribed medicines.
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
