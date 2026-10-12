import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  PlusCircle,
  Table as TableIcon,
  LayoutGrid,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { IncidentStatus, IncidentSeverity, Department, Ticket } from '../types';

export const IncidentsPage: React.FC = () => {
  const {
    tickets,
    setLogIncidentModalOpen,
    updateTicketStatus,
    updateTicketSeverity,
    addTicketComment
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [newCommentText, setNewCommentText] = useState<{ [ticketId: string]: string }>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'All' || t.severity === selectedSeverity;
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;

    return matchesSearch && matchesStatus && matchesSeverity && matchesDept;
  });

  const toggleExpand = (id: string) => {
    setExpandedTicketId(prev => (prev === id ? null : id));
  };

  const handleAddComment = (ticketId: string, e: React.FormEvent) => {
    e.preventDefault();
    const comment = newCommentText[ticketId]?.trim();
    if (!comment) return;
    addTicketComment(ticketId, comment);
    setNewCommentText(prev => ({ ...prev, [ticketId]: '' }));
  };

  const copySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const statuses: (IncidentStatus | 'All')[] = ['All', 'Open', 'In Progress', 'Pending Review', 'Resolved'];
  const severities: (IncidentSeverity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const departments: (Department | 'All')[] = ['All', 'Infrastructure', 'Frontend', 'DevOps', 'Security', 'Database'];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Incident & Ticket Operations Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time SRE incident management, SLA breach monitors, and automated postmortem tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setLogIncidentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-semibold text-xs shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Log New Incident</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by INC-XXXX ID, title, affected service, or engineer..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Department dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 bg-[#05070F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/50"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status & Severity Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 mr-1 text-[11px]">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-slate-400 mr-1 text-[11px]">Severity:</span>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedSeverity === sev
                    ? sev === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                      : sev === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TICKETS LIST / TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#05070F]/80 text-slate-400 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Summary & Service</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">SLA Clock</th>
                  <th className="py-3 px-4 text-right">Expand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTickets.map((t) => {
                  const isExpanded = expandedTicketId === t.id;
                  return (
                    <React.Fragment key={t.id}>
                      <tr
                        onClick={() => toggleExpand(t.id)}
                        className={`cursor-pointer hover:bg-white/5 transition-colors ${
                          isExpanded ? 'bg-cyan-500/5' : ''
                        }`}
                      >
                        {/* ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-400 whitespace-nowrap">
                          {t.id}
                        </td>

                        {/* Title & Service */}
                        <td className="py-3 px-4 max-w-sm">
                          <p className="font-semibold text-white truncate">{t.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{t.service} · {t.department}</p>
                        </td>

                        {/* Severity */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                              t.severity === 'Critical'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : t.severity === 'High'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : t.severity === 'Medium'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-slate-500/20 text-slate-300'
                            }`}
                          >
                            {t.severity}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              t.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : t.status === 'In Progress'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : t.status === 'Pending Review'
                                ? 'bg-violet-500/20 text-violet-300'
                                : 'bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        {/* Assignee */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={t.assignee.avatar}
                              alt={t.assignee.name}
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
                            />
                            <span className="text-slate-300 text-xs">{t.assignee.name}</span>
                          </div>
                        </td>

                        {/* SLA Clock */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono">
                          {t.status === 'Resolved' ? (
                            <span className="text-emerald-400">RESOLVED</span>
                          ) : t.slaDueMinutes > 0 ? (
                            <span
                              className={`flex items-center gap-1 ${
                                t.slaDueMinutes < 30 ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-300'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>{t.slaDueMinutes}m remaining</span>
                            </span>
                          ) : (
                            <span className="text-rose-500 font-bold">BREACHED</span>
                          )}
                        </td>

                        {/* Expand toggle */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(t.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* EXPANDED DETAILS ACCORDION ROW */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-[#05070F]/90 border-b border-white/10">
                            <div className="p-5 space-y-4 text-xs">
                              {/* Top Bar inside expanded drawer */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-400">Update Status:</span>
                                  <select
                                    value={t.status}
                                    onChange={(e) => updateTicketStatus(t.id, e.target.value as IncidentStatus)}
                                    className="px-2.5 py-1 rounded-lg bg-[#0D111D] border border-cyan-500/40 text-cyan-300 font-medium focus:outline-none"
                                  >
                                    {statuses.filter(s => s !== 'All').map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>

                                  <span className="text-slate-400 ml-2">Severity:</span>
                                  <select
                                    value={t.severity}
                                    onChange={(e) => updateTicketSeverity(t.id, e.target.value as IncidentSeverity)}
                                    className="px-2.5 py-1 rounded-lg bg-[#0D111D] border border-white/10 text-white focus:outline-none"
                                  >
                                    {severities.filter(s => s !== 'All').map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="text-[11px] text-slate-400 font-mono">
                                  Created: {t.createdAt} · Updated: {t.updatedAt}
                                </div>
                              </div>

                              {/* Description & Impact */}
                              <div>
                                <h4 className="text-slate-400 font-semibold mb-1 uppercase text-[10px] tracking-wider">
                                  Description & Outage Scope
                                </h4>
                                <p className="text-slate-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                                  {t.description}
                                </p>
                              </div>

                              {/* Attached Snippet/Log */}
                              {t.snippet && (
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-cyan-400 font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                      <Terminal className="w-3.5 h-3.5" />
                                      <span>Attached Diagnostic Trace / Log Output</span>
                                    </h4>
                                    <button
                                      onClick={() => copySnippet(t.snippet!, t.id)}
                                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                      {copiedSnippetId === t.id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Copy Log</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3 rounded-xl bg-[#030408] border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                                    <code>{t.snippet}</code>
                                  </pre>
                                </div>
                              )}

                              {/* Comments Timeline */}
                              <div className="pt-2">
                                <h4 className="text-slate-400 font-semibold mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Incident Responder War Room Notes ({t.comments.length})</span>
                                </h4>

                                <div className="space-y-2 mb-3">
                                  {t.comments.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No comments recorded yet. Add initial triage findings below.</p>
                                  ) : (
                                    t.comments.map((c) => (
                                      <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                                        <img
                                          src={c.avatar}
                                          alt={c.author}
                                          referrerPolicy="no-referrer"
                                          className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400/40 shrink-0"
                                        />
                                        <div className="space-y-0.5 flex-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">{c.author} ({c.role})</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{c.createdAt}</span>
                                          </div>
                                          <p className="text-slate-300 leading-relaxed">{c.content}</p>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Add comment input */}
                                <form onSubmit={(e) => handleAddComment(t.id, e)} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newCommentText[t.id] || ''}
                                    onChange={(e) => setNewCommentText({ ...newCommentText, [t.id]: e.target.value })}
                                    placeholder="Add triage note, PR link, or resolution update..."
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!newCommentText[t.id]?.trim()}
                                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold disabled:opacity-40 flex items-center gap-1.5 transition-all"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Post Note</span>
                                  </button>
                                </form>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl glass-panel border hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-semibold">{t.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                      t.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {t.severity}
                  </span>
                </div>

                <h3 className="font-semibold text-white leading-snug">{t.title}</h3>
                <p className="text-xs text-slate-400">{t.service} · {t.department}</p>
                <p className="text-xs text-slate-300 line-clamp-2 bg-white/5 p-2 rounded-lg">{t.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={t.assignee.avatar}
                    alt={t.assignee.name}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400/40"
                  />
                  <span className="text-slate-300 text-[11px]">{t.assignee.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-cyan-300">{t.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-slate-400 space-y-2">
          <p className="text-sm">No incidents found matching the filter criteria.</p>
          <button
            onClick={() => {
              setSelectedStatus('All');
              setSelectedSeverity('All');
              setSelectedDept('All');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
