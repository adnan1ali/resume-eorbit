'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, LayoutDashboard, FileText, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu-standalone]')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" data-user-menu-standalone>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
      >
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
          {session.user?.name || session.user?.email?.split('@')[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {session.user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {session.user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                My Dashboard
              </Link>
              <Link
                href="/cv-builder"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                My Resumes
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
