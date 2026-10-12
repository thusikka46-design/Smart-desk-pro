import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Activity,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export const FloatingAiDrawer: React.FC = () => {
  const {
    quickAiOpen,
    setQuickAiOpen,
    aiMessages,
    sendAiMessage,
    navigateTo
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quickAiOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, quickAiOpen]);

  if (!quickAiOpen) {
    return (
      <button
        onClick={() => setQuickAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-medium text-xs shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 group"
        aria-label="Open AI Operations Assistant"
      >
        <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform" />
        </div>
        <span>AI Operations Assistant</span>
        <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
      </button>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;

    const query = input;
    setInput('');
    setIsSending(true);
    await sendAiMessage(query);
    setIsSending(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 bg-[#0D111D] border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.2)] flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-200 ${
        isExpanded ? 'w-[680px] h-[720px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]' : 'w-[410px] h-[540px] max-w-[calc(100vw-2rem)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#05070F]/80 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white">SmartDesk AI Diagnostic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Telemetry & SRE Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Standard view' : 'Expand view'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setQuickAiOpen(false);
              navigateTo('ai-hub');
            }}
            className="px-2 py-1 text-[10px] rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-medium transition-colors"
            title="Open Full Page AI Console"
          >
            Full Page
          </button>
          <button
            onClick={() => setQuickAiOpen(false)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Diagnostic data widget */}
              {msg.diagnosticData && (
                <div className="mt-2.5 p-2 rounded-lg bg-[#05070F]/90 border border-amber-500/30 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-amber-300 font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      {msg.diagnosticData.service}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20">{msg.diagnosticData.status}</span>
                  </div>
                  <div className="text-slate-400 space-y-0.5">
                    {msg.diagnosticData.metrics.map((m: string, idx: number) => (
                      <div key={idx}>• {m}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code suggestion block */}
              {msg.codeBlock && (
                <div className="mt-2.5 rounded-lg bg-[#05070F] border border-white/10 overflow-hidden font-mono text-[11px]">
                  <div className="flex items-center justify-between px-2.5 py-1 bg-white/5 border-b border-white/10 text-slate-400 text-[10px]">
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
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 overflow-x-auto text-cyan-300 leading-snug">
                    <code>{msg.codeBlock.code}</code>
                  </pre>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing cluster telemetry and logs...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-[#05070F]/50 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <button
          onClick={() => handleQuickPrompt('Analyze Redis Cluster Memory Pressure')}
          className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors"
        >
          Diagnose Redis
        </button>
        <button
          onClick={() => handleQuickPrompt('Generate SQL Slow Query Diagnostic')}
          className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors"
        >
          Slow Query SQL
        </button>
        <button
          onClick={() => handleQuickPrompt('Check Server Health across clusters')}
          className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors"
        >
          Cluster Health
        </button>
        <button
          onClick={() => handleQuickPrompt('Reset User Credentials & Ephemeral SSH')}
          className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors"
        >
          Ephemeral SSH
        </button>
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-3 bg-[#05070F] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask diagnostic question, paste log, or query SRE..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(0,242,254,0.3)]"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
