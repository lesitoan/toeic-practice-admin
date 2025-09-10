import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { VOCABULARY_COLUMNS } from '@/constants/vocabulary';

const VocabularyTable = ({ 
  vocabularies, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  // Create columns with onView callback
  const columns = VOCABULARY_COLUMNS.map(column => ({
    ...column,
    render: column.key === 'word' 
      ? (value, item) => column.render(value, item, onView)
      : column.render
  }));

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={vocabularies}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      searchable={false} // We have our own search
    />
  );
};

export default VocabularyTable;
