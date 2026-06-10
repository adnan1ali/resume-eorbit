'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumePDF } from '@/components/ResumePDF';
import { CreateResumeModal } from '@/components/CreateResumeModal';
import { Button } from '@/components/ui/button';
import {
  Plus, Search, Sparkles, TrendingUp, Calendar, FileText,
  Edit3, Trash2, ArrowUpRight, BarChart2, Briefcase, Shield,
  Target, Zap, Eye, Download, Clock, CheckCircle, XCircle,
  ChevronRight, Activity, Award, Loader2, LayoutGrid, List,
  Filter, MoreHorizontal, Star, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ============================================================
// TYPES
// ============================================================

interface Resume {
  id: string;
  fullName: string;
  jobTitle: string;
  skills: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// QUICK ACTION CARD COMPONENT
// ============================================================

function QuickActionCard({ icon: Icon, title, description, href, gradient, onClick }: {
  icon: any;
  title: string;
  description: string;
  href?: string;
  gradient: string;
  onClick?: () => void;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick || (() => href && router.push(href))}
      className="text-left p-4 bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 group"
    >
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{title}</h3>
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{description}</p>
    </motion.button>
  );
}

// ============================================================
// RESUME CARD COMPONENT
// ============================================================

function ResumeCard({ resume, onEdit, onDelete, isEditing, editForm, setEditForm, onUpdate, onCancelEdit }: {
  resume: Resume;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editForm: { fullName: string; jobTitle: string; skills: string; summary: string };
  setEditForm: (form: any) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
}) {
  const router = useRouter();

  // Calculate a mock "health score" based on completeness
  const getHealthScore = () => {
    let score = 0;
    if (resume.fullName) score += 25;
    if (resume.jobTitle) score += 25;
    if (resume.skills && resume.skills.length > 10) score += 25;
    if (resume.summary && resume.summary.length > 30) score += 25;
    return score;
  };

  const healthScore = getHealthScore();
  const getHealthColor = () => {
    if (healthScore >= 75) return 'text-emerald-500';
    if (healthScore >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };
  const getHealthBg = () => {
    if (healthScore >= 75) return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-800/40';
    if (healthScore >= 50) return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-800/40';
    return 'bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-800/40';
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        className="bg-white dark:bg-slate-900/60 border border-indigo-200/60 dark:border-indigo-800/40 rounded-2xl overflow-hidden"
      >
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="h-3 w-3" /> Editing Resume
            </span>
          </div>
          <input
            value={editForm.fullName}
            onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
            className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="Full Name"
          />
          <input
            value={editForm.jobTitle}
            onChange={e => setEditForm({ ...editForm, jobTitle: e.target.value })}
            className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="Job Title"
          />
          <textarea
            value={editForm.skills}
            onChange={e => setEditForm({ ...editForm, skills: e.target.value })}
            className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="Skills (comma separated)"
            rows={2}
          />
          <textarea
            value={editForm.summary}
            onChange={e => setEditForm({ ...editForm, summary: e.target.value })}
            className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="Professional Summary"
            rows={3}
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={onUpdate} className="flex-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Save Changes
            </Button>
            <Button onClick={onCancelEdit} variant="outline" className="text-xs font-semibold rounded-xl py-4 px-4">
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 flex flex-col group"
    >
      {/* Card Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {resume.fullName}
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Briefcase className="h-3 w-3" /> {resume.jobTitle}
            </p>
          </div>
          {/* Health Score Badge */}
          <div className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${getHealthBg()} ${getHealthColor()}`}>
            {healthScore}%
          </div>
        </div>

        {/* Skills */}
        {resume.skills && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills</p>
            <div className="flex flex-wrap gap-1">
              {resume.skills.split(',').slice(0, 4).map((skill, i) => (
                <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                  {skill.trim()}
                </span>
              ))}
              {resume.skills.split(',').length > 4 && (
                <span className="text-[10px] font-medium text-slate-400 px-1">+{resume.skills.split(',').length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Summary Preview */}
        {resume.summary && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {resume.summary}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/cv-builder?resume=${resume.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
            title="Open in Builder"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="pl-1.5 ml-1 border-l border-slate-200 dark:border-slate-800">
            <ResumePDF data={{
              fullName: resume.fullName,
              jobTitle: resume.jobTitle,
              skills: resume.skills,
              summary: resume.summary || ''
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ACTIVITY FEED COMPONENT
// ============================================================

function ActivityFeed({ resumes }: { resumes: Resume[] }) {
  const recentActivity = resumes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(r => ({
      id: r.id,
      action: new Date(r.createdAt).getTime() === new Date(r.updatedAt).getTime() ? 'created' : 'updated',
      name: r.fullName,
      title: r.jobTitle,
      time: r.updatedAt,
    }));

  if (recentActivity.length === 0) return null;

  return (
    <div className="space-y-3">
      {recentActivity.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl"
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            item.action === 'created'
              ? 'bg-emerald-50 dark:bg-emerald-500/10'
              : 'bg-blue-50 dark:bg-blue-500/10'
          }`}>
            {item.action === 'created' ? (
              <Plus className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Edit3 className="h-3.5 w-3.5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{item.action === 'created' ? 'Created' : 'Updated'}</span>{' '}
              <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {item.title} · {new Date(item.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', skills: '', summary: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session?.user) {
      fetch('/api/resume/list')
        .then(res => res.json())
        .then(data => {
          setResumes(data);
          setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) return;
    const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
    if (res.ok) setResumes(resumes.filter(r => r.id !== id));
  };

  const handleEdit = (resume: Resume) => {
    setEditingId(resume.id);
    setEditForm({ fullName: resume.fullName, jobTitle: resume.jobTitle, skills: resume.skills, summary: resume.summary || '' });
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/resume/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setResumes(resumes.map(r => r.id === id ? updated : r));
      setEditingId(null);
    }
  };

  const filteredResumes = resumes.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) &&
    (filterJob === '' || r.jobTitle.toLowerCase().includes(filterJob.toLowerCase()))
  );

  const jobTitles = [...new Set(resumes.map(r => r.jobTitle))];
  const weeklyCount = resumes.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const monthlyCount = resumes.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = resumes.filter(r => new Date(r.createdAt).toDateString() === date.toDateString()).length;
    return { name: dateStr, count };
  }).reverse();

  const jobDistribution = jobTitles.map(title => ({
    name: title.length > 15 ? title.substring(0, 15) + '...' : title,
    value: resumes.filter(r => r.jobTitle === title).length,
  }));

  const CHART_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  // Average health score
  const avgHealth = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => {
        let s = 0;
        if (r.fullName) s += 25;
        if (r.jobTitle) s += 25;
        if (r.skills && r.skills.length > 10) s += 25;
        if (r.summary && r.summary.length > 30) s += 25;
        return acc + s;
      }, 0) / resumes.length)
    : 0;

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-5 w-5 text-indigo-500" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading your dashboard</p>
          <p className="text-xs text-slate-400 mt-0.5">Fetching your resumes and analytics...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-300">{session?.user?.name || session?.user?.email}</span>
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-5 py-5 flex items-center gap-2 shadow-md shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" /> Create Resume
        </Button>
      </div>

      {/* ============================================================
          STATS CARDS
          ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Resumes', value: resumes.length, sub: 'All time', icon: FileText, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'This Week', value: weeklyCount, sub: 'Last 7 days', icon: Calendar, gradient: 'from-emerald-500 to-teal-600' },
          { label: 'This Month', value: monthlyCount, sub: 'Last 30 days', icon: TrendingUp, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Avg. Health', value: `${avgHealth}%`, sub: 'Resume completeness', icon: Shield, gradient: 'from-amber-500 to-orange-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-1">{stat.label} · {stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ============================================================
          QUICK ACTIONS
          ============================================================ */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionCard
            icon={Plus}
            title="New Resume"
            description="Start from scratch"
            gradient="from-indigo-500 to-purple-600"
            onClick={() => setModalOpen(true)}
          />
          <QuickActionCard
            icon={Shield}
            title="ATS Scanner"
            description="Check compatibility"
            href="/ats-scanner"
            gradient="from-purple-500 to-pink-600"
          />
          <QuickActionCard
            icon={Sparkles}
            title="Templates"
            description="Browse designs"
            href="/templates"
            gradient="from-amber-500 to-orange-600"
          />
          <QuickActionCard
            icon={Target}
            title="CV Builder"
            description="Build with AI"
            href="/cv-builder"
            gradient="from-emerald-500 to-teal-600"
          />
        </div>
      </div>

      {/* ============================================================
          CHARTS + ACTIVITY
          ============================================================ */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-indigo-500" /> Resume Activity
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Resumes created over the past 7 days</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-200/60 dark:border-indigo-800/40">
              7-Day View
            </span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', fontSize: '11px', color: '#f1f5f9' }}
                  itemStyle={{ color: '#a5b4fc' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Sidebar: Pie + Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Job Distribution */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-purple-500" /> Job Roles
            </h2>
            {jobDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No data yet</p>
            ) : (
              <>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={jobDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
                        {jobDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', fontSize: '11px', color: '#f1f5f9' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
                  {jobDistribution.slice(0, 4).map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span className="text-[10px] font-medium text-slate-500 truncate max-w-[80px]">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-emerald-500" /> Recent Activity
            </h2>
            {resumes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No activity yet</p>
            ) : (
              <ActivityFeed resumes={resumes} />
            )}
          </div>
        </motion.div>
      </div>

      {/* ============================================================
          RESUMES SECTION
          ============================================================ */}
      <div>
        {/* Section Header + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" /> My Resumes
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                {filteredResumes.length}
              </span>
            </h2>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Job filter */}
            {jobTitles.length > 1 && (
              <select
                value={filterJob}
                onChange={e => setFilterJob(e.target.value)}
                className="text-xs font-medium border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">All Roles</option>
                {jobTitles.map(job => <option key={job} value={job}>{job}</option>)}
              </select>
            )}
            {/* View toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800/60 rounded-lg p-0.5 border border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`h-7 w-7 rounded-md flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`h-7 w-7 rounded-md flex items-center justify-center transition-all ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Resume Grid */}
        <AnimatePresence mode="popLayout">
          {filteredResumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="text-center py-16 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex flex-col items-center max-w-lg mx-auto"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {resumes.length === 0 ? 'No resumes yet' : 'No results found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                {resumes.length === 0
                  ? 'Create your first resume to get started with your career journey.'
                  : 'Try a different search term or clear your filters.'}
              </p>
              {resumes.length === 0 ? (
                <Button
                  onClick={() => setModalOpen(true)}
                  className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-4 flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Your First Resume
                </Button>
              ) : (
                <Button
                  onClick={() => { setSearch(''); setFilterJob(''); }}
                  variant="outline"
                  className="text-xs font-semibold rounded-xl px-4 py-4"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => handleEdit(resume)}
                  onDelete={() => handleDelete(resume.id)}
                  isEditing={editingId === resume.id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onUpdate={() => handleUpdate(resume.id)}
                  onCancelEdit={() => setEditingId(null)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Resume Modal */}
      <CreateResumeModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
