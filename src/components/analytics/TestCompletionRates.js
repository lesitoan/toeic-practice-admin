import React from 'react';

const TestCompletionRates = ({ testCompletionData = [] }) => {
  if (testCompletionData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Completion Rates</h3>
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Completion Rates</h3>
        <div className="space-y-4">
          {testCompletionData.map((test, index) => (
            <div key={test.test || index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{test.test || 'N/A'}</span>
                  <span className="text-sm text-gray-500">{test.completionRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${test.completionRate || 0}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-sm font-medium text-gray-900">{test.averageScore || 0}%</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestCompletionRates;
