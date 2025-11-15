// Table columns configuration
export const TEST_COLUMNS = [
  {
    key: 'name',
    label: 'Test Name',
    render: (value, item) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{value || item.title}</div>
        {/* {item.description && (
          <div className="text-sm text-gray-500 truncate max-w-md">{item.description}</div>
        )} */}
      </div>
    ),
  },
  {
  //   key: 'difficulty',
  //   label: 'Difficulty',
  //   render: (value) => (
  //     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  //       value === 'Beginner' ? 'bg-green-100 text-green-800' :
  //       value === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
  //       'bg-red-100 text-red-800'
  //     }`}>
  //       {value}
  //     </span>
  //   ),
  // },
  // {
    key: 'status',
    label: 'Status',
    render: (value) => {
      const statusConfig = {
        'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
        'draft': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
        'archived': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' },
        'Published': { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
        'Draft': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      };
      const config = statusConfig[value] || { bg: 'bg-gray-100', text: 'text-gray-800', label: value };
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    },
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
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'draft', label: 'Draft', color: 'yellow' },
  { value: 'archived', label: 'Archived', color: 'gray' },
];
