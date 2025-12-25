import React from 'react';

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
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      label: 'Beginner',
      value: beginnerWords,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Intermediate',
      value: intermediateWords,
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      label: 'Advanced',
      value: advancedWords,
      gradient: 'from-rose-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`card-block bg-gradient-to-br ${stat.gradient} text-white rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="p-6">
            <dl>
              <dt className="text-sm font-serif font-bold uppercase tracking-wide opacity-90 mb-2">
                {stat.label}
              </dt>
              <dd className="text-4xl font-serif font-bold">
                {stat.value}
              </dd>
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VocabularyStatsCards;
