import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthEventType, HealthTimelineEvent } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Boxes,
  RefreshCw,
  Wrench,
  Clock,
  Terminal,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Play,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const HealthTimeline: React.FC = () => {
  const { healthEvents, simulateHealthRecovery } = useApp();

  const [selectedType, setSelectedType] = useState<HealthEventType | 'all'>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(healthEvents[0]?.id || null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [exportFeedback, setExportFeedback] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Filtering
  const filteredEvents = healthEvents.filter((evt) => {
    const matchesType = selectedType === 'all' || evt.type === selectedType;
    const matchesService = selectedService === 'all' || evt.serviceId === selectedService || evt.serviceName.toLowerCase().includes(selectedService.toLowerCase());
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.rootCauseTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesService && matchesSearch;
  });

  const getEventIcon = (type: HealthEventType) => {
    switch (type) {
      case 'recovered':
        return ShieldCheck;
      case 'autoscaled':
        return Boxes;
      case 'degraded':
        return AlertTriangle;
      case 'failover':
        return RefreshCw;
      case 'maintenance':
        return Wrench;
      default:
        return Zap;
    }
  };

  const getEventStyles = (type: HealthEventType) => {
    switch (type) {
      case 'recovered':
        return {
          iconColor: 'text-emerald-400',
          bgBorder: 'bg-emerald-500/10 border-emerald-500/30',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
          badgeText: 'text-emerald-400'
        };
      case 'autoscaled':
        return {
          iconColor: 'text-cyan-400',
          bgBorder: 'bg-cyan-500/10 border-cyan-500/30',
          glow: 'shadow-[0_0_12px_rgba(0,242,254,0.25)]',
          badgeText: 'text-cyan-400'
        };
      case 'degraded':
        return {
          iconColor: 'text-amber-400',
          bgBorder: 'bg-amber-500/10 border-amber-500/30',
          glow: 'shadow-[0_0_12px_rgba(255,183,3,0.25)]',
          badgeText: 'text-amber-400'
        };
      case 'failover':
        return {
          iconColor: 'text-violet-400',
          bgBorder: 'bg-violet-500/10 border-violet-500/30',
          glow: 'shadow-[0_0_12px_rgba(121,40,202,0.25)]',
          badgeText: 'text-violet-400'
        };
      case 'maintenance':
        return {
          iconColor: 'text-blue-400',
          bgBorder: 'bg-blue-500/10 border-blue-500/30',
          glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
          badgeText: 'text-blue-400'
        };
      default:
        return {
          iconColor: 'text-cyan-400',
          bgBorder: 'bg-cyan-500/10 border-cyan-500/30',
          glow: '',
          badgeText: 'text-cyan-400'
        };
    }
  };

  const copyScript = (script: string, id: string) => {
    navigator.clipboard.writeText(script);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    simulateHealthRecovery();
    setTimeout(() => {
      setIsSimulating(false);
      // expand the newest event
      if (healthEvents[0]) {
        setExpandedEventId(healthEvents[0].id);
      }
    }, 400);
  };

  const handleExportAuditLog = () => {
    const dataStr = JSON.stringify(healthEvents, null, 2);
    navigator.clipboard.writeText(dataStr);
    setExportFeedback(true);
    setTimeout(() => setExportFeedback(false), 2500);
  };

  const eventTypes: { id: HealthEventType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Events' },
    { id: 'recovered', label: 'Auto-Recovered' },
    { id: 'autoscaled', label: 'Autoscaled' },
    { id: 'degraded', label: 'Degraded' },
    { id: 'failover', label: 'Failovers' },
    { id: 'maintenance', label: 'Maintenance' }
  ];

  const servicesList = [
    { id: 'all', label: 'All Core Services' },
    { id: 'svc-prod-db', label: 'PostgreSQL Primary' },
    { id: 'svc-redis', label: 'Redis Sentinel' },
    { id: 'svc-k8s-fleet', label: 'EKS Kubernetes Fleet' },
    { id: 'svc-auth', label: 'Auth0 Gateway' },
    { id: 'svc-cloudflare', label: 'Cloudflare Edge CDN' }
  ];

  const totalAutoRecovered = healthEvents.filter(e => e.type === 'recovered' || e.type === 'autoscaled').length;
  const avgDuration = Math.round(
    healthEvents.reduce((acc, curr) => acc + curr.durationSeconds, 0) / (healthEvents.length || 1)
  );

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/25 shadow-[0_0_35px_rgba(0,242,254,0.08)] space-y-6">
      {/* Header and Telemetry Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Infrastructure Health History & Auto-Recovery Timeline</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE SRE AGENT ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous self-healing logs, circuit-breaker trips, and HPA elastic scale events across production clusters.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons: Simulate Recovery + Export Audit Log */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all active:scale-95 disabled:opacity-50"
            title="Simulate a real-time automated infrastructure self-healing event"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Healing Node...' : 'Simulate Recovery Event'}</span>
          </button>

          <button
            onClick={handleExportAuditLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors"
            title="Copy entire historical event log as structured JSON"
          >
            {exportFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Audit Copied</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Audit Log</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* High-level KPI Mini Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
            Automated Recoveries
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {totalAutoRecovered} / {healthEvents.length}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">(100% Zero-Touch)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
            Mean Healing Latency
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono text-cyan-300 tabular-nums">{avgDuration}s</span>
            <span className="text-[11px] text-emerald-400 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -14s vs avg
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
            Target Service Coverage
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono text-white tabular-nums">5 Core Services</span>
            <span className="text-[11px] text-slate-400">AWS + Cloudflare</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
            Data Loss Incidents
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">0</span>
            <span className="text-[11px] text-emerald-400">RPO = 0s Verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search health events by title, root cause (e.g. WAL Lag, Memory Pressure), or service..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Service Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Service:</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-2.5 py-1.5 bg-[#05070F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/50"
            >
              {servicesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Segmented Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* VERTICAL STATUS TIMELINE */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-400/60 before:via-violet-500/40 before:to-transparent">
        {filteredEvents.map((evt, index) => {
          const isExpanded = expandedEventId === evt.id;
          const EventIcon = getEventIcon(evt.type);
          const styles = getEventStyles(evt.type);

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Tree Node Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border flex items-center justify-center bg-[#05070F] z-10 transition-transform duration-200 group-hover:scale-110 ${styles.bgBorder} ${styles.glow}`}
              >
                <EventIcon className={`w-3.5 h-3.5 ${styles.iconColor}`} />
              </div>

              {/* Event Card Container */}
              <div
                onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 bg-white/5 hover:bg-white/[0.08] ${
                  isExpanded ? 'border-cyan-500/50 laser-border-cyan' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Event Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1 min-w-0">
                    {/* Unboxed Metadata (zero-pill discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-cyan-400 font-semibold">{evt.serviceName}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">{evt.region}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">{evt.exactTime}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-300 leading-relaxed pt-0.5 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  {/* Right Metadata: Time ago, Trigger, Duration, Expand */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1.5 shrink-0 text-xs">
                    <span className="font-mono text-slate-400 text-[11px]">{evt.timestamp}</span>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono uppercase font-semibold ${styles.badgeText}`}>
                        {evt.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({evt.durationSeconds}s)</span>
                      <button className="p-1 text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED AUTOMATED RECOVERY LOG DRAWER */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 pt-4 border-t border-white/10 space-y-4 text-xs"
                  >
                    {/* Metrics Before vs After Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Pre-Incident Telemetry Anomaly</span>
                        </span>
                        <p className="font-mono text-xs text-rose-200 tabular-nums">
                          {evt.metricsBefore || 'Elevated anomaly rate detected'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Post-Recovery Normalized State</span>
                        </span>
                        <p className="font-mono text-xs text-emerald-200 tabular-nums">
                          {evt.metricsAfter || 'Nominal health metrics restored'}
                        </p>
                      </div>
                    </div>

                    {/* Trigger Mechanism and Classification */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Trigger Mechanism:</span>
                        <span className="font-medium text-cyan-300">{evt.triggerMechanism}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Root Cause Vector:</span>
                        <span className="font-mono text-slate-200">{evt.rootCauseTag}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Healing Latency:</span>
                        <span className="font-mono text-emerald-400 font-semibold">{evt.durationSeconds} seconds</span>
                      </div>
                    </div>

                    {/* Automated Remediation Script executed */}
                    {evt.automatedRemediationScript && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Automated Remediation Script Executed</span>
                          </span>
                          <button
                            onClick={() => copyScript(evt.automatedRemediationScript!, evt.id)}
                            className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition-colors"
                          >
                            {copiedScriptId === evt.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Script</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-xl bg-[#030408] border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                          <code>{evt.automatedRemediationScript}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-10 rounded-xl bg-white/5 border border-white/5 text-slate-400 space-y-2">
          <p className="text-xs">No historical health events matched the current filter.</p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedService('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 underline"
          >
            Reset timeline filters
          </button>
        </div>
      )}
    </div>
  );
};
