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

export default function NewUsersChart({ users = [] }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    if (users.length > 0) {
      loadChartDataFromUsers();
    } else {
      loadChartData();
    }
  }, [selectedPeriod, users]);

  const loadChartDataFromUsers = () => {
    try {
      setIsLoading(true);
      
      // Process users data to create chart data
      // Since there's no created_at in the response, we'll use available data
      // For now, we'll create a simple chart based on active/inactive users
      const activeUsers = users.filter(u => u.is_active && !u.deleted_at).length;
      const inactiveUsers = users.filter(u => !u.is_active || u.deleted_at).length;
      
      // Group by role_id for additional insights
      const roleGroups = users.reduce((acc, user) => {
        const role = user.role_id || 'unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      
      // Create summary stats
      const summary = {
        totalUsers: users.length,
        activeUsers: activeUsers,
        inactiveUsers: inactiveUsers,
        newUsersThisMonth: 0, // Can't calculate without created_at
        growthRate: 0
      };
      
      setStatsSummary(summary);
      
      // For now, use the service for time-based data
      // But we can enhance this later if created_at is added to the API
      loadChartData();
    } catch (error) {
      console.error('Error processing user data:', error);
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const [chartDataResult, summaryResult] = await Promise.all([
        userStatsService.getNewUsersByMonth(selectedPeriod),
        userStatsService.getUserStatsSummary()
      ]);
      
      // Merge summary with user list data if available
      if (users.length > 0 && statsSummary) {
        summaryResult.totalUsers = statsSummary.totalUsers;
        summaryResult.activeUsers = statsSummary.activeUsers;
        summaryResult.inactiveUsers = statsSummary.inactiveUsers;
      }
      
      setChartData(chartDataResult);
      setStatsSummary(summaryResult || statsSummary);
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
          {chartData && chartData.labels && chartData.labels.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No Data Available</p>
                <p className="text-sm">There are no users to display in the selected period.</p>
              </div>
            </div>
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
