import {
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PredictResponse } from '../types';

interface PredictionResultCardProps {
  result: PredictResponse;
  onReset: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  onReset,
}) => {
  const isPhishing = result.prediction === 'PHISHING';
  const feats = result.detected_features;

  // Generate dynamic indicators based on detected feature values
  const indicators: { label: string; severity: 'high' | 'medium' | 'info' }[] = [];

  if (feats.url_count > 0) {
    indicators.push({
      label: `Suspicious URL detected (${feats.url_count} link${feats.url_count > 1 ? 's' : ''}, max length ${feats.url_length} chars)`,
      severity: 'high',
    });
  }

  if (feats.subdomain_count > 0) {
    indicators.push({
      label: `Suspicious subdomain structure (${feats.subdomain_count} nested level${feats.subdomain_count > 1 ? 's' : ''})`,
      severity: 'high',
    });
  }

  if (feats.suspicious_word_count > 0) {
    indicators.push({
      label: `Financial / urgency trigger keywords detected (${feats.suspicious_word_count} match${feats.suspicious_word_count > 1 ? 'es' : ''})`,
      severity: isPhishing ? 'high' : 'medium',
    });
  }

  if (feats.exclamation_count > 0) {
    indicators.push({
      label: `High-urgency punctuation (${feats.exclamation_count} exclamation mark${feats.exclamation_count > 1 ? 's' : ''})`,
      severity: 'medium',
    });
  }

  if (feats.digit_count > 6) {
    indicators.push({
      label: `High numeric sequence density (${feats.digit_count} digits - e.g. amount, OTP, or account token)`,
      severity: 'info',
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Primary Verdict Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isPhishing
            ? 'bg-gradient-to-b from-rose-950/40 via-[#111827] to-[#0D1322] border-rose-500/40 shadow-2xl shadow-rose-950/20'
            : 'bg-gradient-to-b from-emerald-950/30 via-[#111827] to-[#0D1322] border-emerald-500/30 shadow-2xl shadow-emerald-950/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]">
          
          {/* Main Status Headline */}
          <div className="flex items-start space-x-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isPhishing
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              }`}
            >
              {isPhishing ? (
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`badge ${
                    isPhishing
                      ? result.risk_level === 'HIGH'
                        ? 'badge-phishing'
                        : 'badge-warning'
                      : 'badge-safe'
                  }`}
                >
                  Risk: {result.risk_level}
                </span>

                <span className="badge badge-neutral">
                  Script: {result.detected_script}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                {isPhishing
                  ? '⚠ PHISHING MESSAGE DETECTED'
                  : '✓ NO PHISHING SIGNAL DETECTED'}
              </h3>

              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {isPhishing
                  ? 'The neural network identified patterns, URL structures, or linguistic cues strongly associated with smishing/phishing attacks.'
                  : 'The model evaluated the message and found low phishing likelihood. Authentic banking alerts, OTPs, or casual texts normally fall in this band.'}
              </p>
            </div>
          </div>

          {/* Probability & Confidence Score Display */}
          <div className="flex items-center gap-4 bg-[#0B0F19]/80 p-4 rounded-xl border border-[#1E293B] shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Model Confidence
              </div>
              <div
                className={`text-3xl font-extrabold font-mono ${
                  isPhishing ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {result.confidence}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Probability: {result.probability.toFixed(4)}
              </div>
            </div>

            {/* Confidence Bar Meter */}
            <div className="w-2 h-14 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
              <div
                className={`w-full rounded-full transition-all duration-700 ${
                  isPhishing ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ height: `${Math.max(result.confidence, 10)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Detected Indicators List */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Detected Behavioral &amp; Structural Indicators:
          </h4>

          {indicators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-[#0B0F19]/60 border border-[#1E293B] text-xs text-slate-200"
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
            <div className="p-3 rounded-lg bg-[#0B0F19]/60 border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No abnormal URL parameters, subdomains, or high-urgency keywords were detected.</span>
            </div>
          )}
        </div>

        {/* Transparent Research Disclaimer */}
        {result.warning && (
          <div className="mt-5 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{result.warning}</p>
          </div>
        )}

        {/* Reset Action */}
        <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            BiGRU + Attention Inference Completed
          </span>
          <button
            onClick={onReset}
            type="button"
            className="btn-secondary text-xs py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Analyze Another Message
          </button>
        </div>

      </div>
    </div>
  );
};
