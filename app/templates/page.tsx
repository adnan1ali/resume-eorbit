'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Sparkles, Heart, Eye, X, ArrowRight, Check,
  Star, TrendingUp, Filter, Grid3x3, LayoutList, Download,
  Briefcase, GraduationCap, Cpu, Award, Palette, Globe,
  ChevronRight, Zap, Shield, FileText
} from 'lucide-react';
import templatesData from '@/data/templates.json';

// ============================================================
// TYPES
// ============================================================

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  style: string;
  color: string;
  description?: string;
  atsFriendly?: boolean;
  popular?: boolean;
}

// ============================================================
// CATEGORY ICONS MAP
// ============================================================

const categoryIcons: Record<string, any> = {
  'All': Grid3x3,
  'Technology': Cpu,
  'Business': Briefcase,
  'Creative': Palette,
  'Healthcare': Award,
  'Education': GraduationCap,
  'Finance': TrendingUp,
  'Engineering': Zap,
  'Marketing': Globe,
  'Default': FileText,
};

// ============================================================
// TEMPLATE PREVIEW CARD COMPONENT
// ============================================================

function TemplateCard({
  template,
  index,
  isFavorite,
  onToggleFavorite,
  onPreview,
  onUse,
}: {
  template: Template;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPreview: () => void;
  onUse: () => void;
}) {
  // Generate a visual preview based on template style/color
  const getPreviewGradient = () => {
    const color = template.color || '#6366f1';
    return `linear-gradient(135deg, ${color}15, ${color}05)`;
  };

  const getAccentColor = () => {
    return template.color || '#6366f1';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300">
        {/* Template Preview Area */}
        <div
          className="relative h-56 sm:h-64 overflow-hidden cursor-pointer"
          onClick={onPreview}
          style={{ background: getPreviewGradient() }}
        >
          {/* Mini resume preview */}
          <div className="absolute inset-4 bg-white rounded-lg shadow-sm border border-slate-200/60 p-4 transform group-hover:scale-[1.02] transition-transform duration-300">
            {/* Header */}
            <div className="text-center border-b pb-2 mb-2" style={{ borderColor: getAccentColor() + '40' }}>
              <div className="h-2.5 w-20 bg-slate-800 rounded mx-auto mb-1.5" />
              <div className="h-2 w-14 rounded mx-auto" style={{ backgroundColor: getAccentColor() }} />
              <div className="h-1.5 w-28 bg-slate-200 rounded mx-auto mt-1.5" />
            </div>
            {/* Body lines */}
            <div className="space-y-3 mt-3">
              <div>
                <div className="h-1.5 w-12 rounded mb-1.5" style={{ backgroundColor: getAccentColor() + '80' }} />
                <div className="space-y-1">
                  <div className="h-1 w-full bg-slate-100 rounded" />
                  <div className="h-1 w-5/6 bg-slate-100 rounded" />
                  <div className="h-1 w-4/5 bg-slate-100 rounded" />
                </div>
              </div>
              <div>
                <div className="h-1.5 w-16 rounded mb-1.5" style={{ backgroundColor: getAccentColor() + '80' }} />
                <div className="space-y-1">
                  <div className="h-1 w-full bg-slate-100 rounded" />
                  <div className="h-1 w-3/4 bg-slate-100 rounded" />
                </div>
              </div>
              <div>
                <div className="h-1.5 w-10 rounded mb-1.5" style={{ backgroundColor: getAccentColor() + '80' }} />
                <div className="flex flex-wrap gap-1">
                  <div className="h-3 w-8 bg-slate-100 rounded" />
                  <div className="h-3 w-10 bg-slate-100 rounded" />
                  <div className="h-3 w-7 bg-slate-100 rounded" />
                  <div className="h-3 w-9 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <button className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-lg">
                <Eye className="h-4 w-4" />
              </button>
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {template.atsFriendly && (
              <Badge className="bg-emerald-500/90 text-white border-0 text-[9px] font-bold px-2 py-0.5 backdrop-blur-sm shadow-sm">
                <Shield className="h-2.5 w-2.5 mr-1" /> ATS
              </Badge>
            )}
            {template.popular && (
              <Badge className="bg-amber-500/90 text-white border-0 text-[9px] font-bold px-2 py-0.5 backdrop-blur-sm shadow-sm">
                <Star className="h-2.5 w-2.5 mr-1" /> Popular
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`absolute top-3 right-3 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Card Footer */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {template.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {template.category} · {template.style}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              onClick={onUse}
              className="flex-1 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl py-4 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Use Template
            </Button>
            <Button
              onClick={onPreview}
              variant="outline"
              className="text-xs font-semibold border-slate-200 dark:border-slate-700 rounded-xl py-4 px-3"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// FULL-SCREEN PREVIEW MODAL
// ============================================================

function PreviewModal({
  template,
  onClose,
  onUse,
  isFavorite,
  onToggleFavorite,
}: {
  template: Template;
  onClose: () => void;
  onUse: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const getAccentColor = () => template.color || '#6366f1';

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: getAccentColor() + '15' }}>
              <FileText className="h-4 w-4" style={{ color: getAccentColor() }} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{template.name}</h2>
              <p className="text-[11px] text-slate-500">{template.category} · {template.style}</p>
            </div>
            {template.atsFriendly && (
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/40 text-[9px] font-bold border px-2 py-0.5">
                ATS Optimized
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                isFavorite ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Preview */}
            <div className="lg:col-span-3">
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/60">
                {/* Large resume preview */}
                <div className="bg-white rounded-lg shadow-md border border-slate-200/60 p-8 mx-auto max-w-md" style={{ minHeight: '500px' }}>
                  {/* Header */}
                  <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: getAccentColor() }}>
                    <div className="h-4 w-32 bg-slate-800 rounded mx-auto mb-2" />
                    <div className="h-3 w-24 rounded mx-auto" style={{ backgroundColor: getAccentColor() }} />
                    <div className="h-2 w-44 bg-slate-200 rounded mx-auto mt-2" />
                  </div>

                  {/* Summary */}
                  <div className="mb-5">
                    <div className="h-2.5 w-28 rounded mb-2" style={{ backgroundColor: getAccentColor() + '90' }} />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-slate-100 rounded" />
                      <div className="h-2 w-11/12 bg-slate-100 rounded" />
                      <div className="h-2 w-4/5 bg-slate-100 rounded" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-5">
                    <div className="h-2.5 w-32 rounded mb-3" style={{ backgroundColor: getAccentColor() + '90' }} />
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <div className="h-2 w-28 bg-slate-700 rounded" />
                            <div className="h-2 w-16 bg-slate-300 rounded" />
                          </div>
                          <div className="h-2 w-20 bg-slate-400 rounded mb-2" />
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-100 rounded" />
                            <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                            <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-5">
                    <div className="h-2.5 w-16 rounded mb-2" style={{ backgroundColor: getAccentColor() + '90' }} />
                    <div className="flex flex-wrap gap-1.5">
                      {[12, 16, 10, 14, 11, 13, 9, 15].map((w, i) => (
                        <div key={i} className="h-4 rounded bg-slate-100 border border-slate-200" style={{ width: `${w * 4}px` }} />
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="h-2.5 w-20 rounded mb-2" style={{ backgroundColor: getAccentColor() + '90' }} />
                    <div className="flex justify-between">
                      <div className="h-2 w-36 bg-slate-700 rounded" />
                      <div className="h-2 w-14 bg-slate-300 rounded" />
                    </div>
                    <div className="h-2 w-24 bg-slate-400 rounded mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{template.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {template.description || `A professional ${template.style.toLowerCase()} resume template designed for ${template.category.toLowerCase()} professionals. Optimized for ATS systems and recruiter readability.`}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Features</h4>
                {[
                  { label: 'ATS Optimized', description: 'Passes all major ATS systems', icon: Shield },
                  { label: 'Recruiter Approved', description: 'Tested with hiring managers', icon: Check },
                  { label: 'Easy to Customize', description: 'Edit all sections freely', icon: Sparkles },
                  { label: 'PDF Export', description: 'Pixel-perfect PDF output', icon: Download },
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg">
                    <div className="h-6 w-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <feat.icon className="h-3 w-3 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{feat.label}</p>
                      <p className="text-[10px] text-slate-400">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[template.category, template.style, 'ATS-Friendly', 'Professional'].map((tag, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
                <Button
                  onClick={onUse}
                  className="w-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-5 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="h-4 w-4" /> Use This Template
                </Button>
                <p className="text-[10px] text-slate-400 text-center">Opens in Resume Builder with this template applied</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// MAIN TEMPLATES PAGE COMPONENT
// ============================================================

export default function TemplatesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'name'>('default');

  // Load templates and favorites
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');

    // Enrich templates with additional metadata
    const enriched = templatesData.templates.map((t: any, idx: number) => ({
      ...t,
      popular: idx < 4 || idx === 7 || idx === 10, // Mark some as popular
      atsFriendly: t.atsFriendly !== false, // Default to true
    }));
    setTemplates(enriched);
    setFilteredTemplates(enriched);

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('templateFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [status, router]);

  // Filter templates
  useEffect(() => {
    let filtered = templates;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.style.toLowerCase().includes(query)
      );
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter(t => favorites.has(t.id));
    }

    // Sort
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTemplates(filtered);
  }, [search, selectedCategory, templates, showFavoritesOnly, favorites, sortBy]);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      localStorage.setItem('templateFavorites', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const useTemplate = (templateId: string) => {
    localStorage.setItem('selectedTemplate', templateId);
    router.push('/cv-builder?template=' + templateId);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-sm text-slate-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => { useTemplate(previewTemplate.id); setPreviewTemplate(null); }}
            isFavorite={favorites.has(previewTemplate.id)}
            onToggleFavorite={() => toggleFavorite(previewTemplate.id)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ============================================================
            HEADER
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Palette className="h-5 w-5 text-white" />
            </div>
            Resume Templates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            25+ ATS-optimized templates designed for your industry and career level
          </p>
        </motion.div>

        {/* ============================================================
            SEARCH & FILTERS
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, category, or style..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1 border border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || categoryIcons['Default'];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40'
                      : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  showFavoritesOnly
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40'
                    : 'bg-white dark:bg-slate-900/40 text-slate-500 border border-slate-200/60 dark:border-slate-800/60 hover:border-rose-200'
                }`}
              >
                <Heart className={`h-3 w-3 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites {favorites.size > 0 && `(${favorites.size})`}
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'popular' ? 'default' : 'popular')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  sortBy === 'popular'
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40'
                    : 'bg-white dark:bg-slate-900/40 text-slate-500 border border-slate-200/60 dark:border-slate-800/60 hover:border-amber-200'
                }`}
              >
                <TrendingUp className="h-3 w-3" /> Popular First
              </button>
            </div>

            <span className="text-[11px] font-medium text-slate-400">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* ============================================================
            TEMPLATES GRID
            ============================================================ */}
        {filteredTemplates.length > 0 ? (
          <div className={`grid gap-5 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredTemplates.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={idx}
                isFavorite={favorites.has(template.id)}
                onToggleFavorite={() => toggleFavorite(template.id)}
                onPreview={() => setPreviewTemplate(template)}
                onUse={() => useTemplate(template.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No templates found</h3>
            <p className="text-xs text-slate-400 mb-4">Try a different search term or category.</p>
            <Button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setShowFavoritesOnly(false); }}
              variant="outline"
              className="text-xs font-semibold rounded-xl px-4 py-4"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
