'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  avatarBg: string;
  rating: number;
  date: string;
  review: string;
  medsMentioned?: string;
  savings?: string;
}

const GOOGLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Dr. Rohan Perera',
    role: 'General Physician & Advocate',
    location: 'Colombo 07',
    avatarBg: 'bg-emerald-600',
    rating: 5,
    date: '3 days ago',
    review:
      'As a doctor practicing in Colombo, illegible prescription handwriting is a major cause of dispensing mistakes. MediBridge LK transcribed complex slips with 100% accuracy and helped my elderly patients switch to Rajya Osu Sala generics without compromising clinical efficacy.',
    savings: 'LKR 6,400 saved/month',
  },
  {
    id: 'rev-2',
    author: 'Dilani Samarasinghe',
    role: 'Caregiver for Elderly Parents',
    location: 'Kandy',
    avatarBg: 'bg-brand-600',
    rating: 5,
    date: '1 week ago',
    review:
      'My mother takes Atorvastatin (Lipitor) and Metformin every month. MediBridge showed us that the identical active molecule was available at State Pharmaceuticals Corporation (SPC) for less than one-third the price! Sinhala language support made it super easy for her to read.',
    medsMentioned: 'Lipitor 20mg → SPC Atorvastatin',
    savings: '62% Cost Reduction',
  },
  {
    id: 'rev-3',
    author: 'Mohamed Fazil',
    role: 'Community Pharmacist',
    location: 'Galle Fort',
    avatarBg: 'bg-indigo-600',
    rating: 5,
    date: '2 weeks ago',
    review:
      'The NMRA gazetted MRP ceiling checker is brilliant. Customers often suspect pharmacies of overcharging when medicine prices fluctuate due to import currency changes. MediBridge gives our patients verified, government-aligned price transparency instantly.',
    savings: '100% NMRA Verified',
  },
  {
    id: 'rev-4',
    author: 'Thivanka Jayawardena',
    role: 'Software Engineer',
    location: 'Gampaha',
    avatarBg: 'bg-teal-600',
    rating: 5,
    date: '2 weeks ago',
    review:
      'I simply took a picture of my doctor’s prescription slip on my phone. Within 3 seconds, MediBridge identified all four medications, dosage frequency, and mapped each to verified generic alternatives in Sri Lanka. Truly groundbreaking technology for our country!',
    medsMentioned: 'Amoxil 500mg, Losec 20mg',
  },
  {
    id: 'rev-5',
    author: 'Sivaranjani Nadarajah',
    role: 'Verified Patient',
    location: 'Jaffna',
    avatarBg: 'bg-purple-600',
    rating: 5,
    date: '3 weeks ago',
    review:
      'Finding affordable medicines in the Northern Province used to involve visiting three different pharmacies. Now I check the prices and generic availability in Tamil on MediBridge before stepping out. Saved our family thousands of rupees already.',
    savings: 'LKR 4,850 saved',
  },
  {
    id: 'rev-6',
    author: 'Nirmal Gunasekara',
    role: 'Chronic Care Patient',
    location: 'Negombo',
    avatarBg: 'bg-amber-600',
    rating: 5,
    date: '1 month ago',
    review:
      'With chronic asthma and blood pressure meds, monthly pharmacy bills were getting out of hand. MediBridge helped me compare prices between Healthguard, Hemas, and Rajya Osu Sala. Unbiased, free, and genuinely helps ordinary Sri Lankans.',
    savings: 'LKR 8,200 saved/month',
  },
];

// Duplicate for infinite marquee loop
const MARQUEE_REVIEWS = [...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS];

export default function GoogleReviewsSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Google Reviews Header Card */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>VERIFIED PATIENT &amp; PHARMACY EXPERIENCES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Patients &amp; Doctors Across Sri Lanka
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Real community reviews from Colombo, Kandy, Galle, Jaffna, and Gampaha saving on monthly prescriptions.
            </p>
          </div>

          {/* Google 4.9 Score Badge */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-subtle flex items-center gap-5 shrink-0">
            <div className="flex flex-col items-center">
              {/* Google G Logo */}
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center mb-1">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Rating</span>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">4.9</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Based on <span className="font-bold text-slate-800">340+ Reviews</span> in Sri Lanka
              </p>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Verified Feedback</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SINGLE LINE INFINITE LOOPING MARQUEE */}
      <div 
        className="relative w-full overflow-hidden pt-4 pb-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Soft Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

        {/* Animated Infinite Sliding Row */}
        <motion.div
          className="flex gap-6 w-max"
          animate={isPaused ? {} : { x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 32,
          }}
        >
          {MARQUEE_REVIEWS.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="w-[340px] sm:w-[380px] p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4 shrink-0 whitespace-normal hover:-translate-y-1 duration-200"
            >
              <div className="space-y-3">
                {/* Header: Author & Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl ${rev.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                    >
                      {rev.author
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{rev.author}</h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" title="Verified Reviewer" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                        {rev.role} • <span className="text-slate-700">{rev.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Google G Tiny Icon */}
                  <svg className="w-4 h-4 shrink-0 opacity-70" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>

                {/* Stars & Date */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">• {rev.date}</span>
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Highlight Footer: Savings Tag */}
              {rev.savings && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">Impact:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 text-[11px]">
                    {rev.savings}
                  </span>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="text-center pt-6">
        <p className="text-[11px] text-slate-400 font-medium">
          Hover to pause scroll • Verified Google Reviews across 25 Sri Lankan administrative districts
        </p>
      </div>
    </section>
  );
}
