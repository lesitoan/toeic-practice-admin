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
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      label: 'Active Users',
      value: activeUsers,
      gradient: 'from-teal-500 to-green-500'
    },
    {
      label: 'Inactive Users',
      value: inactiveUsers,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      label: 'Avg Score',
      value: `${averageScore}%`,
      gradient: 'from-violet-500 to-purple-500'
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

export default UsersStatsCards;
