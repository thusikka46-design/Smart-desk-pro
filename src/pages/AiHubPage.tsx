import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  Copy,
  Check,
  ShieldAlert,
  Server,
  Database,
  Key,
  RotateCw,
  PlusCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AiHubPage: React.FC = () => {
  const {
    aiMessages,
    sendAiMessage,
    currentUser,
    setLogIncidentModalOpen,
    navigateTo,
    openDiagnostic,
    assets
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;

    const query = input;
    setInput('');
    setIsSending(true);
    await sendAiMessage(query);
    setIsSending(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickPrompts = [
    {
      title: 'Analyze Error Log',
      desc: 'Parse Redis eviction spike & volatile-lru traces',
      query: 'Analyze Redis Sentinel Cluster error logs and memory fragmentation ratio',
      icon: ShieldAlert,
      color: 'text-amber-400'
    },
    {
      title: 'Generate SQL Query',
      desc: 'Table sizes, index scans & dead tuple analyzer',
      query: 'Generate SQL query to find largest bloated tables and dead tuples in PostgreSQL',
      icon: Database,
      color: 'text-cyan-400'
    },
    {
      title: 'Check Server Health',
      desc: 'Multi-region cluster telemetry & ping status',
      query: 'Check server health and ping response across all 4 production service clusters',
      icon: Server,
      color: 'text-emerald-400'
    },
    {
      title: 'Reset User Credentials',
      desc: 'Zero Trust ephemeral IAM bastion access grant',
      query: 'Generate ephemeral SSH credentials and Teleport login grant for SRE',
      icon: Key,
      color: 'text-violet-400'
    }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>AI Diagnostic & Autonomous Support Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry inference engine trained on internal runbooks, logs, and infrastructure topology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-400 font-medium">Model Inference Engine Ready</span>
        </div>
      </div>

      {/* QUICK PROMPT CARDS (4 Required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {quickPrompts.map((qp, idx) => {
          const IconComp = qp.icon;
          return (
            <div
              key={idx}
              onClick={() => handleQuickPrompt(qp.query)}
              className="cursor-pointer p-4 rounded-2xl glass-panel border hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2.5">
                  <IconComp className={`w-4 h-4 ${qp.color}`} />
                </div>
                <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {qp.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">{qp.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Run Prompt</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE CHAT CONSOLE */}
      <div className="rounded-2xl glass-panel border border-cyan-500/30 shadow-[0_0_40px_rgba(0,242,254,0.1)] overflow-hidden flex flex-col h-[560px]">
        {/* Terminal Title Bar */}
        <div className="px-5 py-3.5 bg-[#05070F]/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-300">smartdesk_ai_diagnostic_agent.sh</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-cyan-400">Context: AWS us-east-1 + Kubernetes</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {/* Diagnostic Data Card */}
                {msg.diagnosticData && (
                  <div className="mt-3 p-3 rounded-xl bg-[#030408] border border-amber-500/30 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-amber-300 font-semibold mb-2">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        {msg.diagnosticData.service}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px]">
                        {msg.diagnosticData.status}
                      </span>
                    </div>
                    <div className="text-slate-300 space-y-1">
                      {msg.diagnosticData.metrics.map((m: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-cyan-400">›</span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-slate-400">Roundtrip: {msg.diagnosticData.latency}</span>
                      <button
                        onClick={() => setLogIncidentModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] transition-colors"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Escalate to Incident</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Code Suggestion Block */}
                {msg.codeBlock && (
                  <div className="mt-3 rounded-xl bg-[#030408] border border-white/10 overflow-hidden font-mono text-[11px]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-slate-400 text-[10px]">
                      <span className="uppercase">{msg.codeBlock.lang}</span>
                      <button
                        onClick={() => copyToClipboard(msg.codeBlock!.code, msg.id)}
                        className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        {copiedCodeId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 overflow-x-auto text-cyan-300 leading-relaxed">
                      <code>{msg.codeBlock.code}</code>
                    </pre>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs py-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing live telemetry streams and cross-referencing internal runbooks...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#05070F] border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your operational question, paste stack trace, or ask for remediation script..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Execute Analysis</span>
          </button>
        </form>
      </div>
    </div>
  );
};
