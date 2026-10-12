import React from 'react';
import { useApp } from '../context/AppContext';
import { HealthTimeline } from '../components/dashboard/HealthTimeline';
import {
  AlertTriangle,
  Server,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
  RotateCw,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Database,
  Lock,
  Boxes,
  Zap,
  Play
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    tickets,
    assets,
    services,
    activity,
    refreshSystemPings,
    navigateTo,
    openDiagnostic,
    setLogIncidentModalOpen
  } = useApp();

  const activeTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;
  const criticalTicketsCount = tickets.filter(t => t.severity === 'Critical' && t.status !== 'Resolved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP SYSTEM STATUS BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#05070F] via-[#0D152A] to-[#080B16] p-5 shadow-[0_0_30px_rgba(0,242,254,0.12)]">
        <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  All Primary Clusters Operational <span className="text-cyan-400 font-mono">· 99.98% SLO Uptime</span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-region telemetry synched across AWS us-east-1, Cloudflare Edge, and Kubernetes fleet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={refreshSystemPings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 hover:text-white transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping All Probes</span>
            </button>
            <button
              onClick={() => navigateTo('incidents')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-medium text-cyan-300 transition-colors"
            >
              <span>View Triage Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => navigateTo('incidents')}
          className="cursor-pointer glass-panel p-4 rounded-2xl hover:border-cyan-500/40 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{activeTicketsCount}</span>
            <span className="text-xs text-rose-400 font-medium">({criticalTicketsCount} P1 Critical)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>SLA clock running</span>
            <span className="text-cyan-400 group-hover:underline flex items-center">
              Triage <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => navigateTo('assets')}
          className="cursor-pointer glass-panel p-4 rounded-2xl hover:border-cyan-500/40 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Assets Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{assets.length}</span>
            <span className="text-xs text-slate-400">nodes in catalog</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Multi-cloud & physical</span>
            <span className="text-cyan-400 group-hover:underline flex items-center">
              Inventory <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">SLA Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">98.6%</span>
            <span className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>30-day target: &gt;98.0%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Resolution Time</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">11</span>
            <span className="text-xs text-slate-400">mins MTTR</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>-4.2 mins vs previous sprint</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SYSTEM HEALTH GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Interactive Infrastructure Health Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">Live heartbeat telemetry and container resource utilization</p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Auto-refreshed: 2s interval</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((svc) => {
            const isDegraded = svc.status === 'degraded';
            const iconMap: Record<string, any> = {
              'svc-prod-db': Database,
              'svc-auth': Lock,
              'svc-redis': Zap,
              'svc-k8s-fleet': Boxes
            };
            const SvcIcon = iconMap[svc.id] || Server;

            return (
              <div
                key={svc.id}
                className={`p-4 rounded-2xl glass-panel transition-all duration-200 border ${
                  isDegraded ? 'border-amber-500/50 laser-border-amber' : 'hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDegraded
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      }`}
                    >
                      <SvcIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white truncate max-w-[140px]">{svc.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{svc.region}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isDegraded
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 font-medium'
                    }`}
                  >
                    {isDegraded ? 'DEGRADED' : 'NOMINAL'}
                  </span>
                </div>

                {/* Telemetry rows */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">CPU Workload</span>
                      <span className="font-mono text-slate-200 tabular-nums">{svc.cpuPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${svc.cpuPercent > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                        style={{ width: `${svc.cpuPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Memory Allocation</span>
                      <span className="font-mono text-slate-200 tabular-nums">{svc.memoryPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${svc.memoryPercent > 85 ? 'bg-rose-400' : 'bg-violet-400'}`}
                        style={{ width: `${svc.memoryPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5">
                    <span className="text-slate-400">Ping Latency:</span>
                    <span className="font-mono text-cyan-300">{svc.latencyMs}ms</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => {
                      const matched = assets.find(a => a.name.toLowerCase().includes(svc.name.toLowerCase().split(' ')[0]));
                      if (matched) {
                        openDiagnostic(matched);
                      } else {
                        openDiagnostic(assets[0]);
                      }
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Health Diagnostic</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SPLIT ROW: RECENT INCIDENT HIGHLIGHTS & ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Incident Watchlist */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Active Incident War Room Watchlist</h2>
              <p className="text-xs text-slate-400">Real-time tickets currently under engineer triage</p>
            </div>
            <button
              onClick={() => navigateTo('incidents')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              All Tickets ({tickets.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {tickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => navigateTo('incidents')}
                className="cursor-pointer p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 text-xs font-semibold">{t.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        t.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : t.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {t.severity}
                    </span>
                    <span className="text-[11px] text-slate-400">· {t.service}</span>
                  </div>
                  <h4 className="text-xs font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {t.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={t.assignee.avatar}
                      alt={t.assignee.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400/40"
                    />
                    <span className="text-slate-300 text-[11px]">{t.assignee.name.split(' ')[0]}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 font-mono">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Need to log an emergency outage?</span>
            <button
              onClick={() => setLogIncidentModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors"
            >
              + Declare Incident
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Feed */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Operations Audit Log</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 text-xs">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover mt-0.5 ring-1 ring-white/10 shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-slate-300 leading-snug">
                    <span className="font-semibold text-white">{item.user.name}</span>{' '}
                    <span className="text-slate-400">{item.action}</span>{' '}
                    <span className="text-cyan-300 font-medium">{item.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono block">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. VERTICAL STATUS TIMELINE: HISTORICAL HEALTH EVENTS & AUTOMATED RECOVERY LOGS */}
      <HealthTimeline />

      {/* 6. DATACENTER SCHEMATIC BANNER */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 h-44 group">
        <img
          src="/src/assets/images/server_datacenter_mesh_1791782984072.jpg"
          alt="Enterprise Data Center Infrastructure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070F] via-[#05070F]/70 to-transparent flex items-center p-6 sm:p-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              Enterprise Global Topology
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Ashburn Primary & Frankfurt Backup Node Mesh</h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              All 128 production nodes connected via redundant 100GbE fiber trunk. Automated failover ready.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => navigateTo('assets')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10"
              >
                Inspect All 128 Nodes
              </button>
              <button
                onClick={() => navigateTo('vault')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30"
              >
                Open Command Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
