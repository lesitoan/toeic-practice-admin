import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { USER_COLUMNS } from '@/constants/users';

const UsersTable = ({ users, onEdit, onDelete }) => {
  return (
    <DataTable
      data={users}
      columns={USER_COLUMNS}
      onEdit={onEdit}
      onDelete={onDelete}
      searchable={true}
      sortable={true}
    />
  );
};

export default UsersTable;
