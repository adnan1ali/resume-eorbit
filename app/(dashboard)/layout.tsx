'use client';

/**
 * Resume eOrbit — Dashboard Layout
 * 
 * Wraps all /app/* pages with the sidebar navigation.
 * Handles authentication guard at the layout level.
 */

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
<div className="min-h-screen bg-slate-50 dark:bg-slate-950">      <DashboardSidebar />
      <main className="lg:pl-[260px] min-h-screen transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
