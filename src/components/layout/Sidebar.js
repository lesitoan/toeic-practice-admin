'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  XMarkIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Tests', href: '/tests', icon: DocumentTextIcon },
  { name: 'Vocabulary', href: '/vocabulary', icon: BookOpenIcon },
  { name: 'Results', href: '/results', icon: ChartBarIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TOEIC Practice</span>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8 px-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TOEIC Practice</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                          }`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">A</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Admin User</p>
                      <p className="text-xs text-gray-500">admin@toeic.com</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
} 