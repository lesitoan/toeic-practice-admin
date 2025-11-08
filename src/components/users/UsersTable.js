import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { USER_COLUMNS } from '@/constants/users';
import UserActions from './UserActions';

const UsersTable = ({ users, onEdit, onDelete, onViewDetail, onRestore, loading, pagination, onPageChange, onLimitChange }) => {
  return (
    <DataTable
      data={users}
      columns={USER_COLUMNS}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewDetail={onViewDetail}
      onRestore={onRestore}
      searchable={true}
      sortable={true}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      ActionsComponent={UserActions}
    />
  );
};

export default UsersTable;
