'use client';

import React, { useState, useEffect } from 'react';
import PharmacySidebar from '../../../components/PharmacySidebar';
import MobileNav from '../../../components/MobileNav';
import { apiFetch, formatLKR, formatDateLK } from '../../../lib/api';
import {
  DollarSign,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function PharmacyPricesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [availability, setAvailability] = useState('IN_STOCK');
  const [statusMsg, setStatusMsg] = useState('');
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [mRes, pRes] = await Promise.all([
      apiFetch('/medicines'),
      apiFetch('/prices?active_only=true'),
    ]);
    if (mRes.success && mRes.data) setMedicines(mRes.data);
    if (pRes.success && pRes.data) setPrices(pRes.data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId || !newPrice) return;

    const res = await apiFetch('/prices', {
      method: 'POST',
      body: JSON.stringify({
        medicine_id: selectedMedId,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: Number(newPrice),
        price_type: 'PHARMACY_SELLING_PRICE',
        source: 'Pharmacy Portal Manual Update',
        availability,
      }),
    });

    if (res.success) {
      setStatusMsg('Price successfully updated! Previous historical price closed and archived.');
      setNewPrice('');
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const handleSimulateCSV = async () => {
    const sampleRows = [
      { brand_name: 'Panadol', price: 44.0, availability: 'IN_STOCK' },
      { brand_name: 'Amoxil 500', price: 465.0, availability: 'IN_STOCK' },
      { brand_name: 'Lipitor 20', price: 3400.0, availability: 'IN_STOCK' },
      { brand_name: 'Glucophage 500', price: 1900.0, availability: 'IN_STOCK' },
      { brand_name: 'Losec 20', price: 1350.0, availability: 'IN_STOCK' },
    ];

    const res = await apiFetch('/prices/upload-csv', {
      method: 'POST',
      body: JSON.stringify({
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        rows: sampleRows,
      }),
    });

    if (res.success) {
      setCsvUploaded(true);
      loadData();
      setTimeout(() => setCsvUploaded(false), 5000);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <PharmacySidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">
            Pharmacy Price Master & CSV Ingestion
          </span>
          <button
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Pharmacy Retail Prices
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update unit pricing manually or upload POS CSV exports. Historical price records are automatically archived and never overwritten.
            </p>
          </div>

          {statusMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {csvUploaded && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                CSV Successfully Processed! 5 medicine price records synchronized with NMRA validation.
              </span>
            </div>
          )}

          {/* Grid: Manual Form + CSV Ingestion Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Manual Update Card (7 cols) */}
            <form
              onSubmit={handleUpdatePrice}
              className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4"
            >
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Single Product Price Revision</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Medicine</label>
                  <select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Select a product...</option>
                    {medicines.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.brand_name} ({m.active_ingredient} {m.strength}) - NMRA MRP:{' '}
                        {m.nmra_mrp ? formatLKR(m.nmra_mrp) : 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Selling Price (LKR)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 45.00"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="IN_STOCK">In Stock</option>
                      <option value="LOW_STOCK">Low Stock</option>
                      <option value="OUT_OF_STOCK">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Publish Price Revision
                </button>
              </div>
            </form>

            {/* CSV Bulk Ingestion (5 cols) */}
            <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-600" />
                  <span>Bulk Pharmacy CSV Upload</span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload daily POS price sheets (CSV format: brand_name, selling_price, in_stock).
                </p>
              </div>

              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  pharmacy_stock_prices_colombo.csv
                </p>
                <button
                  type="button"
                  onClick={handleSimulateCSV}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Process Sample CSV Batch
                </button>
              </div>

              <div className="text-[10px] text-slate-400">
                * Uploaded prices automatically respect NMRA ceiling guidelines.
              </div>
            </div>
          </div>

          {/* Active Pharmacy Price List */}
          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">
                Currently Active Pharmacy Selling Prices ({prices.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Medicine</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4">Price Type</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prices.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-bold text-slate-900">
                        {p.medicine_id?.brand_name || 'Medicine'}
                        <span className="text-slate-400 font-normal block text-[11px]">
                          {p.medicine_id?.active_ingredient} ({p.medicine_id?.strength})
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-sm text-slate-900">
                        {formatLKR(p.price)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.price_type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{p.source}</td>
                      <td className="p-4 font-semibold text-emerald-700">
                        {p.availability || 'IN_STOCK'}
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDateLK(p.effective_from)}
                      </td>
                    </tr>
                  ))}
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
