// app/dashboard/page.tsx - Role-based redirect router
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role === 'Admin') {
        router.push('/dashboard/admin');     // ← Admin goes to existing admin dashboard
      } else if (user?.role === 'Host') {
        router.push('/dashboard/host');      // ← Host goes to host dashboard
      } else {
        router.push('/dashboard/user');      // ← User goes to user dashboard
      }
    }
  }, [isAuthenticated, loading, user, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}