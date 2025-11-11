'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function PartEditor({ part, initialData, onSave, onClose }) {
  const [questions, setQuestions] = useState(initialData.questions || []);
  const [partConfig, setPartConfig] = useState(initialData.config || {});

  useEffect(() => {
    setQuestions(initialData.questions || []);
    setPartConfig(initialData.config || {});
  }, [initialData]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      audioUrl: '',
      imageUrl: '',
      explanation: ''
    };

    // Part-specific defaults
    if (part.id === 1) {
      // Part 1: Photographs - needs image
      newQuestion.imageUrl = '';
    } else if (part.id >= 2 && part.id <= 4) {
      // Parts 2-4: Listening - needs audio
      newQuestion.audioUrl = '';
    } else if (part.id === 3 || part.id === 4) {
      // Parts 3-4: Multiple questions per conversation/talk
      newQuestion.conversationId = null;
    } else if (part.id === 6 || part.id === 7) {
      // Parts 6-7: Reading - needs passage
      newQuestion.passage = '';
    }

    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = () => {
    // Validate questions
    const invalidQuestions = questions.filter(q => 
      !q.question.trim() || 
      q.options.some(opt => !opt.trim()) ||
      (part.id === 1 && !q.imageUrl) ||
      ((part.id >= 2 && part.id <= 4) && !q.audioUrl) ||
      ((part.id === 6 || part.id === 7) && !q.passage)
    );

    if (invalidQuestions.length > 0) {
      toast.error('Please fill in all required fields for all questions');
      return;
    }

    const partData = {
      questions,
      config: partConfig
    };

    onSave(partData);
    toast.success(`${part.name} saved successfully`);
  };

  const renderQuestionEditor = (question, index) => {
    return (
      <div key={question.id} className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">Question {index + 1}</h4>
          <button
            onClick={() => removeQuestion(question.id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Question Text */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Question Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={question.question}
            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={2}
            placeholder="Enter question text"
          />
        </div>

        {/* Part 1: Image Upload */}
        {part.id === 1 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question.imageUrl || ''}
              onChange={(e) => updateQuestion(question.id, 'imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter image URL"
            />
          </div>
        )}

        {/* Parts 2-4: Audio URL */}
        {(part.id >= 2 && part.id <= 4) && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Audio URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question.audioUrl || ''}
              onChange={(e) => updateQuestion(question.id, 'audioUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter audio URL"
            />
          </div>
        )}

        {/* Parts 6-7: Passage */}
        {(part.id === 6 || part.id === 7) && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reading Passage <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question.passage || ''}
              onChange={(e) => updateQuestion(question.id, 'passage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows={4}
              placeholder="Enter reading passage"
            />
          </div>
        )}

        {/* Options */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Answer Options <span className="text-red-500">*</span>
          </label>
          {question.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctAnswer === optIndex}
                onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
              />
            </div>
          ))}
        </div>

        {/* Explanation (Optional) */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Explanation (Optional)
          </label>
          <textarea
            value={question.explanation || ''}
            onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={2}
            placeholder="Enter explanation for the answer"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{part.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{part.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {/* Questions List */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Questions ({questions.length})
                </h3>
                <button
                  onClick={addQuestion}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No questions added yet. Click "Add Question" to get started.</p>
                </div>
              ) : (
                <div>
                  {questions.map((question, index) => renderQuestionEditor(question, index))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

