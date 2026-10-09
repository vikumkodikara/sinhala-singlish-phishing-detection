import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { SampleMessage, PredictResponse, BenchmarkRunResult } from '../types';

interface BenchmarkLabViewProps {
  samples: SampleMessage[];
  onSelectSample: (sample: SampleMessage) => void;
  onExecuteSampleInference: (sample: SampleMessage) => Promise<PredictResponse>;
}

export const BenchmarkLabView: React.FC<BenchmarkLabViewProps> = ({
  samples,
  onSelectSample,
  onExecuteSampleInference,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [runResults, setRunResults] = useState<Record<string, BenchmarkRunResult>>({});
  const [isExecutingAll, setIsExecutingAll] = useState<boolean>(false);

  // Filter samples based on user selection
  const filteredSamples = samples.filter((s) => {
    const langMatch =
      selectedLanguage === 'all' ||
      s.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    const labelMatch =
      selectedLabel === 'all' || s.label.toUpperCase() === selectedLabel.toUpperCase();
    return langMatch && labelMatch;
  });

  // Execute inference on a single sample
  const handleRunSingle = async (sample: SampleMessage) => {
    const startTime = performance.now();
    setRunResults((prev) => ({
      ...prev,
      [sample.id]: { sampleId: sample.id, isLoading: true },
    }));

    try {
      const result = await onExecuteSampleInference(sample);
      const latencyMs = Math.round(performance.now() - startTime);
      const matchesExpected = result.prediction === sample.label;

      setRunResults((prev) => ({
        ...prev,
        [sample.id]: {
          sampleId: sample.id,
          isLoading: false,
          result,
          latencyMs,
          matchesExpected,
        },
      }));
    } catch (err: any) {
      setRunResults((prev) => ({
        ...prev,
        [sample.id]: {
          sampleId: sample.id,
          isLoading: false,
          error: err.message || 'Inference error',
        },
      }));
    }
  };

  // Run all filtered samples sequentially
  const handleRunAll = async () => {
    setIsExecutingAll(true);
    for (const sample of filteredSamples) {
      await handleRunSingle(sample);
    }
    setIsExecutingAll(false);
  };

  // Calculate live session statistics from executed test runs
  const executedCount = Object.values(runResults).filter((r) => r.result).length;
  const matchCount = Object.values(runResults).filter((r) => r.matchesExpected).length;
  const sessionAccuracy =
    executedCount > 0 ? ((matchCount / executedCount) * 100).toFixed(1) : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="cyber-panel p-6 border-[#1E293B] bg-gradient-to-r from-[#101827] via-[#0D1322] to-[#101827]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <FlaskConical className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Curated Benchmark Demonstration Lab
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  7 Standardized Tests
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Execute live inference across curated research sample messages representing phishing attacks
                and legitimate transactional SMS in Sinhala, Singlish, and English.
              </p>
            </div>
          </div>

          {/* Run All CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunAll}
              disabled={isExecutingAll || filteredSamples.length === 0}
              type="button"
              className="btn-primary text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 font-mono font-bold"
            >
              {isExecutingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Evaluating All...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run All Benchmarks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Distinction Notice */}
      <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B] text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-300">Methodological Scope:</span>
          <p className="leading-relaxed">
            This interactive lab presents curated demonstration cases. Formal empirical research metrics
            (100% synthetic holdout, 92.86% authentic holdout) were computed offline on the complete master
            dataset (N=10,040 records) and can be reviewed in the <strong>About Research</strong> section.
          </p>
        </div>
      </div>

      {/* Filter Toolbar & Live Run Summary */}
      <div className="cyber-panel p-4 border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#0A0F1D] border border-[#253247] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/80"
            >
              <option value="all">All Languages</option>
              <option value="sinhala">Sinhala (Unicode)</option>
              <option value="singlish">Singlish (Latin)</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Expected Label Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Expected:</span>
            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="bg-[#0A0F1D] border border-[#253247] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/80"
            >
              <option value="all">All Classes</option>
              <option value="PHISHING">PHISHING Only</option>
              <option value="SAFE">SAFE Only</option>
            </select>
          </div>
        </div>

        {/* Dynamic Session Run Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] text-slate-300">
            Tested: <strong className="text-cyan-400">{executedCount}</strong> / {samples.length}
          </div>
          {sessionAccuracy !== null && (
            <div className="px-3 py-1.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] text-slate-300 flex items-center gap-1.5">
              <span>Match Rate:</span>
              <strong
                className={
                  parseFloat(sessionAccuracy) >= 90
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }
              >
                {sessionAccuracy}%
              </strong>
            </div>
          )}
        </div>

      </div>

      {/* Benchmark Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSamples.map((sample) => {
          const run = runResults[sample.id];
          const isExpectedPhish = sample.label === 'PHISHING';

          return (
            <div
              key={sample.id}
              className="cyber-panel p-5 border-[#1E293B] hover:border-[#253247] transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${
                        isExpectedPhish ? 'badge-phishing' : 'badge-safe'
                      } text-[10px] py-0.5 px-2`}
                    >
                      {isExpectedPhish ? (
                        <AlertTriangle className="w-2.5 h-2.5" />
                      ) : (
                        <ShieldCheck className="w-2.5 h-2.5" />
                      )}
                      Expected: {sample.label}
                    </span>

                    <span className="badge badge-neutral text-[10px] py-0.5 px-2 font-mono">
                      {sample.language}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    ID: {sample.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium mb-2 leading-snug">
                  {sample.description}
                </p>

                {/* Message Text Block */}
                <div className="p-3 rounded-lg bg-[#080D18] border border-[#1E293B] text-xs font-sans text-slate-200 break-words leading-relaxed select-all">
                  {sample.text}
                </div>
              </div>

              {/* Execution Result Box (If Run) */}
              {run?.result && (
                <div
                  className={`p-3 rounded-xl border animate-fade-in ${
                    run.matchesExpected
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {run.matchesExpected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-emerald-300">
                            MODEL MATCH: {run.result.prediction}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="font-bold text-rose-300">
                            MISMATCH: {run.result.prediction}
                          </span>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {run.latencyMs}ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Probability: {run.result.probability.toFixed(4)}</span>
                    <span>Confidence: {run.result.confidence}%</span>
                    <span>Risk: {run.result.risk_level}</span>
                  </div>
                </div>
              )}

              {run?.error && (
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300">
                  {run.error}
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectSample(sample)}
                  type="button"
                  className="btn-ghost text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 font-mono"
                  title="Populate detector with this message"
                >
                  <span>Load in Detector</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleRunSingle(sample)}
                  disabled={run?.isLoading}
                  type="button"
                  className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 font-mono text-slate-200"
                >
                  {run?.isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-cyan-400 fill-current" />
                      <span>{run?.result ? 'Re-test' : 'Run Live Inference'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
