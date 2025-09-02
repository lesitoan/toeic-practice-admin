'use client';

import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function VocabularyDetail({ 
  vocabulary, 
  isOpen, 
  onClose, 
  onEdit 
}) {
  if (!isOpen || !vocabulary) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Vocabulary Details</h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onEdit(vocabulary)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Word and Pronunciation */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vocabulary.word}
              </h1>
              {vocabulary.pronunciation && (
                <p className="text-lg text-gray-600 font-mono">
                  {vocabulary.pronunciation}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(vocabulary.difficulty)}`}>
                {vocabulary.difficulty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {vocabulary.partOfSpeech}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {vocabulary.category}
              </span>
            </div>

            {/* Definition */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Definition</h3>
              <p className="text-gray-700 leading-relaxed">
                {vocabulary.definition}
              </p>
            </div>

            {/* Example */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Example</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 italic">
                  "{vocabulary.example}"
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>
                  <br />
                  {new Date(vocabulary.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <br />
                  {new Date(vocabulary.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
