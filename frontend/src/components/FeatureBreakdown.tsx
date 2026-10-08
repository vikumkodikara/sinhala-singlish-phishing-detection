import React from 'react';
import {
  Link2,
  Maximize2,
  Globe2,
  Binary,
  AlertCircle,
  HelpCircle,
  FileCode2,
  Type,
  KeyRound,
  Layers,
} from 'lucide-react';
import { DetectedFeatures } from '../types';

interface FeatureBreakdownProps {
  features: DetectedFeatures;
  preprocessedText: string;
}

export const FeatureBreakdown: React.FC<FeatureBreakdownProps> = ({
  features,
  preprocessedText,
}) => {
  const featureList = [
    {
      id: 'url_count',
      name: 'URL Count',
      value: features.url_count,
      icon: Link2,
      desc: 'Count of http/https/www links',
      highlight: features.url_count > 0,
    },
    {
      id: 'url_length',
      name: 'Max URL Length',
      value: `${features.url_length} chars`,
      icon: Maximize2,
      desc: 'Maximum length of embedded URL',
      highlight: features.url_length > 30,
    },
    {
      id: 'subdomain_count',
      name: 'Subdomain Count',
      value: features.subdomain_count,
      icon: Globe2,
      desc: 'Nested domain dot hierarchy',
      highlight: features.subdomain_count > 0,
    },
    {
      id: 'digit_count',
      name: 'Digit Count',
      value: features.digit_count,
      icon: Binary,
      desc: 'Total numeric digits in text',
      highlight: false,
    },
    {
      id: 'exclamation_count',
      name: 'Exclamations (!)',
      value: features.exclamation_count,
      icon: AlertCircle,
      desc: 'Exclamation punctuation marks',
      highlight: features.exclamation_count > 0,
    },
    {
      id: 'question_count',
      name: 'Questions (?)',
      value: features.question_count,
      icon: HelpCircle,
      desc: 'Question mark punctuations',
      highlight: false,
    },
    {
      id: 'text_length',
      name: 'Message Length',
      value: `${features.text_length} chars`,
      icon: Type,
      desc: 'Total character length',
      highlight: false,
    },
    {
      id: 'word_count',
      name: 'Word Count',
      value: features.word_count,
      icon: FileCode2,
      desc: 'Whitespace-separated words',
      highlight: false,
    },
    {
      id: 'suspicious_word_count',
      name: 'Suspicious Keywords',
      value: features.suspicious_word_count,
      icon: KeyRound,
      desc: 'Financial / urgency keywords',
      highlight: features.suspicious_word_count > 0,
    },
  ];

  return (
    <div className="cyber-card p-6 border-[#1E293B]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            9 Engineered Handcrafted Features
          </h3>
          <p className="text-xs text-slate-400">
            Numerical feature vector fed directly into the model's feature branch (Dense 32 &rarr; Fusion 160).
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
          Dim: 9 &times; 1
        </span>
      </div>

      {/* 9 Features Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className={`p-3 rounded-xl border transition-all ${
                f.highlight
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-[#0D1322] border-[#1E293B] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400 truncate">
                  {f.name}
                </span>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    f.highlight ? 'text-rose-400' : 'text-slate-500'
                  }`}
                />
              </div>

              <div className="text-lg font-bold font-mono text-slate-100">
                {f.value}
              </div>

              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preprocessed Text Inspector */}
      <div className="mt-5 pt-4 border-t border-[#1E293B]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Normalized NLP Sequence (Preserving Digits &amp; Unicode NFC):
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            MAX_LEN = 120
          </span>
        </div>
        <div className="bg-[#0D1322] p-3 rounded-lg border border-[#1E293B] font-mono text-xs text-slate-300 break-words leading-relaxed select-all">
          {preprocessedText || '<Empty Sequence>'}
        </div>
      </div>
    </div>
  );
};
