'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Pill,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  Settings,
  LogOut,
  Shield,
  FileText,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Directory', icon: Users },
  { href: '/admin/medicines', label: 'Medicine Catalog', icon: Pill },
  { href: '/admin/prices', label: 'NMRA Price Control', icon: DollarSign },
  { href: '/admin/safety', label: 'Regulatory Alerts', icon: ShieldAlert },
  { href: '/admin/verification', label: 'Verification Center', icon: CheckCircle2 },
  { href: '/dashboard', label: 'Patient View', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 z-40 hidden md:flex text-slate-300">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 p-0.5 shadow-sm flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-400" />
          </div>
        </div>
        <div>
          <span className="font-bold text-lg text-white leading-tight block">
            MediBridge <span className="text-brand-400">Admin</span>
          </span>
          <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
            NMRA Oversight
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-600/30 text-brand-300 font-semibold border border-brand-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 mb-2">
          <p className="text-xs font-semibold text-white truncate">
            {user?.full_name || 'Dr. Nirmal Perera'}
          </p>
          <p className="text-[10px] text-brand-400 font-medium">Administrator</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
