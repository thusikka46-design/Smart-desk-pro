import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageId, UserRole } from '../../types';
import {
  Terminal,
  Search,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  Bot,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    theme,
    toggleTheme,
    currentUserRole,
    setUserRole,
    currentUser,
    setCommandPaletteOpen,
    setLogIncidentModalOpen,
    setQuickAiOpen,
    quickAiOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'assets', label: 'IT Assets' },
    { id: 'vault', label: 'Code Vault' },
    { id: 'docs', label: 'Knowledge Base' },
    { id: 'ai-hub', label: 'AI Diagnostic' }
  ];

  const roles: UserRole[] = [
    'Lead SRE',
    'DevOps Architect',
    'SecOps Specialist',
    'Developer'
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#05070F]/85 dark:bg-[#05070F]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* ZONE 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.35)] transition-transform duration-200 group-hover:scale-105">
                <div className="w-full h-full bg-[#05070F] rounded-[7px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  SmartDesk<span className="text-cyan-400">Pro</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 uppercase">
                  Ops Hub
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean Single-line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 shadow-[0_0_12px_rgba(0,242,254,0.15)] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Action Controls + Cmd+K + Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick search shortcut trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Global Command Palette (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Quick Find</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 border border-white/10 rounded font-mono text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* AI Assistant Quick Toggle */}
            <button
              onClick={() => setQuickAiOpen(!quickAiOpen)}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                quickAiOpen
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-cyan-300 hover:bg-white/10'
              }`}
              title="Toggle AI Quick Assistant"
              aria-label="Toggle AI Quick Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Switch theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Profile / Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                title="Switch User Role"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400/50"
                />
                <span className="hidden xl:inline font-medium text-slate-200">{currentUser.name}</span>
                <span className="hidden md:inline px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-cyan-300 font-mono">
                  {currentUserRole.split(' ')[0]}
                </span>
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0D111D] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-cyan-400 mt-0.5">{currentUser.team}</p>
                  </div>
                  <div className="py-1">
                    <span className="block px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Switch Role View
                    </span>
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          currentUserRole === role
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{role}</span>
                        {currentUserRole === role && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Log Incident */}
            <button
              onClick={() => setLogIncidentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-[0_0_14px_rgba(0,242,254,0.3)] transition-all transform active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>Log Incident</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#05070F] px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  navigateTo(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
