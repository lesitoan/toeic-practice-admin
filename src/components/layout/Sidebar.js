'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import authService from '@/services/auth.service';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Tests', href: '/tests', icon: DocumentTextIcon },
  { name: 'Vocabulary', href: '/vocabulary', icon: BookOpenIcon },
  { name: 'Results', href: '/results', icon: ChartBarIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try to get from localStorage
        let currentUser = authService.getCurrentUser();
        
        // If not in localStorage, fetch from API
        if (!currentUser) {
          currentUser = await authService.getCurrentUserFromAPI();
          if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
          }
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800">
          <div className="flex h-16 items-center justify-between px-6 border-b border-blue-500/30">
            <div className="flex items-center">
              <Image
                src="/logo/default-logo.png"
                alt="TOEIC Practice Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="ml-2 text-xl font-bold text-white">TOEIC Practice</span>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
                      className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg border-r-2 border-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 px-6 pb-4">
          <div className="flex h-16 items-center border-b border-blue-500/30">
            <Image
              src="/logo/default-logo.png"
              alt="TOEIC Practice Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="ml-2 text-xl font-bold text-white">TOEIC Practice</span>
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
                          className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-white/20 text-white shadow-lg border-r-2 border-white'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <item.icon className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                          }`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                  <div className="flex items-center">
                    {(() => {
                      const hasAvatar = user?.avatar && user.avatar.trim() !== '' && 
                        new RegExp('^(https?://.*\\.(?:png|jpg|jpeg|gif|webp|svg|bmp))(?:\\?.*)?$').test(user.avatar);
                      const avatar = hasAvatar ? user.avatar : '/image/defaultAvt.jpg';
                      
                      return (
                        <img
                          className="h-10 w-10 rounded-full bg-white/20 object-cover border-2 border-white/30"
                          src={avatar}
                          alt={user?.name || 'User'}
                          onError={(e) => {
                            e.target.src = '/image/defaultAvt.jpg';
                          }}
                        />
                      );
                    })()}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {loading ? 'Loading...' : (user?.name || 'User')}
                      </p>
                      <p className="text-xs text-white/70">
                        {loading ? '' : (user?.email || '')}
                      </p>
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