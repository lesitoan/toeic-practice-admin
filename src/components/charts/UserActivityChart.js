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
import { UsersIcon, UserPlusIcon } from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserActivityChart({ users = [] }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (users.length > 0) {
      loadChartDataFromUsers();
    } else {
      loadChartData();
    }
  }, [users]);

  const loadChartDataFromUsers = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Process users data to create activity chart
      // Group users by role_id for activity insights
      const roleActivity = users.reduce((acc, user) => {
        const role = user.role_id || 'unknown';
        if (!acc[role]) {
          acc[role] = { active: 0, inactive: 0 };
        }
        if (user.is_active && !user.deleted_at) {
          acc[role].active++;
        } else {
          acc[role].inactive++;
        }
        return acc;
      }, {});
      
      // Create chart data from user list
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const activeCount = users.filter(u => u.is_active && !u.deleted_at).length;
      const avgDailyActive = Math.round(activeCount / 7);
      
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Active Users',
            data: labels.map(() => avgDailyActive),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      };
      
      setChartData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing user activity data:', error);
      setError('Failed to process user activity data');
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userStatsService.getUserActivityByDay();
      setChartData(data);
    } catch (error) {
      console.error('Error loading user activity data:', error);
      setError('Failed to load user activity data');
      // Set empty chart data as fallback
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Active Users',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'New Users',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      });
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
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 20,
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
        <div className="flex items-center">
          <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Weekly User Activity</h3>
            <p className="text-sm text-gray-500">Active and new users by day of the week</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64">
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <p className="text-gray-500 text-xs">Please check your connection and try again.</p>
              </div>
            </div>
          )}
          {!error && chartData && (
            <Bar data={chartData} options={chartOptions} />
          )}
          {!error && !chartData && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-600">Active Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">New Users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
