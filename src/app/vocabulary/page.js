'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import VocabularyForm from '@/components/vocabulary/VocabularyForm';
import VocabularyDetail from '@/components/vocabulary/VocabularyDetail';
import vocabularyService from '@/services/vocabulary.service';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState(null);
  const [viewingVocabulary, setViewingVocabulary] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    category: '',
    partOfSpeech: ''
  });
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [partsOfSpeech, setPartsOfSpeech] = useState([]);

  // Load initial data
  useEffect(() => {
    loadVocabularies();
    loadFilterOptions();
  }, [filters]);

  const loadVocabularies = async () => {
    try {
      setIsLoading(true);
      const response = await vocabularyService.getAllVocabularies(filters);
      setVocabularies(response.data);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      toast.error('Failed to load vocabularies');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [categoriesData, difficultyData, partsData] = await Promise.all([
        vocabularyService.getCategories(),
        vocabularyService.getDifficultyLevels(),
        vocabularyService.getPartsOfSpeech()
      ]);
      
      setCategories(categoriesData);
      setDifficultyLevels(difficultyData);
      setPartsOfSpeech(partsData);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleAddVocabulary = () => {
    setEditingVocabulary(null);
    setIsFormOpen(true);
  };

  const handleViewVocabulary = (vocabulary) => {
    setViewingVocabulary(vocabulary);
    setIsDetailOpen(true);
  };

  const handleEditVocabulary = (vocabulary) => {
    setEditingVocabulary(vocabulary);
    setIsFormOpen(true);
    setIsDetailOpen(false); // Close detail view if open
  };

  const handleDeleteVocabulary = async (vocabulary) => {
    if (window.confirm(`Are you sure you want to delete "${vocabulary.word}"?`)) {
      try {
        await vocabularyService.deleteVocabulary(vocabulary.id);
        toast.success('Vocabulary deleted successfully');
        loadVocabularies();
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
        toast.error('Failed to delete vocabulary');
      }
    }
  };

  const handleSaveVocabulary = () => {
    toast.success(editingVocabulary ? 'Vocabulary updated successfully' : 'Vocabulary created successfully');
    loadVocabularies();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      category: '',
      partOfSpeech: ''
    });
  };

  // Table columns configuration
  const columns = [
    {
      key: 'word',
      label: 'Word',
      render: (value, item) => (
        <div className="flex items-center">
          <BookOpenIcon className="h-4 w-4 text-blue-500 mr-2" />
          <div>
            <button
              onClick={() => handleViewVocabulary(item)}
              className="font-medium text-blue-600 hover:text-blue-800 text-left"
            >
              {value}
            </button>
            {item.pronunciation && (
              <div className="text-sm text-gray-500">{item.pronunciation}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'definition',
      label: 'Definition',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'partOfSpeech',
      label: 'Part of Speech',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value) => {
        const colors = {
          beginner: 'bg-green-100 text-green-800',
          intermediate: 'bg-yellow-100 text-yellow-800',
          advanced: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {value}
        </span>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vocabulary Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage vocabulary words for TOEIC practice tests
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAddVocabulary}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Vocabulary
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search words, definitions..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All difficulties</option>
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Part of Speech */}
            <div>
              <label htmlFor="partOfSpeech" className="block text-sm font-medium text-gray-700">
                Part of Speech
              </label>
              <select
                id="partOfSpeech"
                value={filters.partOfSpeech}
                onChange={(e) => handleFilterChange('partOfSpeech', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All parts</option>
                {partsOfSpeech.map((part) => (
                  <option key={part.value} value={part.value}>
                    {part.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Words</dt>
                    <dd className="text-lg font-medium text-gray-900">{vocabularies.length}</dd>
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
                    <span className="text-xs font-medium text-green-600">B</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Beginner</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {vocabularies.filter(v => v.difficulty === 'beginner').length}
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
                    <span className="text-xs font-medium text-yellow-600">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Intermediate</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {vocabularies.filter(v => v.difficulty === 'intermediate').length}
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
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-red-600">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Advanced</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {vocabularies.filter(v => v.difficulty === 'advanced').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : (
          <DataTable
            data={vocabularies}
            columns={columns}
            onEdit={handleEditVocabulary}
            onDelete={handleDeleteVocabulary}
            searchable={false} // We have our own search
          />
        )}

        {/* Vocabulary Form Modal */}
        <VocabularyForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          vocabulary={editingVocabulary}
          onSave={handleSaveVocabulary}
        />

        {/* Vocabulary Detail Modal */}
        <VocabularyDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          vocabulary={viewingVocabulary}
          onEdit={handleEditVocabulary}
        />
      </div>
    </DashboardLayout>
  );
}
