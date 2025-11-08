import React from 'react';
import { ACTIVITY_TYPE_COLORS } from '@/constants/analytics';

const RecentActivity = ({ recentActivity = [] }) => {
  if (recentActivity.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="h-32 flex items-center justify-center text-gray-500">
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${ACTIVITY_TYPE_COLORS[activity.type] || 'bg-gray-400'}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action || 'N/A'}</p>
                <p className="text-xs text-gray-500">{activity.time || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
