// Mock data for analytics
export const MOCK_SCORE_DATA = [
  { month: 'Jan', averageScore: 75, totalTests: 120, activeUsers: 45 },
  { month: 'Feb', averageScore: 78, totalTests: 135, activeUsers: 52 },
  { month: 'Mar', averageScore: 82, totalTests: 150, activeUsers: 58 },
  { month: 'Apr', averageScore: 79, totalTests: 142, activeUsers: 55 },
  { month: 'May', averageScore: 85, totalTests: 168, activeUsers: 62 },
  { month: 'Jun', averageScore: 88, totalTests: 185, activeUsers: 68 },
  { month: 'Jul', averageScore: 86, totalTests: 172, activeUsers: 65 },
  { month: 'Aug', averageScore: 89, totalTests: 195, activeUsers: 72 },
  { month: 'Sep', averageScore: 91, totalTests: 210, activeUsers: 78 },
  { month: 'Oct', averageScore: 88, totalTests: 198, activeUsers: 75 },
  { month: 'Nov', averageScore: 92, totalTests: 225, activeUsers: 82 },
  { month: 'Dec', averageScore: 90, totalTests: 218, activeUsers: 80 },
];

export const MOCK_TEST_COMPLETION_DATA = [
  { test: 'Test #1', completionRate: 95, averageScore: 78, totalAttempts: 45 },
  { test: 'Test #2', completionRate: 88, averageScore: 82, totalAttempts: 38 },
  { test: 'Test #3', completionRate: 92, averageScore: 85, totalAttempts: 42 },
  { test: 'Test #4', completionRate: 85, averageScore: 79, totalAttempts: 35 },
  { test: 'Test #5', completionRate: 90, averageScore: 87, totalAttempts: 40 },
];

export const MOCK_USER_PROGRESS_DATA = [
  { user: 'Sarah Johnson', testsTaken: 12, averageScore: 85, improvement: '+12%' },
  { user: 'Michael Chen', testsTaken: 8, averageScore: 78, improvement: '+8%' },
  { user: 'Emily Rodriguez', testsTaken: 15, averageScore: 92, improvement: '+15%' },
  { user: 'David Kim', testsTaken: 5, averageScore: 72, improvement: '+5%' },
  { user: 'Lisa Thompson', testsTaken: 20, averageScore: 88, improvement: '+18%' },
];

export const MOCK_SCORE_DISTRIBUTION = [
  { range: '90-100%', count: 234, percentage: 15, color: 'bg-green-500' },
  { range: '80-89%', count: 456, percentage: 30, color: 'bg-blue-500' },
  { range: '70-79%', count: 567, percentage: 37, color: 'bg-yellow-500' },
  { range: '60-69%', count: 234, percentage: 15, color: 'bg-orange-500' },
  { range: 'Below 60%', count: 45, percentage: 3, color: 'bg-red-500' },
];

export const MOCK_RECENT_ACTIVITY = [
  { action: 'New user registered', time: '2 minutes ago', type: 'user' },
  { action: 'Test completed with 92%', time: '5 minutes ago', type: 'test' },
  { action: 'New practice test created', time: '12 minutes ago', type: 'admin' },
  { action: 'User achieved 100% score', time: '18 minutes ago', type: 'achievement' },
  { action: 'Monthly report generated', time: '25 minutes ago', type: 'system' },
];

// Period options
export const PERIOD_OPTIONS = [
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: '2years', label: 'Last 2 Years' },
];

// Activity type colors
export const ACTIVITY_TYPE_COLORS = {
  user: 'bg-blue-500',
  test: 'bg-green-500',
  admin: 'bg-purple-500',
  achievement: 'bg-yellow-500',
  system: 'bg-gray-500',
};
