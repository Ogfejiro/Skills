'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, token } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyDashboardAccess = async () => {
      // Wait for auth to finish loading
      if (loading) {
        return;
      }

      // Check if user has valid token
      if (!isAuthenticated || !token) {
        router.push('/');
        return;
      }

      // Token exists and user is authenticated
      setIsVerifying(false);
    };

    verifyDashboardAccess();
  }, [isAuthenticated, loading, token, router]);

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
}
