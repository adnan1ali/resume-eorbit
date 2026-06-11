'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Search, Bell, FileText, ArrowUpRight, User,
  ChevronDown, X, Menu, Sparkles, Crown,
  PenTool, BarChart3, FileCheck, Upload, Import,
  Briefcase, GraduationCap, Code, Database, Shield,
  BookOpen, TrendingUp, Globe, Building2, Users,
  Mic, DollarSign, MapPin, Brain, Lightbulb,
  CheckCircle, Star, Layers, Layout
} from 'lucide-react';

// ============================================================
// MEGA MENU DATA
// ============================================================

const MEGA_MENUS = {
  resume: {
    label: 'Resume',
    columns: [
      {
        title: 'Resume Tools',
        items: [
          { label: 'AI Resume Builder', href: '/resume-builder', icon: PenTool, description: 'Build ATS-optimized resumes with AI' },
          { label: 'Resume Checker', href: '/resume-checker', icon: CheckCircle, description: 'Get instant feedback on your resume' },
          { label: 'ATS Scanner', href: '/ats-scanner', icon: BarChart3, description: 'Check ATS compatibility score' },
          { label: 'Resume Review', href: '/resume-review', icon: FileCheck, description: 'Expert AI review of your resume' },
          { label: 'Resume Import', href: '/resume-import', icon: Upload, description: 'Import and enhance existing resumes' },
        ],
      },
      {
        title: 'Resume Examples',
        items: [
          { label: 'Cloud Engineer', href: '/examples/cloud-engineer' },
          { label: 'IT Support Engineer', href: '/examples/it-support' },
          { label: 'Data Scientist', href: '/examples/data-scientist' },
          { label: 'Project Manager', href: '/examples/project-manager' },
          { label: 'Business Analyst', href: '/examples/business-analyst' },
          { label: 'DevOps Engineer', href: '/examples/devops-engineer' },
        ],
      },
      {
        title: 'Resume Templates',
        items: [
          { label: 'ATS Friendly', href: '/templates?category=ats' },
          { label: 'Modern', href: '/templates?category=modern' },
          { label: 'Executive', href: '/templates?category=executive' },
          { label: 'Minimal', href: '/templates?category=minimal' },
          { label: 'Professional', href: '/templates?category=professional' },
        ],
      },
      {
        title: 'Resume Guides',
        items: [
          { label: 'How to Write a Resume', href: '/guides/how-to-write-resume' },
          { label: 'Resume Summary Guide', href: '/guides/resume-summary' },
          { label: 'Resume Format Guide', href: '/guides/resume-format' },
          { label: 'ATS Resume Guide', href: '/guides/ats-resume' },
        ],
      },
    ],
  },
  coverLetter: {
    label: 'Cover Letter',
    columns: [
      {
        title: 'Tools',
        items: [
          { label: 'Cover Letter Builder', href: '/cover-letter-builder', icon: PenTool, description: 'Create professional cover letters' },
          { label: 'AI Cover Letter Generator', href: '/cover-letter-generator', icon: Sparkles, description: 'Generate tailored cover letters with AI' },
          { label: 'Cover Letter Review', href: '/cover-letter-review', icon: FileCheck, description: 'Get feedback on your cover letter' },
        ],
      },
      {
        title: 'Examples',
        items: [
          { label: 'QA Engineer', href: '/cover-letter-examples/qa-engineer' },
          { label: 'Data Analyst', href: '/cover-letter-examples/data-analyst' },
          { label: 'Architect', href: '/cover-letter-examples/architect' },
          { label: 'Cloud Engineer', href: '/cover-letter-examples/cloud-engineer' },
        ],
      },
      {
        title: 'Templates',
        items: [
          { label: 'Modern', href: '/cover-letter-templates?style=modern' },
          { label: 'Professional', href: '/cover-letter-templates?style=professional' },
          { label: 'Executive', href: '/cover-letter-templates?style=executive' },
        ],
      },
      {
        title: 'Guides',
        items: [
          { label: 'How to Write a Cover Letter', href: '/guides/cover-letter' },
          { label: 'Cover Letter Formats', href: '/guides/cover-letter-formats' },
          { label: 'Cover Letter Endings', href: '/guides/cover-letter-endings' },
        ],
      },
    ],
  },
  resources: {
    label: 'Resources',
    columns: [
      {
        title: 'Career Resources',
        items: [
          { label: 'Resume Resources', href: '/resources/resume', icon: FileText, description: 'Guides, tips, and best practices' },
          { label: 'Interview Resources', href: '/resources/interview', icon: Mic, description: 'Preparation guides and mock interviews' },
          { label: 'Career Growth', href: '/resources/career-growth', icon: TrendingUp, description: 'Advance your career trajectory' },
        ],
      },
      {
        title: 'Research & Insights',
        items: [
          { label: 'Career Research', href: '/research', icon: BookOpen, description: 'Data-driven career insights' },
          { label: 'Salary Insights', href: '/salary-insights', icon: DollarSign, description: 'Compensation benchmarks' },
          { label: 'Job Market Trends', href: '/job-market', icon: TrendingUp, description: 'Hiring trends and forecasts' },
        ],
      },
      {
        title: 'Regional Guides',
        items: [
          { label: 'Saudi Arabia Career Guides', href: '/guides/saudi-arabia', icon: MapPin },
          { label: 'GCC Career Resources', href: '/guides/gcc', icon: Globe },
          { label: 'AI Career Resources', href: '/guides/ai-careers', icon: Brain },
        ],
      },
    ],
  },
  organizations: {
    label: 'For Organizations',
    columns: [
      {
        title: 'Solutions',
        items: [
          { label: 'Recruitment Agencies', href: '/organizations/recruitment', icon: Users, description: 'Streamline candidate resume processing' },
          { label: 'Universities', href: '/organizations/universities', icon: GraduationCap, description: 'Career services for students and alumni' },
          { label: 'Career Coaches', href: '/organizations/coaches', icon: Lightbulb, description: 'Tools for professional career coaching' },
          { label: 'Corporate Workforce Development', href: '/organizations/corporate', icon: Building2, description: 'Enterprise career development programs' },
        ],
      },
    ],
  },
};

// ============================================================
// HEADER COMPONENT
// ============================================================

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Hide header on dashboard/workspace routes (sidebar takes over)
  const isWorkspace = pathname?.startsWith('/workspace') || pathname?.startsWith('/app');
  if (isWorkspace) return null;

  const handleMenuEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-white border-b border-slate-200/80"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 hidden sm:block">
                Resume eOrbit
              </span>
            </Link>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {Object.entries(MEGA_MENUS).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(key)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeMenu === key
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {menu.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMenu === key ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ))}
              <Link
                href="/pricing"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>

              {session ? (
                <>
                  {/* Notifications */}
                  <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full" />
                  </button>

                  {/* My Documents */}
                  <Link
                    href="/workspace"
                    className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Layout className="h-3.5 w-3.5" />
                    <span>My Documents</span>
                  </Link>

                  {/* Upgrade */}
                  <Link
                    href="/pricing"
                    className="hidden md:flex items-center gap-1.5 h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    <span>Upgrade</span>
                  </Link>

                  {/* Profile */}
                  <button
                    onClick={() => signOut()}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ============ MEGA MENU DROPDOWN ============ */}
        {activeMenu && MEGA_MENUS[activeMenu as keyof typeof MEGA_MENUS] && (
          <div
            className="absolute left-0 right-0 bg-white border-b border-slate-200 shadow-lg shadow-slate-200/50"
            onMouseEnter={() => handleMenuEnter(activeMenu)}
            onMouseLeave={handleMenuLeave}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={`grid gap-8 ${
                MEGA_MENUS[activeMenu as keyof typeof MEGA_MENUS].columns.length === 1
                  ? 'grid-cols-1 max-w-lg'
                  : MEGA_MENUS[activeMenu as keyof typeof MEGA_MENUS].columns.length === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-4'
              }`}>
                {MEGA_MENUS[activeMenu as keyof typeof MEGA_MENUS].columns.map((column, colIdx) => (
                  <div key={colIdx}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      {column.title}
                    </h3>
                    <ul className="space-y-1">
                      {column.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setActiveMenu(null)}
                          >
                           {'icon' in item && item.icon ? (
  <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center">
    <item.icon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600" />
  </div>
) : null}
                            <div>
                              <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {item.label}
                              </p>
                              {('description' in item && item.description) && (
                                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============ MOBILE MENU ============ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              {Object.entries(MEGA_MENUS).map(([key, menu]) => (
                <div key={key} className="border-b border-slate-100 pb-4">
                  <p className="text-sm font-bold text-slate-900 mb-2">{menu.label}</p>
                  <div className="space-y-1">
                    {menu.columns.map((col) =>
                      col.items.slice(0, 4).map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block text-sm text-slate-600 py-1.5 hover:text-indigo-600"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ))}
              <Link
                href="/pricing"
                className="block text-sm font-bold text-slate-900 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ============ SEARCH OVERLAY ============ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates, guides, examples..."
                className="flex-1 text-base text-slate-900 placeholder:text-slate-400 outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">Quick Links</p>
              <div className="space-y-1">
                {[
                  { label: 'AI Resume Builder', href: '/resume-builder' },
                  { label: 'ATS Scanner', href: '/ats-scanner' },
                  { label: 'Cover Letter Generator', href: '/cover-letter-generator' },
                  { label: 'Resume Templates', href: '/templates' },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center gap-2 p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                    onClick={() => setSearchOpen(false)}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
