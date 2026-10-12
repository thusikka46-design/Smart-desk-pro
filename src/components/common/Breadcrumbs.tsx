import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';
import { PageId } from '../../types';

export const Breadcrumbs: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  const { currentPage, navigateTo } = useApp();

  const pageNames: Record<PageId, string> = {
    dashboard: 'System Overview',
    incidents: 'Incident & Ticket Hub',
    assets: 'IT Asset Management',
    vault: 'Developer Code & Command Vault',
    docs: 'Knowledge Base & Runbooks',
    'ai-hub': 'AI Diagnostic & Support Hub'
  };

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 py-3 select-none" aria-label="Breadcrumb">
      <button
        onClick={() => navigateTo('dashboard')}
        className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-500" />
        <span>SmartDesk</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      <button
        onClick={() => navigateTo(currentPage)}
        className={`hover:text-cyan-400 transition-colors ${!subtitle ? 'text-cyan-300 font-medium' : 'text-slate-400'}`}
      >
        {pageNames[currentPage]}
      </button>

      {subtitle && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-cyan-300 font-medium truncate max-w-xs">{subtitle}</span>
        </>
      )}
    </nav>
  );
};
