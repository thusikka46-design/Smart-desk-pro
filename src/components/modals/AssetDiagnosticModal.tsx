import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, RotateCw, CheckCircle, AlertTriangle, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const AssetDiagnosticModal: React.FC = () => {
  const {
    diagnosticModalOpen,
    setDiagnosticModalOpen,
    activeDiagnosticAsset,
    openReportFault,
    sendAiMessage,
    setQuickAiOpen
  } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<'idle' | 'nominal' | 'warning'>('idle');

  useEffect(() => {
    if (diagnosticModalOpen && activeDiagnosticAsset) {
      runDiagnosticRoutine();
    } else {
      setProgress(0);
      setLogs([]);
      setDiagnosticResult('idle');
    }
  }, [diagnosticModalOpen, activeDiagnosticAsset]);

  if (!diagnosticModalOpen || !activeDiagnosticAsset) return null;

  const runDiagnosticRoutine = () => {
    setIsRunning(true);
    setProgress(10);
    setDiagnosticResult('idle');
    setLogs([
      `[${new Date().toISOString()}] Initializing SmartDesk SRE Diagnostic Probe v4.2...`,
      `[PROBE] Target: ${activeDiagnosticAsset.name} (${activeDiagnosticAsset.ip})`,
      `[NETWORK] Dispatching ICMP keepalive ping to node interface...`
    ]);

    setTimeout(() => {
      setProgress(35);
      setLogs(prev => [
        ...prev,
        `[NETWORK] Round-trip latency: ${activeDiagnosticAsset.latencyMs}ms (Jitter: ±0.4ms)`,
        `[SECURITY] TLS/mTLS cipher suite verification: TLS 1.3 (ECDHE-RSA-AES256-GCM-SHA384) [VALID]`
      ]);
    }, 600);

    setTimeout(() => {
      setProgress(70);
      setLogs(prev => [
        ...prev,
        `[SYSTEM] Probing kernel cgroups & CPU utilization: ${activeDiagnosticAsset.loadPercent}% active`,
        `[MEMORY] Inspecting resident set size (RSS) & slab allocator memory tables...`
      ]);
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      setIsRunning(false);
      const isDegraded = activeDiagnosticAsset.healthStatus === 'Degraded' || activeDiagnosticAsset.loadPercent > 80;
      setDiagnosticResult(isDegraded ? 'warning' : 'nominal');

      if (isDegraded) {
        setLogs(prev => [
          ...prev,
          `[ALERT] High memory saturation detected (${activeDiagnosticAsset.loadPercent}% load). Eviction threshold warning active.`,
          `[DIAGNOSTIC COMPLETE] Result: DEGRADED PERFORMANCE. Recommendation: Run heap dump analysis.`
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          `[OK] All kernel threads responsive. Disk I/O ops: 2,410 IOPS. No zombie processes detected.`,
          `[DIAGNOSTIC COMPLETE] Result: ALL SYSTEMS NOMINAL (99.98% SLO verified).`
        ]);
      }
    }, 1800);
  };

  const handleAskAiAboutAsset = () => {
    setDiagnosticModalOpen(false);
    sendAiMessage(`Analyze diagnostic telemetry for ${activeDiagnosticAsset.name} (IP: ${activeDiagnosticAsset.ip}, Load: ${activeDiagnosticAsset.loadPercent}%, Latency: ${activeDiagnosticAsset.latencyMs}ms)`);
    setQuickAiOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-[#0D111D] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070F]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Live Node Diagnostic Probe</h2>
                <span className="font-mono text-[11px] text-cyan-400">({activeDiagnosticAsset.id})</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{activeDiagnosticAsset.name}</p>
            </div>
          </div>
          <button
            onClick={() => setDiagnosticModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Asset Telemetry Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">IP Address</span>
              <span className="font-mono text-cyan-300 font-medium">{activeDiagnosticAsset.ip}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Roundtrip Latency</span>
              <span className="font-mono text-slate-200 font-medium">{activeDiagnosticAsset.latencyMs} ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Workload Load</span>
              <span className={`font-mono font-medium ${activeDiagnosticAsset.loadPercent > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {activeDiagnosticAsset.loadPercent}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Uptime Rate</span>
              <span className="font-mono text-emerald-400 font-medium">{activeDiagnosticAsset.uptimePercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
              <span>Diagnostic Pipeline Execution</span>
              <span className="font-mono text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Terminal Console View */}
          <div>
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#05070F] border border-white/10 rounded-t-xl text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>telemetry_stream.stdout</span>
              </span>
              <span>bash -c smartdesk_probe</span>
            </div>
            <div className="bg-[#05070F] border-x border-b border-white/10 rounded-b-xl p-3 font-mono text-[11px] text-slate-300 space-y-1.5 min-h-[160px] max-h-[220px] overflow-y-auto">
              {logs.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    line.includes('[ALERT]')
                      ? 'text-amber-400'
                      : line.includes('[OK]')
                      ? 'text-emerald-400'
                      : line.includes('[PROBE]')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                  <span>&gt; Querying sub-tier metrics...</span>
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic Result Banner */}
          {!isRunning && diagnosticResult !== 'idle' && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                diagnosticResult === 'nominal'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {diagnosticResult === 'nominal' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    {diagnosticResult === 'nominal' ? 'Health Check Passed: Nominal' : 'High Resource Pressure Warning'}
                  </p>
                  <p className="text-[11px] opacity-80">
                    {diagnosticResult === 'nominal'
                      ? 'No anomalies detected across disk, network, and RAM.'
                      : 'Memory threshold breached (>80%). Action recommended.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {diagnosticResult === 'warning' && (
                  <button
                    onClick={() => {
                      setDiagnosticModalOpen(false);
                      openReportFault(activeDiagnosticAsset);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Declare Incident
                  </button>
                )}
                <button
                  onClick={handleAskAiAboutAsset}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
                >
                  Ask AI Copilot
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#05070F]/80 flex items-center justify-between text-xs">
          <button
            onClick={runDiagnosticRoutine}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-40"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Re-run Probe</span>
          </button>
          <button
            onClick={() => setDiagnosticModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
