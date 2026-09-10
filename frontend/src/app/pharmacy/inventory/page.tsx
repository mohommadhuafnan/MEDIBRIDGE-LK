'use client';

import React, { useState } from 'react';
import PharmacySidebar from '../../../components/PharmacySidebar';
import MobileNav from '../../../components/MobileNav';
import { Package, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const INVENTORY_ITEMS = [
  { name: 'Panadol 500mg', generic: 'Paracetamol', batch: 'GSK-2024-88', stock: 1200, status: 'In Stock' },
  { name: 'ParaLanka SPMC 500mg', generic: 'Paracetamol', batch: 'SPMC-0012', stock: 4500, status: 'In Stock' },
  { name: 'Amoxil 500mg', generic: 'Amoxicillin', batch: 'AMX-914', stock: 340, status: 'Low Stock' },
  { name: 'Amoxicillin SPMC 500mg', generic: 'Amoxicillin', batch: 'SPMC-0044', stock: 2200, status: 'In Stock' },
  { name: 'Lipitor 20mg', generic: 'Atorvastatin', batch: 'PFZ-1102', stock: 150, status: 'Low Stock' },
  { name: 'Storvas 20mg', generic: 'Atorvastatin', batch: 'SUN-441', stock: 900, status: 'In Stock' },
  { name: 'Glucophage 500mg', generic: 'Metformin', batch: 'MRC-8812', stock: 850, status: 'In Stock' },
  { name: 'Metformin SPMC 500mg', generic: 'Metformin', batch: 'SPMC-0028', stock: 3500, status: 'In Stock' },
];

export default function PharmacyInventoryPage() {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PharmacySidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">Pharmacy Inventory & Stock Control</span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dispensary Stock Levels
            </h1>
            <p className="text-xs text-slate-500">
              Live batch numbers, remaining tablet units, and re-order triggers.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Active Molecule</th>
                  <th className="p-4">Batch Number</th>
                  <th className="p-4">Available Units</th>
                  <th className="p-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INVENTORY_ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">{item.name}</td>
                    <td className="p-4 text-slate-600">{item.generic}</td>
                    <td className="p-4 font-mono text-slate-500">{item.batch}</td>
                    <td className="p-4 font-extrabold text-slate-900">{item.stock.toLocaleString()} units</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
