import React from 'react';

const ScoreTrendChart = ({ scoreData }) => {
  const getMaxScore = () => Math.max(...scoreData.map(d => d.averageScore));
  const getMaxTests = () => Math.max(...scoreData.map(d => d.totalTests));

  const maxScore = getMaxScore();
  const maxTests = getMaxTests();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Trends Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {scoreData.map((data, index) => {
            const scoreHeight = (data.averageScore / maxScore) * 100;
            const testHeight = (data.totalTests / maxTests) * 100;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center space-x-1 mb-2">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${scoreHeight}%`, width: '60%' }}
                    title={`Score: ${data.averageScore}%`}
                  />
                  <div 
                    className="bg-green-500 rounded-t"
                    style={{ height: `${testHeight}%`, width: '60%' }}
                    title={`Tests: ${data.totalTests}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            Average Score
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            Total Tests
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTrendChart;
