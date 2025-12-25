'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import testsService from '@/services/tests.service';
import ReactMarkdown from 'react-markdown';

// Common TOEIC topics for dropdown
const COMMON_TOPICS = [
  'Business Communication',
  'Office Environment',
  'Travel & Transportation',
  'Entertainment',
  'Health & Medical',
  'Education',
  'Shopping',
  'Food & Dining',
  'Technology',
  'General Conversation',
  'Weather',
  'Housing',
  'Finance',
  'Custom Topic',
];

export default function AIAssistant({ partId }) {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [description, setDescription] = useState('');
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const isCustomTopic = topic === 'Custom Topic';
  const displayTopic = isCustomTopic ? customTopic : topic;

  const handleGenerate = async () => {
    // Validate inputs
    if (!displayTopic.trim()) {
      toast.error('Please enter or select a topic');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const response = await testsService.getAIAdvice(displayTopic, partId, description);
      setAdvice(response.advice || '');
      toast.success('AI suggestions generated successfully');
    } catch (error) {
      console.error('Error generating AI advice:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to generate AI suggestions. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!advice) return;

    navigator.clipboard
      .writeText(advice)
      .then(() => {
        toast.success('Content copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy content');
      });
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleReset = () => {
    setAdvice(null);
    setDescription('');
    setTopic('');
    setCustomTopic('');
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant Suggestions</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Topic <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <select
              id="topic"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (e.target.value !== 'Custom Topic') {
                  setCustomTopic('');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select or enter custom topic</option>
              {COMMON_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {isCustomTopic && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter custom topic"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            )}
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what kind of questions you need (e.g., focus on grammar, vocabulary, specific scenario...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !displayTopic.trim() || !description.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate Questions (AI Suggestions)
            </>
          )}
        </button>

        {/* Warning */}
        {advice && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Content is AI-generated and requires review before official use.
            </p>
          </div>
        )}

        {/* AI Response */}
        {advice && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">AI Suggestions</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  title="Copy content"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Regenerate"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md border border-gray-200 overflow-auto max-h-96" style={{ whiteSpace: 'pre-wrap' }}>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-base font-semibold text-gray-900 mt-2 mb-1" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed whitespace-pre-wrap" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-none text-sm text-gray-700 mb-2 space-y-1.5 pl-0" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-none text-sm text-gray-700 mb-2 space-y-1.5 pl-0" {...props} />
                  ),
                  li: ({ node, children, ...props }) => {
                    // Render each list item on its own line
                    return (
                      <li className="text-sm text-gray-700 mb-1.5 block leading-relaxed" {...props}>
                        <span className="inline-block w-full">{children}</span>
                      </li>
                    );
                  },
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-gray-900" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-gray-700" {...props} />
                  ),
                  br: () => <br className="block" />,
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="px-1.5 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block p-2 bg-gray-200 text-gray-800 rounded text-xs font-mono overflow-x-auto mb-2 whitespace-pre"
                        {...props}
                      />
                    ),
                }}
              >
                {advice}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Reset Button (only show when there's advice) */}
        {advice && (
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Clear & Start New
          </button>
        )}
      </div>
    </div>
  );
}

