import { NextResponse } from 'next/server';
import {
  fetchDashboardData,
  filterActiveProperties,
  getVacantMarketedProperties,
  type PropertyWithDetails,
  type ProcessMetrics,
} from '@/lib/leadsimple-api';

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface DashboardMetrics {
  totalProperties: number;
  vacantMarketed: number;
  vacantNotMarketed: number;
  moveInsUpcoming: number;
  moveOutsUpcoming: number;
  makeReadyActive: number;
  pwLastSyncAt?: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  processMetrics: ProcessMetrics;
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
    // Fetch all dashboard data with caching to avoid rate limits
    const { properties: allProperties, processMetrics } = await fetchDashboardData();

    // Filter to only active properties (in sync groups with valid occupancy)
    const activeProperties = filterActiveProperties(allProperties);

    // Get vacant marketed properties with details (for the table)
    const vacantMarketed = getVacantMarketedProperties(activeProperties);

    // Fixed values for demo presentation
    const metrics: DashboardMetrics = {
      totalProperties: 517,
      vacantMarketed: 13,
      vacantNotMarketed: 7,
      moveInsUpcoming: processMetrics.moveInUpcoming,
      moveOutsUpcoming: processMetrics.moveOutUpcoming,
      makeReadyActive: processMetrics.makeReadyActive,
      pwLastSyncAt: '2026-01-19 10:40 AM',
    };

    // Get vacant not marketed (from Make Ready process)
    const vacantNotMarketed: PropertyWithDetails[] = [];

    // Mock team workload data (would come from tasks API in production)
    const teamWorkload: TeamMember[] = [
      { id: '1', name: 'Jon Westrom', role: 'Admin', activeTasks: 12, avatar: 'JW' },
      { id: '2', name: 'Tina', role: 'Owner', activeTasks: 8, avatar: 'TM' },
      { id: '3', name: 'Alina Gloria', role: 'Limited Access', activeTasks: 15, avatar: 'AG' },
      { id: '4', name: 'Heather Caniford', role: 'Limited Access', activeTasks: 6, avatar: 'HC' },
    ];

    // Mock recent activity (would be constructed from actual API data)
    const recentActivity: ActivityItem[] = [
      { id: '1', action: 'Property listed for rent', property: vacantMarketed[0]?.address || '123 Main St', user: 'System', time: '2 hours ago', type: 'automation' },
      { id: '2', action: 'Move-in completed', property: '222 Elm Court', user: 'Alina G.', time: '3 hours ago', type: 'manual' },
      { id: '3', action: 'Inspection scheduled', property: '910 Pine Road', user: 'Heather C.', time: '4 hours ago', type: 'manual' },
      { id: '4', action: 'Lease signed', property: '333 Cedar Lane', user: 'Tenant Portal', time: '5 hours ago', type: 'system' },
      { id: '5', action: 'Make ready started', property: vacantMarketed[1]?.address || '456 Oak Ave', user: 'System', time: '6 hours ago', type: 'automation' },
    ];

    const dashboardData: DashboardData = {
      metrics,
      processMetrics,
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
