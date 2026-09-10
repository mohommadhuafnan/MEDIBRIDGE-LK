'use client';

import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded-lg shadow-sm">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {t('Consult a qualified doctor or pharmacist before changing your medicine or brand.')}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200/90 rounded-xl shadow-subtle">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold text-amber-950 text-sm">
            Important Healthcare & Safety Notice (NMRA Sri Lanka Guideline)
          </p>
          <p>
            MediBridge LK provides medicine identification, prescription reading assistance, and price comparison for informational and affordability transparency. <strong>This is not an autonomous prescribing system.</strong>
          </p>
          <p className="text-amber-800">
            Never change, start, or stop prescribed medicines or switch brands without direct consultation and approval from your qualified physician or registered pharmacist.
          </p>
        </div>
      </div>
    </div>
  );
}
