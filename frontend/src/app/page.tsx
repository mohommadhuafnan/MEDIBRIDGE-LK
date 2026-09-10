'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { useLanguage } from '../context/LanguageContext';
import { formatLKR } from '../lib/api';
import {
  FileSearch,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  LineChart,
  Globe2,
  Building2,
  Pill,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Layers,
  ChevronRight,
  Activity,
  Award,
  Clock,
  HelpCircle,
  Search,
  Camera,
  FileText,
  X,
  Lock,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state
  const [homeSearch, setHomeSearch] = useState('');

  // Portal tab: 'upload' or 'compare'
  const [portalTab, setPortalTab] = useState<'upload' | 'compare'>('upload');
  const [activeScenario, setActiveScenario] = useState<number>(0);

  // Dropzone state
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedFile, setStagedFile] = useState<{
    name: string;
    size: string;
    preview: string;
    isPdf?: boolean;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const SCENARIOS = [
    {
      id: 0,
      tab: 'Cardio',
      condition: 'Hyperlipidemia / Heart Care',
      prescribedBrand: 'Lipitor 20mg',
      activeMolecule: 'Atorvastatin Calcium',
      dosage: '1 Tablet nightly (Nocte) • 30 Days',
      prescribedPrice: 3600,
      genericName: 'Storvas 20 / SPC Rajya Osu Sala',
      genericPrice: 1350,
      savingsAmount: 2250,
      savingsPercent: 62.5,
      doctorNote: 'Rx: Lipitor 20mg nocte x 30 tabs',
    },
    {
      id: 1,
      tab: 'Diabetes',
      condition: 'Type 2 Glycemic Control',
      prescribedBrand: 'Glucophage 500mg',
      activeMolecule: 'Metformin Hydrochloride',
      dosage: '1 Tablet twice daily (bd cc) • 60 Days',
      prescribedPrice: 1170,
      genericName: 'Metformin SPC Rajya Osu Sala',
      genericPrice: 390,
      savingsAmount: 780,
      savingsPercent: 66.7,
      doctorNote: 'Rx: Glucophage 500mg bd cc x 60 tabs',
    },
    {
      id: 2,
      tab: 'Gastric',
      condition: 'GERD & Peptic Protection',
      prescribedBrand: 'Losec 20mg',
      activeMolecule: 'Omeprazole',
      dosage: '1 Capsule morning before food (m.ac) • 30 Days',
      prescribedPrice: 1500,
      genericName: 'Omeprazole 20mg SPC Generic',
      genericPrice: 480,
      savingsAmount: 1020,
      savingsPercent: 68.0,
      doctorNote: 'Rx: Losec 20mg m.ac x 30 caps',
    },
  ];

  const current = SCENARIOS[activeScenario];

  // Process selected or dropped file
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Please upload an image (JPG, PNG, WEBP) or a PDF prescription.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit. Please upload a smaller image.');
      return;
    }
    setUploadError(null);

    const isPdf = file.type === 'application/pdf';
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      const sizeText =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setStagedFile({
        name: file.name,
        size: sizeText,
        preview,
        isPdf,
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleLaunchAnalysis = () => {
    if (stagedFile?.preview) {
      try {
        sessionStorage.setItem('medibridge_pending_prescription', stagedFile.preview);
      } catch (err) {
        console.error(err);
      }
    }
    router.push('/dashboard/prescription');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      router.push(`/dashboard/medicines?q=${encodeURIComponent(homeSearch.trim())}`);
    } else {
      router.push('/dashboard/medicines');
    }
  };

  const handleQuickPillClick = (medicineName: string) => {
    router.push(`/dashboard/medicines?q=${encodeURIComponent(medicineName)}`);
  };

  const handleLoadDemoSample = () => {
    // Generate a clean dummy canvas slip for instant test
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fefdfb';
      ctx.fillRect(0, 0, 600, 360);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 580, 340);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('National Hospital of Sri Lanka — Colombo', 30, 45);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Dr. S. K. Perera (MBBS, MD) • SLMC #24981', 30, 68);

      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(30, 85);
      ctx.lineTo(570, 85);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic bold 20px serif';
      ctx.fillText('Rx:', 30, 130);
      ctx.fillText('1. Lipitor 20mg nocte x 30 tabs', 50, 170);
      ctx.fillText('2. Glucophage 500mg bd cc x 60 tabs', 50, 215);
      ctx.fillText('3. Losec 20mg m.ac x 30 caps', 50, 260);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText('Official SLMC Standard Format Prescribing Slip', 30, 320);

      const sampleDataUrl = canvas.toDataURL('image/png');
      setStagedFile({
        name: 'sample_colombo_hospital_rx.png',
        size: '142 KB',
        preview: sampleDataUrl,
        isPdf: false,
      });
      setUploadError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-5%] left-[-10%] w-[520px] h-[520px] bg-brand-200/40 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-[15%] right-[-5%] w-[480px] h-[480px] bg-emerald-200/35 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column: Value Proposition & Live Search */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* NMRA Regulatory Pill with live indicator */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-subtle text-xs font-semibold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="font-bold text-slate-900">Sri Lanka NMRA Gazette Aligned</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200/60">
                    MRP Ceilings Active
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Understand Your Prescription.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-emerald-600">
                    Know Your Medicine.
                  </span>{' '}
                  Save Smarter.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Instantly read physician handwriting, identify active chemical molecules, and discover official NMRA price caps &amp; Rajya Osu Sala generic options across Sri Lanka.
                </p>

                {/* Instant Medicine Search Bar */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative max-w-xl mx-auto lg:mx-0"
                >
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                      placeholder="Search medicine brand or generic (e.g. Lipitor, Panadol, Losec)..."
                      className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Popular Sri Lankan Medicine Quick Chips */}
                <div className="pt-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Popular In Sri Lanka (Click to check price):
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {[
                      { name: 'Panadol 500mg', tag: 'Paracetamol' },
                      { name: 'Lipitor 20mg', tag: 'Atorvastatin' },
                      { name: 'Glucophage 500mg', tag: 'Metformin' },
                      { name: 'Amoxil 500mg', tag: 'Amoxicillin' },
                      { name: 'Losec 20mg', tag: 'Omeprazole' },
                    ].map((med) => (
                      <button
                        key={med.name}
                        type="button"
                        onClick={() => handleQuickPillClick(med.name)}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-white hover:bg-brand-50 hover:border-brand-200 border border-slate-200 text-slate-700 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pill className="w-3 h-3 text-brand-500" />
                        <span>{med.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trust Badges Bar */}
                <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 text-left">
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900">100%</p>
                    <p className="text-[11px] text-slate-500 font-medium">Deterministic Rule Matching</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">60%+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Potential Generic Savings</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-brand-600">3</p>
                    <p className="text-[11px] text-slate-500 font-medium">EN, සිංහල, தமிழ்</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Functional Interactive Action Portal */}
              <div className="lg:col-span-6 relative">
                
                {/* Floating Micro-Badge Top Right */}
                <div className="hidden sm:flex absolute -top-4 -right-2 z-20 items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/95 border border-slate-200/80 shadow-floating backdrop-blur-md text-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-xs">Gemini 3.6 Flash Active</p>
                  </div>
                </div>

                {/* Main Card Container */}
                <div className="relative rounded-3xl border border-slate-200 shadow-floating bg-white/95 backdrop-blur-xl p-5 sm:p-6 overflow-hidden space-y-4">
                  
                  {/* Mode Switcher Tabs */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setPortalTab('upload')}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          portalTab === 'upload'
                            ? 'bg-white text-brand-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <UploadCloud className="w-4 h-4 text-brand-600" />
                        <span>Upload Prescription</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPortalTab('compare')}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          portalTab === 'compare'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                        <span>Price Comparison</span>
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live AI Optical Ready</span>
                    </div>
                  </div>

                  {/* TAB 1: Real Interactive Prescription Dropzone */}
                  {portalTab === 'upload' && (
                    <div className="space-y-4">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={onFileInputChange}
                        className="hidden"
                      />

                      {!stagedFile ? (
                        /* Empty Dropzone Area */
                        <div
                          onDragOver={onDragOver}
                          onDragLeave={onDragLeave}
                          onDrop={onDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                            isDragOver
                              ? 'border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10'
                              : 'border-slate-300 hover:border-brand-400 bg-slate-50/60 hover:bg-brand-50/20'
                          }`}
                        >
                          <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-brand-600 group-hover:scale-105 group-hover:bg-brand-50 transition-all mb-3.5">
                            <UploadCloud className="w-7 h-7" />
                          </div>

                          <p className="text-sm font-extrabold text-slate-800 group-hover:text-brand-700 transition-colors">
                            Drop doctor prescription here, or click to browse
                          </p>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Upload camera photos, scanned slips, or clinic printouts (JPG, PNG, PDF up to 10MB)
                          </p>

                          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Select File / Take Photo</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadDemoSample();
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all"
                            >
                              <span>Try Demo Doctor Slip</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Staged File Loaded State */
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Prescription File Ready
                            </span>
                            <button
                              type="button"
                              onClick={() => setStagedFile(null)}
                              className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100">
                            {stagedFile.isPdf ? (
                              <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                                <FileText className="w-6 h-6" />
                              </div>
                            ) : (
                              <img
                                src={stagedFile.preview}
                                alt="Prescription preview"
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            )}
                            <div className="overflow-hidden flex-1">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {stagedFile.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {stagedFile.size} • Ready for optical extraction
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleLaunchAnalysis}
                            className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 shadow-floating flex items-center justify-center gap-2 transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Start AI Analysis (Gemini 3.6 Flash)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                          {uploadError}
                        </p>
                      )}

                      {/* Trust & Privacy Row */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          SLMC &amp; HIPAA Privacy Standard
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          100% Free Public Service
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Interactive Price Comparison */}
                  {portalTab === 'compare' && (
                    <div className="space-y-3.5">
                      {/* Scenario Switcher Tabs */}
                      <div className="flex items-center justify-between bg-slate-100/80 p-1 rounded-xl">
                        {SCENARIOS.map((sc) => (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => setActiveScenario(sc.id)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              activeScenario === sc.id
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {sc.tab}
                          </button>
                        ))}
                      </div>

                      {/* Brand vs Generic Card */}
                      <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm">{current.prescribedBrand}</span>
                            <p className="text-[11px] text-slate-500">
                              Active: <strong className="text-slate-700">{current.activeMolecule}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Brand MRP</p>
                            <p className="text-sm font-extrabold text-slate-800">
                              {formatLKR(current.prescribedPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Generic Equivalent Box */}
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {current.genericName}
                            </p>
                            <p className="text-[10px] text-emerald-700">
                              State Pharmaceuticals Corporation (Same molecule &amp; strength)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-emerald-800 font-semibold uppercase">Generic Cost</p>
                            <p className="text-sm font-extrabold text-emerald-700">
                              {formatLKR(current.genericPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Savings Banner */}
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                          <span className="flex items-center gap-1.5">
                            <TrendingDown className="w-4 h-4" />
                            <span>Calculated Savings</span>
                          </span>
                          <span>
                            Save {formatLKR(current.savingsAmount)} ({current.savingsPercent}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-center pt-1">
                        <Link
                          href="/dashboard/prices"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          <span>Explore All NMRA Gazette Price Caps</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (Section 10) */}
        <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                Simple 4-Step Patient Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How MediBridge LK Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                From a doctor&apos;s handwritten slip to verified pharmacy cost transparency in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">Upload Prescription</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Take a clear photo of your prescription on your mobile or drag and drop an image or PDF.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
                  <span>Fast Optical OCR</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">AI Reads & Extracts</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Gemini AI decodes physician handwriting, extracts medicine names, strength, dosage form, and frequency.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-sky-600 flex items-center gap-1">
                  <span>Confidence Scoring</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">Compare Prices</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our deterministic rule matching checks verified NMRA gazetted MRPs and pharmacy POS prices.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                  <span>Multi-Pharmacy Feeds</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-medgreen-50 text-medgreen-600 border border-medgreen-100 flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">Understand Savings</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    View comparable products with matching chemical active ingredients and strength, plus total cost calculations.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-medgreen-600 flex items-center gap-1">
                  <span>Prescription Savings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (Section 11) */}
        <section id="features" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-medgreen-700 uppercase tracking-wider bg-medgreen-50 px-3 py-1 rounded-full border border-medgreen-200">
                Complete Healthcare Technology
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built Specifically for Sri Lanka&apos;s Healthcare Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Designed to solve the real-world affordability challenges faced by Sri Lankan patients every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI Prescription Reader',
                  desc: 'Upload handwritten doctor scripts. Advanced vision LLM transcribes medication details instantly.',
                  icon: FileSearch,
                  color: 'text-brand-600 bg-brand-50 border-brand-100',
                },
                {
                  title: 'Medicine Identification',
                  desc: 'Know the true active ingredient, strength, manufacturer, and dosage form behind any brand.',
                  icon: Pill,
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                },
                {
                  title: 'Price Estimation & NMRA MRP',
                  desc: 'Estimate prescription total costs against gazetted Maximum Retail Price ceilings before you reach the counter.',
                  icon: TrendingDown,
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                },
                {
                  title: 'Deterministic Matching Engine',
                  desc: 'Structured database matching based strictly on active ingredient and strength. Zero hallucinated switches.',
                  icon: Layers,
                  color: 'text-sky-600 bg-sky-50 border-sky-100',
                },
                {
                  title: 'Savings Calculator',
                  desc: 'Calculate potential differences in Sri Lankan Rupees and understand your monthly medication budget.',
                  icon: LineChart,
                  color: 'text-teal-600 bg-teal-50 border-teal-100',
                },
                {
                  title: 'Price History Tracking',
                  desc: 'Transparent historical timeline showing gazetted revisions without overwriting past prices.',
                  icon: Clock,
                  color: 'text-amber-600 bg-amber-50 border-amber-100',
                },
                {
                  title: 'Official NMRA Safety Alerts',
                  desc: 'Stay informed with real-time Ministry of Health quality notices, batch recalls, and revocations.',
                  icon: ShieldCheck,
                  color: 'text-rose-600 bg-rose-50 border-rose-100',
                },
                {
                  title: 'Pharmacy Directory & Feeds',
                  desc: 'Compare Rajya Osu Sala, Healthguard, Nawaloka, and local pharmacies in your district.',
                  icon: Building2,
                  color: 'text-violet-600 bg-violet-50 border-violet-100',
                },
                {
                  title: 'Trilingual Access',
                  desc: 'Full native support for English, Sinhala (සිංහල), and Tamil (தமிழ்) powered by Valsea.ai.',
                  icon: Globe2,
                  color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all space-y-3"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MEDICAL DISCLAIMER BANNER IN CONTAINER */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
          <MedicalDisclaimer />
        </section>

        {/* CTA HERO BANNER */}
        <section className="py-16 bg-gradient-to-r from-brand-600 via-brand-700 to-medgreen-700 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Take Control of Your Healthcare Spending Today
            </h2>
            <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto">
              No more guessing at pharmacy counters. Upload your doctor&apos;s prescription or search for any medicine brand now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/dashboard/prescription"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-floating transition-all"
              >
                <FileSearch className="w-4 h-4 text-brand-600" />
                <span>Analyze Your Prescription</span>
              </Link>
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all"
              >
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
