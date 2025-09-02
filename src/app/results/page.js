'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { ChartBarIcon } from '@heroicons/react/24/outline';

// Mock data for results
const mockResults = [
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

const columns = [
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

export default function Results() {
  const [results, setResults] = useState(mockResults);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredResults = selectedFilter === 'all' 
    ? results 
    : results.filter(result => {
        if (selectedFilter === 'excellent') return result.score >= 90;
        if (selectedFilter === 'good') return result.score >= 80 && result.score < 90;
        if (selectedFilter === 'average') return result.score >= 70 && result.score < 80;
        if (selectedFilter === 'below') return result.score < 70;
        return true;
      });

  const handleExport = () => {
    // Handle export logic
    console.log('Exporting results...');
  };

  const getScoreDistribution = () => {
    const distribution = {
      excellent: results.filter(r => r.score >= 90).length,
      good: results.filter(r => r.score >= 80 && r.score < 90).length,
      average: results.filter(r => r.score >= 70 && r.score < 80).length,
      below: results.filter(r => r.score < 70).length,
    };
    return distribution;
  };

  const scoreDistribution = getScoreDistribution();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and analyze student performance across all TOEIC practice tests
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              
              Export Results
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Results</dt>
                    <dd className="text-lg font-medium text-gray-900">{results.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-yellow-700">H</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Highest Score</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.max(...results.map(r => r.score))}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Students</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {new Set(results.map(r => r.student)).size}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{scoreDistribution.excellent}</div>
                <div className="text-sm text-gray-500">Excellent (90%+)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{scoreDistribution.good}</div>
                <div className="text-sm text-gray-500">Good (80-89%)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{scoreDistribution.average}</div>
                <div className="text-sm text-gray-500">Average (70-79%)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{scoreDistribution.below}</div>
                <div className="text-sm text-gray-500">Below 70%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Results Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search results..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Scores</option>
                  <option value="excellent">Excellent (90%+)</option>
                  <option value="good">Good (80-89%)</option>
                  <option value="average">Average (70-79%)</option>
                  <option value="below">Below 70%</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredResults.length} of {results.length} results
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(result[column.key], result) : result[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 