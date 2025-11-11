'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TestsStatsCards from '@/components/tests/TestsStatsCards';
import TestsFilters from '@/components/tests/TestsFilters';
import TestsTable from '@/components/tests/TestsTable';
import CreateTestModal from '@/components/tests/CreateTestModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter tests based on search and filters
  const filteredTests = tests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleAssign = (test) => {
    console.log('Assign test:', test);
  };

  const handleCreateTest = (testData) => {
    console.log('Creating test with data:', testData);
    // TODO: Implement API call to create test
    toast.success(`Test "${testData.name}" created successfully!`);
    // You can add the test to the list here or refresh from API
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

          <TestsTable
            tests={filteredTests}
            onView={handleView}
            onEdit={handleEdit}
            onAssign={handleAssign}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Create Test Modal */}
      <CreateTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateTest}
      />
    </DashboardLayout>
  );
}