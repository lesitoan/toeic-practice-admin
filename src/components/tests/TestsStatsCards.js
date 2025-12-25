import React from 'react';

const TestsStatsCards = ({ tests }) => {
  // Calculate statistics
  const totalTests = tests.length;
  const activeTests = tests.filter(t => t.status === 'active').length;
  const draftTests = tests.filter(t => t.status === 'draft').length;
  const totalUsers = tests.reduce((acc, test) => acc + (test.assignedUsers || 0), 0);

  const stats = [
    {
      label: 'Total Tests',
      value: totalTests,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Active',
      value: activeTests,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Drafts',
      value: draftTests,
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      label: 'Total Users',
      value: totalUsers,
      gradient: 'from-purple-500 to-pink-500'
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

export default TestsStatsCards;
