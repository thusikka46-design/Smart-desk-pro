import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertCircle, Terminal, User, Building, ShieldAlert } from 'lucide-react';
import { IncidentSeverity, Department } from '../../types';

export const LogIncidentModal: React.FC = () => {
  const {
    logIncidentModalOpen,
    setLogIncidentModalOpen,
    addTicket,
    prefilledIncidentData,
    currentUser
  } = useApp();

  const [title, setTitle] = useState('');
  const [service, setService] = useState('Redis Sentinel Cluster');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P2');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [department, setDepartment] = useState<Department>('Infrastructure');
  const [description, setDescription] = useState('');
  const [snippet, setSnippet] = useState('');
  const [assigneeName, setAssigneeName] = useState(currentUser.name);

  useEffect(() => {
    if (prefilledIncidentData) {
      if (prefilledIncidentData.title) setTitle(prefilledIncidentData.title);
      if (prefilledIncidentData.service) setService(prefilledIncidentData.service);
      if (prefilledIncidentData.priority) setPriority(prefilledIncidentData.priority);
      if (prefilledIncidentData.severity) setSeverity(prefilledIncidentData.severity);
      if (prefilledIncidentData.description) setDescription(prefilledIncidentData.description);
    }
  }, [prefilledIncidentData]);

  if (!logIncidentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addTicket({
      title,
      service,
      priority,
      severity,
      department,
      description,
      snippet: snippet.trim() ? snippet : undefined,
      assigneeName
    });

    setLogIncidentModalOpen(false);
    setTitle('');
    setDescription('');
    setSnippet('');
  };

  const servicesList = [
    'PostgreSQL Primary (us-east-1)',
    'Auth0 / Okta Federation Gateway',
    'Redis Sentinel Cluster (Cache/Session)',
    'EKS Kubernetes Production Fleet',
    'Cloudflare Edge CDN',
    'Kafka Event Streaming Bus'
  ];

  const departments: Department[] = ['Infrastructure', 'Frontend', 'DevOps', 'Security', 'Database'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-xl bg-[#0D111D] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070F]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Declare & Log Production Incident</h2>
              <p className="text-[11px] text-slate-400 font-mono">SLA monitoring and SRE on-call dispatch</p>
            </div>
          </div>
          <button
            onClick={() => setLogIncidentModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Incident Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Incident Summary / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Redis Shard Memory Exhaustion in US-East-1"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Service & Department row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Service Impacted</span>
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 bg-[#05070F] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              >
                {servicesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Department</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 bg-[#05070F] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Severity Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Priority Level</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
                {(['P1', 'P2', 'P3', 'P4'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1 rounded-lg text-center font-mono font-medium transition-colors ${
                      priority === p
                        ? p === 'P1'
                          ? 'bg-rose-500 text-white font-bold'
                          : p === 'P2'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Severity Badge</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-1 rounded-lg text-center text-[10px] font-medium transition-colors ${
                      severity === s
                        ? s === 'Critical'
                          ? 'bg-rose-500 text-white font-semibold'
                          : s === 'High'
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-blue-500 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Incident Description & Impact <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, error rates, customer blast radius, and initial observations..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Code/Log Snippet */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attach Error Log or Terminal Output (Optional)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Plaintext / JSON</span>
            </label>
            <textarea
              rows={3}
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="Paste curl response, stack trace, or kubectl describe output..."
              className="w-full font-mono text-[11px] px-3 py-2 bg-[#05070F] border border-white/10 rounded-xl text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Incident Commander / Lead Assignee</span>
            </label>
            <input
              type="text"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setLogIncidentModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-95 transition-opacity"
            >
              Dispatch Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
