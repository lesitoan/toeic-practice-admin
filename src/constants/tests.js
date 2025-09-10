// Mock data for tests
export const MOCK_TESTS = [
  {
    id: 1,
    title: 'TOEIC Practice Test #1 - Listening & Reading',
    category: 'Listening & Reading',
    difficulty: 'Intermediate',
    duration: '120 min',
    questions: 200,
    status: 'Published',
    assignedUsers: 45,
    averageScore: '78%',
    createdAt: '2024-01-10',
    lastModified: '2024-01-15',
  },
  {
    id: 2,
    title: 'TOEIC Practice Test #2 - Speaking & Writing',
    category: 'Speaking & Writing',
    difficulty: 'Advanced',
    duration: '80 min',
    questions: 8,
    status: 'Draft',
    assignedUsers: 0,
    averageScore: 'N/A',
    createdAt: '2024-01-12',
    lastModified: '2024-01-14',
  },
  {
    id: 3,
    title: 'TOEIC Practice Test #3 - Full Test',
    category: 'Full Test',
    difficulty: 'Intermediate',
    duration: '200 min',
    questions: 208,
    status: 'Published',
    assignedUsers: 67,
    averageScore: '82%',
    createdAt: '2024-01-05',
    lastModified: '2024-01-10',
  },
  {
    id: 4,
    title: 'TOEIC Practice Test #4 - Listening Focus',
    category: 'Listening',
    difficulty: 'Beginner',
    duration: '60 min',
    questions: 100,
    status: 'Published',
    assignedUsers: 23,
    averageScore: '75%',
    createdAt: '2024-01-08',
    lastModified: '2024-01-12',
  },
  {
    id: 5,
    title: 'TOEIC Practice Test #5 - Reading Focus',
    category: 'Reading',
    difficulty: 'Advanced',
    duration: '75 min',
    questions: 100,
    status: 'Published',
    assignedUsers: 34,
    averageScore: '85%',
    createdAt: '2024-01-03',
    lastModified: '2024-01-08',
  },
];

// Table columns configuration
export const TEST_COLUMNS = [
  {
    key: 'title',
    label: 'Test Title',
    render: (value, item) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{item.category}</div>
      </div>
    ),
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Beginner' ? 'bg-green-100 text-green-800' :
        value === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
  },
  {
    key: 'questions',
    label: 'Questions',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'assignedUsers',
    label: 'Assigned Users',
  },
  {
    key: 'averageScore',
    label: 'Avg Score',
    render: (value) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'Beginner', label: 'Beginner', color: 'green' },
  { value: 'Intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'Advanced', label: 'Advanced', color: 'red' },
];

// Test categories
export const TEST_CATEGORIES = [
  { value: 'Listening & Reading', label: 'Listening & Reading' },
  { value: 'Speaking & Writing', label: 'Speaking & Writing' },
  { value: 'Full Test', label: 'Full Test' },
  { value: 'Listening', label: 'Listening' },
  { value: 'Reading', label: 'Reading' },
];

// Test statuses
export const TEST_STATUSES = [
  { value: 'Published', label: 'Published', color: 'green' },
  { value: 'Draft', label: 'Draft', color: 'gray' },
  { value: 'Archived', label: 'Archived', color: 'gray' },
];
