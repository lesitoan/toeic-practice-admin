'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  onViewDetail,
  onViewResult,
  onRestore,
  ActionsComponent,
  searchable = true,
  sortable = true,
  loading = false,
  pagination,
  onPageChange,
  onLimitChange
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (!sortable || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  };

  return (
    <div className="card-block">
      {/* Search and Actions */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-offset-2 w-full sm:w-64"
                style={{ 
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-bg-card)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(91, 86, 227, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-secondary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredData.length} of {data.length} results
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: 'var(--color-bg-light)' }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    sortable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{ 
                    color: 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (sortable) e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onViewResult || ActionsComponent) && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ 
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)'
          }}>
            {paginatedData.map((item, index) => (
              <tr key={index} style={{ 
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-light)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-card)'}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onViewResult || ActionsComponent) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {ActionsComponent ? (
                        <>
                          <ActionsComponent 
                            item={item}
                            user={item}
                            onViewDetail={onViewDetail}
                            onViewResult={onViewResult}
                            onRestore={onRestore}
                            onEdit={onEdit}
                          />
                          {onDelete && (
                              <button
                                onClick={() => onDelete(item)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
                                style={{ 
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: 'var(--color-danger)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                                  e.currentTarget.style.color = '#FFFFFF';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                  e.currentTarget.style.color = 'var(--color-danger)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(239, 68, 68, 0.1)';
                                }}
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                          )}
                        </>
                      ) : (
                        <>
                          {onViewResult && (
                            <button
                              onClick={() => onViewResult(item)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
                              style={{ 
                                backgroundColor: 'rgba(91, 86, 227, 0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(91, 86, 227, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.25)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.1)';
                                e.currentTarget.style.color = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.1)';
                              }}
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
                              style={{ 
                                backgroundColor: 'rgba(91, 86, 227, 0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(91, 86, 227, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.25)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.1)';
                                e.currentTarget.style.color = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.1)';
                              }}
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
                              style={{ 
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--color-danger)',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.color = 'var(--color-danger)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
                }}
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 