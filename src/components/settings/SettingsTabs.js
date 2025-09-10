import React from 'react';
import { SETTINGS_TABS } from '@/constants/settings';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsTabs;
