'use client';

import React, { Suspense } from 'react';
import AuthForm from '../../components/AuthForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthForm initialSignUp={true} />
    </Suspense>
  );
}
