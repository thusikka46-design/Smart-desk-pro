import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Key, ShieldCheck, Copy, Check, Lock, Clock } from 'lucide-react';

export const AssetAccessModal: React.FC = () => {
  const { accessModalOpen, setAccessModalOpen, activeAccessAsset, currentUser } = useApp();

  const [durationHours, setDurationHours] = useState('2');
  const [justification, setJustification] = useState('Production telemetry inspection and debug trace');
  const [grantedToken, setGrantedToken] = useState<string | null>(null);
  const [sshCommand, setSshCommand] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!accessModalOpen || !activeAccessAsset) return null;

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `ephem-iam-grant-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
    const cmd = `tsh ssh --proxy=bastion.smartdesk.internal:443 --login=${currentUser.name.toLowerCase().replace(' ', '.')} --identity-token=${token} ${activeAccessAsset.ip}`;
    setGrantedToken(token);
    setSshCommand(cmd);
  };

  const copyCommand = () => {
    if (!sshCommand) return;
    navigator.clipboard.writeText(sshCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-[#0D111D] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070F]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Zero Trust Ephemeral Access Request</h2>
              <p className="text-[11px] text-slate-400 font-mono">Time-bound SSH & IAM Grant</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAccessModalOpen(false);
              setGrantedToken(null);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Target Node</span>
              <span className="font-semibold text-white">{activeAccessAsset.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">IP / Hostname</span>
              <span className="font-mono text-cyan-300">{activeAccessAsset.ip}</span>
            </div>
          </div>

          {!grantedToken ? (
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Access Lease Duration</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '2', '4', '8'].map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setDurationHours(hr)}
                      className={`py-2 rounded-xl text-center font-mono transition-colors ${
                        durationHours === hr
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {hr} Hours
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Business Justification (Audit Recorded)
                </label>
                <textarea
                  rows={2}
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Sessions are cryptographically signed, recorded via Teleport proxy, and automatically revoked at
                  lease expiry.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAccessModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:opacity-95"
                >
                  Generate Ephemeral Grant
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold">Access Grant Approved ({durationHours}h Lease)</p>
                  <p className="text-[11px] opacity-80">Grant Token ID: {grantedToken}</p>
                </div>
              </div>

              <div>
                <span className="block text-slate-300 font-medium mb-1.5">Connect via Teleport Terminal Command:</span>
                <div className="bg-[#05070F] border border-white/10 rounded-xl p-3 font-mono text-[11px] text-cyan-300 relative group">
                  <pre className="whitespace-pre-wrap break-all">{sshCommand}</pre>
                  <button
                    onClick={copyCommand}
                    className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied to Clipboard' : 'Copy Connection String'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setAccessModalOpen(false);
                    setGrantedToken(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  Close & Proceed to Terminal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
