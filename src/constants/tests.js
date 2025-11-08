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
