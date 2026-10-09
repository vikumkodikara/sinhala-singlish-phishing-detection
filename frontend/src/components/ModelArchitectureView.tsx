import React from 'react';
import {
  Cpu,
  ArrowDown,
  Layers,
  Network,
  Binary,
  Code2,
  Info,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { ModelInfoResponse } from '../types';

interface ModelArchitectureViewProps {
  modelInfo: ModelInfoResponse | null;
}

export const ModelArchitectureView: React.FC<ModelArchitectureViewProps> = ({
  modelInfo,
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="cyber-panel p-6 border-[#1E293B] bg-gradient-to-r from-[#101827] via-[#0D1322] to-[#101827]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Neural Network Architecture &amp; Hybrid Pipeline
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                BiGRU + Attention + Dense
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Multi-input deep neural network architecture combining recurrent sequence representation
              learning (Bidirectional GRU with Context Softmax Attention) alongside an engineered 9-dimensional
              URL and linguistic feature vector.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Model Metadata Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="text-[10px] text-slate-500 uppercase font-sans">Model Parameters</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">3,683,501</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trainable: 1,227,833</div>
        </div>

        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="text-[10px] text-slate-500 uppercase font-sans">Vocabulary Capacity</div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {modelInfo?.vocabulary_size || '8,908'} <span className="text-xs font-normal text-slate-500">tokens</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sinhala + Singlish + English</div>
        </div>

        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="text-[10px] text-slate-500 uppercase font-sans">Sequence Length</div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {modelInfo?.max_sequence_length || 120} <span className="text-xs font-normal text-slate-500">steps</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Post-padded with index 0</div>
        </div>

        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="text-[10px] text-slate-500 uppercase font-sans">Feature Dimension</div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            9 &times; 1 <span className="text-xs font-normal text-slate-500">vector</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">StandardScaler Normalized</div>
        </div>
      </div>

      {/* Visual Multi-Branch Computational Graph */}
      <div className="cyber-panel p-6 sm:p-8 border-[#1E293B]">
        <div className="border-b border-[#1E293B] pb-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Computational Graph &amp; Tensor Flow
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-branch feature extraction, intermediate representation fusion, and binary sigmoid classification.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
            Keras 3 / TensorFlow
          </span>
        </div>

        {/* Dual Branch Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
          
          {/* ============================================================= */}
          {/* BRANCH A: Text NLP Sequence Branch                           */}
          {/* ============================================================= */}
          <div className="p-5 rounded-xl bg-[#0A0F1D] border border-[#1E293B] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B]">
              <span className="font-bold text-cyan-400 tracking-wide font-sans text-xs">
                BRANCH A: RECURRENT NLP SEQUENCE
              </span>
              <span className="text-[10px] text-slate-500">Shape: (None, 120)</span>
            </div>

            {/* Step 1: Input & Normalization */}
            <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B]">
              <div className="font-semibold text-slate-200 font-sans">1. Raw Text Preprocessing</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Unicode NFC Normalization + Number-Preserving Regex (collapse &gt;3 char repeats)
              </div>
            </div>

            <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

            {/* Step 2: Tokenization & Embedding */}
            <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B]">
              <div className="font-semibold text-slate-200 font-sans">2. Word Embedding Layer</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Input: (None, 120) &rarr; Embedding(8909 &rarr; 128) &rarr; Output: (None, 120, 128)
              </div>
              <div className="text-[9px] text-cyan-400/80 mt-1">1,140,352 parameters</div>
            </div>

            <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

            {/* Step 3: BiGRU */}
            <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B]">
              <div className="font-semibold text-slate-200 font-sans">3. Bidirectional GRU Layer</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Bidirectional(GRU(64 units, return_sequences=True)) &rarr; Output: (None, 120, 128)
              </div>
              <div className="text-[9px] text-cyan-400/80 mt-1">74,496 parameters (captures forward/backward context)</div>
            </div>

            <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

            {/* Step 4: Custom Attention */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
              <div className="font-semibold text-cyan-300 font-sans">4. Custom Attention Mechanism</div>
              <div className="text-[10px] text-cyan-400/80 mt-0.5">
                Context Softmax Weighting: tanh(H &times; W + b) &rarr; Output: (None, 128)
              </div>
              <div className="text-[9px] text-cyan-400 mt-1">248 parameters (learns key threat words)</div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* BRANCH B: Handcrafted Feature Vector Branch                   */}
          {/* ============================================================= */}
          <div className="p-5 rounded-xl bg-[#0A0F1D] border border-[#1E293B] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B]">
              <span className="font-bold text-blue-400 tracking-wide font-sans text-xs">
                BRANCH B: HANDCRAFTED FEATURES
              </span>
              <span className="text-[10px] text-slate-500">Shape: (None, 9)</span>
            </div>

            {/* Step 1: Feature Extraction */}
            <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B]">
              <div className="font-semibold text-slate-200 font-sans">1. 9 Domain Numerical Signals</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                URL count/length, subdomains, digits, exclamations, questions, text/word length, suspicious words
              </div>
            </div>

            <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

            {/* Step 2: StandardScaler */}
            <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B]">
              <div className="font-semibold text-slate-200 font-sans">2. StandardScaler Transform</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                z = (x - &mu;) / &sigma; using pre-computed research dataset mean and scale vectors
              </div>
            </div>

            <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

            {/* Step 3: Feature Dense Layer */}
            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-200">
              <div className="font-semibold text-blue-300 font-sans">3. Dense Feature Mapping</div>
              <div className="text-[10px] text-blue-400/80 mt-0.5">
                Dense(32 units, activation='relu') &rarr; Output: (None, 32)
              </div>
              <div className="text-[9px] text-blue-400 mt-1">320 parameters</div>
            </div>

            <div className="p-3 rounded-lg bg-transparent border border-dashed border-[#1E293B] text-slate-500 text-center text-[10px] italic">
              Aligns dimensionality with recurrent branch before concatenation
            </div>
          </div>

        </div>

        {/* ============================================================= */}
        {/* FUSION & CLASSIFICATION HEAD                                   */}
        {/* ============================================================= */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] max-w-2xl mx-auto font-mono text-xs space-y-3">
          <div className="text-center font-bold text-slate-200 uppercase tracking-wider font-sans text-xs mb-3">
            FUSION &amp; CLASSIFICATION HEAD
          </div>

          {/* Concatenation */}
          <div className="p-3 rounded-lg bg-[#131E30] border border-cyan-500/30 text-center">
            <div className="font-semibold text-slate-100 font-sans">
              Concatenate([Attention Context (128), Feature Dense (32)])
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">
              Fused Latent Vector Dimension: (None, 160)
            </div>
          </div>

          <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

          {/* Dense Head 1 */}
          <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B] text-center">
            <div className="font-semibold text-slate-200 font-sans">Dense(64, ReLU) + Dropout(0.3)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">10,304 parameters &bull; Output: (None, 64)</div>
          </div>

          <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

          {/* Dense Head 2 */}
          <div className="p-3 rounded-lg bg-[#101827] border border-[#1E293B] text-center">
            <div className="font-semibold text-slate-200 font-sans">Dense(32, ReLU) + Dropout(0.2)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">2,080 parameters &bull; Output: (None, 32)</div>
          </div>

          <div className="flex justify-center text-slate-600"><ArrowDown className="w-4 h-4" /></div>

          {/* Output Sigmoid */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#101827] to-cyan-950/40 border border-cyan-500/40 text-center shadow-lg">
            <div className="font-bold text-cyan-300 font-sans text-sm">
              Dense(1, Sigmoid) Output Neuron
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-mono">
              Raw Sigmoid Score &isin; [0.0, 1.0] &bull; Decision Threshold = 0.50
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-sans">
              Score &ge; 0.50 &rarr; <strong>PHISHING</strong> | Score &lt; 0.50 &rarr; <strong>SAFE</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Layer Parameters Table */}
      <div className="cyber-panel p-5 sm:p-6 border-[#1E293B]">
        <h3 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-[#1E293B] flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Layer-by-Layer Mathematical Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase text-slate-400 bg-[#0A0F1D] border-b border-[#1E293B]">
              <tr>
                <th className="p-3">Layer (Type)</th>
                <th className="p-3">Output Shape</th>
                <th className="p-3">Param #</th>
                <th className="p-3">Connected To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-slate-100">text_input (InputLayer)</td>
                <td className="p-3 text-cyan-400">(None, 120)</td>
                <td className="p-3">0</td>
                <td className="p-3 text-slate-500">-</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">embedding (Embedding)</td>
                <td className="p-3 text-cyan-400">(None, 120, 128)</td>
                <td className="p-3">1,140,352</td>
                <td className="p-3 text-slate-400">text_input</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">bidirectional (BiGRU)</td>
                <td className="p-3 text-cyan-400">(None, 120, 128)</td>
                <td className="p-3">74,496</td>
                <td className="p-3 text-slate-400">embedding</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-cyan-300">attention_layer (Custom)</td>
                <td className="p-3 text-cyan-400">(None, 128)</td>
                <td className="p-3">248</td>
                <td className="p-3 text-slate-400">bidirectional</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">feature_input (InputLayer)</td>
                <td className="p-3 text-blue-400">(None, 9)</td>
                <td className="p-3">0</td>
                <td className="p-3 text-slate-500">-</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">feature_dense (Dense)</td>
                <td className="p-3 text-blue-400">(None, 32)</td>
                <td className="p-3">320</td>
                <td className="p-3 text-slate-400">feature_input</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">concatenate (Concatenate)</td>
                <td className="p-3 text-slate-200 font-bold">(None, 160)</td>
                <td className="p-3">0</td>
                <td className="p-3 text-slate-400">attention_layer, feature_dense</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">dense_head_1 (Dense 64)</td>
                <td className="p-3">(None, 64)</td>
                <td className="p-3">10,304</td>
                <td className="p-3 text-slate-400">concatenate</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-100">dense_head_2 (Dense 32)</td>
                <td className="p-3">(None, 32)</td>
                <td className="p-3">2,080</td>
                <td className="p-3 text-slate-400">dense_head_1</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">output (Dense 1, Sigmoid)</td>
                <td className="p-3 font-bold text-emerald-400">(None, 1)</td>
                <td className="p-3">33</td>
                <td className="p-3 text-slate-400">dense_head_2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
