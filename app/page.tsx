'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Home as HomeIcon,
  LogIn,
  LogOut,
  ClipboardCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import VacantPropertiesTable from '@/components/VacantPropertiesTable';
import ActivityFeed from '@/components/ActivityFeed';
import TeamPanel from '@/components/TeamPanel';

interface DashboardMetrics {
  totalProperties: number;
  vacantMarketed: number;
  vacantNotMarketed: number;
  moveInsThisMonth: number;
  moveOutsThisMonth: number;
  inspectionsNeeded: number;
  newPropertiesThisMonth: number;
}

interface VacantProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  unit?: {
    num_bedrooms?: string;
    num_bathrooms?: string;
    market_rent?: string;
  };
  lockboxCode?: string;
  cookingType?: string;
  hasGas?: boolean;
  alarmCode?: string;
}

interface DashboardData {
  metrics: DashboardMetrics;
  vacantMarketed: VacantProperty[];
  vacantNotMarketed: VacantProperty[];
}

// Mock data for demo - in production this comes from API
const mockDashboardData: DashboardData = {
  metrics: {
    totalProperties: 0,
    vacantMarketed: 0,
    vacantNotMarketed: 0,
    moveInsThisMonth: 0,
    moveOutsThisMonth: 0,
    inspectionsNeeded: 0,
    newPropertiesThisMonth: 0,
  },
  vacantMarketed: [],
  vacantNotMarketed: [],
};

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async (retryCount = 0) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        // Check if it's valid data (not an error response)
        if (data.metrics && data.metrics.totalProperties > 0) {
          setDashboardData(data);
          setLastUpdated(new Date());
        } else if (retryCount < 2) {
          // Retry if data looks invalid
          console.log('Invalid data received, retrying...');
          setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
          return;
        }
      } else if (retryCount < 2) {
        // Retry on error
        console.log('API error, retrying...');
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch with small delay to ensure server is ready
    const initialFetch = setTimeout(() => fetchDashboardData(), 100);

    // Refresh every 10 minutes
    const interval = setInterval(() => fetchDashboardData(), 10 * 60 * 1000);
    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, []);

  const { metrics, vacantMarketed, vacantNotMarketed } = dashboardData;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            {/* Refresh Button */}
            <div className="flex items-center justify-end gap-3">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Top Row Metrics - 6 boxes as requested */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="Total Properties"
                value={metrics.totalProperties}
                change={`+${metrics.newPropertiesThisMonth} this month`}
                changeType="positive"
                icon={Building2}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
              <MetricCard
                title="Vacant Marketed"
                value={metrics.vacantMarketed}
                change="Being marketed"
                changeType="neutral"
                icon={HomeIcon}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
              <MetricCard
                title="Vacant Not Marketed"
                value={metrics.vacantNotMarketed}
                change="Needs attention"
                changeType={metrics.vacantNotMarketed > 0 ? "negative" : "neutral"}
                icon={AlertTriangle}
                iconColor="text-orange-600"
                iconBg="bg-orange-100"
              />
              <MetricCard
                title="Move-Ins"
                value={metrics.moveInsThisMonth}
                change="This month"
                changeType="positive"
                icon={LogIn}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-100"
              />
              <MetricCard
                title="Move-Outs"
                value={metrics.moveOutsThisMonth}
                change="This month"
                changeType="neutral"
                icon={LogOut}
                iconColor="text-red-600"
                iconBg="bg-red-100"
              />
              <MetricCard
                title="Inspections"
                value={metrics.inspectionsNeeded}
                change="Needed"
                changeType={metrics.inspectionsNeeded > 10 ? "negative" : "neutral"}
                icon={ClipboardCheck}
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Properties Marketed for Rent - The 13 properties */}
                <VacantPropertiesTable
                  properties={vacantMarketed}
                  title="Properties Marketed for Rent"
                  subtitle="Click any property to view lockbox code and details"
                />

                {/* Properties Vacant Not Marketed */}
                <VacantPropertiesTable
                  properties={vacantNotMarketed}
                  title="Properties Vacant Not Marketed"
                  subtitle="Properties that need to be listed"
                  emptyMessage="All vacant properties are currently being marketed"
                />
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <TeamPanel />
                <ActivityFeed />
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="p-6 space-y-6">
            <VacantPropertiesTable
              properties={[...vacantMarketed, ...vacantNotMarketed]}
              title="All Vacant Properties"
              subtitle="Complete list of vacant properties"
            />
          </div>
        );

      default:
        return (
          <div className="p-6 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
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
          subtitle: `Welcome back! Here's your property overview for today.`
        };
      case 'properties':
        return {
          title: 'Properties',
          subtitle: `${metrics.totalProperties} properties under management`
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
          showAddButton={false}
        />

        {renderContent()}
      </main>
    </div>
  );
}
