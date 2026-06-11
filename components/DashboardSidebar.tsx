'use client';

/**
 * Resume eOrbit — Dashboard Sidebar Navigation
 * 
 * Full-featured sidebar with all platform sections.
 * Mobile-responsive with slide-out drawer.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, PenTool, BarChart3, ClipboardList,
  Layers, Briefcase, KanbanSquare, Mail, Mic, Map, Heart,
  DollarSign, TrendingUp, BookOpen, Award, Bookmark,
  CreditCard, Settings, HelpCircle, LogOut, ChevronLeft,
  ChevronRight, Sparkles, Menu, X, User, Crown
} from 'lucide-react';

// ============================================================
// NAVIGATION ITEMS
// ============================================================

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  isPro?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/app/resumes', label: 'My Resumes', icon: FileText },
    ],
  },
  {
    title: 'Create',
    items: [
      { href: '/app/builder', label: 'Resume Builder', icon: PenTool },
      { href: '/app/ats-scanner', label: 'ATS Scanner', icon: BarChart3 },
      { href: '/app/ats-reports', label: 'ATS Reports', icon: ClipboardList },
      { href: '/app/templates', label: 'Templates', icon: Layers },
    ],
  },
  {
    title: 'Job Search',
    items: [
      { href: '/app/jobs', label: 'Job Matches', icon: Briefcase, isPro: true },
      { href: '/app/tracker', label: 'Application Tracker', icon: KanbanSquare },
      { href: '/app/cover-letters', label: 'Cover Letter Generator', icon: Mail, isPro: true },
    ],
  },
  {
    title: 'Career Growth',
    items: [
      { href: '/app/interview-coach', label: 'Interview Coach', icon: Mic, isPro: true },
      { href: '/app/career-roadmap', label: 'Career Roadmap', icon: Map, isPro: true },
      { href: '/app/career-health', label: 'Career Health', icon: Heart },
      { href: '/app/salary-insights', label: 'Salary Insights', icon: DollarSign, isPro: true },
      { href: '/app/skill-gap', label: 'Skill Gap Analysis', icon: TrendingUp },
    ],
  },
  {
    title: 'Learning',
    items: [
      { href: '/app/learning', label: 'Learning Hub', icon: BookOpen },
      { href: '/app/certificates', label: 'Certificates', icon: Award },
      { href: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/app/subscription', label: 'Subscription', icon: CreditCard },
      { href: '/app/settings', label: 'Profile Settings', icon: Settings },
      { href: '/app/support', label: 'Support', icon: HelpCircle },
    ],
  },
];

// ============================================================
// SIDEBAR COMPONENT
// ============================================================

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo & Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200/60 dark:border-slate-800/60">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">eOrbit</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                    isActive(item.href)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`h-4 w-4 flex-shrink-0 ${
                    isActive(item.href) ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.isPro && (
                        <span className="text-[8px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Crown className="h-2 w-2" /> PRO
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-3">
        {!collapsed && session?.user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {session.user.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 z-30 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md"
      >
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 z-50 overflow-hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default DashboardSidebar;
