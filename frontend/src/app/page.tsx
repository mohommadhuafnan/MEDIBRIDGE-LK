'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const SCENARIOS = [
    {
      id: 0,
      tab: 'Cardio & Cholesterol',
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
      tab: 'Diabetes Care',
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
      tab: 'Gastric & Acid Relief',
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
          {/* Subtle Dynamic Ambient Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-8%] left-[-12%] w-[540px] h-[540px] bg-brand-200/40 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-[18%] right-[-8%] w-[500px] h-[500px] bg-emerald-200/35 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-[52%] left-[28%] w-[420px] h-[420px] bg-sky-100/50 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* NMRA Regulatory Pill with pulsing live indicator */}
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

                {/* Main CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                  <Link
                    href="/dashboard/prescription"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 shadow-floating btn-glow transition-all"
                  >
                    <FileSearch className="w-5 h-5" />
                    <span>{t('Analyze Prescription')}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/dashboard/medicines"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-subtle transition-all"
                  >
                    <Pill className="w-5 h-5 text-brand-600" />
                    <span>{t('Explore Medicines')}</span>
                  </Link>
                </div>

                {/* Popular Sri Lankan Medicine Chips */}
                <div className="pt-2">
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
                      <Link
                        key={med.name}
                        href="/dashboard/medicines"
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-white hover:bg-brand-50 hover:border-brand-200 border border-slate-200 text-slate-700 shadow-2xs transition-all flex items-center gap-1.5"
                      >
                        <Pill className="w-3 h-3 text-brand-500" />
                        <span>{med.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 text-left">
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

              {/* Right Column: Premium AI Prescription Intelligence Console */}
              <div className="lg:col-span-6 relative">
                
                {/* Floating Micro-Badge Top Right */}
                <div className="hidden sm:flex absolute -top-5 -right-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 border border-slate-200/80 shadow-floating backdrop-blur-md text-xs animate-float-y">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vision Engine</p>
                    <p className="font-extrabold text-slate-800 text-xs">Gemini 3.6 Flash Active</p>
                  </div>
                </div>

                {/* Floating Micro-Badge Bottom Left */}
                <div className="hidden sm:flex absolute -bottom-5 -left-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 border border-slate-200/80 shadow-floating backdrop-blur-md text-xs animate-float-y" style={{ animationDelay: '1.5s' }}>
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price Gazette</p>
                    <p className="font-extrabold text-slate-800 text-xs">Maximum Retail Price Ceiling</p>
                  </div>
                </div>

                {/* Main Console Container */}
                <div className="relative rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.16)] bg-white/95 backdrop-blur-xl p-5 sm:p-7 overflow-hidden space-y-5">
                  
                  {/* Console Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center shadow-xs">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Prescription Scanner
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Real-Time Optical AI Recognition</p>
                      </div>
                    </div>

                    {/* Interactive Scenario Switcher Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
                      {SCENARIOS.map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => setActiveScenario(sc.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            activeScenario === sc.id
                              ? 'bg-white text-brand-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sc.tab.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Prescription Paper Pad with Laser Scanner */}
                  <div className="relative rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-slate-50/60 border border-amber-200/70 p-4 overflow-hidden shadow-inner space-y-3">
                    
                    {/* Glowing Laser Scan Beam */}
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_12px_2px_rgba(6,182,212,0.8)] pointer-events-none z-10 animate-laser-scan" />

                    {/* Doctor Header & Patient Bar */}
                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-dashed border-slate-200 text-slate-500">
                      <div>
                        <p className="font-extrabold text-slate-800 text-xs">National Hospital of Sri Lanka</p>
                        <p className="text-[10px]">Dr. S. K. Perera (MBBS, MD) • SLMC #24981</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">
                          Verified OCR
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Patient: K. Bandara (46y)</p>
                      </div>
                    </div>

                    {/* Handwritten Script Simulator */}
                    <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                          Doctor Handwritten Script
                        </span>
                        <p className="font-serif italic font-bold text-slate-800 text-sm">
                          &ldquo;{current.doctorNote}&rdquo;
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200/80 shrink-0">
                        98% AI Match
                      </span>
                    </div>

                    {/* Extracted Brand vs Generic Comparison Card */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-3">
                      
                      {/* Prescribed Drug Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-sm">{current.prescribedBrand}</span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Brand Name
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Active Molecule: <strong className="text-slate-700">{current.activeMolecule}</strong>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Brand MRP</p>
                          <p className="text-sm font-extrabold text-slate-800">
                            {formatLKR(current.prescribedPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Generic Equivalent Box (SPC / NMRA Gazette) */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-200 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-950">
                              {current.genericName}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700">
                            State Pharmaceuticals Corporation (Same active molecule &amp; strength)
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-emerald-800 font-semibold uppercase">Generic Cost</p>
                          <p className="text-sm font-extrabold text-emerald-700">
                            {formatLKR(current.genericPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Savings Pill Banner */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
                        <span className="flex items-center gap-1.5">
                          <TrendingDown className="w-4 h-4" />
                          <span>Calculated Prescription Savings</span>
                        </span>
                        <span>
                          Save {formatLKR(current.savingsAmount)} ({current.savingsPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action inside the visual */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Free for Sri Lankan citizens
                    </p>
                    <Link
                      href="/dashboard/prescription"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      <span>Upload Your Doctor Slip Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

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
