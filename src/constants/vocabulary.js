import { BookOpenIcon } from '@heroicons/react/24/outline';

// Table columns configuration
export const VOCABULARY_COLUMNS = [
  {
    key: 'word',
    label: 'Word',
    render: (value, item, onView) => (
      <div className="flex items-center">
        <BookOpenIcon className="h-4 w-4 text-blue-500 mr-2" />
        <div>
          <button
            onClick={() => onView(item)}
            className="font-medium text-blue-600 hover:text-blue-800 text-left"
          >
            {value}
          </button>
          {item.pronunciation && (
            <div className="text-sm text-gray-500">{item.pronunciation}</div>
          )}
        </div>
      </div>
    )
  },
  {
    key: 'definition',
    label: 'Definition',
    render: (value) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    )
  },
  {
    key: 'partOfSpeech',
    label: 'Part of Speech',
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value}
      </span>
    )
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    render: (value) => {
      const colors = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800'
      };
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      );
    }
  },
  {
    key: 'category',
    label: 'Category',
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {value}
      </span>
    )
  }
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' },
];

// Categories (fallback data)
export const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'business', label: 'Business' },
  { value: 'academic', label: 'Academic' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
];

// Parts of speech (fallback data)
export const PARTS_OF_SPEECH = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'conjunction', label: 'Conjunction' },
  { value: 'pronoun', label: 'Pronoun' },
  { value: 'interjection', label: 'Interjection' },
];

// Default filter state
export const DEFAULT_FILTERS = {
  search: '',
  difficulty: '',
  category: '',
  partOfSpeech: ''
};

// Filter field configurations
export const FILTER_FIELDS = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search words, definitions...'
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    type: 'select',
    placeholder: 'All difficulties'
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'All categories'
  },
  {
    key: 'partOfSpeech',
    label: 'Part of Speech',
    type: 'select',
    placeholder: 'All parts'
  }
];
