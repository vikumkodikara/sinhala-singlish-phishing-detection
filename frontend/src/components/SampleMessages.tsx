import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SampleMessage } from '../types';

interface SampleMessagesProps {
  samples: SampleMessage[];
  onSelectSample: (sample: SampleMessage) => void;
}

export const SampleMessages: React.FC<SampleMessagesProps> = ({
  samples,
  onSelectSample,
}) => {
  return (
    <div className="cyber-card p-6 border-[#1E293B]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Curated Research Test Suite
          </h3>
          <p className="text-xs text-slate-400">
            Click any test case to populate the detector and run live BiGRU neural inference.
          </p>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {samples.length} Benchmark Samples
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {samples.map((s) => {
          const isPhishing = s.label === 'PHISHING';
          return (
            <div
              key={s.id}
              onClick={() => onSelectSample(s)}
              className="p-4 rounded-xl bg-[#0D1322] hover:bg-[#162032] border border-[#1E293B] hover:border-cyan-500/40 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${
                        isPhishing ? 'badge-phishing' : 'badge-safe'
                      } text-[10px] py-0.5 px-2`}
                    >
                      {isPhishing ? (
                        <AlertTriangle className="w-2.5 h-2.5" />
                      ) : (
                        <ShieldCheck className="w-2.5 h-2.5" />
                      )}
                      {s.label}
                    </span>
                    <span className="badge badge-neutral text-[10px] py-0.5 px-2">
                      {s.language}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono">
                    Load <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2.5 italic">
                  &ldquo;{s.description}&rdquo;
                </p>

                <div className="p-2.5 rounded-lg bg-[#080C14] border border-[#1E293B]/60 font-sans text-xs text-slate-200 line-clamp-3">
                  {s.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
