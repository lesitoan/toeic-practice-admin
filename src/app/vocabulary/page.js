'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VocabularyFilters from '@/components/vocabulary/VocabularyFilters';
import VocabularyStatsCards from '@/components/vocabulary/VocabularyStatsCards';
import VocabularyTable from '@/components/vocabulary/VocabularyTable';
import VocabularyForm from '@/components/vocabulary/VocabularyForm';
import VocabularyDetail from '@/components/vocabulary/VocabularyDetail';
import vocabularyService from '@/services/vocabulary.service';
import { DEFAULT_FILTERS } from '@/constants/vocabulary';
import { PlusIcon } from '@heroicons/react/24/outline';
import { 
  MOCK_VOCABULARIES, 
  MOCK_CATEGORIES, 
  MOCK_DIFFICULTY_LEVELS, 
  MOCK_PARTS_OF_SPEECH 
} from '@/data/mockVocabulary';

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState(null);
  const [viewingVocabulary, setViewingVocabulary] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [partsOfSpeech, setPartsOfSpeech] = useState([]);

  // Load initial data
  useEffect(() => {
    loadVocabularies();
    loadFilterOptions();
  }, [filters]);

  const loadVocabularies = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredData = [...MOCK_VOCABULARIES];

      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.word.toLowerCase().includes(searchLower) ||
          item.definition.toLowerCase().includes(searchLower) ||
          (item.example && item.example.toLowerCase().includes(searchLower))
        );
      }

      if (filters.difficulty) {
        filteredData = filteredData.filter(item => item.difficulty === filters.difficulty);
      }

      if (filters.category) {
        filteredData = filteredData.filter(item => item.category === filters.category);
      }

      if (filters.partOfSpeech) {
        filteredData = filteredData.filter(item => item.partOfSpeech === filters.partOfSpeech);
      }

      setVocabularies(filteredData);
      setIsLoading(false);
    }, 300);
  };

  const loadFilterOptions = () => {
    // Use mock data for filter options
    setCategories(MOCK_CATEGORIES);
    setDifficultyLevels(MOCK_DIFFICULTY_LEVELS);
    setPartsOfSpeech(MOCK_PARTS_OF_SPEECH);
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

  const handleDeleteVocabulary = (vocabulary) => {
    if (window.confirm(`Are you sure you want to delete "${vocabulary.word}"?`)) {
      // Use mock data - just remove from state
      setVocabularies(prev => prev.filter(item => item.id !== vocabulary.id));
      toast.success('Vocabulary deleted successfully');
    }
  };

  const handleSaveVocabulary = (vocabularyData) => {
    if (editingVocabulary) {
      // Update existing vocabulary
      setVocabularies(prev => prev.map(item => 
        item.id === editingVocabulary.id 
          ? { ...item, ...vocabularyData }
          : item
      ));
      toast.success('Vocabulary updated successfully');
    } else {
      // Add new vocabulary
      const newVocabulary = {
        ...vocabularyData,
        id: Date.now(), // Generate temporary ID
      };
      setVocabularies(prev => [...prev, newVocabulary]);
      toast.success('Vocabulary created successfully');
    }
    setIsFormOpen(false);
    setEditingVocabulary(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

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
        <VocabularyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          categories={categories}
          difficultyLevels={difficultyLevels}
          partsOfSpeech={partsOfSpeech}
        />

        {/* Statistics */}
        <VocabularyStatsCards vocabularies={vocabularies} />

        {/* Data Table */}
        <VocabularyTable
          vocabularies={vocabularies}
          isLoading={isLoading}
          onEdit={handleEditVocabulary}
          onDelete={handleDeleteVocabulary}
          onView={handleViewVocabulary}
        />

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