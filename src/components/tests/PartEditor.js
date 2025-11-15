'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import testsService from '@/services/tests.service';

const DEFAULT_DIFFICULTY = 'EASY';
const PASSAGE_TYPES = [
  { value: 'TEXT', label: 'Text' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'AUDIO', label: 'Audio' },
];

const generatePassageRef = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export default function PartEditor({ part, initialData, onSave, onClose, testTemplateId, templateMeta }) {
  const [questions, setQuestions] = useState(initialData.questions || []);
  const [partConfig, setPartConfig] = useState(initialData.config || {});
  const [isSaving, setIsSaving] = useState(false);
  const questionsRef = useRef(questions);

  // Keep ref updated
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const normalizeQuestions = (rawQuestions = []) =>
    rawQuestions.map((question, index) => ({
      id: question.id ?? Date.now() + index,
      question: question.question || '',
      options: Array.isArray(question.options) && question.options.length === 4
        ? question.options
        : ['', '', '', ''],
      correctAnswer: typeof question.correctAnswer === 'number' ? question.correctAnswer : 0,
      explanation: question.explanation || '',
      passage: question.passage || '',
      passageInstructions: question.passageInstructions || '',
      passageRef: question.passageRef || generatePassageRef(),
      passageType: question.passageType || 'TEXT',
      difficulty: question.difficulty || DEFAULT_DIFFICULTY,
      conversationId: question.conversationId ?? null,
      imageUrl: question.imageUrl || '',
      audioUrl: question.audioUrl || '',
      imageFile: null,
      audioFile: null,
      imagePreview: '',
      audioPreview: '',
      imageFileName: '',
      audioFileName: '',
    }));

  useEffect(() => {
    setQuestions(normalizeQuestions(initialData.questions || []));
    setPartConfig(initialData.config || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      questionsRef.current.forEach(q => {
        if (q.imagePreview) {
          URL.revokeObjectURL(q.imagePreview);
        }
        if (q.audioPreview) {
          URL.revokeObjectURL(q.audioPreview);
        }
      });
    };
  }, []);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      audioFile: null,
      audioUrl: '',
      audioPreview: '',
      audioFileName: '',
      imageFile: null,
      imageUrl: '',
      imagePreview: '',
      imageFileName: '',
      explanation: '',
      passage: '',
      passageInstructions: '',
      passageRef: generatePassageRef(),
      passageType: 'TEXT',
      difficulty: DEFAULT_DIFFICULTY,
      conversationId: part.id === 3 || part.id === 4 ? null : undefined,
    };

    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const updateQuestionFields = (questionId, updater) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? updater(q) : q))
    );
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

  const handleImageUpload = (questionId, file) => {
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, or JPEG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    updateQuestionFields(questionId, (q) => ({
      ...q,
      passageType: 'IMAGE',
      imageFile: file,
      imageFileName: file.name,
      imagePreview: previewUrl,
      imageUrl: '',
    }));
  };

  const handleAudioUpload = (questionId, file) => {
    if (!file) return;

    // Validate file type
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/mpeg3'];
    if (!validAudioTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp3')) {
      toast.error('Please upload a valid MP3 audio file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Audio file size must be less than 10MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    updateQuestionFields(questionId, (q) => ({
      ...q,
      passageType: 'AUDIO',
      audioFile: file,
      audioFileName: file.name,
      audioPreview: previewUrl,
      audioUrl: '',
    }));
  };

  const removeImage = (questionId) => {
    updateQuestionFields(questionId, (q) => {
      if (q.imagePreview) {
        URL.revokeObjectURL(q.imagePreview);
      }
      return {
        ...q,
        imageFile: null,
        imagePreview: '',
        imageFileName: '',
        imageUrl: '',
      };
    });
  };

  const removeAudio = (questionId) => {
    updateQuestionFields(questionId, (q) => {
      if (q.audioPreview) {
        URL.revokeObjectURL(q.audioPreview);
      }
      return {
        ...q,
        audioFile: null,
        audioPreview: '',
        audioFileName: '',
        audioUrl: '',
      };
    });
  };

  const handlePassageTypeChange = (questionId, newType) => {
    updateQuestionFields(questionId, (q) => {
      const updated = { ...q, passageType: newType };

      if (newType !== 'TEXT') {
        updated.passage = '';
        updated.passageInstructions = q.passageInstructions || '';
      }

      if (newType !== 'IMAGE') {
        if (q.imagePreview) {
          URL.revokeObjectURL(q.imagePreview);
        }
        updated.imageFile = null;
        updated.imagePreview = '';
        updated.imageFileName = '';
        if (newType !== 'IMAGE') {
          updated.imageUrl = '';
        }
      }

      if (newType !== 'AUDIO') {
        if (q.audioPreview) {
          URL.revokeObjectURL(q.audioPreview);
        }
        updated.audioFile = null;
        updated.audioPreview = '';
        updated.audioFileName = '';
        if (newType !== 'AUDIO') {
          updated.audioUrl = '';
        }
      }

      return updated;
    });
  };

  const uploadFileToCloudinary = async (file, signature) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.api_key);
    formData.append('timestamp', signature.timestamp);
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);
    if (signature.allowed_formats) {
      formData.append('allowed_formats', signature.allowed_formats);
    }

    const response = await fetch(signature.upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message ||
          errorData?.message ||
          'Failed to upload file to Cloudinary'
      );
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    if (!testTemplateId) {
      toast.error('Test template is not ready. Please close and reopen the modal.');
      return;
    }

    if (!templateMeta?.name?.trim()) {
      toast.error('Template name is required before saving.');
      return;
    }

    if (isSaving) return;

    // Validate questions
    const invalidQuestions = questions.filter(q => 
      !q.question.trim() || 
      q.options.some(opt => !opt.trim()) ||
      !q.passageRef?.trim()
    );

    if (invalidQuestions.length > 0) {
      toast.error('Please fill in all required fields for all questions');
      return;
    }

    setIsSaving(true);

    try {
      const signature = await testsService.getCloudinarySignature(testTemplateId);

      const passageMap = {};
      const updatedQuestions = [];
      const questionsPayload = [];

      for (const [index, question] of questions.entries()) {
        let imageUrl = question.imageUrl || '';
        let audioUrl = question.audioUrl || '';

        if (question.imageFile) {
          if (question.imagePreview) {
            URL.revokeObjectURL(question.imagePreview);
          }
          imageUrl = await uploadFileToCloudinary(question.imageFile, signature);
        }

        if (question.audioFile) {
          if (question.audioPreview) {
            URL.revokeObjectURL(question.audioPreview);
          }
          audioUrl = await uploadFileToCloudinary(question.audioFile, signature);
        }

        const passageRef = (question.passageRef || '').trim() || generatePassageRef();
        const passageInstructions = question.passageInstructions?.trim() || '';
        const passageType = question.passageType || 'TEXT';

        let passageContent = '';
        let passagePublicId = '';

        if (passageType === 'TEXT') {
          passageContent = question.passage?.trim() || '';
          if (!passageContent) {
            throw new Error(`Passage text is required for question ${index + 1}.`);
          }
        } else if (passageType === 'IMAGE') {
          passagePublicId = imageUrl;
          if (!passagePublicId) {
            throw new Error(`Image passage is missing upload for question ${index + 1}.`);
          }
        } else if (passageType === 'AUDIO') {
          passagePublicId = audioUrl;
          if (!passagePublicId) {
            throw new Error(`Audio passage is missing upload for question ${index + 1}.`);
          }
        }

        const existingPassage = passageMap[passageRef];
        if (existingPassage) {
          if (existingPassage.type !== passageType) {
            throw new Error(`Passage ref "${passageRef}" has conflicting types.`);
          }
          if (passageType === 'TEXT' && passageContent && !existingPassage.content) {
            existingPassage.content = passageContent;
          }
          if (passagePublicId && !existingPassage.public_id) {
            existingPassage.public_id = passagePublicId;
          }
          if (passageInstructions && !existingPassage.instructions) {
            existingPassage.instructions = passageInstructions;
          }
        } else {
          passageMap[passageRef] = {
            ref: passageRef,
            type: passageType,
            content: passageType === 'TEXT' ? passageContent : '',
            public_id: passageType === 'TEXT' ? '' : passagePublicId,
            instructions: passageInstructions,
          };
        }

        const answers = question.options.map((option, optionIndex) => ({
          text: option.trim(),
          is_correct: question.correctAnswer === optionIndex,
          order: optionIndex + 1,
        }));

        questionsPayload.push({
          content: question.question.trim(),
          difficulty: (question.difficulty || DEFAULT_DIFFICULTY).toUpperCase(),
          part: part.id,
          passage_ref: passageRef,
          answers,
        });

        updatedQuestions.push({
          ...question,
          passageRef,
          imageUrl,
          audioUrl,
          imageFile: null,
          audioFile: null,
          imagePreview: '',
          audioPreview: '',
          imageFileName: '',
          audioFileName: '',
        });
      }

      const templatePayload = {
        name: templateMeta?.name?.trim() || 'Untitled Template',
        description: templateMeta?.description || '',
        status: templateMeta?.status || 'draft',
        content: {
          passages: Object.values(passageMap),
          questions: questionsPayload,
        },
      };

      await testsService.enqueueTemplateImport(testTemplateId, templatePayload);

      const partData = {
        questions: updatedQuestions,
        config: partConfig,
        passages: templatePayload.content.passages,
        lastSavedAt: new Date().toISOString(),
      };

      onSave(partData);
      toast.success(`${part.name} saved successfully`);
    } catch (error) {
      console.error('Save part error:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save part. Please try again.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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

        {/* Difficulty & Passage Ref */}
        <div className="grid gap-3 mb-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={question.difficulty}
              onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Passage Ref <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question.passageRef}
              onChange={(e) => updateQuestion(question.id, 'passageRef', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. p1, p2..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Use the same ref to link multiple questions to one passage.
            </p>
          </div>
        </div>

        {/* Passage Instructions */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Passage Instructions
          </label>
          <input
            type="text"
            value={question.passageInstructions}
            onChange={(e) => updateQuestion(question.id, 'passageInstructions', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="e.g. Read the email and answer the questions."
          />
        </div>

        {/* Passage Type */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Passage Type
          </label>
          <select
            value={question.passageType}
            onChange={(e) => handlePassageTypeChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {PASSAGE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Passage Content */}
        {question.passageType === 'TEXT' && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Passage Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question.passage || ''}
              onChange={(e) => updateQuestion(question.id, 'passage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows={4}
              placeholder="Enter passage content"
            />
          </div>
        )}

        {question.passageType === 'IMAGE' && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image Upload (PNG, JPG, JPEG)
            </label>
            {question.imagePreview || question.imageUrl ? (
              <div className="space-y-2">
                <div className="relative inline-block">
                  <img
                    src={question.imagePreview || question.imageUrl}
                    alt="Passage illustration"
                    className="max-w-full h-auto max-h-48 rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(question.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {question.imageFileName ||
                    question.imageUrl?.split('/')?.pop() ||
                    'Current image'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(question.id, file);
                    }}
                    className="hidden"
                  />
                  <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm text-center text-gray-700">
                    Choose Image (PNG, JPG, JPEG)
                  </div>
                </label>
              </div>
            )}
          </div>
        )}

        {question.passageType === 'AUDIO' && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Audio Upload (MP3)
            </label>
            {question.audioFile || question.audioUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-md">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {question.audioFileName ||
                        question.audioUrl?.split('/')?.pop() ||
                        'Current audio'}
                    </p>
                    {question.audioFile && (
                      <p className="text-xs text-gray-500">
                        {(question.audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <audio controls className="flex-1 max-w-xs">
                    <source
                      src={question.audioPreview || question.audioUrl}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                  <button
                    type="button"
                    onClick={() => removeAudio(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleAudioUpload(question.id, file);
                    }}
                    className="hidden"
                  />
                  <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm text-center text-gray-700">
                    Choose Audio File (MP3)
                  </div>
                </label>
              </div>
            )}
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
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Part'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

