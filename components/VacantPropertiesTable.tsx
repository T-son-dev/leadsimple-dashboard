'use client';

import { useState } from 'react';
import {
  Building2,
  Key,
  Flame,
  Zap,
  MapPin,
  BedDouble,
  Bath,
  DollarSign,
  Eye,
  X,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export interface VacantProperty {
  id: string;
  address: string;
  address_2?: string | null;
  city: string;
  state: string;
  zip_code?: string;
  postal_code?: string;
  link?: string;
  unit?: {
    num_bedrooms?: string;
    num_bathrooms?: string;
    market_rent?: string;
    current_rent?: string;
    square_feet?: number;
    occupancy?: string;
  };
  lockboxCode?: string;
  cookingType?: string;
  hasGas?: boolean;
  alarmCode?: string;
  daysVacant?: number;
}

interface VacantPropertiesTableProps {
  properties: VacantProperty[];
  title: string;
  subtitle?: string;
  emptyMessage?: string;
}

export default function VacantPropertiesTable({
  properties,
  title,
  subtitle,
  emptyMessage = 'No properties found'
}: VacantPropertiesTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<VacantProperty | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCurrency = (value?: string) => {
    if (!value) return '-';
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {properties.length} Properties
            </span>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lockbox
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Utilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{property.address}</p>
                          <p className="text-sm text-gray-500">
                            {property.city}, {property.state} {property.zip_code || property.postal_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" />
                          {property.unit?.num_bedrooms || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {property.unit?.num_bathrooms || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(property.unit?.market_rent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {property.lockboxCode ? (
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-amber-500" />
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {property.lockboxCode}
                          </code>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {property.hasGas || property.cookingType === 'Gas' ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            <Flame className="w-3 h-3" />
                            Gas
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <Zap className="w-3 h-3" />
                            Electric
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedProperty.address}</h2>
                <p className="text-sm text-gray-500">
                  {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip_code || selectedProperty.postal_code}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                    <BedDouble className="w-4 h-4" />
                    <span className="text-xs uppercase">Bedrooms</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedProperty.unit?.num_bedrooms || '-'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-xs uppercase">Bathrooms</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedProperty.unit?.num_bathrooms || '-'}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs uppercase">Market Rent</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedProperty.unit?.market_rent)}
                  </p>
                </div>
              </div>

              {/* Access Information */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Access Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lockbox Code</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-1 rounded border border-amber-200 text-lg font-mono font-bold text-amber-800">
                        {selectedProperty.lockboxCode || 'Not set'}
                      </code>
                      {selectedProperty.lockboxCode && (
                        <button
                          onClick={() => copyToClipboard(selectedProperty.lockboxCode!, 'lockbox')}
                          className="p-2 hover:bg-amber-100 rounded transition-colors"
                        >
                          {copiedField === 'lockbox' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-amber-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedProperty.alarmCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Alarm Code</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-3 py-1 rounded border border-amber-200 font-mono">
                          {selectedProperty.alarmCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedProperty.alarmCode!, 'alarm')}
                          className="p-2 hover:bg-amber-100 rounded transition-colors"
                        >
                          {copiedField === 'alarm' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-amber-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Utility Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Utility Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedProperty.cookingType === 'Gas' || selectedProperty.hasGas
                        ? 'bg-orange-100'
                        : 'bg-blue-100'
                    }`}>
                      {selectedProperty.cookingType === 'Gas' || selectedProperty.hasGas ? (
                        <Flame className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Zap className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cooking Type</p>
                      <p className="font-medium text-gray-900">
                        {selectedProperty.cookingType || (selectedProperty.hasGas ? 'Gas' : 'Electric')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedProperty.hasGas ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      <Flame className={`w-5 h-5 ${selectedProperty.hasGas ? 'text-orange-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gas Service</p>
                      <p className="font-medium text-gray-900">
                        {selectedProperty.hasGas ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedProperty.address}, ${selectedProperty.city}, ${selectedProperty.state} ${selectedProperty.zip_code || selectedProperty.postal_code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  View on Map
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Open in LeadSimple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
