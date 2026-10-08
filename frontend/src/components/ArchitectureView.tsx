import React from 'react';
import {
  Layers,
  Cpu,
  ArrowDown,
  Smartphone,
} from 'lucide-react';
import { ModelInfoResponse } from '../types';

interface ArchitectureViewProps {
  modelInfo: ModelInfoResponse | null;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  modelInfo,
}) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Title Card */}
      <div className="cyber-card p-6 border-[#1E293B]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Neural Network Architecture &amp; System Design
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Multi-input hybrid architecture combining recurrent sequence representation learning
              (Bidirectional GRU + Custom Attention) with engineered domain-specific URL and linguistic features.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Multi-Input Architecture Diagram */}
      <div className="cyber-card p-6 sm:p-8 border-[#1E293B]">
        <h3 className="text-base font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Deep Learning Computational Graph
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative">
          
          {/* Branch 1: NLP Text Branch */}
          <div className="p-5 rounded-xl bg-[#0D1322] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="text-xs font-bold text-cyan-400 font-mono">BRANCH A: TEXT SEQUENCE</span>
              <span className="text-[10px] text-slate-500 font-mono">Input: (None, 120)</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">1. Raw SMS Text Input</div>
                <div className="text-[10px] text-slate-500">Unicode NFC + Number-Preserving Regex</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">2. Tokenizer &amp; Embedding Layer</div>
                <div className="text-[10px] text-slate-500">Vocab: 8,908 | Dim: 128 | (None, 120, 128)</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">3. Bidirectional GRU Layer</div>
                <div className="text-[10px] text-slate-500">64 Units (Forward + Backward) &rarr; (None, 120, 128)</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
                <div className="font-semibold text-cyan-300">4. Custom Attention Mechanism</div>
                <div className="text-[10px] text-cyan-400/80">Softmax Context Weighting &rarr; (None, 128)</div>
              </div>
            </div>
          </div>

          {/* Branch 2: 9 Handcrafted Features Branch */}
          <div className="p-5 rounded-xl bg-[#0D1322] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="text-xs font-bold text-blue-400 font-mono">BRANCH B: HANDCRAFTED FEATURES</span>
              <span className="text-[10px] text-slate-500 font-mono">Input: (None, 9)</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">1. 9 Engineered Domain Features</div>
                <div className="text-[10px] text-slate-500">URLs, Subdomains, Digits, Suspicious Terms</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">2. StandardScaler Transformation</div>
                <div className="text-[10px] text-slate-500">(x - &mu;) / &sigma; fitted on 7,028 training samples</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-slate-300">
                <div className="font-semibold text-slate-200">3. Dense Feature Compression</div>
                <div className="text-[10px] text-slate-500">Dense(32, ReLU) &rarr; (None, 32)</div>
              </div>

              <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

              <div className="p-2.5 rounded bg-blue-950/30 border border-blue-500/30 text-blue-200">
                <div className="font-semibold text-blue-300">4. Feature Vector Output</div>
                <div className="text-[10px] text-blue-400/80">32-Dimensional Domain Vector</div>
              </div>
            </div>
          </div>

        </div>

        {/* Fusion Layer & Classification Head */}
        <div className="mt-6 pt-6 border-t border-[#1E293B] text-center max-w-xl mx-auto space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
            <div className="font-bold text-sm text-purple-300">5. Feature Concatenation &amp; Fusion</div>
            <div className="text-[10px] text-purple-400/80">Concatenate [Attention (128) + Dense (32)] &rarr; (None, 160)</div>
          </div>

          <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

          <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E293B] text-slate-300">
            <div className="font-semibold text-slate-200">6. Dense Classification MLP</div>
            <div className="text-[10px] text-slate-500">Dense(64, ReLU) + Dropout(0.3) &rarr; Dense(32, ReLU) + Dropout(0.2)</div>
          </div>

          <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
            <div className="font-bold text-sm text-emerald-300">7. Final Output Probability</div>
            <div className="text-[10px] text-emerald-400/80">Dense(1, Sigmoid) &rarr; Predicted Phishing Probability (0.0 to 1.0)</div>
          </div>
        </div>
      </div>

      {/* Android Limitation Documentation (Mandatory Section 23) */}
      <div className="cyber-card p-6 border-[#1E293B] bg-slate-900/40">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-100">
              Architectural Transition: Mobile App &rarr; Web Application
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Research Deployment Note:</strong> The original research direction considered on-device
              Android deployment. The recurrent Keras model was not successfully converted to TensorFlow Lite
              due to recurrent-operation compatibility constraints (such as bidirectional GRU recurrent states
              and custom attention op mapping in edge runtimes).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The current implementation therefore provides robust, server-side inference through a professional
              FastAPI web application, preserving the exact multi-input Keras model architecture and full floating-point precision.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
