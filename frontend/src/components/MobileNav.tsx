'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, Pill, DollarSign, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const NAV = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/dashboard/prescription', label: 'Upload', icon: FileSearch, highlight: true },
    { href: '/dashboard/medicines', label: 'Medicines', icon: Pill },
    { href: '/dashboard/prices', label: 'Prices', icon: DollarSign },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-medgreen-500 text-white flex items-center justify-center shadow-floating border-2 border-white">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-brand-700 mt-1">Scan Rx</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
