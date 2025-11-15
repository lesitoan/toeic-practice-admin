'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  MOCK_CATEGORIES, 
  MOCK_DIFFICULTY_LEVELS, 
  MOCK_PARTS_OF_SPEECH 
} from '@/data/mockVocabulary';

export default function VocabularyForm({ 
  isOpen, 
  onClose, 
  vocabulary = null, 
  onSave 
}) {
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [partsOfSpeech, setPartsOfSpeech] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      word: '',
      definition: '',
      pronunciation: '',
      partOfSpeech: '',
      example: '',
      difficulty: 'intermediate',
      category: 'general'
    }
  });

  useEffect(() => {
    // Use mock data for filter options
    setCategories(MOCK_CATEGORIES);
    setDifficultyLevels(MOCK_DIFFICULTY_LEVELS);
    setPartsOfSpeech(MOCK_PARTS_OF_SPEECH);
  }, []);

  useEffect(() => {
    if (vocabulary) {
      // Populate form with existing vocabulary data
      Object.keys(vocabulary).forEach(key => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          setValue(key, vocabulary[key]);
        }
      });
    } else {
      // Reset form for new vocabulary
      reset();
    }
  }, [vocabulary, setValue, reset]);

  const onSubmit = (data) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Pass data to parent component to handle with mock data
      onSave(data);
      reset();
      setIsLoading(false);
    }, 300);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {vocabulary ? 'Edit Vocabulary' : 'Add New Vocabulary'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Word */}
              <div className="sm:col-span-2">
                <label htmlFor="word" className="block text-sm font-medium text-gray-700">
                  Word *
                </label>
                <input
                  type="text"
                  id="word"
                  {...register('word', { required: 'Word is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter the word"
                />
                {errors.word && (
                  <p className="mt-1 text-sm text-red-600">{errors.word.message}</p>
                )}
              </div>

              {/* Definition */}
              <div className="sm:col-span-2">
                <label htmlFor="definition" className="block text-sm font-medium text-gray-700">
                  Definition *
                </label>
                <textarea
                  id="definition"
                  rows={3}
                  {...register('definition', { required: 'Definition is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter the definition"
                />
                {errors.definition && (
                  <p className="mt-1 text-sm text-red-600">{errors.definition.message}</p>
                )}
              </div>

              {/* Pronunciation */}
              <div>
                <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700">
                  Pronunciation
                </label>
                <input
                  type="text"
                  id="pronunciation"
                  {...register('pronunciation')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="/prəˌnʌnsiˈeɪʃən/"
                />
              </div>

              {/* Part of Speech */}
              <div>
                <label htmlFor="partOfSpeech" className="block text-sm font-medium text-gray-700">
                  Part of Speech *
                </label>
                <select
                  id="partOfSpeech"
                  {...register('partOfSpeech', { required: 'Part of speech is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select part of speech</option>
                  {partsOfSpeech.map((part) => (
                    <option key={part.value} value={part.value}>
                      {part.label}
                    </option>
                  ))}
                </select>
                {errors.partOfSpeech && (
                  <p className="mt-1 text-sm text-red-600">{errors.partOfSpeech.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  {...register('difficulty', { required: 'Difficulty level is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Example */}
              <div className="sm:col-span-2">
                <label htmlFor="example" className="block text-sm font-medium text-gray-700">
                  Example Sentence *
                </label>
                <textarea
                  id="example"
                  rows={2}
                  {...register('example', { required: 'Example sentence is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter an example sentence using the word"
                />
                {errors.example && (
                  <p className="mt-1 text-sm text-red-600">{errors.example.message}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (vocabulary ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
