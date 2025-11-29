import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const VocabularyStatsCards = ({ vocabularies }) => {
  // Ensure vocabularies is an array
  const vocabulariesArray = Array.isArray(vocabularies) ? vocabularies : [];
  
  // Calculate statistics
  const totalWords = vocabulariesArray.length;
  const beginnerWords = vocabulariesArray.filter(v => v.difficulty === 'beginner').length;
  const intermediateWords = vocabulariesArray.filter(v => v.difficulty === 'intermediate').length;
  const advancedWords = vocabulariesArray.filter(v => v.difficulty === 'advanced').length;

  const stats = [
    {
      label: 'Total Words',
      value: totalWords,
      icon: BookOpenIcon,
      color: 'blue',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Beginner',
      value: beginnerWords,
      icon: 'B',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Intermediate',
      value: intermediateWords,
      icon: 'I',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Advanced',
      value: advancedWords,
      icon: 'A',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="card-block">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {typeof stat.icon === 'string' ? (
                <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 86, 227, 0.1)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                    {stat.icon}
                  </span>
                </div>
              ) : (
                <stat.icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
              )}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </dt>
                <dd className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {stat.value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VocabularyStatsCards;
