import React, { useState } from 'react';
import { Send, Clipboard, Trash2, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { SampleMessage } from '../types';

interface MessageAnalyzerProps {
  message: string;
  setMessage: (msg: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  samples: SampleMessage[];
  onSelectSample: (sample: SampleMessage) => void;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({
  message,
  setMessage,
  onAnalyze,
  isLoading,
  samples,
  onSelectSample,
}) => {

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setMessage(text);
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleClear = () => {
    setMessage('');
  };

  const charCount = message.length;
  const maxChars = 5000;

  return (
    <div className="cyber-card p-6 border-[#1E293B] shadow-2xl relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Analyze Message
          </h2>
          <p className="text-xs text-slate-400">
            Paste suspicious SMS text in Sinhala, Singlish, or English for deep learning analysis.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePaste}
            type="button"
            className="btn-ghost text-xs"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>
          {message && (
            <button
              onClick={handleClear}
              type="button"
              className="btn-ghost text-xs text-slate-400 hover:text-rose-400"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Message Textarea */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste or type suspicious SMS message here... (e.g. 'ඔබගේ ගිණුම verify කරන්න http://bank.xyz' or 'You won Rs. 50,000...')"
          rows={5}
          maxLength={maxChars}
          className="w-full bg-[#0D1322] border border-[#1E293B] focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 rounded-xl p-4 text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none transition-all resize-y min-h-[140px]"
        />

        {/* Character Count */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500 font-mono">
          <span>Supported: Sinhala (Unicode), Singlish (Latin), English</span>
          <span className={charCount > 4000 ? 'text-amber-400' : ''}>
            {charCount.toLocaleString()} / {maxChars.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Sample Selector Chips */}
      {samples.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#1E293B]/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Benchmark Test Cases:
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSample(s)}
                type="button"
                className="px-2.5 py-1 rounded-md text-xs bg-[#0D1322] hover:bg-[#1E293B] border border-[#1E293B] hover:border-cyan-500/40 text-slate-300 transition-all text-left flex items-center gap-1.5"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    s.label === 'PHISHING' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-semibold text-[11px] text-slate-400">[{s.language}]</span>
                <span className="truncate max-w-[200px]">{s.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span>URLs are parsed as text &amp; NEVER requested externally</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !message.trim()}
          type="button"
          className="btn-primary w-full sm:w-auto min-w-[180px] text-sm py-2.5 px-6 rounded-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Running Neural Inference...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Message
            </>
          )}
        </button>
      </div>
    </div>
  );
};
