import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Search,
  Plus,
  Copy,
  Check,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { CodeLanguage, CodeSnippet } from '../types';

export const CodeVaultPage: React.FC = () => {
  const { snippets, incrementSnippetCopy, setAddSnippetModalOpen } = useApp();

  const [selectedLang, setSelectedLang] = useState<CodeLanguage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sandboxRunningId, setSandboxRunningId] = useState<string | null>(null);
  const [sandboxOutputs, setSandboxOutputs] = useState<{ [id: string]: string }>({});

  const languages: { id: CodeLanguage | 'all'; label: string }[] = [
    { id: 'all', label: 'All Languages' },
    { id: 'sql', label: 'SQL (Postgres)' },
    { id: 'docker', label: 'Docker' },
    { id: 'bash', label: 'Bash / Linux' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'k8s', label: 'Kubernetes (K8s)' }
  ];

  const filteredSnippets = snippets.filter((s) => {
    const matchesLang = selectedLang === 'all' || s.language === selectedLang;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLang && matchesSearch;
  });

  const handleCopy = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    incrementSnippetCopy(snippet.id);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSandbox = (snippet: CodeSnippet) => {
    setSandboxRunningId(snippet.id);
    setTimeout(() => {
      setSandboxOutputs(prev => ({
        ...prev,
        [snippet.id]: snippet.outputExample || `[SANDBOX EXIT 0] Command executed successfully in ephemeral container isolation.`
      }));
      setSandboxRunningId(null);
    }, 800);
  };

  const handleClearSandbox = (id: string) => {
    setSandboxOutputs(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Developer Code & Command Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated repository of tested SQL diagnostic scripts, Docker runbooks, and Kubernetes incident commands.
          </p>
        </div>

        <button
          onClick={() => setAddSnippetModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-semibold text-xs shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Custom Snippet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by script title, keyword, database, or tag..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLang(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedLang === l.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SNIPPETS LIST */}
      <div className="space-y-5">
        {filteredSnippets.map((snippet) => {
          const isCopied = copiedId === snippet.id;
          const isRunning = sandboxRunningId === snippet.id;
          const sandboxOutput = sandboxOutputs[snippet.id];

          return (
            <div
              key={snippet.id}
              className="rounded-2xl glass-panel border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              {/* Header Bar */}
              <div className="p-4 bg-[#05070F]/70 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {snippet.language}
                    </span>
                    <span className="text-xs text-slate-400">· {snippet.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{snippet.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{snippet.description}</p>
                </div>

                {/* Actions: Copy & Run in Sandbox */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRunSandbox(snippet)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-medium transition-colors"
                    title="Simulate execution in sandbox"
                  >
                    <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Running...' : 'Run in Sandbox'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(snippet)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] font-mono text-slate-500 pl-1">
                    {snippet.copyCount} copies
                  </span>
                </div>
              </div>

              {/* Code Editor / Syntax Viewer Box */}
              <div className="p-4 bg-[#030408] font-mono text-xs overflow-x-auto text-cyan-300 leading-relaxed border-b border-white/5">
                <pre>
                  <code>{snippet.code}</code>
                </pre>
              </div>

              {/* Sandbox Terminal Output (if simulated) */}
              {sandboxOutput && (
                <div className="p-4 bg-[#080B14] border-b border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Sandbox Output (Docker Container Isolation)</span>
                    </span>
                    <button
                      onClick={() => handleClearSandbox(snippet.id)}
                      className="text-slate-500 hover:text-slate-300 text-[10px]"
                    >
                      Clear Output
                    </button>
                  </div>
                  <pre className="text-slate-300 p-2.5 rounded-lg bg-black/40 border border-white/5 whitespace-pre-wrap">
                    <code>{sandboxOutput}</code>
                  </pre>
                </div>
              )}

              {/* Tags footer */}
              <div className="px-4 py-2 bg-[#05070F]/40 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                <Tag className="w-3 h-3 text-slate-500" />
                {snippet.tags.map((t, idx) => (
                  <span key={idx} className="hover:text-cyan-400 transition-colors">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSnippets.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-slate-400 space-y-2">
          <p className="text-sm">No code snippets found matching the search criteria.</p>
          <button
            onClick={() => {
              setSelectedLang('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 underline"
          >
            Clear snippet filter
          </button>
        </div>
      )}
    </div>
  );
};
