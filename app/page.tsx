'use client';

import { useState } from 'react';
import {
  Building2,
  GitBranch,
  ListTodo,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Plus
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import ProcessCard from '@/components/ProcessCard';
import WorkflowViewer from '@/components/WorkflowViewer';
import PropertyTable from '@/components/PropertyTable';
import LeasePipeline from '@/components/LeasePipeline';
import ActivityFeed from '@/components/ActivityFeed';
import TeamPanel from '@/components/TeamPanel';
import { processes, properties, dashboardMetrics } from '@/lib/data';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [processFilter, setProcessFilter] = useState<'all' | 'active' | 'draft'>('all');

  const filteredProcesses = processes.filter((p) => {
    if (processFilter === 'all') return true;
    if (processFilter === 'active') return p.status === 'active';
    if (processFilter === 'draft') return p.status === 'draft';
    return true;
  });

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Properties"
                value={dashboardMetrics.totalProperties}
                change="+12 this month"
                changeType="positive"
                icon={Building2}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
              <MetricCard
                title="Active Processes"
                value={dashboardMetrics.activeProcesses}
                change="23 need attention"
                changeType="neutral"
                icon={GitBranch}
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
              />
              <MetricCard
                title="Pending Tasks"
                value={dashboardMetrics.pendingTasks}
                change={`${dashboardMetrics.overdueItems} overdue`}
                changeType="negative"
                icon={ListTodo}
                iconColor="text-orange-600"
                iconBg="bg-orange-100"
              />
              <MetricCard
                title="Completed This Month"
                value={dashboardMetrics.completedThisMonth}
                change="↑ 15% vs last month"
                changeType="positive"
                icon={CheckCircle}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
            </div>

            {/* Draft Workflows Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">3 Workflows in Draft Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  BSG Lease Renewal, BSG Tenant University, and BSG Hiring Process are ready to be activated.
                  These workflows won't run until they're turned on.
                </p>
              </div>
              <button
                onClick={() => setActiveView('processes')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                Review Drafts
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <LeasePipeline />
                <PropertyTable
                  properties={properties.slice(0, 5)}
                  title="Properties Needing Attention"
                />
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <ActivityFeed />
                <TeamPanel />
              </div>
            </div>
          </div>
        );

      case 'processes':
        return (
          <div className="p-6">
            {/* Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(['all', 'active', 'draft'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setProcessFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      processFilter === filter
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter === 'all' && 'All Processes'}
                    {filter === 'active' && 'Active'}
                    {filter === 'draft' && 'Drafts'}
                    {filter === 'draft' && (
                      <span className="ml-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        3
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex-1"></div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <Filter className="w-4 h-4" />
                Filter by Category
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                New Process
              </button>
            </div>

            {/* Process Grid */}
            <div className="process-grid">
              {filteredProcesses.map((process) => (
                <ProcessCard
                  key={process.id}
                  process={process}
                  onClick={() => setSelectedProcess(process.name)}
                />
              ))}
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="p-6">
            <PropertyTable properties={properties} title="All Properties" />
          </div>
        );

      case 'pipeline':
        return (
          <div className="p-6">
            <LeasePipeline />
            <div className="mt-6">
              <PropertyTable
                properties={properties.filter((p) => p.currentProcess === 'BSG Lease Renewal')}
                title="Lease Renewals in Progress"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
              <p className="text-gray-500 mt-1">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  const getHeaderConfig = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Welcome back! Here\'s what\'s happening with your properties.'
        };
      case 'processes':
        return {
          title: 'Workflow Processes',
          subtitle: `${processes.length} processes • ${processes.filter((p) => p.status === 'active').length} active`
        };
      case 'properties':
        return {
          title: 'Properties',
          subtitle: `${properties.length} properties under management`
        };
      case 'pipeline':
        return {
          title: 'Lease Renewal Pipeline',
          subtitle: 'Track and manage upcoming lease expirations'
        };
      default:
        return {
          title: activeView.charAt(0).toUpperCase() + activeView.slice(1),
          subtitle: ''
        };
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="ml-64">
        <Header
          title={headerConfig.title}
          subtitle={headerConfig.subtitle}
          showSearch={true}
          showAddButton={activeView === 'properties'}
          addButtonLabel="Add Property"
        />

        {renderContent()}
      </main>

      {/* Workflow Viewer Modal */}
      {selectedProcess && (
        <WorkflowViewer
          processName={selectedProcess}
          onClose={() => setSelectedProcess(null)}
        />
      )}
    </div>
  );
}
