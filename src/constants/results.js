// Mock data for results
export const MOCK_RESULTS = [
  {
    id: 1,
    student: 'Sarah Johnson',
    test: 'TOEIC Practice Test #1 - Listening & Reading',
    score: 85,
    listeningScore: 88,
    readingScore: 82,
    totalQuestions: 200,
    correctAnswers: 170,
    timeTaken: '115 min',
    completedAt: '2024-01-15 14:30',
    status: 'Completed',
  },
  {
    id: 2,
    student: 'Michael Chen',
    test: 'TOEIC Practice Test #3 - Full Test',
    score: 78,
    listeningScore: 75,
    readingScore: 81,
    totalQuestions: 208,
    correctAnswers: 162,
    timeTaken: '185 min',
    completedAt: '2024-01-15 16:45',
    status: 'Completed',
  },
  {
    id: 3,
    student: 'Emily Rodriguez',
    test: 'TOEIC Practice Test #4 - Listening Focus',
    score: 92,
    listeningScore: 95,
    readingScore: 89,
    totalQuestions: 100,
    correctAnswers: 92,
    timeTaken: '58 min',
    completedAt: '2024-01-15 09:15',
    status: 'Completed',
  },
  {
    id: 4,
    student: 'David Kim',
    test: 'TOEIC Practice Test #5 - Reading Focus',
    score: 72,
    listeningScore: 68,
    readingScore: 76,
    totalQuestions: 100,
    correctAnswers: 72,
    timeTaken: '70 min',
    completedAt: '2024-01-15 11:20',
    status: 'Completed',
  },
  {
    id: 5,
    student: 'Lisa Thompson',
    test: 'TOEIC Practice Test #2 - Speaking & Writing',
    score: 88,
    listeningScore: 90,
    readingScore: 86,
    totalQuestions: 8,
    correctAnswers: 7,
    timeTaken: '75 min',
    completedAt: '2024-01-14 15:30',
    status: 'Completed',
  },
  {
    id: 6,
    student: 'James Wilson',
    test: 'TOEIC Practice Test #1 - Listening & Reading',
    score: 65,
    listeningScore: 62,
    readingScore: 68,
    totalQuestions: 200,
    correctAnswers: 130,
    timeTaken: '120 min',
    completedAt: '2024-01-05 13:45',
    status: 'Completed',
  },
  {
    id: 7,
    student: 'Maria Garcia',
    test: 'TOEIC Practice Test #3 - Full Test',
    score: 91,
    listeningScore: 93,
    readingScore: 89,
    totalQuestions: 208,
    correctAnswers: 189,
    timeTaken: '195 min',
    completedAt: '2024-01-15 10:15',
    status: 'Completed',
  },
  {
    id: 8,
    student: 'Robert Lee',
    test: 'TOEIC Practice Test #4 - Listening Focus',
    score: 79,
    listeningScore: 82,
    readingScore: 76,
    totalQuestions: 100,
    correctAnswers: 79,
    timeTaken: '62 min',
    completedAt: '2024-01-15 17:30',
    status: 'Completed',
  },
];

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
