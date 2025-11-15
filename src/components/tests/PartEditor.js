'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
  // Structure: passages with questions inside
  const [passages, setPassages] = useState(() => {
    // Convert old format to new format if needed
    if (initialData.passages && Array.isArray(initialData.passages)) {
      return initialData.passages.map(p => ({
        ...p,
        questions: p.questions || [],
        imageFile: null,
        audioFile: null,
        imagePreview: '',
        audioPreview: '',
      }));
    }
    // If old format with questions array
    if (initialData.questions && Array.isArray(initialData.questions)) {
      const passageMap = {};
      initialData.questions.forEach(q => {
        const ref = q.passageRef || generatePassageRef();
        if (!passageMap[ref]) {
          passageMap[ref] = {
            id: Date.now() + Math.random(),
            ref,
            type: q.passageType || 'TEXT',
            content: q.passage || '',
            public_id: q.imageUrl || q.audioUrl || '',
            instructions: q.passageInstructions || '',
            questions: [],
            imageFile: null,
            audioFile: null,
            imagePreview: q.passageType === 'IMAGE' && q.imageUrl ? q.imageUrl : '',
            audioPreview: q.passageType === 'AUDIO' && q.audioUrl ? q.audioUrl : '',
          };
        }
        passageMap[ref].questions.push({
          id: q.id || Date.now() + Math.random(),
          question: q.question || '',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correctAnswer || 0,
          difficulty: q.difficulty || DEFAULT_DIFFICULTY,
          explanation: q.explanation || '',
        });
      });
      return Object.values(passageMap);
    }
    return [];
  });
  
  const [partConfig, setPartConfig] = useState(initialData.config || {});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedPassages, setExpandedPassages] = useState(new Set());
  const passagesRef = useRef(passages);

  useEffect(() => {
    passagesRef.current = passages;
  }, [passages]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      passagesRef.current.forEach(passage => {
        if (passage.imagePreview && passage.imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(passage.imagePreview);
        }
        if (passage.audioPreview && passage.audioPreview.startsWith('blob:')) {
          URL.revokeObjectURL(passage.audioPreview);
        }
      });
    };
  }, []);

  const addPassage = () => {
    const newPassage = {
      id: Date.now(),
      ref: generatePassageRef(),
      type: 'TEXT',
      content: '',
      public_id: '',
      instructions: '',
      questions: [],
      imageFile: null,
      audioFile: null,
      imagePreview: '',
      audioPreview: '',
    };
    setPassages(prev => [...prev, newPassage]);
    setExpandedPassages(prev => new Set([...prev, newPassage.id]));
  };

  const removePassage = (passageId) => {
    const passage = passages.find(p => p.id === passageId);
    if (passage) {
      if (passage.imagePreview && passage.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(passage.imagePreview);
      }
      if (passage.audioPreview && passage.audioPreview.startsWith('blob:')) {
        URL.revokeObjectURL(passage.audioPreview);
      }
    }
    setPassages(prev => prev.filter(p => p.id !== passageId));
    setExpandedPassages(prev => {
      const newSet = new Set(prev);
      newSet.delete(passageId);
      return newSet;
    });
  };

  const updatePassage = (passageId, field, value) => {
    setPassages(prev =>
      prev.map(p => (p.id === passageId ? { ...p, [field]: value } : p))
    );
  };

  const addQuestionToPassage = (passageId) => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: DEFAULT_DIFFICULTY,
      explanation: '',
      imageFile: null,
      audioFile: null,
      imageUrl: '',
      audioUrl: '',
      imagePreview: '',
      audioPreview: '',
    };
    setPassages(prev =>
      prev.map(p =>
        p.id === passageId
          ? { ...p, questions: [...(p.questions || []), newQuestion] }
          : p
      )
    );
  };

  const removeQuestion = (passageId, questionId) => {
    setPassages(prev =>
      prev.map(p => {
        if (p.id === passageId) {
          const question = p.questions?.find(q => q.id === questionId);
          if (question) {
            if (question.imagePreview) URL.revokeObjectURL(question.imagePreview);
            if (question.audioPreview) URL.revokeObjectURL(question.audioPreview);
          }
          return {
            ...p,
            questions: (p.questions || []).filter(q => q.id !== questionId)
          };
        }
        return p;
      })
    );
  };

  const updateQuestion = (passageId, questionId, field, value) => {
    setPassages(prev =>
      prev.map(p =>
        p.id === passageId
          ? {
              ...p,
              questions: (p.questions || []).map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
              )
            }
          : p
      )
    );
  };

  const updateOption = (passageId, questionId, optionIndex, value) => {
    setPassages(prev =>
      prev.map(p =>
        p.id === passageId
          ? {
              ...p,
              questions: (p.questions || []).map(q => {
                if (q.id === questionId) {
                  const newOptions = [...q.options];
                  newOptions[optionIndex] = value;
                  return { ...q, options: newOptions };
                }
                return q;
              })
            }
          : p
      )
    );
  };

  const handlePassageImageUpload = (passageId, file) => {
    if (!file) return;
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, or JPEG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updatePassage(passageId, 'imageFile', file);
    updatePassage(passageId, 'imagePreview', previewUrl);
  };

  const handlePassageAudioUpload = (passageId, file) => {
    if (!file) return;
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/mpeg3'];
    if (!validAudioTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp3')) {
      toast.error('Please upload a valid MP3 audio file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Audio file size must be less than 10MB');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updatePassage(passageId, 'audioFile', file);
    updatePassage(passageId, 'audioPreview', previewUrl);
  };

  const removePassageImage = (passageId) => {
    setPassages(prev =>
      prev.map(p => {
        if (p.id === passageId) {
          if (p.imagePreview && p.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(p.imagePreview);
          }
          return {
            ...p,
            imageFile: null,
            imagePreview: '',
            public_id: '',
          };
        }
        return p;
      })
    );
  };

  const removePassageAudio = (passageId) => {
    setPassages(prev =>
      prev.map(p => {
        if (p.id === passageId) {
          if (p.audioPreview && p.audioPreview.startsWith('blob:')) {
            URL.revokeObjectURL(p.audioPreview);
          }
          return {
            ...p,
            audioFile: null,
            audioPreview: '',
            public_id: '',
          };
        }
        return p;
      })
    );
  };

  const togglePassageExpanded = (passageId) => {
    setExpandedPassages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(passageId)) {
        newSet.delete(passageId);
      } else {
        newSet.add(passageId);
      }
      return newSet;
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

    // Validate passages and questions
    for (const passage of passages) {
      if (!passage.ref?.trim()) {
        toast.error('All passages must have a ref');
        return;
      }
      if (passage.type === 'TEXT' && !passage.content?.trim()) {
        toast.error(`Passage "${passage.ref}" must have content for TEXT type`);
        return;
      }
      if (passage.questions?.length === 0) {
        toast.error(`Passage "${passage.ref}" must have at least one question`);
        return;
      }
      for (const question of passage.questions || []) {
        if (!question.question?.trim()) {
          toast.error('All questions must have question text');
          return;
        }
        if (question.options.some(opt => !opt.trim())) {
          toast.error('All question options must be filled');
          return;
        }
      }
    }

    setIsSaving(true);

    try {
      const signature = await testsService.getCloudinarySignature(testTemplateId);

      const passagesPayload = [];
      const questionsPayload = [];

      for (const passage of passages) {
        let passageContent = '';
        let passagePublicId = '';

        // Handle passage content based on type
        if (passage.type === 'TEXT') {
          passageContent = passage.content?.trim() || '';
        } else if (passage.type === 'IMAGE') {
          // Upload image file if exists
          if (passage.imageFile) {
            passagePublicId = await uploadFileToCloudinary(passage.imageFile, signature);
            if (passage.imagePreview && passage.imagePreview.startsWith('blob:')) {
              URL.revokeObjectURL(passage.imagePreview);
            }
          } else if (passage.public_id) {
            passagePublicId = passage.public_id;
          }
        } else if (passage.type === 'AUDIO') {
          // Upload audio file if exists
          if (passage.audioFile) {
            passagePublicId = await uploadFileToCloudinary(passage.audioFile, signature);
            if (passage.audioPreview && passage.audioPreview.startsWith('blob:')) {
              URL.revokeObjectURL(passage.audioPreview);
            }
          } else if (passage.public_id) {
            passagePublicId = passage.public_id;
          }
        }

        passagesPayload.push({
          ref: passage.ref.trim(),
          type: passage.type,
          content: passageContent,
          public_id: passagePublicId,
          instructions: passage.instructions?.trim() || '',
        });

        // Process questions for this passage
        for (const question of passage.questions || []) {

          const answers = question.options.map((option, optionIndex) => ({
            text: option.trim(),
            is_correct: question.correctAnswer === optionIndex,
            order: optionIndex + 1,
          }));

          questionsPayload.push({
            content: question.question.trim(),
            difficulty: (question.difficulty || DEFAULT_DIFFICULTY).toUpperCase(),
            part: part.id,
            passage_ref: passage.ref.trim(),
            answers,
          });
        }
      }

      const templatePayload = {
        name: templateMeta?.name?.trim() || 'Untitled Template',
        description: templateMeta?.description || '',
        status: templateMeta?.status || 'draft',
        content: {
          passages: passagesPayload,
          questions: questionsPayload,
        },
      };

      console.log('Saving part to API:', {
        testTemplateId,
        part: part.id,
        passagesCount: passagesPayload.length,
        questionsCount: questionsPayload.length,
        payload: templatePayload
      });

      const response = await testsService.enqueueTemplateImport(testTemplateId, templatePayload);
      
      console.log('API response:', response);

      const partData = {
        passages: passages.map(p => ({
          ...p,
          imageFile: null,
          audioFile: null,
          imagePreview: p.imagePreview?.startsWith('blob:') ? '' : p.imagePreview,
          audioPreview: p.audioPreview?.startsWith('blob:') ? '' : p.audioPreview,
          questions: p.questions || []
        })),
        config: partConfig,
        lastSavedAt: new Date().toISOString(),
      };

      onSave(partData);
      toast.success(`${part.name} saved successfully to database!`);
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

  const renderPassageEditor = (passage, passageIndex) => {
    const isExpanded = expandedPassages.has(passage.id);
    const questionCount = passage.questions?.length || 0;
    
    // Calculate starting question number (sum of all questions in previous passages)
    const questionsBeforeThisPassage = passages
      .slice(0, passageIndex)
      .reduce((sum, p) => sum + (p.questions?.length || 0), 0);

    return (
      <div key={passage.id} className="border-2 border-blue-200 rounded-lg mb-4 bg-white">
        {/* Passage Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => togglePassageExpanded(passage.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Ref: {passage.ref}
                  </span>
                  <select
                    value={passage.type}
                    onChange={(e) => updatePassage(passage.id, 'type', e.target.value)}
                    className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {PASSAGE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                  </span>
                </div>
                {passage.instructions && (
                  <p className="text-xs text-gray-600 italic">{passage.instructions}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removePassage(passage.id)}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Passage Content (Expanded) */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* Passage Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <input
                type="text"
                value={passage.instructions || ''}
                onChange={(e) => updatePassage(passage.id, 'instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., Read the email and answer the questions."
              />
            </div>

            {/* Passage Content based on type */}
            {passage.type === 'TEXT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passage Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={passage.content || ''}
                  onChange={(e) => updatePassage(passage.id, 'content', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={6}
                  placeholder="Enter passage content..."
                />
              </div>
            )}

            {passage.type === 'IMAGE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Upload (PNG, JPG, JPEG) <span className="text-red-500">*</span>
                </label>
                {passage.imagePreview || passage.public_id ? (
                  <div className="space-y-2">
                    <div className="relative inline-block">
                      <img
                        src={passage.imagePreview || passage.public_id}
                        alt="Passage"
                        className="max-w-full h-auto max-h-64 rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removePassageImage(passage.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handlePassageImageUpload(passage.id, file);
                      }}
                      className="hidden"
                    />
                    <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm text-center text-gray-700">
                      Choose Image (PNG, JPG, JPEG)
                    </div>
                  </label>
                )}
              </div>
            )}

            {passage.type === 'AUDIO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio Upload (MP3) <span className="text-red-500">*</span>
                </label>
                {passage.audioFile || passage.public_id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-md">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {passage.audioFile?.name || passage.public_id?.split('/')?.pop() || 'Current audio'}
                        </p>
                        {passage.audioFile && (
                          <p className="text-xs text-gray-500">
                            {(passage.audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <audio controls className="flex-1 max-w-xs">
                        <source src={passage.audioPreview || passage.public_id} type="audio/mpeg" />
                      </audio>
                      <button
                        type="button"
                        onClick={() => removePassageAudio(passage.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handlePassageAudioUpload(passage.id, file);
                      }}
                      className="hidden"
                    />
                    <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm text-center text-gray-700">
                      Choose Audio File (MP3)
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* Questions Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Questions ({questionCount})
                </h4>
                <button
                  onClick={() => addQuestionToPassage(passage.id)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Question
                </button>
              </div>

              {questionCount === 0 ? (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-sm">No questions yet. Click "Add Question" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {passage.questions.map((question, qIndex) => {
                    const globalQuestionNumber = questionsBeforeThisPassage + qIndex + 1;
                    return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-900">
                          Question {globalQuestionNumber}
                        </h5>
                        <button
                          onClick={() => removeQuestion(passage.id, question.id)}
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
                          onChange={(e) => updateQuestion(passage.id, question.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                          placeholder="Enter question text"
                        />
                      </div>

                      {/* Difficulty */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Difficulty
                        </label>
                        <select
                          value={question.difficulty}
                          onChange={(e) => updateQuestion(passage.id, question.id, 'difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>


                      {/* Options */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Answer Options <span className="text-red-500">*</span>
                        </label>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 mb-2">
                            <input
                              type="radio"
                              name={`correct-${passage.id}-${question.id}`}
                              checked={question.correctAnswer === optIndex}
                              onChange={() => updateQuestion(passage.id, question.id, 'correctAnswer', optIndex)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(passage.id, question.id, optIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(passage.id, question.id, 'explanation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                          placeholder="Enter explanation for the answer"
                        />
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
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
            {/* Add Passage Button */}
            <div className="mb-4">
              <button
                onClick={addPassage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Passage
              </button>
            </div>

            {/* Passages List */}
            {passages.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm">No passages added yet. Click "Add Passage" to get started.</p>
              </div>
            ) : (
              <div>
                {passages.map((passage, index) => renderPassageEditor(passage, index))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || passages.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Part'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
