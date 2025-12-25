'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

const TestSessionDetailModal = ({ isOpen, onClose, testDetail, loading }) => {
  if (!isOpen) return null;

  // Get correct answer for a question
  const getCorrectAnswer = (questionId) => {
    if (!testDetail?.answers_true) return null;
    
    for (const partKey in testDetail.answers_true) {
      const partAnswers = testDetail.answers_true[partKey];
      if (partAnswers[questionId]) {
        return partAnswers[questionId];
      }
    }
    return null;
  };

  // Get user answer for a question
  const getUserAnswer = (questionId) => {
    if (!testDetail?.answers_user) return null;
    return testDetail.answers_user[questionId] || null;
  };

  // Check if answer is correct
  const isAnswerCorrect = (questionId) => {
    const correctAnswer = getCorrectAnswer(questionId);
    const userAnswer = getUserAnswer(questionId);
    return correctAnswer && userAnswer && correctAnswer === userAnswer;
  };

  // Find answer by ID
  const findAnswerById = (answers, answerId) => {
    return answers.find(ans => ans.id === answerId);
  };

  // Get answer label (A, B, C, D)
  const getAnswerLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Test Detail
              </h2>
              {testDetail?.test_content?.template && (
                <p className="text-sm text-gray-500 mt-1">
                  {testDetail.test_content.template.name}
                </p>
              )}
            </div>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading test detail...</span>
              </div>
            ) : testDetail?.test_content?.parts ? (
              <div className="space-y-8">
                {/* Meta Info */}
                {testDetail.test_content.meta && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Total Questions:</span>
                        <span className="ml-2 text-gray-900">{testDetail.test_content.meta.total_questions}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Groups:</span>
                        <span className="ml-2 text-gray-900">{testDetail.test_content.meta.total_groups}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Generated At:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(testDetail.test_content.meta.generated_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Parts */}
                {testDetail.test_content.parts.map((part, partIndex) => (
                  <div key={part.part} className="border border-gray-200 rounded-lg p-6">
                    <div className="mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Part {part.part}
                        {part.count_question_part && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({part.count_question_part} questions)
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {part.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-4 border-blue-500 pl-4">
                          {/* Passage Info */}
                          {item.passage && (
                            <div className="mb-3 p-3 bg-gray-50 rounded">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase">
                                  {item.passage.type}
                                </span>
                                {item.passage.type === 'TEXT' && item.passage.content_preview && (
                                  <span className="text-xs text-gray-600">
                                    Preview: {item.passage.content_preview.substring(0, 100)}...
                                  </span>
                                )}
                              </div>
                              {item.passage.type === 'AUDIO' && item.passage.content_preview && (
                                <p className="text-sm text-gray-700 italic">
                                  "{item.passage.content_preview}"
                                </p>
                              )}
                            </div>
                          )}

                          {/* Questions */}
                          {item.questions && item.questions.map((question, qIndex) => {
                            const correctAnswerId = getCorrectAnswer(question.id);
                            const userAnswerId = getUserAnswer(question.id);
                            const isCorrect = isAnswerCorrect(question.id);

                            return (
                              <div key={question.id} className="mb-6 last:mb-0">
                                <div className="mb-3">
                                  <div className="flex items-start gap-2">
                                    <span className="font-semibold text-gray-900 min-w-[40px]">
                                      Q{question.position}:
                                    </span>
                                    <p className="text-gray-900 flex-1">{question.content}</p>
                                  </div>
                                </div>

                                {/* Answers */}
                                <div className="ml-[48px] space-y-2">
                                  {question.answers.map((answer, aIndex) => {
                                    const isCorrectAnswer = answer.id === correctAnswerId;
                                    const isUserAnswer = answer.id === userAnswerId;
                                    const isWrong = isUserAnswer && !isCorrect;

                                    let bgColor = 'bg-white';
                                    let borderColor = 'border-gray-200';
                                    let textColor = 'text-gray-900';

                                    if (isCorrectAnswer) {
                                      bgColor = 'bg-green-50';
                                      borderColor = 'border-green-500';
                                      textColor = 'text-green-900';
                                    }
                                    if (isWrong) {
                                      bgColor = 'bg-red-50';
                                      borderColor = 'border-red-500';
                                      textColor = 'text-red-900';
                                    }
                                    if (isUserAnswer && isCorrect) {
                                      bgColor = 'bg-green-50';
                                      borderColor = 'border-green-500';
                                      textColor = 'text-green-900';
                                    }

                                    return (
                                      <div
                                        key={answer.id}
                                        className={`p-3 rounded border-2 ${bgColor} ${borderColor} ${textColor}`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <span className="font-semibold min-w-[20px]">
                                            {getAnswerLabel(aIndex)}.
                                          </span>
                                          <span className="flex-1">{answer.text}</span>
                                          {isCorrectAnswer && (
                                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                              Correct
                                            </span>
                                          )}
                                          {isUserAnswer && !isCorrect && (
                                            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                                              Your Answer
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Answer Status */}
                                {userAnswerId && (
                                  <div className="ml-[48px] mt-2">
                                    {isCorrect ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Correct
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        ✗ Incorrect
                                      </span>
                                    )}
                                  </div>
                                )}
                                {!userAnswerId && (
                                  <div className="ml-[48px] mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Not answered
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No test detail available.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
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
};

export default TestSessionDetailModal;

