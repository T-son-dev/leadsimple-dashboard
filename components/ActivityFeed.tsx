'use client';

import { Zap, User, Monitor, Clock, Building2 } from 'lucide-react';
import { recentActivity } from '@/lib/data';

export default function ActivityFeed() {
  const typeConfig = {
    automation: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    manual: { icon: User, color: 'text-blue-500', bg: 'bg-blue-100' },
    system: { icon: Monitor, color: 'text-purple-500', bg: 'bg-purple-100' }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {recentActivity.map((activity) => {
          const config = typeConfig[activity.type as keyof typeof typeConfig];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                  <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{activity.property}</span>
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                    <span className="text-xs text-gray-500">{activity.user}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">{activity.time}</span>
                  <span className="sm:hidden">{activity.time.split(' ')[0]}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
