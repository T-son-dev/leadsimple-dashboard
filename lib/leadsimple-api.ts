// LeadSimple API Integration
// API Key is stored securely and used for server-side requests only

const API_BASE_URL = 'https://api.leadsimple.com/rest';
const API_KEY = process.env.LEADSIMPLE_API_KEY || '';

// Property Manager groups that sync with Propertyware (active properties)
const ACTIVE_PROPERTY_GROUPS = [
  'Property Manager: thaislet',
  'Property Manager: dcoxe',
  'Property Manager: jwestrom',
  'Property Manager: tmarsale',
];

// Valid occupancy statuses for active properties
const VALID_OCCUPANCY = ['Tenant Occupied', 'Owner Occupied', 'Vacant'];

// Process Type IDs from LeadSimple
const PROCESS_TYPES = {
  MOVE_IN: '42c20497-0a7c-4b71-95e5-f54bc8dd7253',
  MOVE_OUT: '183f5a28-016f-4491-b967-c68a584f8097',
  MAKE_READY: '9e4c5dfe-263e-4882-833f-ebf64abf163c',
  MARKETING: '059c7d80-a613-4292-9508-a0e568d301ac',
  LEASE_RENEWAL: '00a35935-2f8a-41d2-8fa9-be00a2277d41',
};

// Marketing process stages that indicate actively marketed properties
const MARKETED_STAGES = [
  'Property Listed - Weekly Updates',
  'Property on Market - Vacant Showings',
  'Property on Market - Occupied Showings',
];

export interface PropertyGroup {
  id: string;
  name: string;
}

export interface LeadSimpleProperty {
  id: string;
  address: string;
  address_2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  postal_code?: string; // alias for compatibility
  country?: string;
  property_groups?: PropertyGroup[];
  unit: {
    id: string;
    occupancy: 'Vacant' | 'Occupied' | 'Tenant Occupied' | 'Owner Occupied' | string;
    num_bedrooms: string;
    num_bathrooms: string;
    market_rent: string;
    current_rent?: string;
    square_feet?: number;
    lease_start_date?: string | null;
    lease_end_date: string | null;
    current_lease_move_in: string | null;
    current_lease_move_out: string | null;
    future_lease_move_in?: string | null;
    future_lease_move_out?: string | null;
    custom_fields?: CustomField[];
  };
  link?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  key: string;
  label: string;
  value?: string;
  options?: string[];
}

export interface LeadSimpleTask {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  assignee_id: string | null;
  assignee_name?: string;
  property_id?: string;
  created_at: string;
}

export interface LeadSimpleProcessType {
  id: string;
  name: string;
  stage_count: number;
  active_count: number;
}

export interface LeadSimpleDeal {
  id: string;
  name: string;
  stage_id: string;
  pipeline_id: string;
  property_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadSimpleProcess {
  id: string;
  name: string;
  process_type_id: string;
  process_type?: {
    id: string;
    name: string;
  };
  stage?: {
    id: string;
    name: string;
    status: string;
  };
  properties?: LeadSimpleProperty[];
  created_at: string;
  updated_at: string;
}

export interface ProcessMetrics {
  moveInUpcoming: number;      // Pre Move In stage
  moveInTotal: number;         // All active move-in processes
  moveOutUpcoming: number;     // Move Out Upcoming stage
  moveOutTotal: number;        // All active move-out processes
  makeReadyActive: number;     // Active make-ready processes
  makeReadyCompleted: number;  // Make Ready Completed stage
  vacantMarketed: number;      // Properties actively marketed
  vacantNotMarketed: number;   // Vacant but not yet marketed
}

export interface DashboardMetrics {
  totalProperties: number;
  vacantMarketed: number;
  vacantNotMarketed: number;
  moveInsThisMonth: number;
  moveOutsThisMonth: number;
  inspectionsNeeded: number;
  newPropertiesThisMonth: number;
}

export interface PropertyWithDetails extends LeadSimpleProperty {
  lockboxCode?: string;
  cookingType?: string;
  hasGas?: boolean;
  alarmCode?: string;
  isMarketed?: boolean;
}

// Simple rate limiter - delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests (1 request per second max)

// Cache for dashboard data to avoid hitting API rate limits
interface CachedData {
  properties: LeadSimpleProperty[];
  processMetrics: ProcessMetrics;
  timestamp: number;
}

let cachedDashboardData: CachedData | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

async function fetchFromLeadSimple<T>(endpoint: string, params?: Record<string, string>, retryCount = 0): Promise<T> {
  // Rate limiting: ensure minimum interval between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Disable caching to ensure consistent pagination across all pages
  });

  // Handle rate limiting with exponential backoff
  if (response.status === 429 && retryCount < 3) {
    const backoffDelay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
    console.log(`Rate limited, retrying in ${backoffDelay}ms (attempt ${retryCount + 1}/3)`);
    await delay(backoffDelay);
    return fetchFromLeadSimple<T>(endpoint, params, retryCount + 1);
  }

  if (!response.ok) {
    throw new Error(`LeadSimple API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllProperties(): Promise<LeadSimpleProperty[]> {
  const allProperties: LeadSimpleProperty[] = [];
  let page = 1;

  while (true) {
    const response = await fetchFromLeadSimple<{
      data: LeadSimpleProperty[];
      meta: { total_count: number; per_page: number; page_number: number; total_pages: number }
    }>(
      '/properties',
      { page: page.toString(), per_page: '100', include_custom_fields: 'true', include_property_groups: 'true' }
    );

    allProperties.push(...response.data);

    console.log(`Fetched page ${page}/${response.meta.total_pages}: ${response.data.length} properties (total so far: ${allProperties.length}/${response.meta.total_count})`);

    // Check if we've fetched all pages
    if (page >= response.meta.total_pages || response.data.length === 0) {
      break;
    }

    page++;

    // Safety limit to prevent infinite loops
    if (page > 50) break;
  }

  console.log(`Total properties fetched: ${allProperties.length}`);
  return allProperties;
}

// Filter properties to only include active ones (in sync groups with valid occupancy)
export function filterActiveProperties(properties: LeadSimpleProperty[]): LeadSimpleProperty[] {
  return properties.filter(p => {
    // Check if property has a valid property group
    const groups = p.property_groups?.map(g => g.name) || [];
    const hasValidGroup = groups.some(g => ACTIVE_PROPERTY_GROUPS.includes(g));

    // Check if property has valid occupancy
    const hasValidOccupancy = VALID_OCCUPANCY.includes(p.unit?.occupancy || '');

    return hasValidGroup && hasValidOccupancy;
  });
}

// Fetch processes by type
export async function fetchProcessesByType(processTypeId: string, status: string = 'active'): Promise<LeadSimpleProcess[]> {
  const allProcesses: LeadSimpleProcess[] = [];
  let page = 1;

  while (true) {
    const response = await fetchFromLeadSimple<{
      data: LeadSimpleProcess[];
      meta: { total_count: number; per_page: number; page_number: number; total_pages: number }
    }>(
      '/processes',
      { page: page.toString(), per_page: '100', process_type_id: processTypeId, status }
    );

    allProcesses.push(...response.data);

    if (page >= response.meta.total_pages || response.data.length === 0) {
      break;
    }

    page++;
    if (page > 20) break; // Safety limit
  }

  return allProcesses;
}

// Get process-based metrics (internal, without cache)
async function fetchProcessMetricsInternal(): Promise<ProcessMetrics> {
  // Fetch all process types sequentially to avoid rate limits
  console.log('Fetching Move-In processes...');
  const moveInProcesses = await fetchProcessesByType(PROCESS_TYPES.MOVE_IN);

  console.log('Fetching Move-Out processes...');
  const moveOutProcesses = await fetchProcessesByType(PROCESS_TYPES.MOVE_OUT);

  console.log('Fetching Make-Ready processes...');
  const makeReadyProcesses = await fetchProcessesByType(PROCESS_TYPES.MAKE_READY);

  console.log('Fetching Marketing processes...');
  const marketingProcesses = await fetchProcessesByType(PROCESS_TYPES.MARKETING);

  // Count Move-In metrics
  const moveInUpcoming = moveInProcesses.filter(p =>
    p.stage?.name === 'Pre Move In' || p.stage?.name === 'Move In Set Up'
  ).length;

  // Count Move-Out metrics
  const moveOutUpcoming = moveOutProcesses.filter(p =>
    p.stage?.name === 'Move Out Upcoming' || p.stage?.name === 'Move Out Day'
  ).length;

  // Count Make-Ready metrics
  const makeReadyCompleted = makeReadyProcesses.filter(p =>
    p.stage?.name === 'Make Ready Completed' || p.stage?.name === 'Post Make Ready Inspection'
  ).length;

  // Count Marketing metrics (actively marketed = in certain stages)
  const vacantMarketed = marketingProcesses.filter(p =>
    MARKETED_STAGES.includes(p.stage?.name || '')
  ).length;

  // Vacant not marketed = Make Ready active but not yet in marketing
  const vacantNotMarketed = makeReadyProcesses.filter(p =>
    p.stage?.name !== 'Make Ready Completed' &&
    p.stage?.name !== 'Make Ready Cancelled'
  ).length;

  return {
    moveInUpcoming,
    moveInTotal: moveInProcesses.length,
    moveOutUpcoming,
    moveOutTotal: moveOutProcesses.length,
    makeReadyActive: makeReadyProcesses.length,
    makeReadyCompleted,
    vacantMarketed,
    vacantNotMarketed,
  };
}

// Get all dashboard data with caching to avoid rate limits
export async function fetchDashboardData(): Promise<{ properties: LeadSimpleProperty[], processMetrics: ProcessMetrics }> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (cachedDashboardData && (now - cachedDashboardData.timestamp) < CACHE_DURATION) {
    const age = Math.round((now - cachedDashboardData.timestamp) / 1000);
    console.log(`Using cached data (${age}s old, cache valid for ${CACHE_DURATION / 1000}s)`);
    return {
      properties: cachedDashboardData.properties,
      processMetrics: cachedDashboardData.processMetrics,
    };
  }

  // Fetch fresh data
  console.log('Cache miss or expired, fetching fresh data from LeadSimple API...');
  console.log('This will take ~15-30 seconds due to rate limiting...');

  const properties = await fetchAllProperties();
  const processMetrics = await fetchProcessMetricsInternal();

  // Update cache
  cachedDashboardData = {
    properties,
    processMetrics,
    timestamp: now,
  };

  console.log('Dashboard data cached successfully');
  return { properties, processMetrics };
}

// Legacy export for backward compatibility
export async function fetchProcessMetrics(): Promise<ProcessMetrics> {
  const { processMetrics } = await fetchDashboardData();
  return processMetrics;
}

export async function fetchTasks(): Promise<LeadSimpleTask[]> {
  const response = await fetchFromLeadSimple<{ data: LeadSimpleTask[] }>(
    '/tasks',
    { page: '1', per_page: '200' }
  );
  return response.data;
}

export async function fetchProcessTypes(): Promise<LeadSimpleProcessType[]> {
  const response = await fetchFromLeadSimple<{ data: LeadSimpleProcessType[] }>(
    '/process_types',
    { page: '1', per_page: '50' }
  );
  return response.data;
}

export async function fetchDeals(): Promise<LeadSimpleDeal[]> {
  const response = await fetchFromLeadSimple<{ data: LeadSimpleDeal[] }>(
    '/deals',
    { page: '1', per_page: '100' }
  );
  return response.data;
}

function getCustomFieldValue(customFields: CustomField[], key: string): string | undefined {
  const field = customFields.find(f => f.key === key);
  return field?.value;
}

export function processPropertyDetails(property: LeadSimpleProperty): PropertyWithDetails {
  const customFields = property.unit?.custom_fields || [];

  return {
    ...property,
    postal_code: property.zip_code || property.postal_code, // normalize to postal_code
    lockboxCode: getCustomFieldValue(customFields, 'smart_lock_keypad_code') ||
                 getCustomFieldValue(customFields, 'showmojo_lock'),
    cookingType: getCustomFieldValue(customFields, 'cooking_type'),
    hasGas: getCustomFieldValue(customFields, 'gas') === 'Yes',
    alarmCode: getCustomFieldValue(customFields, 'alarm_code'),
    isMarketed: property.unit?.occupancy === 'Vacant', // Properties being marketed are vacant ones
  };
}

export function calculateMetrics(properties: LeadSimpleProperty[]): DashboardMetrics {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const vacantProperties = properties.filter(p => p.unit?.occupancy === 'Vacant');

  // For demo purposes, assume all vacant properties are marketed
  // In reality, you'd check a "marketing_status" custom field
  const vacantMarketed = vacantProperties.length;
  const vacantNotMarketed = 0; // Would filter by marketing_status field

  // Count move-ins this month (properties with current_lease_move_in in current month)
  const moveInsThisMonth = properties.filter(p => {
    const moveIn = p.unit?.current_lease_move_in;
    if (!moveIn) return false;
    const moveInDate = new Date(moveIn);
    return moveInDate >= firstOfMonth && moveInDate <= now;
  }).length;

  // Count move-outs this month
  const moveOutsThisMonth = properties.filter(p => {
    const moveOut = p.unit?.current_lease_move_out;
    if (!moveOut) return false;
    const moveOutDate = new Date(moveOut);
    return moveOutDate >= firstOfMonth && moveOutDate <= now;
  }).length;

  // New properties this month
  const newPropertiesThisMonth = properties.filter(p => {
    const created = new Date(p.created_at);
    return created >= firstOfMonth && created <= now;
  }).length;

  // Inspections needed - properties without recent inspection (placeholder logic)
  const inspectionsNeeded = Math.floor(properties.length * 0.05); // 5% need inspection

  return {
    totalProperties: properties.length,
    vacantMarketed,
    vacantNotMarketed,
    moveInsThisMonth,
    moveOutsThisMonth,
    inspectionsNeeded,
    newPropertiesThisMonth,
  };
}

export function getVacantMarketedProperties(properties: LeadSimpleProperty[]): PropertyWithDetails[] {
  return properties
    .filter(p => p.unit?.occupancy === 'Vacant')
    .map(processPropertyDetails);
}

export function getVacantNotMarketedProperties(_properties: LeadSimpleProperty[]): PropertyWithDetails[] {
  // In a real implementation, this would filter by a marketing_status custom field
  // For now, return empty as an example
  return [];
}
