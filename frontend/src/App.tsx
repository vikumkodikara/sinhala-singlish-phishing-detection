import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LiveDetectorView } from './components/LiveDetectorView';
import { BenchmarkLabView } from './components/BenchmarkLabView';
import { DetectionInsightsView } from './components/DetectionInsightsView';
import { ModelArchitectureView } from './components/ModelArchitectureView';
import { SecurityPrivacyView } from './components/SecurityPrivacyView';
import { AboutResearchView } from './components/AboutResearchView';
import {
  NavigationTab,
  PredictResponse,
  HealthResponse,
  SampleMessage,
  ModelInfoResponse,
  AnalysisHistoryItem,
} from './types';
import { Shield, X } from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('detector');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Detector State
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  // Session History State (Volatile client telemetry)
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  // Backend Metadata State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [samples, setSamples] = useState<SampleMessage[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);

  // Fallback research benchmark samples if backend is waking up from cold start
  const fallbackSamples: SampleMessage[] = [
    {
      id: 'phish-en-1',
      label: 'PHISHING',
      language: 'English',
      text: 'Congratulations! You have won Rs. 50,000 in the Dialog Mega Draw. Claim your prize now at http://secure-dialog-reward.xyz/claim',
      description: 'Reward scam with fake urgency, financial lure, and suspicious URL.',
    },
    {
      id: 'phish-si-1',
      label: 'PHISHING',
      language: 'Sinhala',
      text: 'ඔබගේ බැංකු ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර http://commercial-bank-auth.com වෙත ගොස් verify කරන්න.',
      description: 'Sinhala banking impersonation requesting credential verification.',
    },
    {
      id: 'phish-sg-1',
      label: 'PHISHING',
      language: 'Singlish',
      text: 'Oyage Commercial Bank account eka suspend wenawa danma verify karanna http://combank-secure-update.lk/login OTP eka danna.',
      description: 'Singlish urgency attack asking for OTP and credentials via malicious link.',
    },
    {
      id: 'safe-en-1',
      label: 'SAFE',
      language: 'English',
      text: 'Dear customer, your account 4589 has been credited with Rs. 1500.00 on 2026-05-12. Thank you for banking with us.',
      description: 'Legitimate bank transaction notification without links or urgent calls to action.',
    },
    {
      id: 'safe-si-1',
      label: 'SAFE',
      language: 'Sinhala',
      text: 'සුබ උදෑසනක්! අද දහවල් පැවැත්වෙන දෙපාර්තමේන්තු රැස්වීමට සහභාගී වන්න.',
      description: 'Benign Sinhala conversational announcement.',
    },
    {
      id: 'safe-sg-1',
      label: 'SAFE',
      language: 'Singlish',
      text: 'Ada raata gedara enawada? Api raata kamata kadekata yamu. Mata call ekak denna.',
      description: 'Authentic personal Singlish social message.',
    },
    {
      id: 'safe-otp-1',
      label: 'SAFE',
      language: 'English / Mixed',
      text: 'Your OTP for transaction verification is 849201. Valid for 5 minutes. Do not share this code with anyone.',
      description: 'Authentic OTP delivery message with numeric code.',
    },
  ];

  // Initial data loading on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [healthRes, samplesRes, infoRes] = await Promise.allSettled([
          fetch(`${API_BASE}/health`),
          fetch(`${API_BASE}/api/v1/samples`),
          fetch(`${API_BASE}/api/v1/model-info`),
        ]);

        if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
          const healthData = await healthRes.value.json();
          setHealth(healthData);
        }

        if (samplesRes.status === 'fulfilled' && samplesRes.value.ok) {
          const samplesData = await samplesRes.value.json();
          setSamples(samplesData.length > 0 ? samplesData : fallbackSamples);
        } else {
          setSamples(fallbackSamples);
        }

        if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
          const infoData = await infoRes.value.json();
          setModelInfo(infoData);
        }
      } catch (err) {
        console.warn('Backend connection warning:', err);
        setSamples(fallbackSamples);
      }
    };

    fetchMetadata();

    // Poll health check every 30 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch {
        // Keep existing status
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Main Prediction Request Handler
  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Server responded with HTTP ${res.status}. Please check backend logs.`
        );
      }

      const data: PredictResponse = await res.json();
      setResult(data);

      // Auto-record to session telemetry history
      const historyEntry: AnalysisHistoryItem = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: message.trim(),
        result: data,
      };
      setHistory((prev) => [historyEntry, ...prev.slice(0, 49)]); // Keep latest 50
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setError(
        err.message ||
          'Inference communication error occurred. Please verify backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Direct benchmark execution helper
  const handleExecuteSampleInference = async (sample: SampleMessage): Promise<PredictResponse> => {
    const res = await fetch(`${API_BASE}/api/v1/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sample.text }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${res.status}`);
    }

    return await res.json();
  };

  const handleSelectSample = (sample: SampleMessage) => {
    setMessage(sample.text);
    setResult(null);
    setError(null);
    setActiveTab('detector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setMessage(item.message);
    setResult(item.result);
    setError(null);
    setActiveTab('detector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToHistory = (res: PredictResponse) => {
    const historyEntry: AnalysisHistoryItem = {
      id: `saved-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: message.trim(),
      result: res,
    };
    setHistory((prev) => [historyEntry, ...prev.filter((h) => h.message !== message).slice(0, 49)]);
  };

  const handleReset = () => {
    setResult(null);
    setMessage('');
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex bg-[#080D18] text-[#E8EEF8] selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Collapsible Desktop Sidebar Navigation */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          health={health}
        />
      </div>

      {/* Mobile Drawer Navigation Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#0A0F1D] border-r border-[#1E293B] flex flex-col justify-between z-50">
            <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-mono font-bold text-slate-100 text-sm">SPECTRA NAVIGATION</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isCollapsed={false}
                setIsCollapsed={() => {}}
                health={health}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          health={health}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Main Content View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* TAB 1: Live Phishing Detector */}
          {activeTab === 'detector' && (
            <LiveDetectorView
              message={message}
              setMessage={setMessage}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
              result={result}
              onReset={handleReset}
              samples={samples.length > 0 ? samples : fallbackSamples}
              onSelectSample={handleSelectSample}
              onSaveToHistory={handleSaveToHistory}
            />
          )}

          {/* TAB 2: Curated Benchmark Lab */}
          {activeTab === 'benchmarks' && (
            <BenchmarkLabView
              samples={samples.length > 0 ? samples : fallbackSamples}
              onSelectSample={handleSelectSample}
              onExecuteSampleInference={handleExecuteSampleInference}
            />
          )}

          {/* TAB 3: Detection Insights & Session Analytics */}
          {activeTab === 'insights' && (
            <DetectionInsightsView
              history={history}
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          )}

          {/* TAB 4: Model Architecture Graph */}
          {activeTab === 'architecture' && (
            <ModelArchitectureView modelInfo={modelInfo} />
          )}

          {/* TAB 5: Security & Privacy Policy */}
          {activeTab === 'security' && (
            <SecurityPrivacyView />
          )}

          {/* TAB 6: About the Research */}
          {activeTab === 'about' && (
            <AboutResearchView modelInfo={modelInfo} />
          )}

        </main>

        {/* Unified Application Footer */}
        <footer className="border-t border-[#1E293B] bg-[#0A0F1D]/80 backdrop-blur-md py-6 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">SPECTRA Intelligence</span>
              <span>&bull;</span>
              <span>Sinhala/Singlish Phishing Detector Research Prototype</span>
            </div>

            <div className="text-slate-400 text-center md:text-right">
              <span>Authors: <strong>Vikum Kodikara</strong> &bull; <strong>Ravindhu Adheesha</strong></span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default App;
