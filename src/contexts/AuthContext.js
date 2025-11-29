'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        // Clean up any invalid data first
        authService.cleanupInvalidData();
        
        const currentUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        // Check if user has Student role (role_id = 3) - block from admin panel
        if (currentUser && (currentUser.role_id === 3 || currentUser.roleID === 3)) {
          // Clear auth data and logout Student user
          authService.clearAuthData();
          setUser(null);
          console.warn('Student user detected, logged out from admin panel');
          return;
        }
        
        if (isAuthenticated && currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // If user data wasn't fetched during login, try to get it from localStorage
      let user = response.user;
      if (!user) {
        user = authService.getCurrentUser();
      }
      
      // Double check: Block Student role (in case it passed through)
      if (user && (user.role_id === 3 || user.roleID === 3)) {
        await authService.logout();
        throw new Error('Bạn không có quyền truy cập vào trang quản trị. Chỉ Admin và Staff mới có thể đăng nhập.');
      }
      
      setUser(user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setIsLoading(true);
      await authService.googleLogin();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.refreshUserData();
      
      // Check if user has Student role - block from admin panel
      if (user && (user.role_id === 3 || user.roleID === 3)) {
        await authService.logout();
        setUser(null);
        router.push('/login');
        throw new Error('Bạn không có quyền truy cập vào trang quản trị.');
      }
      
      setUser(user);
      return user;
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    googleLogin,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
