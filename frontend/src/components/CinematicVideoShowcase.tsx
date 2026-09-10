'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileSearch,
  Volume2,
  VolumeX,
} from 'lucide-react';

const TYPING_PHRASES = [
  'Decodes Sri Lankan Doctor Handwriting Instantly.',
  'Identifies NMRA Verified Generic Alternatives.',
  'Calculates Up to 65% in Prescription Savings.',
  'Trilingual Healthcare in English, සිංහල, and தமிழ்.',
  'Connects 500+ Verified Pharmacies Nationwide.',
];

export default function CinematicVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Typewriter effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter animation loop
  useEffect(() => {
    const targetPhrase = TYPING_PHRASES[currentPhraseIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetPhrase.length) {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(targetPhrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white border-y border-white/10">
      {/* Full-Screen Edge-to-Edge Looping Video */}
      <video
        ref={videoRef}
        src="/Vedio.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-[0.82]"
      />

      {/* Cinematic Dark Gradient Overlays for optimal readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

      {/* Top Floating Badges */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE AI ENGINE DEMO</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-xl">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sri Lanka NMRA Gazetted MRPs</span>
        </div>
      </div>

      {/* Center Stage: Dynamic Typewriter Text & Action Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 backdrop-blur-md border border-brand-400/30 text-xs font-bold text-brand-300 shadow-lg">
            <Activity className="w-3.5 h-3.5 text-brand-400" />
            <span>Next-Gen Healthcare Intelligence</span>
          </div>

          {/* Dynamic Typewriter Headline */}
          <div className="min-h-[80px] sm:min-h-[110px] flex items-center justify-center">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-2xl">
              {currentText}
              <span className="inline-block w-1 sm:w-1.5 h-8 sm:h-12 bg-brand-400 ml-1.5 animate-pulse align-middle" />
            </h2>
          </div>

          <p className="text-sm sm:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Instant translation of doctor handwriting, generic molecule cross-matching, and pharmacy price transparency for every Sri Lankan family.
          </p>

          {/* CTA Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/prescription"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-medgreen-600 hover:from-brand-500 hover:to-medgreen-500 shadow-floating transition-all transform hover:scale-105"
            >
              <FileSearch className="w-4 h-4" />
              <span>Scan Your Prescription</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/medicines"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all transform hover:scale-105"
            >
              <span>Compare Medicine Prices</span>
            </Link>
          </div>

          {/* 3 Value Points */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
              <p className="text-sm font-bold text-white">100% Free Public Service</p>
              <p className="text-[11px] text-slate-400">For patients &amp; caregivers</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
              <p className="text-sm font-bold text-brand-400">Gemini 3.6 Vision OCR</p>
              <p className="text-[11px] text-slate-400">Doctor script transcription</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
              <p className="text-sm font-bold text-emerald-400">NMRA Price Ceiling</p>
              <p className="text-[11px] text-slate-400">Official gazette alignment</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Unobtrusive Mute/Unmute Icon in Bottom Right */}
      <div className="absolute bottom-5 right-5 z-20">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          title={isMuted ? 'Click to enable audio' : 'Click to mute'}
          className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-lg hover:scale-110"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
}
