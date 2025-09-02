'use client';

import { useState } from 'react';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Navbar({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <div className="relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          </div>
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-x-4 text-sm font-medium leading-6 text-gray-900"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span className="hidden lg:flex lg:items-center">
              Admin User
              <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 