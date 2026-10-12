/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Breadcrumbs } from './components/common/Breadcrumbs';
import { CommandPalette } from './components/common/CommandPalette';
import { FloatingAiDrawer } from './components/common/FloatingAiDrawer';
import { LogIncidentModal } from './components/modals/LogIncidentModal';
import { AssetDiagnosticModal } from './components/modals/AssetDiagnosticModal';
import { AssetAccessModal } from './components/modals/AssetAccessModal';
import { AddSnippetModal } from './components/modals/AddSnippetModal';

import { DashboardPage } from './pages/DashboardPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AssetsPage } from './pages/AssetsPage';
import { CodeVaultPage } from './pages/CodeVaultPage';
import { DocsPage } from './pages/DocsPage';
import { AiHubPage } from './pages/AiHubPage';

const MainLayout: React.FC = () => {
  const { currentPage } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'assets':
        return <AssetsPage />;
      case 'vault':
        return <CodeVaultPage />;
      case 'docs':
        return <DocsPage />;
      case 'ai-hub':
        return <AiHubPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070F] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-2 min-w-0">
          <Breadcrumbs />
          <div className="mt-2">{renderActivePage()}</div>
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <CommandPalette />
      <FloatingAiDrawer />
      <LogIncidentModal />
      <AssetDiagnosticModal />
      <AssetAccessModal />
      <AddSnippetModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
