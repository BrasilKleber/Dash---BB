
import React from 'react';
import { CRMNavigationProvider, useCurrentView, useNavigationParams, useNavigate } from './navigation';
import { CRMDashboard } from './dashboard/CRMDashboard';
import { ClientsPage } from './clients/ClientsPage';
import { TasksPage } from './tasks/TasksPage';
import { ClientDetailPage } from './clients/ClientDetailPage';
import { CampaignDetailPage } from './campaigns/CampaignDetailPage';
import { CampaignsPage } from './campaigns/CampaignsPage';

// Componente interno que consome o contexto e renderiza a view correta
const CRMContent: React.FC = () => {
  const view = useCurrentView();
  const params = useNavigationParams();
  const navigate = useNavigate();

  // Switch de views
  switch (view) {
    case 'dashboard':
      return <CRMDashboard onNavigate={navigate} />;
    case 'clients':
      return <ClientsPage onNavigate={navigate} />;
    case 'tasks':
      return <TasksPage />;
    case 'client-detail':
      return <ClientDetailPage clientId={params.clientId} onNavigate={navigate} />;
    case 'campaign-detail':
      return <CampaignDetailPage campaignId={params.campaignId} onNavigate={navigate} />;
    case 'campaigns':
      return <CampaignsPage onNavigate={navigate} />;
    default:
      return <CRMDashboard onNavigate={navigate} />;
  }
};

// Root que fornece o contexto para toda a árvore do CRM
export const CRMRoot: React.FC = () => {
  return (
    <CRMNavigationProvider>
      <div className="h-full flex flex-col bg-slate-50">
        <CRMContent />
      </div>
    </CRMNavigationProvider>
  );
};
