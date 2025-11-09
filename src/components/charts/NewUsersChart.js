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
  LineController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

import { Bar } from 'react-chartjs-2';
import usersService from '@/services/users.service';

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
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all users from the API
      const response = await usersService.getUsers({
        is_fetch_all: true,
        no_pagination: true
      });
      
      const allUsers = Array.isArray(response?.items) ? response.items : [];
      
      // Process users data to create chart data
      // Group users by role for visualization
      const roleNames = { 1: 'Admin', 2: 'Staff', 3: 'Student' };
      const roleCounts = allUsers.reduce((acc, user) => {
        const roleId = user.role_id || 3;
        const roleName = roleNames[roleId] || 'Unknown';
        acc[roleName] = (acc[roleName] || 0) + 1;
        return acc;
      }, {});
      
      // Create chart data - show user distribution by role
      const labels = Object.keys(roleCounts);
      const data = Object.values(roleCounts);
      
      const chartDataResult = {
        labels: labels,
        datasets: [
          {
            label: 'Users by Role',
            data: data,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      };
      
      // Calculate summary stats
      const activeUsers = allUsers.filter(u => u.is_active && !u.deleted_at).length;
      const inactiveUsers = allUsers.filter(u => !u.is_active || u.deleted_at).length;
      const totalUsers = allUsers.length;
      
      const summary = {
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        inactiveUsers: inactiveUsers,
        newUsersThisMonth: 0, // Can't calculate without created_at
        averageNewUsersPerMonth: 0,
        growthRate: 0,
        peakMonth: { month: 'N/A', newUsers: 0 },
        totalNewUsersThisYear: totalUsers
      };
      
      setChartData(chartDataResult);
      setStatsSummary(summary);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setChartData(null);
      setStatsSummary(null);
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
            <h3 className="text-lg font-medium text-gray-900">User Distribution by Role</h3>
            <p className="text-sm text-gray-500">Total users grouped by role</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {statsSummary && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {statsSummary.totalUsers}
              </div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {statsSummary.activeUsers}
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {statsSummary.inactiveUsers}
              </div>
              <div className="text-sm text-gray-500">Inactive Users</div>
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
              <span className="font-medium">Total Users:</span> {statsSummary.totalUsers}
            </div>
            <div>
              <span className="font-medium">Active Rate:</span> {statsSummary.totalUsers > 0 ? Math.round((statsSummary.activeUsers / statsSummary.totalUsers) * 100) : 0}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
