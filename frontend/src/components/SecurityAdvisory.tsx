import { ShieldCheck, Lock, EyeOff, Globe2, ServerOff } from 'lucide-react';

export const SecurityAdvisory: React.FC = () => {
  const policies = [
    {
      icon: Globe2,
      title: 'Zero URL Fetching / Web Isolation',
      desc: 'The backend parses URL strings solely via regular expressions. It NEVER initiates HTTP requests, DNS lookups, downloads, or scripts to the URLs submitted in SMS messages, ensuring absolute malware isolation.',
    },
    {
      icon: EyeOff,
      title: 'Privacy & Ephemeral Processing',
      desc: 'Submitted messages are processed in-memory during the inference request and are never stored in databases, log files, or persisted to disk.',
    },
    {
      icon: Lock,
      title: 'Strict Input Validation',
      desc: 'Payloads are validated with Pydantic for length limits (max 5,000 chars), script escaping, and format integrity to prevent injection vectors.',
    },
    {
      icon: ServerOff,
      title: 'Deterministic Server-Side Execution',
      desc: 'The trained Keras model is loaded once into server memory on startup, ensuring predictable latency without dynamic retraining or unverified downloads.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="cyber-card p-6 border-[#1E293B]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Security Architecture &amp; Privacy Policy
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineering controls implemented across the FastAPI inference engine to guarantee user privacy and threat isolation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#0D1322] border border-[#1E293B] flex items-center justify-center text-cyan-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
