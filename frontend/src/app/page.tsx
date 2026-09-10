'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CinematicVideoShowcase from '../components/CinematicVideoShowcase';
import GoogleReviewsSection from '../components/GoogleReviewsSection';
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

  // Hero Typewriter Animation
  const HERO_TYPING_PHRASES = [
    'Know Your Medicine. Save Smarter.',
    'Decodes Handwritten Doctor Slips.',
    'Discovers Verified Generic Options.',
    'Official Sri Lanka NMRA Price Ceilings.',
    'Trilingual in English, සිංහල & தமிழ்.',
  ];
  const [heroPhraseIdx, setHeroPhraseIdx] = useState(0);
  const [heroTypedText, setHeroTypedText] = useState('');
  const [heroIsDeleting, setHeroIsDeleting] = useState(false);

  useEffect(() => {
    const target = HERO_TYPING_PHRASES[heroPhraseIdx];
    const speed = heroIsDeleting ? 25 : 55;

    const timer = setTimeout(() => {
      if (!heroIsDeleting) {
        if (heroTypedText.length < target.length) {
          setHeroTypedText(target.slice(0, heroTypedText.length + 1));
        } else {
          setTimeout(() => setHeroIsDeleting(true), 2400);
        }
      } else {
        if (heroTypedText.length > 0) {
          setHeroTypedText(target.slice(0, heroTypedText.length - 1));
        } else {
          setHeroIsDeleting(false);
          setHeroPhraseIdx((prev) => (prev + 1) % HERO_TYPING_PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [heroTypedText, heroIsDeleting, heroPhraseIdx]);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION WITH USER BANNER BACKGROUND IMAGE */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat pt-10 pb-20 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/60"
          style={{ backgroundImage: "url('/hero-banner.jpg')" }}
        >
          {/* Balanced translucent overlay: preserves background artwork while ensuring 100% text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/65 to-white/85 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              
              {/* NMRA Regulatory Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-800 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-bold text-slate-900">Sri Lanka NMRA Gazette Aligned</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200/60">
                  MRP Ceilings Active
                </span>
              </div>

              {/* Dynamic Typewriter Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                Understand Your Prescription.{' '}
                <span className="block text-brand-700 min-h-[1.25em] drop-shadow-2xs">
                  {heroTypedText}
                  <span className="inline-block w-1 sm:w-1.5 h-8 sm:h-12 bg-brand-600 ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed max-w-2xl mx-auto drop-shadow-2xs">
                Instantly read physician handwriting, identify active chemical molecules, and discover official NMRA price caps &amp; Rajya Osu Sala generic options across Sri Lanka.
              </p>

              {/* Instant Medicine Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl mx-auto"
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={homeSearch}
                    onChange={(e) => setHomeSearch(e.target.value)}
                    placeholder="Search medicine brand or generic (e.g. Lipitor, Panadol, Losec)..."
                    className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
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
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Popular In Sri Lanka (Click to check price):
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
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
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-brand-50 hover:border-brand-300 border border-slate-200/90 text-slate-800 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pill className="w-3 h-3 text-brand-600" />
                      <span>{med.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard/prescription"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-medgreen-600 hover:from-brand-500 hover:to-medgreen-500 shadow-lg hover:shadow-brand-500/25 transition-all transform hover:scale-105"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Scan Prescription Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard/medicines"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-white/95 hover:bg-white border border-slate-200 shadow-md transition-all transform hover:scale-105"
                >
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Compare Medicine Prices</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
                <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900">100%</p>
                  <p className="text-[11px] text-slate-600 font-semibold">Deterministic Rule Matching</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">60%+</p>
                  <p className="text-[11px] text-slate-600 font-semibold">Potential Generic Savings</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-600">3 Languages</p>
                  <p className="text-[11px] text-slate-600 font-semibold">EN, සිංහල, தமிழ்</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                  <p className="text-xl sm:text-2xl font-extrabold text-indigo-600">500+</p>
                  <p className="text-[11px] text-slate-600 font-semibold">Pharmacies Across Sri Lanka</p>
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

        {/* CINEMATIC VIDEO SHOWCASE WITH DYNAMIC TYPEWRITER TEXT */}
        <CinematicVideoShowcase />

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

        {/* GOOGLE REVIEWS SECTION (SINGLE LINE INFINITE MARQUEE) */}
        <GoogleReviewsSection />

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
