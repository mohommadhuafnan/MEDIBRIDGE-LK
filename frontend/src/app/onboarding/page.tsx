'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import {
  Activity,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  HeartHandshake,
  Building2,
  Stethoscope,
  Globe,
  MapPin,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];

const GOALS_OPTIONS = [
  { id: 'understand_prescription', label: 'Understand my prescription handwriting & drugs' },
  { id: 'compare_prices', label: 'Compare medicine prices across state & private pharmacies' },
  { id: 'find_comparable', label: 'Find lower-cost comparable products (matching ingredients)' },
  { id: 'track_spending', label: 'Track monthly prescription spending & estimates' },
  { id: 'safety_alerts', label: 'Receive official NMRA medicine recalls & safety notices' },
  { id: 'pharmacy_mgmt', label: 'Manage pharmacy prices and inventory' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateOnboarding } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'PATIENT');
  const [goals, setGoals] = useState<string[]>(['understand_prescription', 'compare_prices', 'find_comparable']);
  const [district, setDistrict] = useState('Colombo');
  const [city, setCity] = useState('Colombo 03');
  const [priceNotifications, setPriceNotifications] = useState(true);
  const [safetyNotifications, setSafetyNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toggleGoal = (id: string) => {
    if (goals.includes(id)) {
      setGoals(goals.filter((g) => g !== id));
    } else {
      setGoals([...goals, id]);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    await updateOnboarding({
      full_name: fullName,
      role,
      goals,
      preferred_language: language,
      district,
      city,
      price_notifications: priceNotifications,
      safety_notifications: safetyNotifications,
    });
    setIsSaving(false);

    if (role === 'ADMIN') router.push('/admin/dashboard');
    else if (role === 'PHARMACIST') router.push('/pharmacy/dashboard');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-emerald-50/30 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900">
            MediBridge <span className="text-brand-600">LK</span>
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200">
          Step {step} of 7
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-medgreen-500 rounded-full"
            initial={{ width: '14%' }}
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/80 shadow-floating relative my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: About You */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 1 — About You</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  What should we call you?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We use your preferred name to personalize your medical cost analyses and reports.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sunil Jayawardena"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-800"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Role Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 2 — Your Role</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  How will you use MediBridge?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select your primary role so we tailor your navigation and tools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'PATIENT', title: 'Patient', desc: 'Find medicines, compare prices & save', icon: User },
                  { id: 'CAREGIVER', title: 'Caregiver / Family', desc: 'Managing medicines for loved ones', icon: HeartHandshake },
                  { id: 'PHARMACIST', title: 'Pharmacist', desc: 'Pharmacy price updates & stock', icon: Building2 },
                  { id: 'HEALTHCARE_PROFESSIONAL', title: 'Doctor / Medical Staff', desc: 'Prescription & NMRA drug reference', icon: Stethoscope },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-brand-50/90 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 3 — Your Goals</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  What would you mainly like to do?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select all that apply. We will customize your dashboard shortcuts.
                </p>
              </div>

              <div className="space-y-2.5">
                {GOALS_OPTIONS.map((g) => {
                  const selected = goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs sm:text-sm ${
                        selected
                          ? 'bg-brand-50 border-brand-400 text-brand-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{g.label}</span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          selected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Language Selection */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 4 — Language</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Choose your preferred language
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  MediBridge LK is proudly trilingual for Sri Lankan patients.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', title: 'English', sub: 'Standard medical English' },
                  { code: 'si', title: 'සිංහල', sub: 'Sinhala language' },
                  { code: 'ta', title: 'தமிழ்', sub: 'Tamil language' },
                ].map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code as Language)}
                      className={`p-5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Globe className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                      <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Location */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 5 — Location</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Where are you located?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Helps us prioritize pharmacy availability and pricing near your district.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    disabled
                    value="Sri Lanka"
                    className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 font-medium"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Town (Optional)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Maharagama / Kandy"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Preferences */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 6 — Alerts</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Notification Preferences
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose which regulatory and price updates you would like to receive.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <p className="text-sm font-bold text-slate-800">Medicine Price-Change Notifications</p>
                    <p className="text-xs text-slate-500">
                      Receive alerts when NMRA announces price ceiling revisions or participating pharmacies reduce rates.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={priceNotifications}
                    onChange={(e) => setPriceNotifications(e.target.checked)}
                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                  />
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <p className="text-sm font-bold text-slate-800">Official NMRA Safety & Recall Alerts</p>
                    <p className="text-xs text-slate-500">
                      Get urgent notifications if a medicine or batch you use is recalled by the Ministry of Health.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyNotifications}
                    onChange={(e) => setSafetyNotifications(e.target.checked)}
                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* FINAL STEP: Ready */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-medgreen-500 text-white flex items-center justify-center mx-auto shadow-floating">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  Your MediBridge Experience is Ready!
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                  Welcome aboard, <strong>{fullName || 'Friend'}</strong>. Your profile has been customized with NMRA Sri Lanka verified pricing and generic matching tools.
                </p>
              </div>

              <div className="p-4 bg-sky-50/80 border border-sky-200/70 rounded-2xl text-left max-w-md mx-auto space-y-2 text-xs text-sky-900">
                <div className="flex items-center gap-2 font-bold text-sky-950">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Configured Settings Summary:</span>
                </div>
                <p>• Role: <span className="font-semibold capitalize">{role}</span></p>
                <p>• Language: <span className="font-semibold">{language === 'si' ? 'සිංහල' : language === 'ta' ? 'தமிழ்' : 'English'}</span></p>
                <p>• District: <span className="font-semibold">{district}, Sri Lanka</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
          {step > 1 && step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 btn-glow transition-all ml-auto"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleFinish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-medgreen-600 hover:from-brand-700 hover:to-medgreen-700 shadow-floating btn-glow transition-all"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('Go to Dashboard')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="max-w-2xl mx-auto w-full text-center text-[11px] text-slate-400 py-2">
        Sri Lanka Healthcare Regulatory Compliance • NMRA Act No. 5 of 2015
      </div>
    </div>
  );
}
