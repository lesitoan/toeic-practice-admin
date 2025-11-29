'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { USER_COLUMNS } from '@/constants/users';

const UserResultsActions = ({ user, onViewResult }) => {
  return (
    <button
      onClick={() => onViewResult(user)}
      className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
      style={{ 
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.3)';
        e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.2)';
        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
      }}
    >
      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
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

