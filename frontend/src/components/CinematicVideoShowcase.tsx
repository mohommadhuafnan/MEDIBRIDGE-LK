'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileSearch,
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Typewriter effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter animation loop
  useEffect(() => {
    const targetPhrase = TYPING_PHRASES[currentPhraseIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetPhrase.length) {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        } else {
          // Pause at end of sentence before deleting
          setTimeout(() => setIsDeleting(true), 2200);
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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <section className="relative w-full py-16 sm:py-24 bg-slate-950 overflow-hidden text-white border-y border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin" />
            <span>CINEMATIC PLATFORM PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            See MediBridge LK <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-medgreen-400 bg-clip-text text-transparent">In Action</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Watch our Sri Lankan healthcare intelligence engine decode real physician handwriting and find verified generic equivalents in real-time.
          </p>
        </div>

        {/* Video Player Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video max-h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black group"
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            src="/Vedio.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Cinematic Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,6,23,0.7)_100%)] pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE AI ENGINE DEMO</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Sri Lanka NMRA Gazetted MRPs</span>
            </div>
          </div>

          {/* Center Stage: Dynamic Typewriter Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 text-center z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-slate-200">
                <Activity className="w-3.5 h-3.5 text-brand-400" />
                <span>Next-Gen Healthcare Intelligence</span>
              </div>

              {/* Dynamic Typewriter Headline */}
              <div className="min-h-[72px] sm:min-h-[96px] flex items-center justify-center">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
                  {currentText}
                  <span className="inline-block w-1 sm:w-1.5 h-7 sm:h-11 bg-brand-400 ml-1.5 animate-pulse align-middle" />
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto drop-shadow">
                Instant translation of doctor handwriting, generic molecule cross-matching, and pharmacy price transparency for every Sri Lankan family.
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
                <Link
                  href="/dashboard/prescription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-medgreen-600 hover:from-brand-500 hover:to-medgreen-500 shadow-floating transition-all transform hover:scale-105"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Scan Your Prescription</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/dashboard/medicines"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
                >
                  <span>Compare Medicine Prices</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Floating Controls Bar */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="hidden sm:inline-block text-[11px] font-medium text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15">
                {isMuted ? 'Muted (Click to unmute)' : 'Sound Enabled'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle full screen"
                className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Full screen view"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights beneath video */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg font-extrabold text-white">100% Free</p>
            <p className="text-xs text-slate-400 mt-0.5">For all Sri Lankan patients & caregivers</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg font-extrabold text-brand-400">Gemini 3.6 Flash</p>
            <p className="text-xs text-slate-400 mt-0.5">Vision OCR handwriting transcription</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg font-extrabold text-medgreen-400">NMRA Compliant</p>
            <p className="text-xs text-slate-400 mt-0.5">Official gazetted price ceiling checks</p>
          </div>
        </div>

      </div>
    </section>
  );
}
