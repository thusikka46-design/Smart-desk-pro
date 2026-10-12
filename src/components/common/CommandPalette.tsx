import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  AlertTriangle,
  Server,
  Code2,
  BookOpen,
  Bot,
  Activity,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { PageId } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    navigateTo,
    tickets,
    assets,
    snippets,
    docs,
    healthEvents,
    setLogIncidentModalOpen,
    openDiagnostic,
    setQuickAiOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchingTickets = q
    ? tickets.filter(t => t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.service.toLowerCase().includes(q))
    : [];

  const matchingAssets = q
    ? assets.filter(a => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.ip.includes(q))
    : [];

  const matchingSnippets = q
    ? snippets.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.language.includes(q))
    : [];

  const matchingDocs = q
    ? docs.filter(d => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q))
    : [];

  const matchingHealthEvents = q
    ? healthEvents.filter(e => e.title.toLowerCase().includes(q) || e.serviceName.toLowerCase().includes(q) || e.rootCauseTag.toLowerCase().includes(q))
    : [];

  const quickNavItems: { id: PageId; label: string; icon: any; category: string }[] = [
    { id: 'dashboard', label: 'Go to System Overview Dashboard', icon: Activity, category: 'Navigation' },
    { id: 'incidents', label: 'Go to Incident & Ticket Hub', icon: AlertTriangle, category: 'Navigation' },
    { id: 'assets', label: 'Go to IT Asset Inventory', icon: Server, category: 'Navigation' },
    { id: 'vault', label: 'Go to Developer Code & Command Vault', icon: Code2, category: 'Navigation' },
    { id: 'docs', label: 'Go to Knowledge Base & Runbooks', icon: BookOpen, category: 'Navigation' },
    { id: 'ai-hub', label: 'Go to AI Diagnostic & Support Hub', icon: Bot, category: 'Navigation' }
  ];

  const filteredNav = q
    ? quickNavItems.filter(item => item.label.toLowerCase().includes(q))
    : quickNavItems;

  const handleSelectPage = (page: PageId) => {
    navigateTo(page);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-[#0D111D] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#05070F]/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, ticket ID, server, code snippet, or doc..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Operations
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  setLogIncidentModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-cyan-400" />
                  <span>Log New Production Incident</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  setQuickAiOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <span>Open AI Diagnostic Quick Assistant</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPage(item.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Jump</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Tickets */}
          {matchingTickets.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Tickets ({matchingTickets.length})
              </div>
              <div className="space-y-1">
                {matchingTickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      navigateTo('incidents');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-cyan-400 shrink-0">{t.id}</span>
                      <span className="truncate">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400">{t.status}</span>
                      <span className="text-[10px] text-rose-400 font-medium">{t.severity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Assets */}
          {matchingAssets.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                IT Assets ({matchingAssets.length})
              </div>
              <div className="space-y-1">
                {matchingAssets.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      navigateTo('assets');
                      setCommandPaletteOpen(false);
                      openDiagnostic(a);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-cyan-400 shrink-0">{a.id}</span>
                      <span className="truncate">{a.name}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">Run Diagnostic</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Snippets */}
          {matchingSnippets.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Developer Snippets ({matchingSnippets.length})
              </div>
              <div className="space-y-1">
                {matchingSnippets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      navigateTo('vault');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {s.language}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Docs */}
          {matchingDocs.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
                Documentation & Runbooks ({matchingDocs.length})
              </div>
              <div className="space-y-1">
                {matchingDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      navigateTo('docs');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="truncate">{d.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{d.readTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Health Recovery Events */}
          {matchingHealthEvents.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                Health Recovery Logs ({matchingHealthEvents.length})
              </div>
              <div className="space-y-1">
                {matchingHealthEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      navigateTo('dashboard');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.title}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">{evt.status} ({evt.durationSeconds}s)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && !matchingTickets.length && !matchingAssets.length && !matchingSnippets.length && !matchingDocs.length && !matchingHealthEvents.length && !filteredNav.length && (
            <div className="py-8 text-center text-slate-400">
              <p>No operational items found matching "{query}"</p>
              <p className="text-[11px] text-slate-500 mt-1">Try searching for "Redis", "P1", "Docker", "SLA", "WAL", or "Kubernetes"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/10 bg-[#05070F]/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Navigate: <kbd className="font-mono text-slate-300">↑↓</kbd></span>
            <span>Select: <kbd className="font-mono text-slate-300">↵</kbd></span>
          </div>
          <span className="text-cyan-400 font-mono">SmartDesk Operational Index</span>
        </div>
      </div>
    </div>
  );
};
