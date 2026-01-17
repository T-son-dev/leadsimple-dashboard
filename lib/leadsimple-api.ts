// LeadSimple API Integration
// API Key is stored securely and used for server-side requests only

const API_BASE_URL = 'https://api.leadsimple.com/rest';
const API_KEY = process.env.LEADSIMPLE_API_KEY || '';

export interface LeadSimpleProperty {
  id: string;
  address: string;
  address_2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  postal_code?: string; // alias for compatibility
  country?: string;
  unit: {
    id: string;
    occupancy: 'Vacant' | 'Occupied' | string;
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

async function fetchFromLeadSimple<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
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
      { page: page.toString(), per_page: '100', include_custom_fields: 'true' }
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

export function getVacantNotMarketedProperties(properties: LeadSimpleProperty[]): PropertyWithDetails[] {
  // In a real implementation, this would filter by a marketing_status custom field
  // For now, return empty as an example
  return [];
}
