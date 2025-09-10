import React from 'react';
import NewUsersChart from '@/components/charts/NewUsersChart';
import UserActivityChart from '@/components/charts/UserActivityChart';
import UserGrowthChart from '@/components/charts/UserGrowthChart';

const UsersChartsSection = () => {
  return (
    <div className="space-y-6">
      {/* New Users Chart */}
      <NewUsersChart />
      
      {/* User Growth Chart */}
      <UserGrowthChart />
      
      {/* User Activity Chart */}
      <UserActivityChart />
    </div>
  );
};

export default UsersChartsSection;
