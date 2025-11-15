'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TestsStatsCards from '@/components/tests/TestsStatsCards';
import TestsFilters from '@/components/tests/TestsFilters';
import TestsTable from '@/components/tests/TestsTable';
import CreateTestModal from '@/components/tests/CreateTestModal';
import CreateTestRunModal from '@/components/tests/CreateTestRunModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import testsService from '@/services/tests.service';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTestRunModalOpen, setIsTestRunModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch tests from API
  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const response = await testsService.getAllTests({
        page: 1,
        limit: 100,
        sort_by: 'id',
        sort_type: -1,
        is_fetch_all: true,
        name: searchTerm || 'default',
      });
      
      // Map API response to match component structure
      const mappedTests = (response.items || []).map(test => ({
        id: test.id,
        title: test.name,
        name: test.name,
        description: test.description || '',
        status: test.status,
        category: 'TOEIC Test', // Default category
        difficulty: 'Intermediate', // Default difficulty
        duration: '120 min', // Default duration
        questions: 0, // Will be calculated if needed
        assignedUsers: 0, // Will be calculated if needed
        averageScore: 'N/A', // Will be calculated if needed
        lastModified: 'N/A', // Will be calculated if needed
      }));
      
      setTests(mappedTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Filter tests based on search and filters
  const filteredTests = tests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || test.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || test.difficulty === selectedDifficulty;
    const matchesStatus = !selectedStatus || test.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleEdit = (test) => {
    console.log('Edit test:', test);
  };

  const handleDelete = (test) => {
    if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
      setTests(tests.filter(t => t.id !== test.id));
    }
  };

  const handleView = (test) => {
    console.log('View test:', test);
  };

  const handleRun = (test) => {
    setSelectedTest(test);
    setIsTestRunModalOpen(true);
  };

  const handleTestRunSuccess = (response) => {
    console.log('Test run created:', response);
    toast.success('Test run created successfully!');
  };

  const handleCreateTest = async (testData) => {
    try {
      console.log('Creating test with data:', testData);
      
      // Check if all parts have been configured
      const configuredParts = Object.keys(testData.parts || {}).length;
      if (configuredParts === 0) {
        toast.warning('Please configure at least one part before creating the test.');
        return;
      }

      // The actual saving happens in PartEditor when each part is saved
      // The enqueueTemplateImport API is called for each part
      // Here we just confirm the test creation
      toast.success(`Test "${testData.name}" created successfully! All configured parts have been saved.`);
      
      // Close modal and refresh tests list
      setIsAddModalOpen(false);
      
      // Refresh tests list from API
      await fetchTests();
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Failed to create test. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage TOEIC practice tests for your students
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Test
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <TestsStatsCards tests={tests} />

        {/* Tests Table */}
        <div className="bg-white shadow rounded-lg">
          <TestsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            totalCount={filteredTests.length}
          />

          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Loading tests...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No tests found.</p>
            </div>
          ) : (
            <TestsTable
              tests={filteredTests}
              onView={handleView}
              onEdit={handleEdit}
              onRun={handleRun}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Create Test Modal */}
      <CreateTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateTest}
      />

      {/* Create Test Run Modal */}
      <CreateTestRunModal
        isOpen={isTestRunModalOpen}
        onClose={() => {
          setIsTestRunModalOpen(false);
          setSelectedTest(null);
        }}
        test={selectedTest}
        onSuccess={handleTestRunSuccess}
      />
    </DashboardLayout>
  );
}