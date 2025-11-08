'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import userStatsService from '@/services/userStats.service';
import { 
  ArrowTrendingUpIcon,
  CalendarIcon 
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
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

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
      
      // Process users data for growth chart
      // Since there's no created_at, we'll show current user distribution
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.is_active && !u.deleted_at).length;
      const inactiveUsers = users.filter(u => !u.is_active || u.deleted_at).length;
      
      // Group by role
      const roleDistribution = users.reduce((acc, user) => {
        const role = user.role_id || 'unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      
      // For time-based growth, still use service
      // But we can enhance with current user stats
      loadChartData();
    } catch (error) {
      console.error('Error processing user growth data:', error);
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const data = await userStatsService.getNewUsersByMonth(selectedPeriod);

      // Derive total users cumulatively from new users data
      const totalUsersData = data.datasets[0].data.reduce((acc, cur) => {
        const prev = acc.length ? acc[acc.length - 1] : 0;
        acc.push(prev + (Number(cur) || 0));
        return acc;
      }, []);

      const combinedData = {
        labels: data.labels,
        datasets: [
          {
            type: 'bar',
            label: 'New Users',
            data: data.datasets[0].data,
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
            data: totalUsersData,
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
          text: 'New Users',
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
              <h3 className="text-lg font-medium text-gray-900">User Growth Analysis</h3>
              <p className="text-sm text-gray-500">New users vs total user base over time</p>
            </div>
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
                <span>New Users (Monthly)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Total Users (Cumulative)</span>
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
