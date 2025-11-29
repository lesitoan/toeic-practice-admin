import React from 'react';

const TestsStatsCards = ({ tests }) => {
  // Calculate statistics
  const totalTests = tests.length;
  const activeTests = tests.filter(t => t.status === 'active').length;
  const draftTests = tests.filter(t => t.status === 'draft').length;
  const archivedTests = tests.filter(t => t.status === 'archived').length;
  const totalUsers = tests.reduce((acc, test) => acc + (test.assignedUsers || 0), 0);

  const stats = [
    {
      label: 'Total Tests',
      value: totalTests,
      icon: 'T',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      label: 'Active',
      value: activeTests,
      icon: 'A',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Drafts',
      value: draftTests,
      icon: 'D',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Archived',
      value: archivedTests,
      icon: 'A',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: 'U',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <div key={index} className="card-block">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 86, 227, 0.1)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  {stat.icon}
                </span>
              </div>
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

export default TestsStatsCards;
