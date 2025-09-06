'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResultsStatsCards from '@/components/results/ResultsStatsCards';
import ScoreDistributionChart from '@/components/results/ScoreDistributionChart';
import ResultsFilters from '@/components/results/ResultsFilters';
import ResultsTable from '@/components/results/ResultsTable';
import { MOCK_RESULTS } from '@/constants/results';

export default function Results() {
  const [results, setResults] = useState(MOCK_RESULTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter results based on search and filter
  const filteredResults = results.filter(result => {
    // Search filter
    const matchesSearch = !searchTerm || 
      result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.test.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Score filter
    let matchesScore = true;
    if (selectedFilter === 'excellent') matchesScore = result.score >= 90;
    else if (selectedFilter === 'good') matchesScore = result.score >= 80 && result.score < 90;
    else if (selectedFilter === 'average') matchesScore = result.score >= 70 && result.score < 80;
    else if (selectedFilter === 'below') matchesScore = result.score < 70;
    
    return matchesSearch && matchesScore;
  });

  const handleExport = () => {
    // Handle export logic
    console.log('Exporting results...');
  };

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
        <ResultsStatsCards results={results} />

        {/* Score Distribution Chart */}
        <ScoreDistributionChart results={results} />

        {/* Filters and Results Table */}
        <div className="bg-white shadow rounded-lg">
          <ResultsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filteredCount={filteredResults.length}
            totalCount={results.length}
          />

          <ResultsTable results={filteredResults} />
        </div>
      </div>
    </DashboardLayout>
  );
}