import { Shield, Activity, BookOpen, Layers, Lock } from 'lucide-react';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
  activeTab: 'detector' | 'benchmarks' | 'architecture' | 'security';
  setActiveTab: (tab: 'detector' | 'benchmarks' | 'architecture' | 'security') => void;
}

export const Header: React.FC<HeaderProps> = ({ health, activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-[#1E293B] bg-[#0D1322]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Product Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Shield className="w-6 h-6 text-cyan-400 animate-pulse-glow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  Sinhala/Singlish Phishing Detector
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold tracking-wider">
                    Research Prototype
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI-Assisted Phishing Detection for Sinhala, Singlish and English Mobile Messages
              </p>
            </div>
          </div>

          {/* Navigation & Status */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            
            {/* Nav Tabs */}
            <nav className="flex space-x-1 bg-[#111827] p-1 rounded-lg border border-[#1E293B]">
              <button
                onClick={() => setActiveTab('detector')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'detector'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Live</span> Detector
              </button>

              <button
                onClick={() => setActiveTab('benchmarks')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'benchmarks'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Benchmarks
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'architecture'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Architecture
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'security'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Security
              </button>
            </nav>

            {/* Model Status Dot */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E293B] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${health?.model_loaded ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="text-slate-300">
                {health?.model_loaded ? 'Model: BiGRU+Attention' : 'Connecting...'}
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
