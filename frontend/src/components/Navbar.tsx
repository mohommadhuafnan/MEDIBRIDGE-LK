'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import {
  Activity,
  Globe,
  Menu,
  X,
  FileSearch,
  LogIn,
  LayoutDashboard,
  ChevronDown,
  Check,
} from 'lucide-react';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
        {/* Professional Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt="MediBridge LK Official Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-2xs group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                MediBridge <span className="text-brand-600">LK</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Sri Lanka
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden xl:block font-medium">
              {t('Understand Your Medicine. Know Your Cost.')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links - Fully Translated */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-slate-600">
          <Link
            href="/#how-it-works"
            className="hover:text-brand-600 transition-colors whitespace-nowrap"
          >
            {t('How It Works')}
          </Link>
          <Link
            href="/#features"
            className="hover:text-brand-600 transition-colors whitespace-nowrap"
          >
            {t('Features')}
          </Link>
          <Link
            href="/dashboard/medicines"
            className="hover:text-brand-600 transition-colors whitespace-nowrap"
          >
            {t('Medicines Directory')}
          </Link>
          <Link
            href="/dashboard/prices"
            className="hover:text-brand-600 transition-colors whitespace-nowrap"
          >
            {t('NMRA Prices')}
          </Link>
          <Link
            href="/dashboard/pharmacies"
            className="hover:text-brand-600 transition-colors whitespace-nowrap"
          >
            {t('For Pharmacies')}
          </Link>
        </nav>

        {/* Right Action Controls: Language Dropdown + CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Elegant Language Dropdown Menu */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{currentLangObj.native}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Card */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-floating border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language
                </div>
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center justify-between transition-colors ${
                      language === item.code
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block">{item.native}</span>
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                    {language === item.code && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Logged In vs CTA */}
          {user ? (
            <Link
              href={
                user.role === 'ADMIN'
                  ? '/admin/dashboard'
                  : user.role === 'PHARMACIST'
                  ? '/pharmacy/dashboard'
                  : '/dashboard'
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('Go to Dashboard')}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                {t('Login')}
              </Link>
              <Link
                href="/dashboard/prescription"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
              >
                <FileSearch className="w-4 h-4" />
                <span>{t('Analyze Prescription')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'si' : language === 'si' ? 'ta' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            <span>{currentLangObj.code.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 hover:text-brand-600"
            >
              {t('How It Works')}
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 hover:text-brand-600"
            >
              {t('Features')}
            </Link>
            <Link
              href="/dashboard/prescription"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 text-brand-700 font-semibold flex items-center gap-2"
            >
              <FileSearch className="w-4 h-4 text-brand-600" />
              {t('Analyze Prescription')}
            </Link>
            <Link
              href="/dashboard/medicines"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 hover:text-brand-600"
            >
              {t('Medicines Directory')}
            </Link>
            <Link
              href="/dashboard/prices"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 hover:text-brand-600"
            >
              {t('NMRA Prices')}
            </Link>
            <Link
              href="/dashboard/pharmacies"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 hover:text-brand-600"
            >
              {t('For Pharmacies')}
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
              >
                {t('Go to Dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs"
                >
                  {t('Login')}
                </Link>
                <Link
                  href="/dashboard/prescription"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
                >
                  {t('Analyze Prescription')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
