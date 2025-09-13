import React from 'react';

const ScoreDistributionChart = ({ scoreDistribution }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
        <div className="space-y-3">
          {scoreDistribution.map((item) => (
            <div key={item.range} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">{item.range}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreDistributionChart;
