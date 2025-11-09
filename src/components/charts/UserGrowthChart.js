'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

import { Chart } from 'react-chartjs-2';
import usersService from '@/services/users.service';
import { 
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function UserGrowthChart({ users = [] }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      // Process users data for growth chart
      // Since there's no created_at, we'll show user distribution by role and status
      const roleNames = { 1: 'Admin', 2: 'Staff', 3: 'Student' };
      
      // Group by role
      const roleDistribution = allUsers.reduce((acc, user) => {
        const roleId = user.role_id || 3;
        const roleName = roleNames[roleId] || 'Unknown';
        acc[roleName] = (acc[roleName] || 0) + 1;
        return acc;
      }, {});
      
      // Group by active/inactive
      const activeCount = allUsers.filter(u => u.is_active && !u.deleted_at).length;
      const inactiveCount = allUsers.filter(u => !u.is_active || u.deleted_at).length;
      
      // Create chart data - show role distribution as bars and total as line
      const labels = Object.keys(roleDistribution);
      const roleData = Object.values(roleDistribution);
      const totalUsers = allUsers.length;
      
      const combinedData = {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Users by Role',
            data: roleData,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'Total Users',
            data: labels.map(() => totalUsers),
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            yAxisID: 'y1',
          }
        ]
      };
      
      setChartData(combinedData);
    } catch (error) {
      console.error('Error loading user growth data:', error);
      setChartData(null);
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
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.dataset.type === 'line') {
              return `${label}: ${value.toLocaleString()} total users`;
            }
            return `${label}: ${value} new users`;
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
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 10,
          callback: function(value) {
            return value;
          }
        },
        title: {
          display: true,
          text: 'Users by Role',
          color: 'rgba(59, 130, 246, 1)',
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Total Users',
          color: 'rgba(34, 197, 94, 1)',
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
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">User Distribution Analysis</h3>
              <p className="text-sm text-gray-500">User distribution by role and total count</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          {chartData && (
            <Chart type="bar" data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Users by Role</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Total Users</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Hover over data points for detailed information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
