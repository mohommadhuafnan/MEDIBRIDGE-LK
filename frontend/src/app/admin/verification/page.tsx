'use client';

import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import MobileNav from '../../../components/MobileNav';
import { CheckCircle2, AlertCircle, FileSearch, ShieldCheck } from 'lucide-react';

const RECENT_OCR_LOGS = [
  {
    id: 'ocr-101',
    timestamp: '10 minutes ago',
    rawText: 'Rx: Lipitor 20mg nocte x 30 | Glucophage 500mg bd cc x 60',
    detectedDrugs: ['Atorvastatin 20mg', 'Metformin 500mg'],
    confidence: '96%',
    status: 'User Confirmed',
  },
  {
    id: 'ocr-102',
    timestamp: '42 minutes ago',
    rawText: 'Rx: Amoxil 500mg cap tds x 5/7 | Panadol 500mg tab prn',
    detectedDrugs: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
    confidence: '98%',
    status: 'User Confirmed',
  },
  {
    id: 'ocr-103',
    timestamp: '2 hours ago',
    rawText: 'Rx: Losec 20mg mane ac x 14/7',
    detectedDrugs: ['Omeprazole 20mg'],
    confidence: '93%',
    status: 'User Confirmed',
  },
];

export default function AdminVerificationPage() {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">
            AI Prescription Extraction & Quality Audits
          </span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Vision Extraction Quality Auditing
            </h1>
            <p className="text-xs text-slate-500">
              Review Google Gemini AI handwriting extraction accuracy and user confirmation metrics.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-4">Log ID & Time</th>
                  <th className="p-4">Raw Doctor Transcript</th>
                  <th className="p-4">Identified Generic Drugs</th>
                  <th className="p-4">Model Confidence</th>
                  <th className="p-4">Patient Confirmation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_OCR_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-900">{log.id}</span>
                      <span className="text-slate-400 block text-[10px]">{log.timestamp}</span>
                    </td>
                    <td className="p-4 italic font-serif text-slate-700 max-w-xs">{log.rawText}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {log.detectedDrugs.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold text-[10px]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-600">{log.confidence}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> {log.status}
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
