'use client';
import AuthWrapper from '../LoginScreen/components/AuthWrapper';
import SignUpForm from './componants/SignUpForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <AuthWrapper>
      <SignUpForm />
    </AuthWrapper>
  );
}
