// Mock data for LeadSimple Dashboard

export interface Process {
  id: string;
  name: string;
  stages: number;
  status: 'active' | 'draft' | 'paused';
  category: string;
  activeCount: number;
  completedCount: number;
  avgDuration: string;
  lastModified: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'canceled' | 'backlog' | 'pending';
  count: number;
  order: number;
  daysInStage: number;
  automations: number;
  branch?: 'main' | 'renewal' | 'non-renewal';
}

export interface Property {
  id: string;
  address: string;
  unit?: string;
  tenant: string;
  owner: string;
  currentProcess: string;
  currentStage: string;
  daysInStage: number;
  leaseEnd?: string;
  status: 'on-track' | 'attention' | 'overdue';
}

export interface DashboardMetrics {
  totalProperties: number;
  activeProcesses: number;
  pendingTasks: number;
  overdueItems: number;
  completedThisMonth: number;
  avgProcessTime: string;
}

export const processes: Process[] = [
  {
    id: 'bsg-move-in',
    name: 'BSG Move In',
    stages: 12,
    status: 'active',
    category: 'Tenant Lifecycle',
    activeCount: 8,
    completedCount: 145,
    avgDuration: '14 days',
    lastModified: '2024-01-10'
  },
  {
    id: 'bsg-move-out',
    name: 'BSG Move Out',
    stages: 9,
    status: 'active',
    category: 'Tenant Lifecycle',
    activeCount: 5,
    completedCount: 89,
    avgDuration: '21 days',
    lastModified: '2024-01-08'
  },
  {
    id: 'bsg-lease-renewal',
    name: 'BSG Lease Renewal',
    stages: 16,
    status: 'draft',
    category: 'Tenant Lifecycle',
    activeCount: 0,
    completedCount: 0,
    avgDuration: '-',
    lastModified: '2024-01-12'
  },
  {
    id: 'bsg-maintenance',
    name: 'BSG Maintenance Request',
    stages: 7,
    status: 'active',
    category: 'Operations',
    activeCount: 23,
    completedCount: 567,
    avgDuration: '3 days',
    lastModified: '2024-01-11'
  },
  {
    id: 'bsg-tenant-university',
    name: 'BSG Tenant University',
    stages: 5,
    status: 'draft',
    category: 'Onboarding',
    activeCount: 0,
    completedCount: 0,
    avgDuration: '-',
    lastModified: '2024-01-05'
  },
  {
    id: 'bsg-hoa-violations',
    name: 'BSG HOA Violations',
    stages: 6,
    status: 'active',
    category: 'Compliance',
    activeCount: 4,
    completedCount: 34,
    avgDuration: '7 days',
    lastModified: '2024-01-09'
  },
  {
    id: 'bsg-owner-onboarding',
    name: 'BSG Owner Onboarding',
    stages: 8,
    status: 'active',
    category: 'Onboarding',
    activeCount: 2,
    completedCount: 28,
    avgDuration: '10 days',
    lastModified: '2024-01-07'
  },
  {
    id: 'bsg-annual-inspection',
    name: 'BSG Annual Inspection',
    stages: 5,
    status: 'active',
    category: 'Compliance',
    activeCount: 12,
    completedCount: 156,
    avgDuration: '5 days',
    lastModified: '2024-01-06'
  },
  {
    id: 'bsg-hiring-process',
    name: 'BSG Hiring Process',
    stages: 10,
    status: 'draft',
    category: 'Internal',
    activeCount: 0,
    completedCount: 0,
    avgDuration: '-',
    lastModified: '2024-01-03'
  },
  {
    id: 'bsg-eviction',
    name: 'BSG Eviction Process',
    stages: 11,
    status: 'paused',
    category: 'Legal',
    activeCount: 1,
    completedCount: 8,
    avgDuration: '45 days',
    lastModified: '2024-01-02'
  },
  {
    id: 'bsg-lease-violation',
    name: 'BSG Lease Violation',
    stages: 6,
    status: 'active',
    category: 'Compliance',
    activeCount: 3,
    completedCount: 45,
    avgDuration: '12 days',
    lastModified: '2024-01-04'
  },
  {
    id: 'bsg-rent-increase',
    name: 'BSG Rent Increase',
    stages: 4,
    status: 'active',
    category: 'Financials',
    activeCount: 6,
    completedCount: 78,
    avgDuration: '30 days',
    lastModified: '2024-01-01'
  },
  {
    id: 'bsg-vendor-management',
    name: 'BSG Vendor Management',
    stages: 3,
    status: 'active',
    category: 'Operations',
    activeCount: 15,
    completedCount: 234,
    avgDuration: '2 days',
    lastModified: '2023-12-28'
  }
];

export const leaseRenewalStages: WorkflowStage[] = [
  { id: 'lr-1', name: 'Lease Expiring Soon', status: 'completed', count: 12, order: 1, daysInStage: 0, automations: 2, branch: 'main' },
  { id: 'lr-2', name: 'Send Renewal Notice', status: 'completed', count: 0, order: 2, daysInStage: 0, automations: 3, branch: 'main' },
  { id: 'lr-3', name: 'Waiting for Response', status: 'active', count: 8, order: 3, daysInStage: 5, automations: 1, branch: 'main' },
  { id: 'lr-4', name: 'Owner Decision', status: 'active', count: 4, order: 4, daysInStage: 3, automations: 0, branch: 'main' },
  // Renewal branch
  { id: 'lr-5a', name: 'Prepare Renewal Lease', status: 'pending', count: 0, order: 5, daysInStage: 0, automations: 2, branch: 'renewal' },
  { id: 'lr-6a', name: 'Send Lease for Signature', status: 'pending', count: 0, order: 6, daysInStage: 0, automations: 3, branch: 'renewal' },
  { id: 'lr-7a', name: 'Awaiting Tenant Signature', status: 'pending', count: 0, order: 7, daysInStage: 0, automations: 1, branch: 'renewal' },
  { id: 'lr-8a', name: 'Lease Signed - Update System', status: 'pending', count: 0, order: 8, daysInStage: 0, automations: 4, branch: 'renewal' },
  { id: 'lr-9a', name: 'Renewal Complete', status: 'pending', count: 0, order: 9, daysInStage: 0, automations: 2, branch: 'renewal' },
  // Non-renewal branch
  { id: 'lr-5b', name: 'Non-Renewal Notice', status: 'backlog', count: 2, order: 5, daysInStage: 0, automations: 2, branch: 'non-renewal' },
  { id: 'lr-6b', name: 'Schedule Move-Out Inspection', status: 'backlog', count: 0, order: 6, daysInStage: 0, automations: 1, branch: 'non-renewal' },
  { id: 'lr-7b', name: 'List Property', status: 'pending', count: 0, order: 7, daysInStage: 0, automations: 3, branch: 'non-renewal' },
  { id: 'lr-8b', name: 'Transition to Move-Out', status: 'pending', count: 0, order: 8, daysInStage: 0, automations: 2, branch: 'non-renewal' },
  // Canceled
  { id: 'lr-c1', name: 'Canceled - Early Termination', status: 'canceled', count: 1, order: 10, daysInStage: 0, automations: 1, branch: 'main' },
  { id: 'lr-c2', name: 'Canceled - Property Sold', status: 'canceled', count: 0, order: 11, daysInStage: 0, automations: 1, branch: 'main' },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    address: '1234 Oak Street',
    unit: 'Unit A',
    tenant: 'John Smith',
    owner: 'ABC Investments LLC',
    currentProcess: 'BSG Lease Renewal',
    currentStage: 'Waiting for Response',
    daysInStage: 5,
    leaseEnd: '2024-03-15',
    status: 'on-track'
  },
  {
    id: 'prop-2',
    address: '5678 Maple Ave',
    tenant: 'Sarah Johnson',
    owner: 'Michael Chen',
    currentProcess: 'BSG Lease Renewal',
    currentStage: 'Owner Decision',
    daysInStage: 8,
    leaseEnd: '2024-02-28',
    status: 'attention'
  },
  {
    id: 'prop-3',
    address: '910 Pine Road',
    unit: 'Suite 200',
    tenant: 'Tech Solutions Inc',
    owner: 'Commercial Holdings',
    currentProcess: 'BSG Maintenance Request',
    currentStage: 'Vendor Assigned',
    daysInStage: 2,
    status: 'on-track'
  },
  {
    id: 'prop-4',
    address: '222 Elm Court',
    tenant: 'Maria Garcia',
    owner: 'Robert Wilson',
    currentProcess: 'BSG Move In',
    currentStage: 'Key Handoff',
    daysInStage: 1,
    status: 'on-track'
  },
  {
    id: 'prop-5',
    address: '333 Cedar Lane',
    tenant: 'James Brown',
    owner: 'Sunset Properties',
    currentProcess: 'BSG HOA Violations',
    currentStage: 'Notice Sent',
    daysInStage: 12,
    leaseEnd: '2024-08-01',
    status: 'overdue'
  },
  {
    id: 'prop-6',
    address: '444 Birch Drive',
    unit: 'Unit 3B',
    tenant: 'Emily Davis',
    owner: 'Vista Investments',
    currentProcess: 'BSG Lease Renewal',
    currentStage: 'Lease Expiring Soon',
    daysInStage: 3,
    leaseEnd: '2024-04-30',
    status: 'on-track'
  },
  {
    id: 'prop-7',
    address: '555 Walnut Way',
    tenant: 'David Lee',
    owner: 'First Choice Rentals',
    currentProcess: 'BSG Move Out',
    currentStage: 'Final Walkthrough',
    daysInStage: 0,
    status: 'on-track'
  },
  {
    id: 'prop-8',
    address: '666 Spruce Street',
    tenant: 'Amanda White',
    owner: 'Heritage Homes',
    currentProcess: 'BSG Annual Inspection',
    currentStage: 'Inspection Scheduled',
    daysInStage: 4,
    status: 'on-track'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  totalProperties: 156,
  activeProcesses: 79,
  pendingTasks: 34,
  overdueItems: 7,
  completedThisMonth: 45,
  avgProcessTime: '8.5 days'
};

export const leaseRenewalPipeline = {
  '90days': [
    { address: '789 Highland Ave', tenant: 'Tom Wilson', leaseEnd: '2024-04-15', status: 'not-started' },
    { address: '321 Valley Road', tenant: 'Lisa Anderson', leaseEnd: '2024-04-20', status: 'not-started' },
    { address: '654 Summit Dr', tenant: 'Chris Martin', leaseEnd: '2024-04-25', status: 'not-started' },
  ],
  '60days': [
    { address: '1234 Oak Street', tenant: 'John Smith', leaseEnd: '2024-03-15', status: 'in-progress' },
    { address: '987 Creek Ln', tenant: 'Nancy Taylor', leaseEnd: '2024-03-20', status: 'in-progress' },
  ],
  '30days': [
    { address: '5678 Maple Ave', tenant: 'Sarah Johnson', leaseEnd: '2024-02-28', status: 'pending-decision' },
    { address: '147 River Rd', tenant: 'Mark Davis', leaseEnd: '2024-02-25', status: 'signed' },
  ]
};

export const recentActivity = [
  { id: 1, action: 'Lease renewal notice sent', property: '1234 Oak Street', user: 'System', time: '2 hours ago', type: 'automation' },
  { id: 2, action: 'Move-in completed', property: '222 Elm Court', user: 'Jessica M.', time: '3 hours ago', type: 'manual' },
  { id: 3, action: 'Maintenance request created', property: '910 Pine Road', user: 'Tenant Portal', time: '4 hours ago', type: 'system' },
  { id: 4, action: 'HOA violation notice sent', property: '333 Cedar Lane', user: 'System', time: '5 hours ago', type: 'automation' },
  { id: 5, action: 'Annual inspection scheduled', property: '666 Spruce Street', user: 'Mike R.', time: '6 hours ago', type: 'manual' },
  { id: 6, action: 'Owner approved rent increase', property: '444 Birch Drive', user: 'Owner Portal', time: '1 day ago', type: 'system' },
];

export const teamMembers = [
  { id: 1, name: 'Jessica Martinez', role: 'Property Manager', activeTasks: 12, avatar: 'JM' },
  { id: 2, name: 'Mike Rodriguez', role: 'Maintenance Coordinator', activeTasks: 8, avatar: 'MR' },
  { id: 3, name: 'Sarah Thompson', role: 'Leasing Agent', activeTasks: 15, avatar: 'ST' },
  { id: 4, name: 'David Kim', role: 'Operations Manager', activeTasks: 6, avatar: 'DK' },
];
