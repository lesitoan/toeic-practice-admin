// Mock data for user statistics
const mockNewUsersData = [
  { month: 'Jan 2024', newUsers: 45, totalUsers: 245 },
  { month: 'Feb 2024', newUsers: 52, totalUsers: 297 },
  { month: 'Mar 2024', newUsers: 38, totalUsers: 335 },
  { month: 'Apr 2024', newUsers: 61, totalUsers: 396 },
  { month: 'May 2024', newUsers: 47, totalUsers: 443 },
  { month: 'Jun 2024', newUsers: 55, totalUsers: 498 },
  { month: 'Jul 2024', newUsers: 42, totalUsers: 540 },
  { month: 'Aug 2024', newUsers: 58, totalUsers: 598 },
  { month: 'Sep 2024', newUsers: 49, totalUsers: 647 },
  { month: 'Oct 2024', newUsers: 63, totalUsers: 710 },
  { month: 'Nov 2024', newUsers: 51, totalUsers: 761 },
  { month: 'Dec 2024', newUsers: 67, totalUsers: 828 }
];

const mockUserGrowthData = [
  { week: 'Week 1', newUsers: 12, activeUsers: 156 },
  { week: 'Week 2', newUsers: 18, activeUsers: 162 },
  { week: 'Week 3', newUsers: 15, activeUsers: 168 },
  { week: 'Week 4', newUsers: 22, activeUsers: 175 },
  { week: 'Week 5', newUsers: 19, activeUsers: 182 },
  { week: 'Week 6', newUsers: 25, activeUsers: 190 },
  { week: 'Week 7', newUsers: 21, activeUsers: 198 },
  { week: 'Week 8', newUsers: 28, activeUsers: 208 }
];

const mockUserActivityData = [
  { day: 'Mon', activeUsers: 145, newUsers: 8 },
  { day: 'Tue', activeUsers: 162, newUsers: 12 },
  { day: 'Wed', activeUsers: 158, newUsers: 10 },
  { day: 'Thu', activeUsers: 171, newUsers: 15 },
  { day: 'Fri', activeUsers: 189, newUsers: 18 },
  { day: 'Sat', activeUsers: 134, newUsers: 6 },
  { day: 'Sun', activeUsers: 98, newUsers: 4 }
];

class UserStatsService {
  // Get new users data by month
  async getNewUsersByMonth(period = '12months') {
    try {
      let data = [...mockNewUsersData];
      
      // Filter data based on period
      switch (period) {
        case '6months':
          data = data.slice(-6);
          break;
        case '3months':
          data = data.slice(-3);
          break;
        case '1year':
        case '12months':
        default:
          data = data.slice(-12);
          break;
      }
      
      return {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'New Users',
            data: data.map(item => item.newUsers),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching new users data:', error);
      throw error;
    }
  }

  // Get user growth data by week
  async getUserGrowthByWeek() {
    try {
      return {
        labels: mockUserGrowthData.map(item => item.week),
        datasets: [
          {
            label: 'New Users',
            data: mockUserGrowthData.map(item => item.newUsers),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Active Users',
            data: mockUserGrowthData.map(item => item.activeUsers),
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      throw error;
    }
  }

  // Get user activity data by day of week
  async getUserActivityByDay() {
    try {
      return {
        labels: mockUserActivityData.map(item => item.day),
        datasets: [
          {
            label: 'Active Users',
            data: mockUserActivityData.map(item => item.activeUsers),
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'New Users',
            data: mockUserActivityData.map(item => item.newUsers),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching user activity data:', error);
      throw error;
    }
  }

  // Get user statistics summary
  async getUserStatsSummary() {
    try {
      const latestMonth = mockNewUsersData[mockNewUsersData.length - 1];
      const previousMonth = mockNewUsersData[mockNewUsersData.length - 2];
      
      const growthRate = previousMonth ? 
        ((latestMonth.newUsers - previousMonth.newUsers) / previousMonth.newUsers * 100) : 0;
      
      const totalNewUsersThisYear = mockNewUsersData.reduce((sum, month) => sum + month.newUsers, 0);
      const averageNewUsersPerMonth = totalNewUsersThisYear / mockNewUsersData.length;
      
      return {
        totalUsers: latestMonth.totalUsers,
        newUsersThisMonth: latestMonth.newUsers,
        growthRate: Math.round(growthRate * 10) / 10,
        averageNewUsersPerMonth: Math.round(averageNewUsersPerMonth),
        totalNewUsersThisYear,
        peakMonth: mockNewUsersData.reduce((max, month) => 
          month.newUsers > max.newUsers ? month : max
        )
      };
    } catch (error) {
      console.error('Error fetching user stats summary:', error);
      throw error;
    }
  }

  // Get user registration trends
  async getUserRegistrationTrends() {
    try {
      const trends = mockNewUsersData.map((month, index) => {
        const previousMonth = index > 0 ? mockNewUsersData[index - 1] : null;
        const change = previousMonth ? month.newUsers - previousMonth.newUsers : 0;
        const changePercent = previousMonth ? (change / previousMonth.newUsers * 100) : 0;
        
        return {
          month: month.month,
          newUsers: month.newUsers,
          change,
          changePercent: Math.round(changePercent * 10) / 10,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      });
      
      return trends;
    } catch (error) {
      console.error('Error fetching user registration trends:', error);
      throw error;
    }
  }
}

export default new UserStatsService();
