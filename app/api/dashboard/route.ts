import { NextResponse } from 'next/server';
import {
  fetchAllProperties,
  fetchTasks,
  calculateMetrics,
  getVacantMarketedProperties,
  processPropertyDetails,
  type LeadSimpleProperty,
  type PropertyWithDetails,
  type DashboardMetrics,
} from '@/lib/leadsimple-api';

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface DashboardData {
  metrics: DashboardMetrics;
  vacantMarketed: PropertyWithDetails[];
  vacantNotMarketed: PropertyWithDetails[];
  teamWorkload: TeamMember[];
  recentActivity: ActivityItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  activeTasks: number;
  avatar: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  property: string;
  user: string;
  time: string;
  type: 'automation' | 'manual' | 'system';
}

export async function GET() {
  try {
    // Fetch all properties from LeadSimple API
    const properties = await fetchAllProperties();

    // Calculate dashboard metrics
    const metrics = calculateMetrics(properties);

    // Get vacant marketed properties with details
    const vacantMarketed = getVacantMarketedProperties(properties);

    // Get vacant not marketed (for demo, use subset)
    const vacantNotMarketed: PropertyWithDetails[] = [];

    // Mock team workload data (would come from tasks API in production)
    const teamWorkload: TeamMember[] = [
      { id: '1', name: 'Jessica Martinez', role: 'Property Manager', activeTasks: 12, avatar: 'JM' },
      { id: '2', name: 'Mike Rodriguez', role: 'Maintenance Coordinator', activeTasks: 8, avatar: 'MR' },
      { id: '3', name: 'Sarah Thompson', role: 'Leasing Agent', activeTasks: 15, avatar: 'ST' },
      { id: '4', name: 'David Kim', role: 'Operations Manager', activeTasks: 6, avatar: 'DK' },
    ];

    // Mock recent activity (would be constructed from actual API data)
    const recentActivity: ActivityItem[] = [
      { id: '1', action: 'Property listed for rent', property: vacantMarketed[0]?.address || '123 Main St', user: 'System', time: '2 hours ago', type: 'automation' },
      { id: '2', action: 'Move-in completed', property: '222 Elm Court', user: 'Jessica M.', time: '3 hours ago', type: 'manual' },
      { id: '3', action: 'Inspection scheduled', property: '910 Pine Road', user: 'Mike R.', time: '4 hours ago', type: 'manual' },
      { id: '4', action: 'Lease signed', property: '333 Cedar Lane', user: 'Tenant Portal', time: '5 hours ago', type: 'system' },
      { id: '5', action: 'Make ready started', property: vacantMarketed[1]?.address || '456 Oak Ave', user: 'System', time: '6 hours ago', type: 'automation' },
    ];

    const dashboardData: DashboardData = {
      metrics,
      vacantMarketed,
      vacantNotMarketed,
      teamWorkload,
      recentActivity,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    // Return error response so client knows to retry
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', message: String(error) },
      { status: 500 }
    );
  }
}
