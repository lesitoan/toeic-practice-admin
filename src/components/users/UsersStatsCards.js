import React from 'react';

const UsersStatsCards = ({ users }) => {
  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
  const numericScores = users
    .map(u => Number(String(u.averageScore).replace('%','')))
    .filter(v => !isNaN(v));
  const averageScore = numericScores.length
    ? Math.round(numericScores.reduce((a,b) => a + b, 0) / numericScores.length)
    : 0;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: 'T',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      label: 'Active Users',
      value: activeUsers,
      icon: 'A',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Inactive Users',
      value: inactiveUsers,
      icon: 'I',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Avg Score',
      value: `${averageScore}%`,
      icon: 'S',
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

export default UsersStatsCards;
