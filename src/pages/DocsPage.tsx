import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Shield,
  Layers,
  Terminal,
  HelpCircle,
  ThumbsUp,
  AlertTriangle,
  Copy,
  Check,
  ChevronRight,
  Clock,
  User,
  ArrowLeft
} from 'lucide-react';
import { DocCategory, DocArticle } from '../types';

export const DocsPage: React.FC = () => {
  const { docs, activeDocArticle, setActiveDocArticle, markDocHelpful } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<DocCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const categories: { name: DocCategory | 'All'; icon: any; desc: string }[] = [
    { name: 'All', icon: BookOpen, desc: 'All documentation categories' },
    { name: 'Troubleshooting Runbooks', icon: Terminal, desc: 'P1 outage triage & remediation matrices' },
    { name: 'Security Protocols', icon: Shield, desc: 'Zero trust bastions & key rotation guidelines' },
    { name: 'Onboarding Guides', icon: User, desc: 'Developer toolchains & workstation setup' },
    { name: 'API Integration Docs', icon: Layers, desc: 'Ingress gateways, mTLS & rate limiting' }
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.steps.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Knowledge Base & Incident Runbooks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Peer-reviewed engineering playbooks, architecture diagrams, and emergency failover protocols.
          </p>
        </div>

        {activeDocArticle && (
          <button
            onClick={() => setActiveDocArticle(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </button>
        )}
      </div>

      {/* If an article is currently open in full reader mode */}
      {activeDocArticle ? (
        <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                {activeDocArticle.category}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activeDocArticle.readTime}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight">{activeDocArticle.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{activeDocArticle.summary}</p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
              <span>Author: {activeDocArticle.author}</span>
              <span>Last Audited: {activeDocArticle.lastUpdated}</span>
            </div>
          </div>

          {/* Warnings Section (Constitutional design: subtle all-around hairline border, no thick left bar) */}
          {activeDocArticle.warnings && activeDocArticle.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Strict Protocol Safeguards</span>
              </div>
              <ul className="list-disc list-inside space-y-1 opacity-90 pl-1">
                {activeDocArticle.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-step instructions */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Standard Operating Procedure
            </h3>

            <div className="space-y-4">
              {activeDocArticle.steps.map((st) => (
                <div key={st.step} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">
                      {st.step}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{st.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-8">{st.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippets */}
          {activeDocArticle.codeSnippets && activeDocArticle.codeSnippets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Verified Verification Commands
              </h3>
              {activeDocArticle.codeSnippets.map((cs, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-[#030408]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[11px] text-slate-400 font-mono">
                    <span className="uppercase">{cs.lang}</span>
                    <button
                      onClick={() => handleCopyCode(cs.code, idx)}
                      className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                    >
                      {copiedCodeIndex === idx ? (
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
                  <pre className="p-3 text-xs font-mono text-cyan-300 overflow-x-auto">
                    <code>{cs.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Helpful Feedback Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Did this documentation assist your incident triage?</span>
            <button
              onClick={() => markDocHelpful(activeDocArticle.id)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Mark Helpful ({activeDocArticle.helpfulCount})</span>
            </button>
          </div>
        </div>
      ) : (
        /* OVERVIEW GRID VIEW */
        <>
          {/* Category Cards Carousel / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.filter(c => c.name !== 'All').map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                  className={`cursor-pointer p-4 rounded-2xl glass-panel border transition-all duration-200 ${
                    isSelected ? 'border-cyan-400 laser-border-cyan' : 'hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2.5">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white">{cat.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all runbooks, SLA escalation procedures, and onboarding guides..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Articles list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDocArticle(doc)}
                className="cursor-pointer p-5 rounded-2xl glass-panel border hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">
                      {doc.category}
                    </span>
                    <span>{doc.readTime}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-mono">By {doc.author}</span>
                  <div className="flex items-center gap-1 text-cyan-400 group-hover:underline font-medium">
                    <span>Read Runbook</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-slate-400">
              <p className="text-sm">No documentation articles match "{searchQuery}".</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
