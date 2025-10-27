import React from 'react';
import AuthWrapper from './components/AuthWrapper';
import LoginForm from './components/LoginForm';

export default function LoginScreen() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
