'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { USER_COLUMNS } from '@/constants/users';

const UserResultsActions = ({ user, onViewResult }) => {
  return (
    <button
      onClick={() => onViewResult(user)}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
    >
      View Result
    </button>
  );
};

const UserResultsTable = ({ users, onViewResult, loading, pagination, onPageChange, onLimitChange }) => {
  return (
    <DataTable
      data={users}
      columns={USER_COLUMNS}
      onViewResult={onViewResult}
      searchable={true}
      sortable={true}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      ActionsComponent={({ item }) => <UserResultsActions user={item} onViewResult={onViewResult} />}
    />
  );
};

export default UserResultsTable;

