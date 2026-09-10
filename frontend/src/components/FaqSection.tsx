'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How accurately does MediBridge LK read doctor handwriting?',
    answer:
      'MediBridge LK uses Google Gemini 3.6 Flash multimodal vision intelligence paired with medical-grade OCR. It is trained on cursive South Asian clinical slips, accurately transcribing drug names, active chemical molecules, strength (e.g., 500mg, 20mg), dosage forms (tablets, syrups), and frequency (bd, tds, mane, nocte).',
  },
  {
    question: 'Are medicine prices and price ceilings legally official in Sri Lanka?',
    answer:
      'Yes, 100%. All Maximum Retail Price (MRP) ceilings are directly matched against the official gazettes issued by the National Medicines Regulatory Authority (NMRA) under the Ministry of Health Sri Lanka. If a pharmacy charges above gazetted limits, MediBridge alerts you automatically.',
  },
  {
    question: 'What is generic substitution and is it safe to use Rajya Osu Sala (SPC) medicines?',
    answer:
      'Generic medicines have the exact same active pharmaceutical ingredient, purity, and clinical efficacy as expensive brand names. State Pharmaceuticals Corporation (Rajya Osu Sala) medicines are produced under strict WHO Good Manufacturing Practice (GMP) standards, providing identical medical results at 40% to 75% lower cost.',
  },
  {
    question: 'How much money can a typical Sri Lankan family save each month?',
    answer:
      'Families managing chronic conditions (such as Diabetes, Hypertension, and High Cholesterol) typically save between LKR 3,500 and LKR 8,500 every month by switching to verified generic equivalents or comparing nearby pharmacy prices.',
  },
  {
    question: 'Is my medical prescription data kept confidential and secure?',
    answer:
      'Yes. Your prescription images and medical information are encrypted in transit and at rest adhering to Sri Lanka Medical Council (SLMC) and international HIPAA privacy standards. We never sell or share patient data.',
  },
  {
    question: 'Can I use MediBridge LK in Sinhala (සිංහල) or Tamil (தமிழ்)?',
    answer:
      'Yes, MediBridge LK is fully trilingual. You can switch between English, Sinhala (සිංහල), and Tamil (தமிழ்) at any time from the top navigation bar. Medicine names, instructions, and price breakdowns translate seamlessly.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white border-y border-slate-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wide">
            <MessageCircleQuestion className="w-4 h-4 text-brand-600" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Learn how MediBridge LK decodes doctor handwriting, checks NMRA price ceilings, and helps Sri Lankan families save.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-brand-300 bg-brand-50/20 shadow-subtle'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-brand-100 text-brand-700 rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-brand-100/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Chatbot Prompt Callout */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-slate-900">Have a specific medicine question?</h4>
            <p className="text-xs text-slate-500">
              Ask our live Gemini AI Assistant in English, Sinhala, or Tamil.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-medibridge-chat'));
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Gemini AI Assistant</span>
          </button>
        </div>

      </div>
    </section>
  );
}
