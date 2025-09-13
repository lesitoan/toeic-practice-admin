import { 
  UserIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Settings tabs configuration
export const SETTINGS_TABS = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

// Time zone options
export const TIMEZONE_OPTIONS = [
  { value: 'UTC-8', label: 'UTC-8 (Pacific Time)' },
  { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
  { value: 'UTC+0', label: 'UTC+0 (GMT)' },
  { value: 'UTC+1', label: 'UTC+1 (Central European Time)' },
];

// Default profile data
export const DEFAULT_PROFILE = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@toeic.com',
  bio: 'TOEIC Practice Admin'
};

// Default notification settings
export const DEFAULT_NOTIFICATIONS = {
  email: true,
  push: false,
  sms: false,
};

// Notification types
export const NOTIFICATION_TYPES = [
  {
    key: 'email',
    title: 'Email Notifications',
    description: 'Receive notifications via email'
  },
  {
    key: 'push',
    title: 'Push Notifications',
    description: 'Receive push notifications in browser'
  },
  {
    key: 'sms',
    title: 'SMS Notifications',
    description: 'Receive notifications via SMS'
  }
];
