'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import MobileNav from '../../../components/MobileNav';
import { Users, Search, Shield, User, Building2, CheckCircle2 } from 'lucide-react';

const SAMPLE_USERS = [
  { id: '1', name: 'Sunil Jayawardena', email: 'sunil@gmail.com', role: 'PATIENT', district: 'Colombo', status: 'Active' },
  { id: '2', name: 'Rajith Fernando (R.Ph)', email: 'rajith.rx@osusala.lk', role: 'PHARMACIST', district: 'Colombo', status: 'Licensed' },
  { id: '3', name: 'Dr. Nirmal Perera', email: 'admin@nmra.gov.lk', role: 'ADMIN', district: 'Colombo', status: 'Verified' },
  { id: '4', name: 'Priyanthi Alwis', email: 'priyanthi@yahoo.com', role: 'CAREGIVER', district: 'Kandy', status: 'Active' },
  { id: '5', name: 'Healthguard Bambalapitiya Staff', email: 'bamba@healthguard.lk', role: 'PHARMACIST', district: 'Colombo', status: 'Licensed' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <span className="font-extrabold text-base text-slate-800">User Directory & Role Auditing</span>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Registered Platform Users
            </h1>
            <p className="text-xs text-slate-500">
              Audit patient accounts, pharmacist licenses, and regulatory authority roles.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 shadow-subtle flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, or role..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{u.district}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 font-semibold">{u.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Managing permissions for ${u.name}`)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Edit Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
