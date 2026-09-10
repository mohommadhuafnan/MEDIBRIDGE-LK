'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ChevronDown,
  Minimize2,
  ExternalLink,
  Pill,
  FileSearch,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; href?: string; actionText?: string }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text:
      'Ayubowan! Vanakkam! Hello! 👋 I am your MediBridge LK Health Assistant.\n\nI can help you check official Sri Lanka NMRA price ceilings, find affordable Rajya Osu Sala (SPC) generic alternatives, or guide you through prescription decoding.',
    timestamp: 'Just now',
    quickActions: [
      { label: '💊 Generic for Lipitor 20mg', actionText: 'What is the generic equivalent and price of Lipitor 20mg?' },
      { label: '🏷️ Panadol NMRA Price Cap', actionText: 'What is the NMRA price cap for Panadol in Sri Lanka?' },
      { label: '📷 Scan Doctor Slip', href: '/dashboard/prescription' },
      { label: '🏥 Find Rajya Osu Sala', actionText: 'Where can I find Rajya Osu Sala pharmacies in Sri Lanka?' },
    ],
  },
];

export default function MediBridgeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for custom event from other sections
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-medibridge-chat', handleOpen);
    return () => window.removeEventListener('open-medibridge-chat', handleOpen);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const generateBotResponse = (userQuery: string): { text: string; actions?: { label: string; href?: string; actionText?: string }[] } => {
    const query = userQuery.toLowerCase();

    if (query.includes('lipitor') || query.includes('atorvastatin') || query.includes('cholesterol')) {
      return {
        text:
          '**Atorvastatin 20mg (Generic equivalent for Lipitor 20mg)**\n\n• **Brand Price (Lipitor):** ~LKR 65.00 - 85.00 per tablet\n• **Rajya Osu Sala (SPC) Generic:** ~LKR 14.50 - 18.00 per tablet\n• **Potential Savings:** ~65% - 75%!\n\nBoth contain the exact same active chemical ingredient and meet NMRA & WHO bioequivalence safety standards.',
        actions: [
          { label: 'View Atorvastatin Prices', href: '/dashboard/medicines?q=Atorvastatin' },
          { label: 'Scan Prescription', href: '/dashboard/prescription' },
        ],
      };
    }

    if (query.includes('panadol') || query.includes('paracetamol') || query.includes('පැනඩෝල්') || query.includes('fever')) {
      return {
        text:
          '**Paracetamol 500mg (Panadol)**\n\n• **Official NMRA MRP Ceiling:** Gazetted at **LKR 4.50 - 5.00** per 500mg tablet.\n• **SPC (Rajya Osu Sala) Generic:** ~LKR 2.50 - 3.20 per tablet.\n\n⚠️ If any pharmacy in Sri Lanka charges more than LKR 5.00 for standard Paracetamol 500mg, it violates NMRA Gazette Section 142 price ceilings.',
        actions: [
          { label: 'Check NMRA Prices', href: '/dashboard/prices' },
          { label: 'Compare All Brands', href: '/dashboard/medicines?q=Paracetamol' },
        ],
      };
    }

    if (query.includes('amoxil') || query.includes('amoxicillin') || query.includes('antibiotic')) {
      return {
        text:
          '**Amoxicillin (Amoxil)**\n\n• **Available Strengths:** 250mg, 500mg capsules, suspension.\n• **Generic Equivalent:** SPC Amoxicillin / State Pharmaceuticals Mfg.\n• **NMRA MRP Cap:** ~LKR 18.50 - 22.00 per 500mg capsule.\n\n*Note: Antibiotics require a valid registered SLMC physician prescription in Sri Lanka.*',
        actions: [{ label: 'Search Amoxicillin', href: '/dashboard/medicines?q=Amoxicillin' }],
      };
    }

    if (query.includes('metformin') || query.includes('glucophage') || query.includes('sugar') || query.includes('diabetes')) {
      return {
        text:
          '**Metformin 500mg / 850mg (Glucophage)**\n\n• **Active Molecule:** Metformin Hydrochloride.\n• **Generic Alternative:** SPC Metformin 500mg (~LKR 4.50 - 6.00/tab) vs Imported Brands (~LKR 16.00 - 24.00/tab).\n• **Average Monthly Saving:** Up to LKR 1,200/month for chronic diabetic care.',
        actions: [{ label: 'Compare Metformin', href: '/dashboard/medicines?q=Metformin' }],
      };
    }

    if (query.includes('upload') || query.includes('prescription') || query.includes('scan') || query.includes('doctor slip')) {
      return {
        text:
          '**How to Scan Your Prescription:**\n\n1. Go to the [Prescription Scanner](/dashboard/prescription).\n2. Take a clear photo of your doctor slip in good lighting.\n3. Our Gemini AI engine reads doctor handwriting, identifies dosage, checks NMRA price ceilings, and calculates generic savings in seconds!',
        actions: [{ label: 'Open Prescription Scanner', href: '/dashboard/prescription' }],
      };
    }

    if (query.includes('osu sala') || query.includes('pharmacy') || query.includes('pharmacies') || query.includes('store')) {
      return {
        text:
          '**Rajya Osu Sala & Partner Pharmacies**\n\nState Pharmaceuticals Corporation (SPC) Rajya Osu Sala outlets provide government-quality generic medicines across Colombo, Kandy, Galle, Kurunegala, Jaffna, and all 25 administrative districts.\n\nYou can compare POS prices between Rajya Osu Sala and private pharmacies directly on MediBridge LK.',
        actions: [{ label: 'Browse Pharmacies Directory', href: '/dashboard/pharmacies' }],
      };
    }

    if (query.includes('price') || query.includes('cost') || query.includes('mrp') || query.includes('nmra')) {
      return {
        text:
          '**NMRA Price Gazette Compliance:**\n\nThe National Medicines Regulatory Authority (NMRA) sets legally binding Maximum Retail Prices (MRP) on 60+ essential molecules. MediBridge LK continuously syncs with Ministry of Health Gazette publications to guarantee you never overpay.',
        actions: [{ label: 'Explore NMRA MRP Ceilings', href: '/dashboard/prices' }],
      };
    }

    // Default intelligent response
    return {
      text:
        `Thank you for asking about "${userQuery}".\n\nMediBridge LK is designed to help Sri Lankan patients understand their doctor slips, verify NMRA Maximum Retail Prices (MRPs), and discover verified generic medicines at Rajya Osu Sala.\n\nWould you like to scan a prescription or search a specific medication name?`,
      actions: [
        { label: 'Scan Prescription', href: '/dashboard/prescription' },
        { label: 'Search Medicine Directory', href: '/dashboard/medicines' },
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply;
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: 'Just now',
          quickActions: [
            { label: '📷 Scan Prescription', href: '/dashboard/prescription' },
            { label: '💊 Check NMRA Prices', href: '/dashboard/prices' },
            { label: '🏥 Nearby Pharmacies', href: '/dashboard/pharmacies' },
          ],
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const { text: replyText, actions } = generateBotResponse(text.trim());
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: 'Just now',
          quickActions: actions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const { text: replyText, actions } = generateBotResponse(text.trim());
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: 'Just now',
        quickActions: actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button at Bottom Right */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open MediBridge AI Health Chatbot"
            className="relative flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-gradient-to-r from-brand-600 via-brand-700 to-medgreen-600 text-white shadow-2xl hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/25"
          >
            {/* 3D Medical Robot Avatar */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white/20 border-2 border-white shadow-md shrink-0">
              <img
                src="/chatbot-avatar.png"
                alt="MediBridge AI Assistant"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide">AI Assistant</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
              <p className="text-[10px] text-white/80 font-medium">Ask medicines &amp; prices</p>
            </div>

            <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block ml-1">
              EN • සිං • தம
            </span>
          </button>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-brand-700 via-brand-800 to-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 shadow-md shrink-0 bg-white/10">
                <img
                  src="/chatbot-avatar.png"
                  alt="MediBridge AI Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white leading-none">MediBridge AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Gemini 3.6 • Trilingual Sri Lanka Health AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                title="Minimize chat"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                title="Close chat"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body / Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-sm">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-200 shrink-0 mt-0.5 shadow-2xs bg-white">
                      <img
                        src="/chatbot-avatar.png"
                        alt="MediBridge AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isBot
                          ? 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                          : 'bg-brand-600 text-white font-medium shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Quick Action Chips from Bot */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickActions.map((action, i) => {
                          if (action.href) {
                            return (
                              <Link
                                key={i}
                                href={action.href}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-[11px] font-semibold text-brand-700 shadow-2xs transition-all"
                              >
                                <span>{action.label}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                            );
                          }
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendMessage(action.actionText || action.label)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-[11px] font-semibold text-slate-700 shadow-2xs transition-all text-left"
                            >
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2.5 text-xs text-slate-500 pl-1">
                <img
                  src="/chatbot-avatar.png"
                  alt="MediBridge AI"
                  className="w-7 h-7 rounded-full object-cover shadow-2xs animate-pulse"
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span className="font-medium">MediBridge AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clinical Disclaimer Strip */}
          <div className="px-4 py-1.5 bg-amber-50/80 border-t border-amber-100/80 text-[10px] text-amber-800 flex items-center gap-1.5 shrink-0">
            <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
            <span>AI guidance only. Consult an SLMC registered doctor before switching medicines.</span>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about medicine, prices, generics (English, සිංහල, தமிழ்)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
