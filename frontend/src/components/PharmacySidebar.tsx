'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Pill,
  DollarSign,
  Package,
  Upload,
  User,
  Settings,
  LogOut,
  Building2,
  FileText,
} from 'lucide-react';

const PHARMACY_NAV = [
  { href: '/pharmacy/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/pharmacy/medicines', label: 'Pharmacy Medicines', icon: Pill },
  { href: '/pharmacy/prices', label: 'Price Updates & CSV', icon: DollarSign },
  { href: '/pharmacy/inventory', label: 'Inventory Stock', icon: Package },
  { href: '/dashboard', label: 'Switch to Patient View', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function PharmacySidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shrink-0 z-40 hidden md:flex">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div>
          <span className="font-bold text-lg text-slate-900 leading-tight block">
            MediBridge <span className="text-emerald-600">Rx</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
            Pharmacy Portal
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {PHARMACY_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 mb-2">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {user?.full_name || 'Rajith Fernando (R.Ph)'}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">Licensed Pharmacist</p>
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
