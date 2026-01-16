'use client';

import { GitBranch, Play, Pause, FileEdit, MoreVertical, Clock, CheckCircle } from 'lucide-react';
import { Process } from '@/lib/data';

interface ProcessCardProps {
  process: Process;
  onClick?: () => void;
}

export default function ProcessCard({ process, onClick }: ProcessCardProps) {
  const statusConfig = {
    active: {
      badge: 'bg-green-100 text-green-700',
      icon: <Play className="w-3 h-3" />,
      label: 'Active'
    },
    draft: {
      badge: 'bg-orange-100 text-orange-700',
      icon: <FileEdit className="w-3 h-3" />,
      label: 'Draft'
    },
    paused: {
      badge: 'bg-gray-100 text-gray-700',
      icon: <Pause className="w-3 h-3" />,
      label: 'Paused'
    }
  };

  const config = statusConfig[process.status];

  const categoryColors: Record<string, string> = {
    'Tenant Lifecycle': 'bg-blue-50 text-blue-700 border-blue-200',
    'Operations': 'bg-purple-50 text-purple-700 border-purple-200',
    'Onboarding': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Compliance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Internal': 'bg-slate-50 text-slate-700 border-slate-200',
    'Legal': 'bg-red-50 text-red-700 border-red-200',
    'Financials': 'bg-cyan-50 text-cyan-700 border-cyan-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-5 card-hover cursor-pointer ${
        process.status === 'draft' ? 'border-dashed border-orange-300' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${process.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <GitBranch className={`w-5 h-5 ${process.status === 'active' ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{process.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[process.category] || 'bg-gray-50 text-gray-700'}`}>
              {process.category}
            </span>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.badge}`}>
          {config.icon}
          {config.label}
        </span>
        <span className="text-xs text-gray-500">{process.stages} stages</span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{process.activeCount}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{process.completedCount}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-600">{process.avgDuration}</p>
          <p className="text-xs text-gray-500">Avg Time</p>
        </div>
      </div>

      {process.status === 'draft' && (
        <div className="mt-4 pt-4 border-t border-orange-200 bg-orange-50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
          <p className="text-xs text-orange-700 flex items-center gap-1">
            <FileEdit className="w-3 h-3" />
            This workflow is not yet active. Click to configure and activate.
          </p>
        </div>
      )}
    </div>
  );
}
