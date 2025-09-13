'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsTabs from '@/components/settings/SettingsTabs';
import ProfileTab from '@/components/settings/ProfileTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveProfile = (profileData) => {
    console.log('Profile saved:', profileData);
  };

  const handleSavePreferences = (preferencesData) => {
    console.log('Preferences saved:', preferencesData);
  };

  const handleSaveNotifications = (notificationsData) => {
    console.log('Notifications saved:', notificationsData);
  };

  const handleSaveSecurity = (securityData) => {
    console.log('Security settings saved:', securityData);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab onSave={handleSaveProfile} />;
      case 'preferences':
        return <PreferencesTab onSave={handleSavePreferences} />;
      case 'notifications':
        return <NotificationsTab onSave={handleSaveNotifications} />;
      case 'security':
        return <SecurityTab onSave={handleSaveSecurity} />;
      default:
        return <ProfileTab onSave={handleSaveProfile} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Container */}
        <div className="bg-white shadow rounded-lg">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 