import React from 'react';
import { SCORE_RANGES } from '@/constants/results';

const ScoreDistributionChart = ({ results }) => {
  // Calculate score distribution
  const getScoreDistribution = () => {
    return {
      excellent: results.filter(r => r.score >= 90).length,
      good: results.filter(r => r.score >= 80 && r.score < 90).length,
      average: results.filter(r => r.score >= 70 && r.score < 80).length,
      below: results.filter(r => r.score < 70).length,
    };
  };

  const scoreDistribution = getScoreDistribution();

  const distributionItems = [
    {
      key: 'excellent',
      count: scoreDistribution.excellent,
      config: SCORE_RANGES.excellent
    },
    {
      key: 'good',
      count: scoreDistribution.good,
      config: SCORE_RANGES.good
    },
    {
      key: 'average',
      count: scoreDistribution.average,
      config: SCORE_RANGES.average
    },
    {
      key: 'below',
      count: scoreDistribution.below,
      config: SCORE_RANGES.below
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {distributionItems.map((item) => (
            <div key={item.key} className="text-center">
              <div className={`text-2xl font-bold text-${item.config.color}-600`}>
                {item.count}
              </div>
              <div className="text-sm text-gray-500">
                {item.config.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreDistributionChart;
