'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { RefreshCw } from 'lucide-react';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    if (user?.role === 'administrator') {
      router.replace('/admin/dashboard');
    } else if (user?.role === 'mahasiswa') {
      router.replace('/mahasiswa/dashboard');
    } else {
      router.replace('/admin/dashboard');
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen w-full bg-[#F4F6FB] flex flex-col items-center justify-center gap-3">
      <RefreshCw className="w-8 h-8 text-[#0D3B82] animate-spin" />
      <p className="text-xs text-slate-500 font-medium">Mengarahkan ke Dashboard...</p>
    </div>
  );
}