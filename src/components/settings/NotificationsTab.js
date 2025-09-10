import React, { useState } from 'react';
import { DEFAULT_NOTIFICATIONS, NOTIFICATION_TYPES } from '@/constants/settings';

const NotificationsTab = ({ onSave }) => {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const handleNotificationChange = (key, checked) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(notifications);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to be notified about important events.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {NOTIFICATION_TYPES.map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[notification.key]}
                onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsTab;
