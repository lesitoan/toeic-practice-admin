'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ViewTestModal({ isOpen, onClose, test, testDetail, loading }) {
  if (!isOpen || !test) return null;

  // Use testDetail if available, otherwise fallback to test
  const template = testDetail?.template || null;
  const parts = testDetail?.parts || [];
  const totalQuestions = testDetail?.total_questions || 0;
  const totalGroups = testDetail?.total_groups || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">Test Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading test details...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Test Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <p className="text-base text-gray-900">
                    {template?.name || test.name || test.title || 'N/A'}
                  </p>
                </div>

                {/* Description */}
                {(template?.description || test.description) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-base text-gray-900">
                      {template?.description || test.description || 'No description'}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      (template?.status || test.status) === 'published' || 
                      (template?.status || test.status) === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {template?.status || test.status || 'draft'}
                  </span>
                </div>

                {/* Statistics */}
                {(totalQuestions > 0 || totalGroups > 0) && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {totalQuestions > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Questions
                        </label>
                        <p className="text-base text-gray-900">{totalQuestions}</p>
                      </div>
                    )}
                    {totalGroups > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Groups
                        </label>
                        <p className="text-base text-gray-900">{totalGroups}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Test ID */}
                {test.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test ID (Template ID)
                    </label>
                    <p className="text-base text-gray-500 font-mono">{test.id}</p>
                  </div>
                )}

                {/* Parts and Questions */}
                {parts.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Test Parts & Questions
                    </label>
                    <div className="space-y-6">
                      {parts.map((partData, partIndex) => (
                        <div key={partIndex} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Part {partData.part}
                          </h3>
                          {partData.items && partData.items.length > 0 && (
                            <div className="space-y-4">
                              {partData.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-gray-50 rounded-md p-4">
                                  {item.kind === 'passage' && item.passage && (
                                    <div className="mb-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                          Passage {item.passage.id}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          Type: {item.passage.type}
                                        </span>
                                      </div>
                                      
                                      {/* Display content based on passage type */}
                                      {item.passage.type === 'IMAGE' && (
                                        <div className="mt-2">
                                          {(item.passage.content || item.passage.content_preview) ? (
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                              <img
                                                src={item.passage.content || item.passage.content_preview}
                                                alt={`Passage ${item.passage.id}`}
                                                className="max-w-full h-auto max-h-96 rounded-md"
                                                onError={(e) => {
                                                  e.target.style.display = 'none';
                                                  e.target.nextSibling.style.display = 'block';
                                                }}
                                              />
                                              <p className="text-xs text-red-500 mt-2" style={{ display: 'none' }}>
                                                Failed to load image. Link: {item.passage.content || item.passage.content_preview}
                                              </p>
                                              {(item.passage.content || item.passage.content_preview) && (
                                                <a
                                                  href={item.passage.content || item.passage.content_preview}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                                >
                                                  View Full Image
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-gray-500 italic">No image available</p>
                                          )}
                                        </div>
                                      )}
                                      
                                      {item.passage.type === 'AUDIO' && (
                                        <div className="mt-2">
                                          {(item.passage.content || item.passage.content_preview) ? (
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                              <audio
                                                controls
                                                className="w-full"
                                                src={item.passage.content || item.passage.content_preview}
                                              >
                                                Your browser does not support the audio element.
                                              </audio>
                                              {(item.passage.content || item.passage.content_preview) && (
                                                <a
                                                  href={item.passage.content || item.passage.content_preview}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                                >
                                                  Download Audio
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-gray-500 italic">No audio available</p>
                                          )}
                                        </div>
                                      )}
                                      
                                      {item.passage.type === 'TEXT' && item.passage.content_preview && (
                                        <div className="mt-2">
                                          <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap">
                                            {item.passage.content_preview}
                                          </p>
                                        </div>
                                      )}
                                      
                                      <p className="text-xs text-gray-500 mt-2">
                                        Questions: {item.position_start} - {item.position_end}
                                      </p>
                                    </div>
                                  )}
                                  {item.questions && item.questions.length > 0 && (
                                    <div className="mt-3 space-y-3">
                                      {item.questions.map((question, qIndex) => (
                                        <div key={question.id} className="bg-white p-3 rounded border border-gray-200">
                                          <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-medium text-blue-600">
                                              Q{question.position}
                                            </span>
                                            {question.requires_passage && (
                                              <span className="text-xs text-gray-500">
                                                Requires Passage
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-900 mb-2">
                                            {question.content}
                                          </p>
                                          {question.answers && question.answers.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                              {question.answers.map((answer, aIndex) => (
                                                <div key={answer.id} className="text-xs text-gray-600 pl-2">
                                                  {String.fromCharCode(65 + aIndex)}. {answer.text}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

