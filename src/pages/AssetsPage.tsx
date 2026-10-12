import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Cloud,
  HardDrive,
  Database,
  FileBadge,
  Search,
  Key,
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  MapPin,
  Cpu
} from 'lucide-react';
import { AssetType, HealthStatus, Asset } from '../types';

export const AssetsPage: React.FC = () => {
  const { assets, openDiagnostic, openAccessRequest, openReportFault } = useApp();

  const [selectedType, setSelectedType] = useState<AssetType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<HealthStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types: (AssetType | 'All')[] = ['All', 'Cloud', 'Hardware', 'Database', 'Software License'];

  const filteredAssets = assets.filter((a) => {
    const matchesType = selectedType === 'All' || a.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || a.healthStatus === selectedStatus;
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'Cloud':
        return Cloud;
      case 'Database':
        return Database;
      case 'Hardware':
        return HardDrive;
      case 'Software License':
        return FileBadge;
      default:
        return Server;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>IT Asset Management & Infrastructure Inventory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-pane-of-glass tracking for multi-cloud clusters, physical network switches, and developer endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
            <span>Inventory Health: </span>
            <span className="text-emerald-400 font-semibold">98.2% Nominal</span>
          </div>
        </div>
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
              placeholder="Search by Asset ID, Hostname, IP, or location..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Type Segmented Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ASSET CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const IconComponent = getAssetIcon(asset.type);
          const isDegraded = asset.healthStatus === 'Degraded';

          return (
            <div
              key={asset.id}
              className={`p-5 rounded-2xl glass-panel border transition-all duration-200 flex flex-col justify-between group ${
                isDegraded ? 'border-amber-500/50 laser-border-amber' : 'hover:border-cyan-500/40'
              }`}
            >
              <div>
                {/* Header: Type icon, ID, and Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isDegraded
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-cyan-400 text-xs font-semibold block">{asset.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{asset.type}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                      isDegraded
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {asset.healthStatus.toUpperCase()}
                  </span>
                </div>

                {/* Name & IP */}
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                  {asset.name}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                  <span className="text-cyan-300">{asset.ip}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate max-w-[150px]">{asset.location}</span>
                  </span>
                </div>

                {/* Telemetry Strip: Load & Uptime */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 mb-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Workload Load</span>
                    <span
                      className={`font-mono font-medium ${
                        asset.loadPercent > 80 ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {asset.loadPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Uptime Rate</span>
                    <span className="font-mono text-emerald-400 font-medium">{asset.uptimePercent}%</span>
                  </div>
                </div>

                {/* Hardware Spec Tags */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Configuration & Specs
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {asset.specs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between p-1.5 rounded-lg bg-black/30 border border-white/5">
                        <span className="text-slate-400">{spec.label}:</span>
                        <span className="font-mono text-slate-200">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned User */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-white/10 mb-4">
                  <span className="text-slate-400 text-[11px]">Assigned Custodian:</span>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={asset.assignedUser.avatar}
                      alt={asset.assignedUser.name}
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-cyan-400/40"
                    />
                    <span className="text-slate-200 text-[11px] font-medium">{asset.assignedUser.name}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (3 Required) */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10 text-[11px]">
                <button
                  onClick={() => openAccessRequest(asset)}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 font-medium transition-colors flex items-center justify-center gap-1"
                  title="Request Zero Trust Access Token"
                >
                  <Key className="w-3 h-3 text-emerald-400" />
                  <span>Access</span>
                </button>

                <button
                  onClick={() => openDiagnostic(asset)}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 font-medium transition-colors flex items-center justify-center gap-1"
                  title="Run Live Telemetry Probe"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Diagnose</span>
                </button>

                <button
                  onClick={() => openReportFault(asset)}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 font-medium transition-colors flex items-center justify-center gap-1"
                  title="Report Hardware or Service Fault"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-slate-400 space-y-2">
          <p className="text-sm">No assets found matching the search criteria.</p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 underline"
          >
            Clear asset filters
          </button>
        </div>
      )}
    </div>
  );
};
