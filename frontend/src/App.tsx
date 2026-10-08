import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MessageAnalyzer } from './components/MessageAnalyzer';
import { PredictionResultCard } from './components/PredictionResultCard';
import { FeatureBreakdown } from './components/FeatureBreakdown';
import { SampleMessages } from './components/SampleMessages';
import { ResearchResultsView } from './components/ResearchResultsView';
import { ArchitectureView } from './components/ArchitectureView';
import { SecurityAdvisory } from './components/SecurityAdvisory';
import {
  PredictResponse,
  HealthResponse,
  SampleMessage,
  ModelInfoResponse,
} from './types';
import { AlertCircle, Shield } from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detector' | 'benchmarks' | 'architecture' | 'security'>('detector');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [samples, setSamples] = useState<SampleMessage[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);

  // Initial data loading on mount
  useEffect(() => {
    const fetchHealthAndMetadata = async () => {
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
          setSamples(samplesData);
        }

        if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
          const infoData = await infoRes.value.json();
          setModelInfo(infoData);
        }
      } catch (err) {
        console.warn('Backend connection warning:', err);
      }
    };

    fetchHealthAndMetadata();
  }, []);

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
        throw new Error(errorData.detail || errorData.error || `Server responded with status ${res.status}`);
      }

      const data: PredictResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Inference error occurred while communicating with the model backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleMessage) => {
    setMessage(sample.text);
    setActiveTab('detector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResult(null);
    setMessage('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation */}
      <Header health={health} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-fade-in shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Live Phishing Detector */}
        {activeTab === 'detector' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Main Message Input Box */}
            <MessageAnalyzer
              message={message}
              setMessage={setMessage}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              samples={samples}
              onSelectSample={handleSelectSample}
            />

            {/* Inference Results Section */}
            {result && (
              <div className="space-y-6">
                <PredictionResultCard result={result} onReset={handleReset} />
                <FeatureBreakdown
                  features={result.detected_features}
                  preprocessedText={result.preprocessed_text}
                />
              </div>
            )}

            {/* Benchmark Samples Selector */}
            {samples.length > 0 && (
              <SampleMessages
                samples={samples}
                onSelectSample={handleSelectSample}
              />
            )}

          </div>
        )}

        {/* Tab 2: Research Benchmarks */}
        {activeTab === 'benchmarks' && (
          <ResearchResultsView modelInfo={modelInfo} />
        )}

        {/* Tab 3: Model Architecture & Specs */}
        {activeTab === 'architecture' && (
          <ArchitectureView modelInfo={modelInfo} />
        )}

        {/* Tab 4: Security & Isolation Policy */}
        {activeTab === 'security' && (
          <SecurityAdvisory />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#080C14] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">
              Sinhala/Singlish Phishing Detector
            </span>
            <span>&bull;</span>
            <span>Research Prototype &bull; NLP &amp; Deep Learning</span>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            <span>Author: Vikum Kodikara &bull; University Research Project</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
