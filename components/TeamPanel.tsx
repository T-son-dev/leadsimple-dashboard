'use client';

import { teamMembers } from '@/lib/data';

export default function TeamPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Team Workload</h3>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${
                  ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][member.id % 4]
                }, ${['#1d4ed8', '#6d28d9', '#be185d', '#d97706'][member.id % 4]})`
              }}
            >
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{member.activeTasks}</p>
              <p className="text-xs text-gray-500">tasks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
