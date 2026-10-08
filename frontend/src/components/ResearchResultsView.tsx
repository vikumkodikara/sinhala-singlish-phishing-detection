import {
  BarChart3,
  AlertTriangle,
  BrainCircuit,
} from 'lucide-react';
import { ModelInfoResponse } from '../types';

interface ResearchResultsViewProps {
  modelInfo: ModelInfoResponse | null;
}

export const ResearchResultsView: React.FC<ResearchResultsViewProps> = ({
  modelInfo,
}) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Title & Introduction */}
      <div className="cyber-card p-6 border-[#1E293B] bg-gradient-to-r from-[#111827] via-[#0D1322] to-[#111827]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Experimental Research Benchmarks &amp; Evaluation
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Transparent reporting of empirical evaluation metrics for the proposed BiGRU + Attention
              hybrid phishing detector. This page presents both the synthetic-augmented holdout test
              results and the separate real-world authentic message audit.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Transparency Banner */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-200">
            Scientific Rigor &amp; Generalization Notice:
          </p>
          <p className="text-amber-300/90 leading-relaxed">
            The dataset comprises 10,040 total messages (10,000 synthetic records and 40 real-world observations).
            While the archived random-split benchmark demonstrates 100% accuracy on synthetic distributions,
            out-of-distribution real-world generalization must be evaluated cautiously. In keeping with IEEE/academic
            research standards, we do not claim 100% production accuracy or absolute protection.
          </p>
        </div>
      </div>

      {/* Comparison Grid: Synthetic-Heavy Benchmark vs Real-Message Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Synthetic-Heavy Random Split */}
        <div className="cyber-card p-6 border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
              <span className="badge badge-neutral text-xs">
                Split: 70/15/15 Holdout
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                N = 1,344 Test Samples
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              Synthetic-Heavy Random-Split Benchmark
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Standard holdout test split evaluating in-distribution classification across Sinhala, Singlish, and English message variations.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5 font-mono">
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                <div className="text-lg font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Precision</div>
                <div className="text-lg font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Recall</div>
                <div className="text-lg font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">F1-Score</div>
                <div className="text-lg font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">ROC-AUC</div>
                <div className="text-lg font-bold text-cyan-400">1.0000</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">PR-AUC</div>
                <div className="text-lg font-bold text-cyan-400">1.0000</div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="p-3.5 rounded-xl bg-[#080C14] border border-[#1E293B] text-xs">
              <div className="font-semibold text-slate-300 mb-2 font-mono text-[11px]">
                Confusion Matrix (Test Set N=1,344):
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded">
                  <div className="text-[10px] text-emerald-400 font-sans">True Negative (Safe)</div>
                  <div className="text-base font-bold text-emerald-300">327</div>
                </div>
                <div className="p-2 bg-slate-900/60 border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 font-sans">False Positive (Spam Alert)</div>
                  <div className="text-base font-bold text-slate-300">0</div>
                </div>
                <div className="p-2 bg-slate-900/60 border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 font-sans">False Negative (Missed)</div>
                  <div className="text-base font-bold text-slate-300">0</div>
                </div>
                <div className="p-2 bg-rose-950/20 border border-rose-500/20 rounded">
                  <div className="text-[10px] text-rose-400 font-sans">True Positive (Phish)</div>
                  <div className="text-base font-bold text-rose-300">1,017</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500 italic">
            * Benchmark reflects high synthetic uniformity in training/test splits.
          </div>
        </div>

        {/* Card 2: Real-World Message Audit */}
        <div className="cyber-card p-6 border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
              <span className="badge badge-warning text-xs">
                Audit: Real Observations
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                N = 28 Real Holdout
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              Real-World Authentic Message Holdout Audit
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Empirical validation exclusively on authentic real-world mobile messages collected from Sri Lankan mobile network users.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5 font-mono">
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                <div className="text-lg font-bold text-amber-400">92.86%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Precision</div>
                <div className="text-lg font-bold text-amber-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Recall</div>
                <div className="text-lg font-bold text-amber-400">92.31%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">F1-Score</div>
                <div className="text-lg font-bold text-amber-400">96.00%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">ROC-AUC</div>
                <div className="text-lg font-bold text-amber-400">0.9808</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1322] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Sample N</div>
                <div className="text-lg font-bold text-slate-300">28 Msgs</div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="p-3.5 rounded-xl bg-[#080C14] border border-[#1E293B] text-xs">
              <div className="font-semibold text-slate-300 mb-2 font-mono text-[11px]">
                Confusion Matrix (Authentic Real Holdout N=28):
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded">
                  <div className="text-[10px] text-emerald-400 font-sans">Actual Safe Correct</div>
                  <div className="text-base font-bold text-emerald-300">2</div>
                </div>
                <div className="p-2 bg-slate-900/60 border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 font-sans">Safe Missed (FP)</div>
                  <div className="text-base font-bold text-slate-300">0</div>
                </div>
                <div className="p-2 bg-rose-950/20 border border-rose-500/20 rounded">
                  <div className="text-[10px] text-rose-400 font-sans">Phish Missed (FN)</div>
                  <div className="text-base font-bold text-rose-300">2</div>
                </div>
                <div className="p-2 bg-rose-950/20 border border-rose-500/20 rounded">
                  <div className="text-[10px] text-rose-400 font-sans">Phish Detected (TP)</div>
                  <div className="text-base font-bold text-rose-300">24</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-amber-400/90 italic">
            * Exploratory audit due to small real-message holdout sample size (28 messages).
          </div>
        </div>

      </div>

      {/* Dataset Breakdown */}
      <div className="cyber-card p-6 border-[#1E293B]">
        <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          Dataset Composition &amp; Methodology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="text-slate-400">Total Records</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">10,040</div>
            <div className="text-slate-500 mt-1">Curated Master Dataset</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="text-slate-400">Synthetic Augmentations</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">10,000</div>
            <div className="text-slate-500 mt-1">Controlled LLM / Pattern Generation</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="text-slate-400">Authentic Local Observations</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">40</div>
            <div className="text-slate-500 mt-1">Survey &amp; User Submitted Real SMS</div>
          </div>
        </div>
      </div>

    </div>
  );
};
