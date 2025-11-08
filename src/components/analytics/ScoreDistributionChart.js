import React from 'react';

const ScoreDistributionChart = ({ scoreDistribution = [] }) => {
  if (scoreDistribution.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
        <div className="space-y-3">
          {scoreDistribution.map((item, index) => (
            <div key={item.range || index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">{item.range || 'N/A'}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color || 'bg-gray-400'}`}
                    style={{ width: `${item.percentage || 0}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">{item.count || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreDistributionChart;
