
// Table columns configuration
export const TABLE_COLUMNS = [
  {
    key: 'student',
    label: 'Student',
    render: (value) => (
      <div className="text-sm font-medium text-gray-900">{value}</div>
    ),
  },
  {
    key: 'test',
    label: 'Test',
    render: (value) => (
      <div className="text-sm text-gray-900 max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: 'score',
    label: 'Overall Score',
    render: (value) => (
      <div className="flex items-center">
        <span className={`text-lg font-bold ${
          value >= 90 ? 'text-green-600' :
          value >= 80 ? 'text-blue-600' :
          value >= 70 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {value}%
        </span>
      </div>
    ),
  },
  {
    key: 'listeningScore',
    label: 'Listening',
    render: (value) => (
      <span className={`text-sm font-medium ${
        value >= 90 ? 'text-green-600' :
        value >= 80 ? 'text-blue-600' :
        value >= 70 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {value}%
      </span>
    ),
  },
  {
    key: 'readingScore',
    label: 'Reading',
    render: (value) => (
      <span className={`text-sm font-medium ${
        value >= 90 ? 'text-green-600' :
        value >= 80 ? 'text-blue-600' :
        value >= 70 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {value}%
      </span>
    ),
  },
  {
    key: 'correctAnswers',
    label: 'Correct Answers',
    render: (value, item) => (
      <div className="text-sm text-gray-900">
        {value}/{item.totalQuestions}
      </div>
    ),
  },
  {
    key: 'timeTaken',
    label: 'Time Taken',
  },
  {
    key: 'completedAt',
    label: 'Completed At',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {value}
      </span>
    ),
  },
];

// Score ranges configuration
export const SCORE_RANGES = {
  excellent: { min: 90, color: 'green', label: 'Excellent (90%+)' },
  good: { min: 80, max: 89, color: 'blue', label: 'Good (80-89%)' },
  average: { min: 70, max: 79, color: 'yellow', label: 'Average (70-79%)' },
  below: { max: 69, color: 'red', label: 'Below 70%' },
};

// Filter options
export const FILTER_OPTIONS = [
  { value: 'all', label: 'All Scores' },
  { value: 'excellent', label: 'Excellent (90%+)' },
  { value: 'good', label: 'Good (80-89%)' },
  { value: 'average', label: 'Average (70-79%)' },
  { value: 'below', label: 'Below 70%' },
];
