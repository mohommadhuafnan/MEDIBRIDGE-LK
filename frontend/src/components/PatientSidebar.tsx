'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  FileSearch,
  Pill,
  DollarSign,
  TrendingDown,
  History,
  LineChart,
  ShieldAlert,
  Building2,
  User,
  Settings,
  LogOut,
  Sparkles,
  Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/prescription', label: 'Analyze Prescription', icon: FileSearch, highlight: true },
  { href: '/dashboard/medicines', label: 'Medicines Directory', icon: Pill },
  { href: '/dashboard/prices', label: 'Price Comparison', icon: DollarSign },
  { href: '/dashboard/savings', label: 'Savings Calculator', icon: TrendingDown },
  { href: '/dashboard/history', label: 'Prescription History', icon: History },
  { href: '/dashboard/my-medicines', label: 'My Medicines', icon: Pill },
  { href: '/dashboard/price-history', label: 'Price History', icon: LineChart },
  { href: '/dashboard/safety', label: 'Safety Alerts', icon: ShieldAlert },
  { href: '/dashboard/pharmacies', label: 'Pharmacies', icon: Building2 },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function PatientSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shrink-0 z-40 hidden md:flex">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-medgreen-500 p-0.5 shadow-sm flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-600" />
          </div>
        </div>
        <div>
          <span className="font-bold text-lg text-slate-900 leading-tight block">
            MediBridge <span className="text-brand-600">LK</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Patient Portal
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs border border-brand-200/60'
                  : item.highlight
                  ? 'bg-gradient-to-r from-brand-50/60 to-medgreen-50/40 text-brand-800 hover:bg-brand-50 border border-brand-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-brand-600' : item.highlight ? 'text-brand-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.highlight && (
                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Section & Logout */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.full_name || 'Sunil Jayawardena'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Patient'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
