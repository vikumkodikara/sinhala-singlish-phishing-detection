import React from 'react';
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Users,
  AlertTriangle,
  ExternalLink,
  Code2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ModelInfoResponse } from '../types';

interface AboutResearchViewProps {
  modelInfo: ModelInfoResponse | null;
}

export const AboutResearchView: React.FC<AboutResearchViewProps> = ({
  modelInfo,
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="cyber-panel p-6 border-[#1E293B] bg-gradient-to-r from-[#101827] via-[#0D1322] to-[#101827]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              About the Research Project
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Academic Prototype
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              &ldquo;NLP-Based Detection of Phishing Attacks in Multilingual Sinhala and Singlish Mobile Messages&rdquo;
              &bull; University Research Project exploring deep recurrent representation learning and domain feature engineering.
            </p>
          </div>
        </div>
      </div>

      {/* Authors Card */}
      <div className="cyber-panel p-6 border-[#1E293B]">
        <h3 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-[#1E293B] flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Research Authors &amp; Attribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Author 1 */}
          <div className="p-4 rounded-xl bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-100 font-sans">
                Vikum Kodikara
              </div>
              <div className="text-xs text-cyan-400 font-mono mt-0.5">
                Lead Researcher &amp; Systems Developer
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Deep Learning Model Development &bull; Cloud Infrastructure &bull; Full-Stack Architecture
              </div>
            </div>
          </div>

          {/* Author 2 */}
          <div className="p-4 rounded-xl bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-100 font-sans">
                Ravindhu Adheesha
              </div>
              <div className="text-xs text-cyan-400 font-mono mt-0.5">
                Research Contributor
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Dataset Curation &bull; Smishing Threat Intelligence &bull; Empirical Evaluation
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dataset Breakdown */}
      <div className="cyber-panel p-6 border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-[#1E293B] flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          Master Dataset Distributions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
            <div className="text-[10px] text-slate-500 uppercase font-sans">Total Records</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">10,040</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
            <div className="text-[10px] text-slate-500 uppercase font-sans">Synthetic Samples</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">10,000</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
            <div className="text-[10px] text-slate-500 uppercase font-sans">Authentic Local SMS</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">40</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
            <div className="text-[10px] text-slate-500 uppercase font-sans">Split Ratio</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">70 / 15 / 15</div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The primary dataset combines controlled synthetic template variations (reward lures, banking alerts, OTP notices)
          and authentic user-submitted messages collected across Sri Lankan mobile telecommunication networks.
        </p>
      </div>

      {/* Dual Empirical Evaluation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Benchmark 1: Synthetic Holdout */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B] mb-3">
              <span className="badge badge-neutral text-xs font-mono">Split: 70/15/15</span>
              <span className="text-[11px] font-mono text-slate-400">N = 1,344 Samples</span>
            </div>

            <h4 className="text-sm font-bold text-slate-100">
              Synthetic-Heavy Random Split
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Random held-out test split evaluating in-distribution classification accuracy across Sinhala, Singlish, and English message variations.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                <div className="text-base font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">F1-Score</div>
                <div className="text-base font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Precision</div>
                <div className="text-base font-bold text-cyan-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">ROC-AUC</div>
                <div className="text-base font-bold text-cyan-400">1.0000</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono italic">
            TN: 327 &bull; FP: 0 &bull; FN: 0 &bull; TP: 1,017
          </div>
        </div>

        {/* Benchmark 2: Real World Audit */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B] mb-3">
              <span className="badge badge-warning text-xs font-mono">Authentic Audit</span>
              <span className="text-[11px] font-mono text-amber-400">N = 28 Real Messages</span>
            </div>

            <h4 className="text-sm font-bold text-slate-100">
              Real-World Authentic Message Audit
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Holdout evaluation on authentic Sri Lankan SMS smishing attacks and legitimate local conversational messages.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                <div className="text-base font-bold text-emerald-400">92.86%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">F1-Score</div>
                <div className="text-base font-bold text-emerald-400">96.00%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">Precision</div>
                <div className="text-base font-bold text-emerald-400">100.0%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                <div className="text-[10px] text-slate-500 uppercase">ROC-AUC</div>
                <div className="text-base font-bold text-emerald-400">0.9808</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono italic">
            Safe Correct: 2 &bull; Safe Missed: 0 &bull; Phishing Correct: 24 &bull; Phishing Missed: 2
          </div>
        </div>

      </div>

      {/* Limitations & Scientific Notice */}
      <div className="p-5 rounded-xl bg-[#0D1322] border border-[#1E293B] space-y-2">
        <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Known Limitations &amp; Future Directions
        </h4>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>Sample Size Constraints:</strong> The authentic real-world dataset (N=40) is exploratory; future work aims to incorporate community threat feeds.
          </li>
          <li>
            <strong>Edge Runtime Export:</strong> Legacy TFLite runtimes struggle with custom recurrent Attention layer ops; inference is served via server-side containerized REST microservices.
          </li>
          <li>
            <strong>Transformer Exploration:</strong> Ongoing experiments evaluate fine-tuning Sinhala-BERT and XLM-RoBERTa for subword semantic embeddings.
          </li>
        </ul>
      </div>

    </div>
  );
};
