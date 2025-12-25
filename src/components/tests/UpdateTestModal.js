'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PartEditor from './PartEditor';
import testsService from '@/services/tests.service';

// TOEIC Test Parts
const TOEIC_PARTS = [
  { id: 1, name: 'Part 1: Photographs', description: 'Listening - Photographs' },
  { id: 2, name: 'Part 2: Question-Response', description: 'Listening - Question-Response' },
  { id: 3, name: 'Part 3: Conversations', description: 'Listening - Conversations' },
  { id: 4, name: 'Part 4: Short Talks', description: 'Listening - Short Talks' },
  { id: 5, name: 'Part 5: Incomplete Sentences', description: 'Reading - Incomplete Sentences' },
  { id: 6, name: 'Part 6: Text Completion', description: 'Reading - Text Completion' },
  { id: 7, name: 'Part 7: Reading Comprehension', description: 'Reading - Reading Comprehension' },
];

// Helper function to generate passage ref
const generatePassageRef = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export default function UpdateTestModal({ isOpen, onClose, test, onSave }) {
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testStatus, setTestStatus] = useState('draft');
  const [selectedPart, setSelectedPart] = useState(null);
  const [partsData, setPartsData] = useState({});
  const [testTemplateId, setTestTemplateId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const handleEditPart = (part) => {
    setSelectedPart(part);
  };

  const handleSavePart = (partId, partData) => {
    setPartsData(prev => ({
      ...prev,
      [partId]: partData
    }));
    setSelectedPart(null);
  };

  const handleClose = () => {
    setTestName('');
    setTestDescription('');
    setTestStatus('draft');
    setSelectedPart(null);
    setPartsData({});
    setTestTemplateId(null);
    setLoadError(null);
    onClose();
  };

  // Parse API response data into partsData format
  const parseTestData = (testDetail) => {
    const parsedPartsData = {};

    if (testDetail?.parts && Array.isArray(testDetail.parts)) {
      testDetail.parts.forEach((partData) => {
        const partId = partData.part;
        const passages = [];

        if (partData.items && Array.isArray(partData.items)) {
          partData.items.forEach((item) => {
            if (item.kind === 'passage' && item.passage) {
              const passage = {
                id: Date.now() + Math.random(),
                ref: item.passage.ref || generatePassageRef(),
                type: item.passage.type || 'TEXT',
                content: item.passage.content || item.passage.content_preview || '',
                public_id: item.passage.public_id || item.passage.content || '',
                instructions: item.passage.instructions || '',
                imageFile: null,
                audioFile: null,
                imagePreview: item.passage.type === 'IMAGE' && item.passage.content 
                  ? item.passage.content 
                  : '',
                audioPreview: item.passage.type === 'AUDIO' && item.passage.content 
                  ? item.passage.content 
                  : '',
                questions: [],
              };

              // Parse questions for this passage
              if (item.questions && Array.isArray(item.questions)) {
                passage.questions = item.questions.map((q) => ({
                  id: q.id || Date.now() + Math.random(),
                  question: q.content || '',
                  options: q.answers?.map((ans) => ans.text || '') || ['', '', '', ''],
                  correctAnswer: q.answers?.findIndex((ans) => ans.is_correct) || 0,
                  difficulty: q.difficulty || 'EASY',
                  explanation: '',
                }));
              }

              passages.push(passage);
            }
          });
        }

        if (passages.length > 0) {
          parsedPartsData[partId] = {
            passages,
            config: {},
            lastSavedAt: new Date().toISOString(),
          };
        }
      });
    }

    return parsedPartsData;
  };

  // Load test data from API
  const loadTestData = async () => {
    if (!test?.id) {
      setLoadError('Test ID not found');
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const templateId = test.id;
      setTestTemplateId(templateId);

      // Fetch test details
      const testDetail = await testsService.getTestById(templateId, {
        page: 1,
        limit: 20,
        sort_by: 'id',
        sort_type: -1,
        name: 'default',
      });

      // Set test info from template
      if (testDetail?.template) {
        setTestName(testDetail.template.name || test.name || '');
        setTestDescription(testDetail.template.description || test.description || '');
        setTestStatus(testDetail.template.status || test.status || 'draft');
      } else {
        setTestName(test.name || test.title || '');
        setTestDescription(test.description || '');
        setTestStatus(test.status || 'draft');
      }

      // Parse and set parts data
      const parsedData = parseTestData(testDetail);
      setPartsData(parsedData);

      console.log('Test data loaded:', {
        templateId,
        partsCount: Object.keys(parsedData).length,
        testDetail,
      });
    } catch (error) {
      console.error('Error loading test data:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load test data. Please try again.';
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && test) {
      loadTestData();
    } else {
      // Reset when closed
      setTestName('');
      setTestDescription('');
      setTestStatus('draft');
      setSelectedPart(null);
      setPartsData({});
      setTestTemplateId(null);
      setLoadError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, test]);

  const handleUpdateTest = async () => {
    if (!testName.trim()) {
      toast.error('Please enter a test name');
      return;
    }

    if (!testTemplateId) {
      toast.error('Test template ID not found');
      return;
    }

    try {
      // Show loading
      toast.info('Updating test... Please wait.');

      // Get Cloudinary signature
      const signature = await testsService.getCloudinarySignature(testTemplateId);

      // Collect all passages and questions from all parts
      const allPassages = [];
      const allQuestions = [];

      // Process each part
      for (const [partId, partData] of Object.entries(partsData)) {
        if (!partData || !partData.passages || !Array.isArray(partData.passages)) {
          continue;
        }

        // Process passages for this part
        for (const passage of partData.passages) {
          let passageContent = '';
          let passagePublicId = '';

          // Handle passage content based on type
          if (passage.type === 'TEXT') {
            passageContent = passage.content?.trim() || '';
          } else if (passage.type === 'IMAGE') {
            // Upload image file if exists
            if (passage.imageFile) {
              try {
                const uploadedUrl = await testsService.uploadFileToCloudinary(passage.imageFile, signature);
                passageContent = uploadedUrl;
                passagePublicId = uploadedUrl;
                if (passage.imagePreview && passage.imagePreview.startsWith('blob:')) {
                  URL.revokeObjectURL(passage.imagePreview);
                }
              } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                throw new Error(`Failed to upload image for passage "${passage.ref}": ${uploadError.message}`);
              }
            } else if (passage.public_id) {
              passageContent = passage.public_id;
              passagePublicId = passage.public_id;
            } else if (passage.content) {
              passageContent = passage.content;
              passagePublicId = passage.content;
            }
          } else if (passage.type === 'AUDIO') {
            // Upload audio file if exists
            if (passage.audioFile) {
              try {
                const uploadedUrl = await testsService.uploadFileToCloudinary(passage.audioFile, signature);
                passageContent = uploadedUrl;
                passagePublicId = uploadedUrl;
                if (passage.audioPreview && passage.audioPreview.startsWith('blob:')) {
                  URL.revokeObjectURL(passage.audioPreview);
                }
              } catch (uploadError) {
                console.error('Error uploading audio:', uploadError);
                throw new Error(`Failed to upload audio for passage "${passage.ref}": ${uploadError.message}`);
              }
            } else if (passage.public_id) {
              passageContent = passage.public_id;
              passagePublicId = passage.public_id;
            } else if (passage.content) {
              passageContent = passage.content;
              passagePublicId = passage.content;
            }
          }

          allPassages.push({
            ref: passage.ref?.trim() || generatePassageRef(),
            type: passage.type || 'TEXT',
            content: passageContent,
            public_id: passagePublicId,
            instructions: passage.instructions?.trim() || '',
          });

          // Process questions for this passage
          if (passage.questions && Array.isArray(passage.questions)) {
            for (const question of passage.questions) {
              const answers = question.options?.map((option, optionIndex) => ({
                text: option.trim(),
                is_correct: question.correctAnswer === optionIndex,
                order: optionIndex + 1,
              })) || [];

              allQuestions.push({
                content: question.question?.trim() || '',
                difficulty: (question.difficulty || 'EASY').toUpperCase(),
                part: parseInt(partId),
                passage_ref: passage.ref?.trim() || generatePassageRef(),
                answers,
              });
            }
          }
        }
      }

      // Create final payload
      const templatePayload = {
        name: testName.trim(),
        description: testDescription.trim(),
        status: testStatus,
        content: {
          passages: allPassages,
          questions: allQuestions,
        },
      };

      console.log('Updating test with all parts:', {
        testTemplateId,
        partsCount: Object.keys(partsData).length,
        passagesCount: allPassages.length,
        questionsCount: allQuestions.length,
      });

      // Send API request with existing template_id
      const response = await testsService.enqueueTemplateImport(testTemplateId, templatePayload);
      
      console.log('Test updated successfully:', response);

      toast.success(`Test "${testName}" updated successfully!`);
      
      const testData = {
        name: testName,
        description: testDescription,
        status: testStatus,
        templateId: testTemplateId,
        parts: partsData
      };

      onSave(testData);
      handleClose();
    } catch (error) {
      console.error('Error updating test:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update test. Please try again.';
      toast.error(message);
    }
  };

  if (!isOpen || !test) return null;

  // If a part is selected, show the part editor
  if (selectedPart) {
    return (
      <PartEditor
        part={selectedPart}
        initialData={partsData[selectedPart.id] || {}}
        onSave={(data) => handleSavePart(selectedPart.id, data)}
        onClose={() => setSelectedPart(null)}
        testTemplateId={testTemplateId}
        templateMeta={{
          name: testName,
          description: testDescription,
          status: testStatus,
        }}
        existingPartsData={partsData}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Update Test</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading test data...</p>
                </div>
              </div>
            ) : loadError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600 mb-4">{loadError}</p>
                <button
                  onClick={loadTestData}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Template Status */}
                <div className="mb-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Test Template</p>
                    {testTemplateId ? (
                      <p className="text-gray-500">Template ID: {testTemplateId}</p>
                    ) : (
                      <p className="text-gray-500">Loading...</p>
                    )}
                  </div>
                </div>

                {/* Test Name Field */}
                <div className="mb-6">
                  <label htmlFor="testName" className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="testName"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter test name (e.g., TOEIC Practice Test 1)"
                  />
                </div>

                {/* Description Field */}
                <div className="mb-6">
                  <label htmlFor="testDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="testDescription"
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Short description for this template"
                  />
                </div>

                {/* Status Field */}
                <div className="mb-6">
                  <label htmlFor="testStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="testStatus"
                    value={testStatus}
                    onChange={(e) => setTestStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                {/* Parts List */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    TOEIC Test Parts
                  </label>
                  <div className="space-y-2">
                    {TOEIC_PARTS.map((part) => {
                      const hasData = partsData[part.id];
                      return (
                        <div
                          key={part.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900">{part.name}</h3>
                              {hasData && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Configured
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                          </div>
                          <button
                            onClick={() => handleEditPart(part)}
                            disabled={!testTemplateId || isLoading}
                            className="ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            {hasData ? 'Edit' : 'Configure'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateTest}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{backgroundColor: 'var(--color-primary)'}}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Save Test
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
