'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BarChart3,
  LayoutDashboard,
  Layers,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { href: '/cv-builder', label: 'Build CV', icon: FileText },
  { href: '/ats-scanner', label: 'ATS Scanner', icon: BarChart3 },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: Layers },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname?.startsWith(href + '/'),
    [pathname]
  );

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const ThemeIcon = () => {
  if (!mounted) {
    return <Monitor className="h-4 w-4" />;
  }

  if (theme === 'dark') {
    return <Moon className="h-4 w-4" />;
  }

  if (theme === 'light') {
    return <Sun className="h-4 w-4" />;
  }

  return <Monitor className="h-4 w-4" />;
};

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/40 shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20'
            : 'bg-white/60 dark:bg-[#030712]/60 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group relative z-10 shrink-0">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 transition-all duration-500 group-hover:shadow-indigo-500/40 group-hover:scale-105">
                  <span className="text-white text-sm font-black tracking-wider">E</span>
                </div>
                {/* Animated glow ring on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  resume{' '}
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold">
                    eOrbit
                  </span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-none mt-0.5 hidden sm:block">
                  AI Career Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Pill Style */}
            <nav className="hidden lg:flex items-center" aria-label="Main navigation">
              <div className="flex items-center gap-0.5 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-1 rounded-full backdrop-blur-sm">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                        active
                          ? 'text-indigo-600 dark:text-white bg-white dark:bg-slate-800 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <link.icon className={`h-3.5 w-3.5 ${active ? 'text-indigo-500' : ''}`} />
                      {link.label}
                      {active && (
                        <motion.div
                          layoutId="nav-active-indicator"
                          className="absolute inset-0 rounded-full bg-white dark:bg-slate-800 shadow-sm -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
                aria-label="Toggle theme"
                title={mounted ? `Current: ${theme}` : 'Toggle theme'}
              >
                <ThemeIcon />
              </button>

              {/* User Menu / Auth */}
              {session ? (
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
                  >
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                      {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
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
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            My Dashboard
                          </Link>
                          <Link
                            href="/cv-builder"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            My Resumes
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                          <button
                            onClick={() => signOut()}
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
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
                  >
                    <Sparkles className="h-3 w-3" />
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-16 left-0 right-0 z-50 lg:hidden bg-white dark:bg-[#0a0f1a] border-b border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40"
            >
              <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4">
                {/* Navigation Links */}
                <nav className="space-y-1" aria-label="Mobile navigation">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            active
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <link.icon className={`h-4 w-4 ${active ? 'text-indigo-500' : 'text-slate-400'}`} />
                          {link.label}
                          {active && (
                            <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-md">
                              Active
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Auth Actions */}
                {!session && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
