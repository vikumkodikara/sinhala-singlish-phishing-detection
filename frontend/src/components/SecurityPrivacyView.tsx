import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Network,
  FileCheck2,
  AlertOctagon,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const SecurityPrivacyView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="cyber-panel p-6 border-[#1E293B] bg-gradient-to-r from-[#101827] via-[#0D1322] to-[#101827]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Security, Privacy &amp; Threat Isolation Policy
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Privacy-by-Design
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Transparent documentation of data handling practices, sandbox isolation guarantees,
              and static text analysis constraints implemented across the SPECTRA architecture.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pillar 1: Zero URL Fetching */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                Zero URL Network Fetching Guarantee
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Static Regex Parsing</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All hyperlinks contained within submitted SMS messages are analyzed purely as static text
            character strings. The backend engine does <strong>NOT</strong> resolve DNS records, open TCP
            sockets, or perform HTTP requests against suspicious domains. This prevents accidental malware
            delivery or tracking beacon execution.
          </p>
        </div>

        {/* Pillar 2: Volatile In-Memory Inference */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                Volatile In-Memory Processing
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">No Database Persistence</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submitted messages are processed in-memory by the FastAPI server to generate neural token
            sequences and feature matrices. Message contents are <strong>never written to permanent disk storage</strong>,
            external relational databases, or telemetry aggregators.
          </p>
        </div>

        {/* Pillar 3: HTTPS & TLS 1.3 Transport Security */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                End-to-End Transport Encryption
              </h3>
              <span className="text-[10px] font-mono text-blue-400">TLS 1.3 Standard</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All communication between the user's browser client and the inference microservice traverses
            encrypted HTTPS channels managed by Cloudflare global edge certificates and Render SSL termination,
            protecting message payloads against interception.
          </p>
        </div>

        {/* Pillar 4: Safe HTML Rendering */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                Inert Text Escaping &amp; XSS Defense
              </h3>
              <span className="text-[10px] font-mono text-purple-400">Anti-Payload Execution</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracted text sequences and links are strictly rendered as inert text nodes in React without
            <code className="text-purple-300 font-mono text-[11px] px-1 bg-[#1E293B] rounded">dangerouslySetInnerHTML</code>.
            This prevents stored or reflected script execution attacks from adversarial message strings.
          </p>
        </div>

      </div>

      {/* Sensitive Data Handling Advisory */}
      <div className="cyber-panel p-6 border-[#1E293B]">
        <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          Sensitive Credentials &amp; Financial Information Handling
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Smishing attacks typically lure victims into divulging sensitive credentials such as One-Time Passwords (OTPs),
          credit card CVVs, and banking passwords. When testing authentic alerts:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B] space-y-1">
            <div className="text-slate-200 font-semibold font-sans flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Expired OTPs
            </div>
            <p className="text-slate-500 font-sans text-[11px]">
              Only test expired or non-functional OTP tokens for demonstration purposes.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B] space-y-1">
            <div className="text-slate-200 font-semibold font-sans flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Anonymized Accounts
            </div>
            <p className="text-slate-500 font-sans text-[11px]">
              Mask real bank account numbers (e.g. <code className="text-slate-400">4589****12</code>) before input.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B] space-y-1">
            <div className="text-slate-200 font-semibold font-sans flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Password Sharing
            </div>
            <p className="text-slate-500 font-sans text-[11px]">
              Never paste active banking passwords or personal identification numbers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
