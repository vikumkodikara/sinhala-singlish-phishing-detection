import React, { useState } from 'react';
import {
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Languages,
  Layers,
  History,
  Trash2,
  Download,
  Eye,
  Info,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AnalysisHistoryItem, PredictResponse } from '../types';

interface DetectionInsightsViewProps {
  history: AnalysisHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
}

export const DetectionInsightsView: React.FC<DetectionInsightsViewProps> = ({
  history,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  const [selectedInspection, setSelectedInspection] = useState<AnalysisHistoryItem | null>(null);

  const total = history.length;
  const phishingCount = history.filter((h) => h.result.prediction === 'PHISHING').length;
  const safeCount = history.filter((h) => h.result.prediction === 'SAFE').length;

  const phishingPct = total > 0 ? ((phishingCount / total) * 100).toFixed(1) : '0.0';
  const safePct = total > 0 ? ((safeCount / total) * 100).toFixed(1) : '0.0';

  const avgProb =
    total > 0
      ? (
          history.reduce((acc, curr) => acc + curr.result.probability, 0) / total
        ).toFixed(4)
      : '0.0000';

  // Language count breakdown
  const langCounts: Record<string, number> = {};
  history.forEach((h) => {
    const script = h.result.detected_script || 'Unknown';
    langCounts[script] = (langCounts[script] || 0) + 1;
  });

  // Features triggers breakdown
  const urlHits = history.filter((h) => h.result.detected_features.url_count > 0).length;
  const wordHits = history.filter(
    (h) => h.result.detected_features.suspicious_word_count > 0
  ).length;
  const subdomainHits = history.filter(
    (h) => h.result.detected_features.subdomain_count > 0
  ).length;
  const exclamHits = history.filter(
    (h) => h.result.detected_features.exclamation_count > 0
  ).length;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spectra-session-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="cyber-panel p-6 border-[#1E293B] bg-gradient-to-r from-[#101827] via-[#0D1322] to-[#101827]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Threat Detection Insights &amp; Session Telemetry
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Volatile session analytics tracking message volume, threat detection ratio, script
                distributions, and handcrafted signal frequencies during your current active session.
              </p>
            </div>
          </div>

          {total > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportJSON}
                type="button"
                className="btn-secondary text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 font-mono"
                title="Export session records as JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={onClearHistory}
                type="button"
                className="btn-ghost text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5"
                title="Clear current session log"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#0D1322] border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Privacy By Design:</strong> All telemetry displayed below is stored strictly in client
          memory during your browser session and is never persisted to backend databases.
        </span>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Card 1: Total Analyses */}
        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
            <span>Session Messages</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{total}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
            Active session evaluations
          </div>
        </div>

        {/* Card 2: Phishing Detected */}
        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
            <span>Threats Flagged</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{phishingCount}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
            {phishingPct}% of total volume
          </div>
        </div>

        {/* Card 3: Safe Messages */}
        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
            <span>Benign Messages</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{safeCount}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
            {safePct}% of total volume
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="cyber-panel p-4 border-[#1E293B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-sans">
            <span>Avg Sigmoid Score</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">{avgProb}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
            Mean prediction probability
          </div>
        </div>

      </div>

      {/* Analytical Distributions & Handcrafted Indicators Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel A: Classification Ratio & Script Distribution */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-5">
          <div className="border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              Language &amp; Threat Classification Breakdown
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Distribution of submitted message scripts and model verdicts.
            </p>
          </div>

          {/* Threat Ratio Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Phishing vs Safe Distribution</span>
              <span className="text-slate-500">
                {phishingCount} Phishing / {safeCount} Safe
              </span>
            </div>
            <div className="h-3 w-full bg-[#0A0F1D] rounded-full overflow-hidden flex border border-[#1E293B]">
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${phishingPct}%` }}
                title={`Phishing: ${phishingPct}%`}
              />
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${safePct}%` }}
                title={`Safe: ${safePct}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Phishing: {phishingPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe: {safePct}%
              </span>
            </div>
          </div>

          {/* Script Breakdown Table */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Observed Script Types:
            </div>
            {Object.keys(langCounts).length > 0 ? (
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(langCounts).map(([script, count]) => {
                  const pct = ((count / total) * 100).toFixed(0);
                  return (
                    <div
                      key={script}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0A0F1D] border border-[#1E293B]"
                    >
                      <span className="text-slate-300">{script}</span>
                      <span className="text-cyan-400 font-bold">
                        {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-3 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
                No messages analyzed yet in this session.
              </div>
            )}
          </div>
        </div>

        {/* Panel B: Top Triggered Handcrafted Indicators */}
        <div className="cyber-panel p-5 sm:p-6 border-[#1E293B] space-y-4">
          <div className="border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Handcrafted Threat Signal Hits
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Frequency of extracted structural and linguistic anomalies across analyzed messages.
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {/* Indicator 1 */}
            <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold font-sans">Embedded URLs Detected</div>
                <div className="text-[10px] text-slate-500 font-mono">http/https/www link instances</div>
              </div>
              <span className={`text-base font-bold ${urlHits > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {urlHits} <span className="text-[10px] font-normal text-slate-500">hits</span>
              </span>
            </div>

            {/* Indicator 2 */}
            <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold font-sans">Financial / Urgency Keywords</div>
                <div className="text-[10px] text-slate-500 font-mono">OTP, verify, bank, urgent, prize</div>
              </div>
              <span className={`text-base font-bold ${wordHits > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {wordHits} <span className="text-[10px] font-normal text-slate-500">hits</span>
              </span>
            </div>

            {/* Indicator 3 */}
            <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold font-sans">Subdomain Nesting</div>
                <div className="text-[10px] text-slate-500 font-mono">Multi-level dot domain hierarchies</div>
              </div>
              <span className={`text-base font-bold ${subdomainHits > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {subdomainHits} <span className="text-[10px] font-normal text-slate-500">hits</span>
              </span>
            </div>

            {/* Indicator 4 */}
            <div className="p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold font-sans">Urgent Exclamation Intensity</div>
                <div className="text-[10px] text-slate-500 font-mono">Exclamation punctuation count</div>
              </div>
              <span className={`text-base font-bold ${exclamHits > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {exclamHits} <span className="text-[10px] font-normal text-slate-500">hits</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Analysis Log Table */}
      <div className="cyber-panel p-5 sm:p-6 border-[#1E293B]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Session Evaluation Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical record of messages evaluated during this active session.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {history.length} Record{history.length !== 1 ? 's' : ''}
          </span>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase text-slate-400 bg-[#0A0F1D] border-b border-[#1E293B]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Message Snippet</th>
                  <th className="p-3">Script</th>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">Sigmoid</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {history.map((item) => {
                  const isPhish = item.result.prediction === 'PHISHING';
                  return (
                    <tr key={item.id} className="hover:bg-[#131E30]/50 transition-colors">
                      <td className="p-3 text-slate-400 whitespace-nowrap">{item.timestamp}</td>
                      <td className="p-3 text-slate-200 max-w-xs truncate font-sans">
                        {item.message}
                      </td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {item.result.detected_script}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`badge ${
                            isPhish ? 'badge-phishing' : 'badge-safe'
                          } text-[10px] py-0.5 px-2`}
                        >
                          {item.result.prediction}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 font-bold whitespace-nowrap">
                        {item.result.probability.toFixed(4)}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectHistoryItem(item)}
                          type="button"
                          className="btn-ghost text-xs text-cyan-400 hover:text-cyan-300 py-1 px-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Load</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs italic">
            No analyses performed in this session yet. Run a message in the Live Detector to record telemetry!
          </div>
        )}
      </div>

    </div>
  );
};
