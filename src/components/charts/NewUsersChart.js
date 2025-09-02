'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import userStatsService from '@/services/userStats.service';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function NewUsersChart() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const [chartDataResult, summaryResult] = await Promise.all([
        userStatsService.getNewUsersByMonth(selectedPeriod),
        userStatsService.getUserStatsSummary()
      ]);
      
      setChartData(chartDataResult);
      setStatsSummary(summaryResult);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} users`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 10,
          callback: function(value) {
            return value;
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const getGrowthIcon = (growthRate) => {
    if (growthRate > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (growthRate < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getGrowthColor = (growthRate) => {
    if (growthRate > 0) return 'text-green-600';
    if (growthRate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">New Users Registration</h3>
            <p className="text-sm text-gray-500">Monthly user registration trends</p>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {statsSummary && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {statsSummary.newUsersThisMonth}
              </div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {statsSummary.averageNewUsersPerMonth}
              </div>
              <div className="text-sm text-gray-500">Monthly Average</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center ${getGrowthColor(statsSummary.growthRate)}`}>
                {getGrowthIcon(statsSummary.growthRate)}
                <span className="ml-1">{Math.abs(statsSummary.growthRate)}%</span>
              </div>
              <div className="text-sm text-gray-500">Growth Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          {chartData && (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Additional Info */}
      {statsSummary && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">Peak Month:</span> {statsSummary.peakMonth.month} ({statsSummary.peakMonth.newUsers} users)
            </div>
            <div>
              <span className="font-medium">Total New Users This Year:</span> {statsSummary.totalNewUsersThisYear}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
