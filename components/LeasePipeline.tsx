'use client';

import { Calendar, CheckCircle, Clock, AlertCircle, User, Building2 } from 'lucide-react';
import { leaseRenewalPipeline } from '@/lib/data';

export default function LeasePipeline() {
  const statusConfig = {
    'not-started': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Not Started' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-600', label: 'In Progress' },
    'pending-decision': { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Pending Decision' },
    'signed': { bg: 'bg-green-100', text: 'text-green-600', label: 'Signed' }
  };

  const columns = [
    { key: '90days', label: '90 Days Out', color: 'border-blue-500', bg: 'bg-blue-50' },
    { key: '60days', label: '60 Days Out', color: 'border-yellow-500', bg: 'bg-yellow-50' },
    { key: '30days', label: '30 Days Out', color: 'border-red-500', bg: 'bg-red-50' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Lease Renewal Pipeline</h3>
          <p className="text-sm text-gray-500">Track upcoming lease expirations</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {columns.map((column) => {
          const items = leaseRenewalPipeline[column.key as keyof typeof leaseRenewalPipeline];
          return (
            <div key={column.key} className="p-4">
              <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${column.color}`}>
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">{column.label}</span>
                <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer ${column.bg}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{item.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <User className="w-3 h-3" />
                        <span>{item.tenant}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Expires: {item.leaseEnd}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
