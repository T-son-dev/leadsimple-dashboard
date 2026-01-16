'use client';

import { useState } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ChevronRight,
  Users,
  Mail,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { leaseRenewalStages, WorkflowStage } from '@/lib/data';

interface WorkflowViewerProps {
  processName: string;
  onClose: () => void;
}

export default function WorkflowViewer({ processName, onClose }: WorkflowViewerProps) {
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);

  const statusConfig = {
    active: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: Play },
    completed: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: CheckCircle },
    canceled: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: XCircle },
    backlog: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700', icon: Clock },
    pending: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500', icon: Clock }
  };

  const mainStages = leaseRenewalStages.filter(s => s.branch === 'main' && !s.id.startsWith('lr-c'));
  const renewalStages = leaseRenewalStages.filter(s => s.branch === 'renewal');
  const nonRenewalStages = leaseRenewalStages.filter(s => s.branch === 'non-renewal');
  const canceledStages = leaseRenewalStages.filter(s => s.id.startsWith('lr-c'));

  const renderStage = (stage: WorkflowStage) => {
    const config = statusConfig[stage.status];
    const Icon = config.icon;

    return (
      <div
        key={stage.id}
        onClick={() => setSelectedStage(stage)}
        className={`workflow-node ${stage.status} cursor-pointer min-w-[180px]`}
      >
        <div className="flex items-center justify-between mb-2">
          <Icon className={`w-4 h-4 ${config.text}`} />
          {stage.count > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
              {stage.count}
            </span>
          )}
        </div>
        <h4 className="font-medium text-sm text-gray-900 mb-1">{stage.name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {stage.automations > 0 && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              {stage.automations}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{processName}</h2>
            <p className="text-sm text-gray-500">16 stages • Branching workflow</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Draft Mode
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-6">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <span key={key} className="flex items-center gap-1.5 text-sm">
                <span className={`w-3 h-3 rounded-full ${config.bg} ${config.border} border-2`}></span>
                <span className="capitalize text-gray-600">{key}</span>
              </span>
            );
          })}
        </div>

        {/* Workflow Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {/* Main Branch */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Initial Stages</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {mainStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  {renderStage(stage)}
                  {index < mainStages.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Branch Point */}
          <div className="relative mb-8 pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Renewal Branch */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                  Renewal Path
                </h3>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-4 pl-4">
                {renewalStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    {renderStage(stage)}
                    {index < renewalStages.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Renewal Branch */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                  Non-Renewal Path
                </h3>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-4 pl-4">
                {nonRenewalStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    {renderStage(stage)}
                    {index < nonRenewalStages.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Canceled States */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                  Canceled States
                </h3>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-4 pl-4">
                {canceledStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    {renderStage(stage)}
                    {index < canceledStages.length - 1 && (
                      <div className="w-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stage Details Panel */}
        {selectedStage && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedStage.name}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStage.count} properties in this stage • {selectedStage.automations} automation{selectedStage.automations !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Edit Email Template
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Configure Automation
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  View Properties
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              Save as Draft
            </button>
            <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2">
              <Play className="w-4 h-4" />
              Activate Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
