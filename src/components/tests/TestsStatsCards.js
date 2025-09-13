import React from 'react';

const TestsStatsCards = ({ tests }) => {
  // Calculate statistics
  const totalTests = tests.length;
  const publishedTests = tests.filter(t => t.status === 'Published').length;
  const draftTests = tests.filter(t => t.status === 'Draft').length;
  const totalUsers = tests.reduce((acc, test) => acc + test.assignedUsers, 0);

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
      label: 'Published',
      value: publishedTests,
      icon: 'P',
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
      label: 'Total Users',
      value: totalUsers,
      icon: 'U',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <span className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.icon}
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestsStatsCards;
