import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  Activity,
  AlertTriangle,
  Server,
  Code2,
  BookOpen,
  Bot,
  Zap,
  Terminal,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    tickets,
    assets,
    snippets,
    docs,
    setQuickAiOpen,
    quickAiOpen,
    currentUser,
    currentUserRole
  } = useApp();

  const activeTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const navItems: { id: PageId; label: string; icon: any; count?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'System Overview', icon: Activity },
    {
      id: 'incidents',
      label: 'Incident Hub',
      icon: AlertTriangle,
      count: activeTicketsCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'assets',
      label: 'IT Asset Inventory',
      icon: Server,
      count: assets.length,
      badgeColor: 'bg-cyan-500/20 text-cyan-300'
    },
    {
      id: 'vault',
      label: 'Code & Command Vault',
      icon: Code2,
      count: snippets.length,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'docs',
      label: 'Knowledge Base',
      icon: BookOpen,
      count: docs.length,
      badgeColor: 'bg-violet-500/20 text-violet-300'
    },
    {
      id: 'ai-hub',
      label: 'AI Diagnostic Hub',
      icon: Bot,
      count: 'AI Live',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 animate-pulse font-mono'
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 bg-[#05070F]/90 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 justify-between">
      {/* Upper Navigation Rail */}
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Operations Navigation
          </div>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.15)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComp
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      item.badgeColor || 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Diagnostic Card in Sidebar */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-[#0D152A] to-[#080B16] border border-cyan-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between text-cyan-300 font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>SLA Target: 99.98%</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            All primary availability zones (us-east-1, eu-central-1) reporting healthy latency.
          </p>
          <button
            onClick={() => setQuickAiOpen(true)}
            className="w-full mt-1 py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-medium text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch Copilot</span>
          </button>
        </div>
      </div>

      {/* Footer User Profile Card */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-400/50"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-cyan-400 font-mono truncate">{currentUserRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
