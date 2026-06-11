'use client';

/**
 * Resume eOrbit — Redesigned Dashboard
 * 
 * Shows:
 * - Welcome banner with career health score
 * - Quick actions
 * - Resume cards with ATS scores
 * - Recent ATS scans
 * - Application tracker summary
 * - Skill gap highlights
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, BarChart3, PenTool, Plus, ArrowRight, TrendingUp,
  Clock, Target, Briefcase, Sparkles, Download, Eye, Trash2,
  MoreHorizontal, CheckCircle, AlertCircle, Zap, Award,
  Calendar, Activity, Layers
} from 'lucide-react';
// ============================================================
// TYPES
// ============================================================

interface ResumeCard {
  id: string;
  fullName: string;
  jobTitle: string;
  atsScore: number | null;
  updatedAt: string;
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

export default function DashboardPage() {
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await fetch('/api/resume/list?limit=6&sortBy=updatedAt&sortOrder=desc');
        const data = await res.json();
setResumes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-xl sm:text-2xl font-black">Welcome back, {firstName}!</h1>
          <p className="text-sm text-indigo-100 mt-2 max-w-md">
            Your career dashboard is ready. Build resumes, scan for ATS compatibility, and track your applications.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/app/builder"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> New Resume
            </Link>
            <Link
              href="/app/ats-scanner"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5" /> ATS Scan
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Resumes', value: resumes.length.toString(), icon: FileText, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'ATS Scans', value: '—', icon: BarChart3, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Applications', value: '—', icon: Briefcase, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Interviews', value: '—', icon: Target, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-4"
          >
            <div className={`h-9 w-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* My Resumes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">My Resumes</h2>
          <Link href="/app/resumes" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-8 text-center"
          >
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No resumes yet</h3>
            <p className="text-xs text-slate-500 mb-4">Create your first ATS-optimized resume in minutes.</p>
            <Link
              href="/app/builder"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Create Resume
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, idx) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
  <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
    <FileText className="h-4 w-4 text-indigo-500" />
  </div>

  <span
    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
      resume.atsScore
        ? resume.atsScore >= 80
          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
          : resume.atsScore >= 60
          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'
          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
}`}
>
  ATS: {resume.atsScore ? `${resume.atsScore}%` : 'Not Scanned'}
</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{resume.fullName || 'Untitled'}</h3>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{resume.jobTitle || 'No job title'}</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                </div>
                
                {/* Hover Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/app/builder?resume=${resume.id}`}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <PenTool className="h-3 w-3" /> Edit
                  </Link>
                  <Link
                    href={`/app/ats-scanner?resume=${resume.id}`}
                    className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <BarChart3 className="h-3 w-3" /> Scan
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* Add New Card */}
            <Link
              href="/app/builder"
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-colors">
                <Plus className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600 mt-3 transition-colors">New Resume</p>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/app/ats-scanner', label: 'Scan Resume', description: 'Check ATS compatibility', icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
            { href: '/app/templates', label: 'Browse Templates', description: 'Professional designs', icon: Layers, color: 'from-indigo-500 to-purple-600' },
            { href: '/app/jobs', label: 'Find Jobs', description: 'AI-matched opportunities', icon: Briefcase, color: 'from-amber-500 to-orange-600' },
            { href: '/app/interview-coach', label: 'Practice Interview', description: 'AI mock interviews', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
          ].map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="group bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-4 hover:shadow-md transition-all"
            >
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-md`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{action.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
