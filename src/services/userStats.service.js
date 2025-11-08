import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';

class UserStatsService {
  // Lấy danh sách user mới theo tháng
  async getNewUsersByMonth(period = '12months') {
    try {
      // Fetch a large list and aggregate by month from created_at
      // Use full URL from API_ENDPOINTS to ensure correct URL construction
      const res = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
        params: {
          is_fetch_all: true,
          no_pagination: true,
        },
      });
      const items = Array.isArray(res.data?.items) ? res.data.items : [];

      // Build a map of YYYY-MM -> count
      const byMonth = new Map();
      for (const u of items) {
        const d = u?.created_at ? new Date(u.created_at) : null;
        if (!d || isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        byMonth.set(key, (byMonth.get(key) || 0) + 1);
      }

      // Sort months ascending, then limit by period
      const allMonths = Array.from(byMonth.keys()).sort();
      const take = period === '3months' ? 3 : period === '6months' ? 6 : 12;
      const lastMonths = allMonths.slice(-take);

      const labels = lastMonths.map((k) => {
        const [y, m] = k.split('-');
        return `${m}/${y}`;
      });
      const data = lastMonths.map((k) => byMonth.get(k) || 0);

      return {
        labels,
        datasets: [
          {
            label: 'New Users',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching new users data:', error);
      throw error;
    }
  }

  async getUserActivityByDay() {
    try {
      // Use recent users as a proxy to build weekly activity
      // Use full URL from API_ENDPOINTS to ensure correct URL construction
      const res = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
        params: {
          page: 1,
          limit: 200,
          no_pagination: false,
          is_fetch_all: false,
          sort_type: -1,
        },
      });
      
      // Handle different response structures
      let items = [];
      if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      } else if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data?.data)) {
        items = res.data.data;
      }

      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const activeCounts = Array(7).fill(0);
      const newCounts = Array(7).fill(0);

      for (const u of items) {
        // Try different date field names
        const createdStr = u?.created_at || u?.createdAt || u?.created_at_date;
        const updatedStr = u?.updated_at || u?.updatedAt || u?.updated_at_date;
        
        const created = createdStr ? new Date(createdStr) : null;
        const updated = updatedStr ? new Date(updatedStr) : null;
        
        if (created && !isNaN(created.getTime())) {
          const idx = (created.getDay() + 6) % 7; // convert Sun(0) to 6
          newCounts[idx] += 1;
        }
        if (updated && !isNaN(updated.getTime())) {
          const idx = (updated.getDay() + 6) % 7;
          activeCounts[idx] += 1;
        }
      }

      return {
        labels: dayLabels,
        datasets: [
          {
            label: 'Active Users',
            data: activeCounts,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'New Users',
            data: newCounts,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching user activity data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      // Return empty chart data structure instead of throwing to prevent component crash
      return {
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
      };
    }
  }

  // Lấy tổng quan thống kê người dùng
  async getUserStatsSummary() {
    try {
      // Use full URL from API_ENDPOINTS to ensure correct URL construction
      const res = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
        params: { is_fetch_all: true, no_pagination: true },
      });
      const items = Array.isArray(res.data?.items) ? res.data.items : [];

      // compute for last two months
      const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const byMonth = new Map();
      for (const u of items) {
        const d = u?.created_at ? new Date(u.created_at) : null;
        if (!d || isNaN(d.getTime())) continue;
        const k = monthKey(d);
        byMonth.set(k, (byMonth.get(k) || 0) + 1);
      }
      const sorted = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      const last = sorted[sorted.length - 1]?.[1] || 0;
      const prev = sorted[sorted.length - 2]?.[1] || 0;
      const growthRate = prev ? ((last - prev) / prev) * 100 : 0;
      const totalNewUsersThisYear = sorted.reduce((s, [, v]) => s + v, 0);
      const averageNewUsersPerMonth = sorted.length ? totalNewUsersThisYear / sorted.length : 0;
      const peak = sorted.reduce((max, cur) => (cur[1] > max[1] ? cur : max), sorted[0] || ['-', 0]);

      return {
        totalUsers: items.length,
        newUsersThisMonth: last,
        growthRate: Math.round(growthRate * 10) / 10,
        averageNewUsersPerMonth: Math.round(averageNewUsersPerMonth),
        totalNewUsersThisYear,
        peakMonth: { month: peak?.[0] || '-', newUsers: peak?.[1] || 0 },
      };
    } catch (error) {
      console.error('Error fetching user stats summary:', error);
      throw error;
    }
  }
}

export default new UserStatsService();
