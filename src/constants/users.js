// Mock data for users
export const MOCK_USERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 14:30',
    testsTaken: 12,
    averageScore: '85%',
    joinDate: '2023-09-15',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 16:45',
    testsTaken: 8,
    averageScore: '78%',
    joinDate: '2023-10-20',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    status: 'Inactive',
    lastLogin: '2024-01-10 09:15',
    testsTaken: 15,
    averageScore: '92%',
    joinDate: '2023-08-05',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 11:20',
    testsTaken: 5,
    averageScore: '72%',
    joinDate: '2023-11-12',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    status: 'Active',
    lastLogin: '2024-01-14 15:30',
    testsTaken: 20,
    averageScore: '88%',
    joinDate: '2023-07-18',
  },
  {
    id: 6,
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    status: 'Inactive',
    lastLogin: '2024-01-05 13:45',
    testsTaken: 3,
    averageScore: '65%',
    joinDate: '2023-12-01',
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 10:15',
    testsTaken: 18,
    averageScore: '91%',
    joinDate: '2023-06-22',
  },
  {
    id: 8,
    name: 'Robert Lee',
    email: 'robert.lee@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 17:30',
    testsTaken: 9,
    averageScore: '79%',
    joinDate: '2023-10-08',
  },
];

// Table columns configuration
export const USER_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    render: (value, item) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-700">
            {value.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'testsTaken',
    label: 'Tests Taken',
  },
  {
    key: 'averageScore',
    label: 'Avg Score',
    render: (value) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

// User statuses
export const USER_STATUSES = [
  { value: 'Active', label: 'Active', color: 'green' },
  { value: 'Inactive', label: 'Inactive', color: 'gray' },
  { value: 'Suspended', label: 'Suspended', color: 'red' },
  { value: 'Pending', label: 'Pending', color: 'yellow' },
];
