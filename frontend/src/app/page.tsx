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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-3xl" />
            <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] bg-medgreen-100/40 rounded-full blur-3xl" />
            <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* NMRA Regulatory Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-subtle text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Aligned with NMRA Sri Lanka Price Gazette</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Understand Your Prescription.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-medgreen-600">
                    Know Your Medicine.
                  </span>{' '}
                  Save Smarter.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  MediBridge LK uses AI to help you understand prescriptions, identify medicines, estimate costs and compare available medicine options across Sri Lanka.
                </p>

                {/* Main CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/dashboard/prescription"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-medgreen-600 hover:from-brand-700 hover:to-medgreen-700 shadow-floating btn-glow transition-all"
                  >
                    <FileSearch className="w-5 h-5" />
                    <span>{t('Analyze Prescription')}</span>
                  </Link>

                  <Link
                    href="/dashboard/medicines"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-subtle transition-all"
                  >
                    <Pill className="w-5 h-5 text-brand-600" />
                    <span>{t('Explore Medicines')}</span>
                  </Link>
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

              {/* Right Column: Hero Visualizer (Prescription -> AI Extraction -> Comparison) */}
              <div className="lg:col-span-6 relative">
                <div className="relative glass-panel rounded-3xl p-5 sm:p-7 shadow-floating border border-white/90">
                  {/* Visualizer Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-600 ml-2">
                        Live AI Extraction Pipeline
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Activity className="w-3 h-3 animate-pulse" /> Verified Active
                    </span>
                  </div>

                  {/* Visualizer Step 1: Doctor Handwritten Prescription Note */}
                  <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                        1. Handwritten Doctor Prescription (Uploaded)
                      </span>
                      <span>Colombo Hospital</span>
                    </div>
                    <div className="font-serif italic text-slate-700 text-sm bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 font-medium">
                      &ldquo;Rx: Lipitor 20mg nocte x 30 | Glucophage 500mg bd cc x 60&rdquo;
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  <div className="flex justify-center my-1">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs">
                      ↓
                    </div>
                  </div>

                  {/* Visualizer Step 2: AI Extracted Details */}
                  <div className="p-3.5 bg-white rounded-2xl border border-brand-200/80 shadow-sm mb-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 2. AI Identified Active Ingredients
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        96% Confidence
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-slate-400 text-[10px]">Identified Drug</p>
                        <p className="font-bold text-slate-800">Atorvastatin 20mg</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-slate-400 text-[10px]">Dosage Form</p>
                        <p className="font-bold text-slate-800">Tablet (Nightly)</p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  <div className="flex justify-center my-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                      ↓
                    </div>
                  </div>

                  {/* Visualizer Step 3: NMRA Comparable Products & Savings */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                        3. Comparable Product & Savings
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-xs">
                        Save Rs. 2,250 (62.5%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <p className="text-[10px] text-slate-500">Brand Name Prescribed</p>
                        <p className="font-semibold text-slate-800">Lipitor 20mg — Rs. 3,600.00</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-emerald-700 font-bold">Potential Lower-Cost Option</p>
                        <p className="font-bold text-emerald-800">Storvas 20 / SPC — Rs. 1,350.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Safety Prompt */}
                  <p className="text-[10px] text-slate-500 text-center mt-3">
                    * Always consult a qualified doctor or pharmacist before changing any brand.
                  </p>
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
