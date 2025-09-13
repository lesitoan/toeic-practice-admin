import React from 'react';

const TestCompletionRates = ({ testCompletionData }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Completion Rates</h3>
        <div className="space-y-4">
          {testCompletionData.map((test) => (
            <div key={test.test} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{test.test}</span>
                  <span className="text-sm text-gray-500">{test.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${test.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-sm font-medium text-gray-900">{test.averageScore}%</div>
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
