'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserResultsTable from '@/components/results/UserResultsTable';
import TestSessionModal from '@/components/results/TestSessionModal';
import usersService from '@/services/users.service';
import { toast } from 'react-toastify';

export default function Results() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testSessions, setTestSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // Fetch users from API
  const fetchUsers = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await usersService.getUsersPaginated(page, limit);

      // API format: { total, items, page, limit }
      if (response && Array.isArray(response.items)) {
        const mapped = response.items.map((u) => {
          return {
            id: u.id,
            name: u.name || '-',
            email: u.email || '-',
            avatar: u.avatar || null,
            gender: u.gender,
            age: u.age,
            role_id: u.role_id,
            is_active: u.is_active,
            deleted_by: u.deleted_by,
            deleted_at: u.deleted_at,
            status: u.deleted_at ? 'Inactive' : 'Active',
            lastLogin: '-',
            testsTaken: '-',
            averageScore: '-',
            joinDate: '-',
          };
        });
        setUsers(mapped);
        setPagination({
          page: response.page ?? page,
          limit: response.limit ?? limit,
          total: response.total ?? mapped.length,
        });
      } else if (Array.isArray(response)) {
        setUsers(response);
        setPagination(prev => ({ ...prev, page, limit, total: response.length }));
      } else if (response?.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          page,
          limit,
          total: response.pagination?.totalItems || response.data.length,
        }));
      } else {
        console.warn('Unexpected API response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle view result button click
  const handleViewResult = async (user) => {
    try {
      setSelectedUser(user);
      setIsModalOpen(true);
      setLoadingSessions(true);
      setTestSessions([]);

      // Fetch test sessions for the user
      const response = await usersService.getUserTestSessions(user.id, 20);
      
      // Handle response format: { items: [...], limit, has_more, next_cursor, ... }
      if (response?.items && Array.isArray(response.items)) {
        setTestSessions(response.items);
      } else if (Array.isArray(response)) {
        setTestSessions(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setTestSessions(response.data);
      } else {
        setTestSessions([]);
        toast.info('No test sessions found for this user.');
      }
    } catch (error) {
      console.error('Error fetching test sessions:', error);
      toast.error('Failed to load test sessions. Please try again.');
      setTestSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pagination.limit);
  };

  const handleLimitChange = (newLimit) => {
    fetchUsers(1, newLimit);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and analyze student performance across all TOEIC practice tests
            </p>
          </div>
        </div>

        {/* Users Table with View Result Button */}
        <UserResultsTable
          users={users}
          onViewResult={handleViewResult}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />

        {/* Test Session Modal */}
        <TestSessionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
            setTestSessions([]);
          }}
          testSessions={testSessions}
          user={selectedUser}
          loading={loadingSessions}
        />
      </div>
    </DashboardLayout>
  );
}