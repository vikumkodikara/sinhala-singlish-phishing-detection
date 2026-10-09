import React from 'react';
import {
  Activity,
  FlaskConical,
  BarChart3,
  Cpu,
  ShieldCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { NavigationTab, HealthResponse } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  health: HealthResponse | null;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  health,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'detector',
      label: 'Live Detector',
      subtitle: 'Real-time NLP inference',
      icon: Activity,
    },
    {
      id: 'benchmarks',
      label: 'Benchmark Lab',
      subtitle: 'Curated test suite',
      icon: FlaskConical,
      badge: '7 Tests',
    },
    {
      id: 'insights',
      label: 'Detection Insights',
      subtitle: 'Session intelligence',
      icon: BarChart3,
    },
    {
      id: 'architecture',
      label: 'Model Architecture',
      subtitle: 'BiGRU + Attention graph',
      icon: Cpu,
    },
    {
      id: 'security',
      label: 'Security & Privacy',
      subtitle: 'Data isolation policy',
      icon: ShieldCheck,
    },
    {
      id: 'about',
      label: 'About Research',
      subtitle: 'Methodology & authors',
      icon: GraduationCap,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-[#1E293B] bg-[#0A0F1D]/95 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/10">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>

            {!isCollapsed && (
              <div className="animate-fade-in truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-wider text-slate-100 font-mono">
                    SPECTRA
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Sinhala/Singlish Phishing Intelligence
                </p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="button"
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] transition-colors border border-transparent hover:border-[#253247]"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-[#131E30] to-transparent text-slate-100 border border-cyan-500/30 shadow-sm shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131E30]/70 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-fade-in flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-xs font-semibold tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#1E293B] text-slate-400 border border-[#253247]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#1E293B] space-y-2">
        {/* Real Engine Status Indicator */}
        <div
          className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0D1322] border border-[#1E293B] ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              health?.model_loaded
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse'
            }`}
          />

          {!isCollapsed && (
            <div className="min-w-0 text-[11px] font-mono leading-tight">
              <div className="text-slate-200 font-semibold truncate">
                {health?.model_loaded ? 'Inference Engine Active' : 'Connecting to API...'}
              </div>
              <div className="text-slate-500 text-[10px] truncate">
                {health?.model_loaded ? health.model_name : 'Render Cloud API'}
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Research Prototype</span>
            <a
              href="https://github.com/vikumkodikara/sinhala-singlish-phishing-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};
