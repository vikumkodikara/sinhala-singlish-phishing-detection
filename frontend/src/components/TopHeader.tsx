import React from 'react';
import {
  Menu,
  FileCode,
  Languages,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { NavigationTab, HealthResponse } from '../types';

interface TopHeaderProps {
  activeTab: NavigationTab;
  health: HealthResponse | null;
  onOpenMobileMenu: () => void;
}

const sectionTitles: Record<NavigationTab, { title: string; subtitle: string }> = {
  detector: {
    title: 'Live Phishing Detector Workspace',
    subtitle: 'Real-time NLP sequence evaluation and handcrafted threat feature analysis',
  },
  benchmarks: {
    title: 'Curated Benchmark Lab',
    subtitle: 'Empirical verification across standardized Sinhala, Singlish, and English smishing samples',
  },
  insights: {
    title: 'Threat Detection Insights & Session Telemetry',
    subtitle: 'Session-level analytical distributions and recent message classification audit',
  },
  architecture: {
    title: 'Neural Network Architecture & Graph Specification',
    subtitle: 'Multi-input hybrid deep learning graph: BiGRU + Custom Attention + 9 Domain Features',
  },
  security: {
    title: 'Security, Privacy & Threat Isolation Policy',
    subtitle: 'Transparent data flow guarantees: in-memory processing, zero network socket execution',
  },
  about: {
    title: 'About the Research Project',
    subtitle: 'Academic background, smishing threat landscape in Sri Lanka, empirical results & authors',
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  health,
  onOpenMobileMenu,
}) => {
  const currentSection = sectionTitles[activeTab] || {
    title: 'Sinhala/Singlish Phishing Intelligence',
    subtitle: 'Cybersecurity research prototype',
  };

  const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

  return (
    <header className="h-20 border-b border-[#1E293B] bg-[#0A0F1D]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] border border-[#253247]"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 truncate">
            {currentSection.title}
          </h1>
          <p className="text-xs text-slate-400 truncate hidden sm:block">
            {currentSection.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Technical Badges & Status Indicators */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        
        {/* Language Coverage Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E293B] text-xs font-mono text-slate-300">
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sinhala</span>
          <span className="text-slate-600">&bull;</span>
          <span>Singlish</span>
          <span className="text-slate-600">&bull;</span>
          <span>English</span>
        </div>

        {/* Real Model Health Indicator Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            health?.model_loaded
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}
          title={
            health?.model_loaded
              ? `Model: ${health.model_name} | Vocab: ${health.vocab_size} | Features: ${health.num_features}`
              : 'Connecting to Render ML Backend Service...'
          }
        >
          {health?.model_loaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-semibold">Model Active</span>
              <span className="sm:hidden font-semibold">Active</span>
              <span className="text-[10px] text-emerald-500/80 hidden md:inline">
                (BiGRU+Attn)
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-semibold">Connecting...</span>
            </>
          )}
        </div>

        {/* Interactive API Docs Link */}
        <a
          href={`${API_BASE}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-1.5 px-3 rounded-lg hidden sm:flex items-center gap-1.5 font-mono text-slate-300 hover:text-cyan-300"
          title="Open interactive Swagger REST API Documentation"
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>API Docs</span>
        </a>

      </div>
    </header>
  );
};
