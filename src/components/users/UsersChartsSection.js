import React from 'react';
import NewUsersChart from '@/components/charts/NewUsersChart';
import UserActivityChart from '@/components/charts/UserActivityChart';
import UserGrowthChart from '@/components/charts/UserGrowthChart';

const UsersChartsSection = ({ users = [] }) => {
  return (
    <div className="space-y-6">
      {/* New Users Chart */}
      <NewUsersChart users={users} />
      
      {/* User Growth Chart */}
      <UserGrowthChart users={users} />
      
      {/* User Activity Chart */}
      <UserActivityChart users={users} />
    </div>
  );
};

export default UsersChartsSection;
