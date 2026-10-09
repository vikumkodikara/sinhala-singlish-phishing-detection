import React, { useState } from 'react';
import {
  Send,
  Clipboard,
  Trash2,
  ShieldAlert,
  Sparkles,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Info,
  CheckCircle2,
  Layers,
  Link2,
  Maximize2,
  Globe2,
  Binary,
  AlertCircle,
  HelpCircle,
  FileCode2,
  Type,
  KeyRound,
  Eye,
  Radar,
  BookmarkPlus,
} from 'lucide-react';
import { PredictResponse, SampleMessage } from '../types';

interface LiveDetectorViewProps {
  message: string;
  setMessage: (msg: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
  result: PredictResponse | null;
  onReset: () => void;
  samples: SampleMessage[];
  onSelectSample: (sample: SampleMessage) => void;
  onSaveToHistory?: (result: PredictResponse) => void;
}

// Client-side instant script identification helper for live preview
const detectScriptClient = (text: string): string => {
  if (!text.trim()) return 'None';
  const hasSinhala = /[\u0D80-\u0DFF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasSinhala && hasLatin) return 'Mixed (Sinhala + Latin)';
  if (hasSinhala) return 'Sinhala (Unicode)';
  if (hasLatin) {
    // Quick heuristic for Singlish common words
    const singlishPatterns = /\b(oya|oyage|mage|mata|api|apita|danna|enna|karanna|balanna|wenawa|kiyanna|gedara|salli|denna|nisa|thiyenawa|ganna)\b/i;
    if (singlishPatterns.test(text)) return 'Singlish (Phonetic Latin)';
    return 'English / Latin';
  }
  return 'Numeric / Punctuation';
};

export const LiveDetectorView: React.FC<LiveDetectorViewProps> = ({
  message,
  setMessage,
  onAnalyze,
  isLoading,
  error,
  result,
  onReset,
  samples,
  onSelectSample,
  onSaveToHistory,
}) => {
  const [showNormalized, setShowNormalized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const charCount = message.length;
  const maxChars = 5000;
  const liveScript = detectScriptClient(message);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setMessage(text);
    } catch (err) {
      console.warn('Clipboard read permission error:', err);
    }
  };

  const handleSaveHistory = () => {
    if (result && onSaveToHistory) {
      onSaveToHistory(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  // Build dynamic indicators from result
  const indicators: { label: string; severity: 'high' | 'medium' | 'info' }[] = [];
  if (result) {
    const feats = result.detected_features;
    if (feats.url_count > 0) {
      indicators.push({
        label: `Embedded URL detected (${feats.url_count} link${feats.url_count > 1 ? 's' : ''}, max length ${feats.url_length} chars)`,
        severity: 'high',
      });
    }
    if (feats.subdomain_count > 0) {
      indicators.push({
        label: `Abnormal subdomain nesting (${feats.subdomain_count} nested level${feats.subdomain_count > 1 ? 's' : ''})`,
        severity: 'high',
      });
    }
    if (feats.suspicious_word_count > 0) {
      indicators.push({
        label: `Financial / urgency trigger keywords detected (${feats.suspicious_word_count} match${feats.suspicious_word_count > 1 ? 'es' : ''})`,
        severity: result.prediction === 'PHISHING' ? 'high' : 'medium',
      });
    }
    if (feats.exclamation_count > 0) {
      indicators.push({
        label: `Urgent punctuation intensity (${feats.exclamation_count} exclamation mark${feats.exclamation_count > 1 ? 's' : ''})`,
        severity: 'medium',
      });
    }
    if (feats.digit_count > 6) {
      indicators.push({
        label: `High numeric sequence density (${feats.digit_count} digits - account, OTP, or prize amount)`,
        severity: 'info',
      });
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: Message Analysis Workspace (lg:col-span-6 or 7)      */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="cyber-panel p-5 sm:p-6 shadow-xl">
            {/* Workspace Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1E293B]">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  Analyze a Message
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input SMS text in Sinhala Unicode, Singlish Latin, or English.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePaste}
                  type="button"
                  className="btn-ghost text-xs text-slate-300 hover:text-cyan-300"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
                {message && (
                  <button
                    onClick={() => {
                      setMessage('');
                      if (result) onReset();
                    }}
                    type="button"
                    className="btn-ghost text-xs text-slate-400 hover:text-rose-400"
                    title="Clear text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Multiline Text Editor */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste or type suspicious SMS message here... (e.g. 'ඔබගේ ගිණුම verify කරන්න http://bank.com' or 'Oyage Commercial Bank account eka block wela...')"
                rows={6}
                maxLength={maxChars}
                className="w-full bg-[#0A0F1D] border border-[#253247] focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-xl p-4 text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none transition-all resize-y min-h-[160px] leading-relaxed"
              />

              {/* Bottom Metadata inside Textarea */}
              <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Live Script: <strong className="text-cyan-400">{liveScript}</strong>
                  </span>
                </div>
                <span className={charCount > 4000 ? 'text-amber-400' : 'text-slate-500'}>
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Benchmark Chips */}
            {samples.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Curated Benchmark Test Cases:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {samples.slice(0, 4).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectSample(s)}
                      type="button"
                      className="p-2.5 rounded-lg bg-[#0A0F1D] hover:bg-[#131E30] border border-[#1E293B] hover:border-cyan-500/40 text-left transition-all group flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.label === 'PHISHING' ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="text-[10px] font-mono uppercase font-semibold text-slate-400">
                            [{s.language}]
                          </span>
                          <span className="text-[10px] text-slate-300 font-medium truncate">
                            {s.description}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          &ldquo;{s.text}&rdquo;
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="mt-5 pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Zero URL network fetching &bull; In-memory volatile execution</span>
              </div>

              <button
                onClick={onAnalyze}
                disabled={isLoading || !message.trim()}
                type="button"
                className="btn-primary w-full sm:w-auto min-w-[200px] text-xs uppercase tracking-wider py-3 px-6 rounded-lg font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Evaluating Sequence...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze Threat</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-rose-200">Inference Request Failed</div>
                <p className="text-rose-300/90 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Analysis Results Panel (lg:col-span-6 or 5)          */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* STATE 1: Analyzing Loader */}
          {isLoading && (
            <div className="cyber-panel p-8 sm:p-12 text-center space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[420px]">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 animate-radar" />
                <Radar className="w-8 h-8 text-cyan-400" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
                  RUNNING NEURAL INFERENCE
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Executing Unicode normalization, token sequence embedding, BiGRU attention context weighting, and 9 handcrafted feature extraction...
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Evaluating BiGRU + Attention</span>
              </div>
            </div>
          )}

          {/* STATE 2: Empty State (Waiting for user input) */}
          {!isLoading && !result && (
            <div className="cyber-panel p-8 sm:p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-[#0D1322] border border-[#253247] flex items-center justify-center text-slate-500 shadow-inner">
                <Radar className="w-8 h-8 text-slate-400 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-base font-bold text-slate-100">
                  Awaiting Message Submission
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter an SMS message in the workspace on the left or select a curated research sample to run live deep learning phishing detection.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-[11px] text-slate-400 font-mono max-w-xs text-left space-y-1.5">
                <div className="text-slate-300 font-semibold text-[10px] uppercase tracking-wider">
                  Engineered Detection Signals:
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400">&bull;</span>
                  <span>BiGRU Contextual Text Embeddings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400">&bull;</span>
                  <span>URL Structural &amp; Subdomain Extraction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400">&bull;</span>
                  <span>Singlish Financial Urgency Lexicon</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Active Result Display */}
          {!isLoading && result && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Primary Verdict Card */}
              <div
                className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                  result.prediction === 'PHISHING'
                    ? 'bg-gradient-to-b from-rose-950/40 via-[#101827] to-[#0A0F1D] border-rose-500/40 shadow-xl shadow-rose-950/20'
                    : 'bg-gradient-to-b from-emerald-950/30 via-[#101827] to-[#0A0F1D] border-emerald-500/30 shadow-xl shadow-emerald-950/20'
                }`}
              >
                {/* Header with Classification & Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-[#1E293B]">
                  
                  {/* Status Badge & Icon */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        result.prediction === 'PHISHING'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                          : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      }`}
                    >
                      {result.prediction === 'PHISHING' ? (
                        <AlertTriangle className="w-7 h-7 animate-pulse" />
                      ) : (
                        <ShieldCheck className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`badge ${
                            result.prediction === 'PHISHING'
                              ? result.risk_level === 'HIGH'
                                ? 'badge-phishing'
                                : 'badge-warning'
                              : 'badge-safe'
                          }`}
                        >
                          Threat Risk: {result.risk_level}
                        </span>

                        <span className="badge badge-neutral">
                          Script: {result.detected_script}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight font-mono">
                        {result.prediction === 'PHISHING'
                          ? 'PHISHING DETECTED'
                          : 'NO PHISHING DETECTED'}
                      </h3>
                    </div>
                  </div>

                  {/* Confidence & Sigmoid Score */}
                  <div className="p-3.5 rounded-xl bg-[#0A0F1D] border border-[#1E293B] shrink-0 min-w-[140px] text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-medium tracking-wider">
                      Model Confidence
                    </div>
                    <div
                      className={`text-2xl font-extrabold font-mono ${
                        result.prediction === 'PHISHING' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {result.confidence}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Sigmoid: {result.probability.toFixed(4)}
                    </div>
                  </div>

                </div>

                {/* Explanation Paragraph */}
                <div className="mt-4 text-xs text-slate-300 leading-relaxed">
                  {result.prediction === 'PHISHING' ? (
                    <p>
                      The BiGRU neural network and handcrafted domain extractors identified suspicious urgency markers, URL domain signatures, or financial lures consistent with smishing attacks.
                    </p>
                  ) : (
                    <p>
                      The message exhibited low probability of malicious intent. Structural indicators, URL parameters, and language sequences align with benign or transactional communication patterns.
                    </p>
                  )}
                </div>

                {/* Detected Behavioral Indicators */}
                <div className="mt-5 pt-4 border-t border-[#1E293B]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Triggered Threat Indicators ({indicators.length}):</span>
                  </div>

                  {indicators.length > 0 ? (
                    <div className="space-y-2">
                      {indicators.map((ind, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0A0F1D]/80 border border-[#1E293B] text-xs text-slate-200"
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              ind.severity === 'high'
                                ? 'bg-rose-400'
                                : ind.severity === 'medium'
                                ? 'bg-amber-400'
                                : 'bg-cyan-400'
                            }`}
                          />
                          <span>{ind.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-[#0A0F1D]/80 border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>No abnormal URL parameters, subdomains, or high-urgency keywords were detected.</span>
                    </div>
                  )}
                </div>

                {/* Transparency Advisory */}
                {result.warning && (
                  <div className="mt-4 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{result.warning}</p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveHistory}
                      type="button"
                      className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-slate-300"
                      title="Save analysis to session history"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{saved ? 'Saved!' : 'Save Result'}</span>
                    </button>

                    <button
                      onClick={() => setShowNormalized(!showNormalized)}
                      type="button"
                      className="btn-ghost text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showNormalized ? 'Hide Sequence' : 'Inspect Sequence'}</span>
                    </button>
                  </div>

                  <button
                    onClick={onReset}
                    type="button"
                    className="btn-ghost text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Analysis</span>
                  </button>
                </div>

                {/* Collapsible Normalized String Inspector */}
                {showNormalized && (
                  <div className="mt-4 pt-3 border-t border-[#1E293B] animate-fade-in">
                    <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                      Preprocessed NLP Sequence (Unicode NFC &bull; Preserved Digits):
                    </div>
                    <div className="p-3 rounded-lg bg-[#080D18] border border-[#1E293B] text-xs font-mono text-cyan-300 break-words select-all">
                      {result.preprocessed_text || '<Empty>'}
                    </div>
                  </div>
                )}

              </div>

              {/* 9 Handcrafted Feature Breakdown Grid */}
              <div className="cyber-panel p-5 sm:p-6 border-[#1E293B]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      9 Handcrafted Feature Vector
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Numerical features scaled via StandardScaler &amp; fused with the Attention context vector.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                    Dense Branch (9 &rarr; 32)
                  </span>
                </div>

                {/* Features Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
                  
                  {/* Feature 1: URL Count */}
                  <div className={`p-3 rounded-xl border ${result.detected_features.url_count > 0 ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-[#0A0F1D] border-[#1E293B] text-slate-300'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>URL Count</span>
                      <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.url_count}</div>
                  </div>

                  {/* Feature 2: URL Length */}
                  <div className={`p-3 rounded-xl border ${result.detected_features.url_length > 30 ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-[#0A0F1D] border-[#1E293B] text-slate-300'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Max URL Len</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.url_length} <span className="text-[10px] font-normal text-slate-500">chars</span></div>
                  </div>

                  {/* Feature 3: Subdomain Count */}
                  <div className={`p-3 rounded-xl border ${result.detected_features.subdomain_count > 0 ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-[#0A0F1D] border-[#1E293B] text-slate-300'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Subdomains</span>
                      <Globe2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.subdomain_count}</div>
                  </div>

                  {/* Feature 4: Digit Count */}
                  <div className="p-3 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-slate-300">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Digit Count</span>
                      <Binary className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.digit_count}</div>
                  </div>

                  {/* Feature 5: Exclamation Count */}
                  <div className={`p-3 rounded-xl border ${result.detected_features.exclamation_count > 0 ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-[#0A0F1D] border-[#1E293B] text-slate-300'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Exclamations (!)</span>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.exclamation_count}</div>
                  </div>

                  {/* Feature 6: Question Count */}
                  <div className="p-3 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-slate-300">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Questions (?)</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.question_count}</div>
                  </div>

                  {/* Feature 7: Text Length */}
                  <div className="p-3 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-slate-300">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Text Length</span>
                      <Type className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.text_length} <span className="text-[10px] font-normal text-slate-500">chars</span></div>
                  </div>

                  {/* Feature 8: Word Count */}
                  <div className="p-3 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-slate-300">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Word Count</span>
                      <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.word_count}</div>
                  </div>

                  {/* Feature 9: Suspicious Keywords */}
                  <div className={`p-3 rounded-xl border ${result.detected_features.suspicious_word_count > 0 ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-[#0A0F1D] border-[#1E293B] text-slate-300'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Suspicious Words</span>
                      <KeyRound className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-base font-bold mt-1">{result.detected_features.suspicious_word_count}</div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
