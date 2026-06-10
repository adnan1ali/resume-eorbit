'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, Sparkles, Save, Download, Eye, FileText, User,
  Briefcase, GraduationCap, Wrench, Award, Upload, CheckCircle,
  ChevronRight, ChevronLeft, LayoutGrid, Info, Plus, Trash2,
  ArrowRight, Shield, Zap, X, Check, AlertCircle, EyeOff
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import templatesData from '@/data/templates.json';

// ============================================================
// TYPES
// ============================================================

type WorkExperience = {
  title: string;
  company: string;
  period: string;
  bullets: string;
};

type Education = {
  degree: string;
  institution: string;
  period: string;
};

type ResumeFormData = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string;
  experience: WorkExperience[];
  education: Education[];
  certifications: string;
};

// ============================================================
// STEP CONFIGURATION
// ============================================================

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Your contact details' },
  { id: 2, title: 'Experience', icon: Briefcase, description: 'Work history' },
  { id: 3, title: 'Education', icon: GraduationCap, description: 'Academic background' },
  { id: 4, title: 'Skills', icon: Wrench, description: 'Technical & soft skills' },
  { id: 5, title: 'Summary', icon: Sparkles, description: 'AI-powered summary' },
];

// ============================================================
// TOAST NOTIFICATION COMPONENT
// ============================================================

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300',
    error: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300',
    info: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300',
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-rose-500" />,
    info: <Info className="h-4 w-4 text-indigo-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[type]} max-w-sm`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

// ============================================================
// RESUME HEALTH SCORE COMPONENT
// ============================================================

function ResumeHealthScore({ score, sections }: { score: number; sections: { name: string; complete: boolean }[] }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 50) return 'Good';
    if (s >= 25) return 'Needs Work';
    return 'Just Started';
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resume Score</h3>
        <Badge className={`${score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/40' : score >= 50 ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/40' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/40'} text-[10px] font-bold border px-2 py-0.5`}>
          {getScoreLabel(score)}
        </Badge>
      </div>

      {/* Score Circle */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score}, 100`} className={getScoreColor(score)} strokeLinecap="round" />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {score >= 80 ? 'Your resume is well-structured and ready for download.' : score >= 50 ? 'Add more details to improve your resume quality.' : 'Complete more sections to build a strong resume.'}
          </p>
        </div>
      </div>

      {/* Section Checklist */}
      <div className="space-y-2">
        {sections.map((section, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${section.complete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {section.complete && <Check className="h-2.5 w-2.5 text-white" />}
            </div>
            <span className={`text-xs font-medium ${section.complete ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
              {section.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LIVE PREVIEW COMPONENT
// ============================================================

function LivePreview({ data, visible }: { data: ResumeFormData; visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Preview Header */}
      <div className="bg-slate-50 dark:bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] font-medium text-slate-400 ml-2">Live Preview</span>
        </div>
        <Badge className="bg-indigo-50 text-indigo-600 border-indigo-200 text-[9px] font-bold px-1.5 py-0">A4</Badge>
      </div>

      {/* Preview Content */}
      <div className="p-6 text-slate-900 min-h-[500px] max-h-[700px] overflow-y-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Name & Title */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {data.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-medium text-indigo-600 mt-0.5">
            {data.jobTitle || 'Job Title'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5 space-x-2">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>· {data.phone}</span>}
            {data.location && <span>· {data.location}</span>}
          </p>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">Professional Summary</h2>
            <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.some(e => e.title || e.company) && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">Work Experience</h2>
            <div className="space-y-3">
              {data.experience.filter(e => e.title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-800">{exp.title}</p>
                      <p className="text-[10px] text-slate-500">{exp.company}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{exp.period}</span>
                  </div>
                  {exp.bullets && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, i) => (
                        <li key={i} className="text-[10px] text-slate-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                          {bullet.trim().replace(/^[•\-]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.some(e => e.degree || e.institution) && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {data.education.filter(e => e.degree || e.institution).map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">{edu.degree}</p>
                    <p className="text-[10px] text-slate-500">{edu.institution}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.split(',').map((skill, i) => (
                <span key={i} className="text-[9px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">Certifications</h2>
            <ul className="space-y-0.5">
              {data.certifications.split('\n').filter(c => c.trim()).map((cert, i) => (
                <li key={i} className="text-[10px] text-slate-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                  {cert.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!data.fullName && !data.summary && !data.skills && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-xs text-slate-400 font-medium">Start filling in your details</p>
            <p className="text-[10px] text-slate-300 mt-1">Your resume preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN CV BUILDER COMPONENT
// ============================================================

export default function CVBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const imported = searchParams.get('imported');

  // State
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [importing, setImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Form
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ResumeFormData>({
    defaultValues: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: '',
      skills: '',
      experience: [{ title: '', company: '', period: '', bullets: '' }],
      education: [{ degree: '', institution: '', period: '' }],
      certifications: '',
    }
  });

  const { fields: experienceFields, append: addExperience, remove: removeExperience } = useFieldArray({ control, name: 'experience' });
  const { fields: educationFields, append: addEducation, remove: removeEducation } = useFieldArray({ control, name: 'education' });

  const formData = watch();

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Calculate resume health score
  const calculateScore = useCallback(() => {
    let score = 0;
    const data = formData;
    if (data.fullName) score += 10;
    if (data.jobTitle) score += 10;
    if (data.email || data.phone) score += 10;
    if (data.location) score += 5;
    if (data.summary && data.summary.length > 50) score += 20;
    if (data.skills && data.skills.split(',').length >= 3) score += 15;
    if (data.experience && data.experience.some(e => e.title && e.company)) score += 20;
    if (data.education && data.education.some(e => e.degree && e.institution)) score += 10;
    return Math.min(100, score);
  }, [formData]);

  const getSectionCompletion = useCallback(() => {
    const data = formData;
    return [
      { name: 'Personal Information', complete: !!(data.fullName && data.jobTitle && (data.email || data.phone)) },
      { name: 'Work Experience', complete: !!(data.experience && data.experience.some(e => e.title && e.company)) },
      { name: 'Education', complete: !!(data.education && data.education.some(e => e.degree && e.institution)) },
      { name: 'Skills', complete: !!(data.skills && data.skills.split(',').length >= 3) },
      { name: 'Professional Summary', complete: !!(data.summary && data.summary.length > 50) },
    ];
  }, [formData]);

  // Template loading
  useEffect(() => {
    setTemplates(templatesData.templates);
    if (templateId) {
      const found = templatesData.templates.find((t: any) => t.id === templateId);
      setSelectedTemplate(found || null);
    }
  }, [templateId]);

  // Handle imported resume data
  useEffect(() => {
    if (imported === 'true') {
      const stored = sessionStorage.getItem('importedResume');
      if (stored) {
        const data = JSON.parse(stored);
        sessionStorage.removeItem('importedResume');
        showToast('Resume imported successfully! Review and complete the fields below.', 'success');
      }
    }
  }, [imported, showToast]);

  // Auth guard
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Form submission
  const onSubmit = async (data: ResumeFormData) => {
    setSaving(true);
    try {
      // Simulate save (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 800));
      showToast('Resume saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // AI Summary generation
  const generateAISummary = async () => {
    const jobTitle = watch('jobTitle');
    const skills = watch('skills');
    if (!jobTitle || !skills) {
      showToast('Please fill in your Job Title and Skills first.', 'info');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, skills }),
      });
      const { summary } = await res.json();
      setValue('summary', summary);
      showToast('AI summary generated! Review and customize it.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to generate summary. Please try again.', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  // HTML escape for PDF
  const escapeHtml = (str: string) => {
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
  };

  // PDF Download
  const downloadPDF = async () => {
    const currentData = watch();
    if (!currentData.fullName) {
      showToast('Please add your name before downloading.', 'info');
      return;
    }

    showToast('Generating PDF...', 'info');

    try {
      const printDiv = document.createElement('div');
      printDiv.style.backgroundColor = '#ffffff';
      printDiv.style.color = '#0f172a';
      printDiv.style.fontFamily = 'Inter, system-ui, sans-serif';
      printDiv.style.padding = '48px';
      printDiv.style.maxWidth = '820px';
      printDiv.style.margin = '0 auto';
      printDiv.style.lineHeight = '1.6';

      // Build contact line
      const contactParts = [currentData.email, currentData.phone, currentData.location, currentData.linkedin].filter(Boolean);
      const contactLine = contactParts.join(' · ');

      // Build experience HTML
      let experienceHtml = '';
      if (currentData.experience && currentData.experience.some(e => e.title)) {
        experienceHtml = `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px;">Work Experience</h2>
            ${currentData.experience.filter(e => e.title).map(exp => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <div>
                    <span style="font-size: 13px; font-weight: 700; color: #1e293b;">${escapeHtml(exp.title)}</span>
                    <span style="font-size: 12px; color: #64748b; margin-left: 8px;">${escapeHtml(exp.company)}</span>
                  </div>
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">${escapeHtml(exp.period)}</span>
                </div>
                ${exp.bullets ? `<ul style="margin: 6px 0 0 16px; padding: 0;">${exp.bullets.split('\n').filter(b => b.trim()).map(b => `<li style="font-size: 11px; color: #475569; margin-bottom: 3px; line-height: 1.5;">${escapeHtml(b.trim().replace(/^[•\-]\s*/, ''))}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      // Build education HTML
      let educationHtml = '';
      if (currentData.education && currentData.education.some(e => e.degree)) {
        educationHtml = `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px;">Education</h2>
            ${currentData.education.filter(e => e.degree).map(edu => `
              <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                  <span style="font-size: 13px; font-weight: 700; color: #1e293b;">${escapeHtml(edu.degree)}</span>
                  <span style="font-size: 12px; color: #64748b; margin-left: 8px;">${escapeHtml(edu.institution)}</span>
                </div>
                <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">${escapeHtml(edu.period)}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Build certifications HTML
      let certsHtml = '';
      if (currentData.certifications) {
        certsHtml = `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px;">Certifications</h2>
            <ul style="margin: 0 0 0 16px; padding: 0;">
              ${currentData.certifications.split('\n').filter(c => c.trim()).map(c => `<li style="font-size: 11px; color: #475569; margin-bottom: 4px;">${escapeHtml(c.trim())}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      printDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 28px; border-bottom: 3px solid #1e293b; padding-bottom: 18px;">
          <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin: 0;">${escapeHtml(currentData.fullName || '')}</h1>
          <p style="font-size: 15px; color: #2563eb; font-weight: 600; margin: 6px 0 4px 0;">${escapeHtml(currentData.jobTitle || '')}</p>
          <p style="font-size: 11px; color: #64748b; font-weight: 500; margin: 4px 0 0 0;">${escapeHtml(contactLine)}</p>
        </div>
        ${currentData.summary ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px;">Professional Summary</h2>
            <p style="font-size: 12px; color: #334155; white-space: pre-line; line-height: 1.7;">${escapeHtml(currentData.summary)}</p>
          </div>
        ` : ''}
        ${experienceHtml}
        ${educationHtml}
        ${currentData.skills ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px;">Skills</h2>
            <div style="font-size: 11px; color: #334155; line-height: 2;">${currentData.skills.split(',').map((s: string) => `<span style="background: #f1f5f9; padding: 3px 10px; margin: 2px; border-radius: 4px; display: inline-block; font-weight: 500; border: 1px solid #e2e8f0;">${escapeHtml(s.trim())}</span>`).join('')}</div>
          </div>
        ` : ''}
        ${certsHtml}
      `;

      document.body.appendChild(printDiv);
      const canvas = await html2canvas(printDiv, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff' });
      document.body.removeChild(printDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${currentData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  // File import handler
  const handleManualImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/ai/scan-resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.extractedText || data.extractedText.length < 100) throw new Error('Could not extract text from file.');

      const text = data.extractedText;
      const lines = text.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      const firstLine = lines[0] || '';

      let fullName = '', jobTitle = '';
      const jobKeywords = /(Engineer|Support|Developer|Analyst|Specialist|Consultant|Director|Lead|Architect|Technician|Administrator)/i;
      const keywordMatch = firstLine.match(jobKeywords);

      if (keywordMatch) {
        const idx = keywordMatch.index!;
        fullName = firstLine.substring(0, idx).trim();
        jobTitle = firstLine.substring(idx).trim().split(/[0-9|@]/)[0].trim();
      } else {
        fullName = firstLine.split(/\s+/).slice(0, 2).join(' ');
        jobTitle = firstLine.replace(fullName, '').trim();
      }

      setValue('fullName', fullName);
      setValue('jobTitle', jobTitle);

      // Parse summary
      const summaryRegex = /Professional Summary[:\s]*([\s\S]*?)(?=Core Competencies|Work Experience|Experience|Education|Skills|$)/i;
      const summaryMatch = text.match(summaryRegex);
      if (summaryMatch) {
        setValue('summary', summaryMatch[1].trim());
      }

      showToast('Resume imported! Review and complete the fields.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to import file. Please try a different format.', 'error');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) setCurrentStep(step);
  };

  return (
    <div className="min-h-screen relative">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ============================================================
            HEADER BAR
            ============================================================ */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Resume Builder
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedTemplate ? `Template: ${selectedTemplate.name}` : 'Create your professional resume'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Import Button */}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="text-xs font-semibold border-slate-200 dark:border-slate-700 rounded-xl px-4 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 flex-1 sm:flex-initial"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-slate-400" />}
              Import Resume
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleManualImport} accept=".pdf,.docx,.txt" className="hidden" />

            {/* Template Button */}
            <Button
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-700 rounded-xl px-4 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <LayoutGrid className="h-4 w-4 text-slate-400" />
              Templates
            </Button>

            {/* Preview Toggle (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-700 rounded-xl px-4 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 lg:hidden flex-1 sm:flex-initial"
            >
              {showPreview ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            {/* Download Button */}
            <Button
              onClick={downloadPDF}
              className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-5 rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* ============================================================
            TEMPLATE SELECTION PANEL (Collapsible)
            ============================================================ */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose a Template</h3>
                  <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => { setSelectedTemplate(tmpl); setShowTemplates(false); showToast(`Template "${tmpl.name}" selected`, 'success'); }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === tmpl.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{tmpl.name}</h4>
                        {selectedTemplate?.id === tmpl.id && <Check className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />}
                      </div>
                      {tmpl.atsFriendly && (
                        <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 text-[9px] font-bold px-1.5 py-0 border">ATS</Badge>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{tmpl.description || 'Professional resume template'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================
            STEP INDICATOR
            ============================================================ */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center group"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    currentStep === step.id
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-110'
                      : currentStep > step.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1.5 hidden sm:block ${
                    currentStep === step.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`h-[2px] w-8 sm:w-16 mx-1 sm:mx-2 transition-colors duration-200 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            MAIN CONTENT: FORM + PREVIEW SIDE BY SIDE
            ============================================================ */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT: Form Area */}
          <div className={`${showPreview ? 'lg:col-span-7' : 'lg:col-span-8'}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                </div>

                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {/* ============================
                        STEP 1: Personal Information
                        ============================ */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" /> Personal Information
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your basic contact details for the resume header.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</Label>
                            <Input id="fullName" {...register('fullName', { required: true })} placeholder="e.g. Mohammed Al-Rashidi" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobTitle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Job Title *</Label>
                            <Input id="jobTitle" {...register('jobTitle', { required: true })} placeholder="e.g. Senior Software Engineer" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="e.g. mohammed@email.com" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
                            <Input id="phone" {...register('phone')} placeholder="e.g. +966 50 123 4567" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</Label>
                            <Input id="location" {...register('location')} placeholder="e.g. Riyadh, Saudi Arabia" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin" className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn (optional)</Label>
                            <Input id="linkedin" {...register('linkedin')} placeholder="e.g. linkedin.com/in/mohammed" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ============================
                        STEP 2: Work Experience
                        ============================ */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Briefcase className="h-5 w-5 text-purple-500" /> Work Experience
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your relevant work history, most recent first.</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addExperience({ title: '', company: '', period: '', bullets: '' })}
                            className="text-xs font-semibold rounded-xl px-3 py-2 h-auto border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 flex items-center gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Position
                          </Button>
                        </div>

                        <div className="space-y-5">
                          {experienceFields.map((field, index) => (
                            <div key={field.id} className="relative bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5">
                              {experienceFields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeExperience(index)}
                                  className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}

                              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Job Title *</Label>
                                  <Input {...register(`experience.${index}.title`)} placeholder="e.g. Lead Software Engineer" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company</Label>
                                  <Input {...register(`experience.${index}.company`)} placeholder="e.g. STC Pay, Riyadh" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Period</Label>
                                <Input {...register(`experience.${index}.period`)} placeholder="e.g. Jan 2021 – Present" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500 max-w-xs" />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Key Achievements (one per line)</Label>
                                <Textarea {...register(`experience.${index}.bullets`)} placeholder={"Led migration of payment infrastructure serving 2M+ users\nReduced deployment time by 60% through CI/CD automation\nMentored team of 5 junior developers"} rows={4} className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-indigo-500/20 focus:border-indigo-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ============================
                        STEP 3: Education
                        ============================ */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-emerald-500" /> Education
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your educational background.</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addEducation({ degree: '', institution: '', period: '' })}
                            className="text-xs font-semibold rounded-xl px-3 py-2 h-auto border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 flex items-center gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Education
                          </Button>
                        </div>

                        <div className="space-y-5">
                          {educationFields.map((field, index) => (
                            <div key={field.id} className="relative bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5">
                              {educationFields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEducation(index)}
                                  className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}

                              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Degree / Qualification *</Label>
                                  <Input {...register(`education.${index}.degree`)} placeholder="e.g. B.Sc. Computer Science" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Institution</Label>
                                  <Input {...register(`education.${index}.institution`)} placeholder="e.g. King Fahd University" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Period</Label>
                                <Input {...register(`education.${index}.period`)} placeholder="e.g. 2014 – 2018" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm py-5 focus:ring-indigo-500/20 focus:border-indigo-500 max-w-xs" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Certifications */}
                        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                            <Award className="h-4 w-4 text-amber-500" /> Certifications (optional)
                          </h3>
                          <Textarea {...register('certifications')} placeholder={"AWS Solutions Architect Professional\nGoogle Cloud Professional Data Engineer\nPMP Certified"} rows={3} className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-indigo-500/20 focus:border-indigo-500" />
                          <p className="text-[11px] text-slate-400 mt-1.5">One certification per line.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* ============================
                        STEP 4: Skills
                        ============================ */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-amber-500" /> Skills
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">List your technical and professional skills.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="skills" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Skills (comma-separated)</Label>
                          <Textarea id="skills" {...register('skills')} placeholder="e.g. React, Node.js, TypeScript, AWS, Docker, Kubernetes, PostgreSQL, Python, CI/CD, Agile" rows={4} className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-indigo-500/20 focus:border-indigo-500" />
                          <div className="flex items-start gap-2 mt-2 p-3 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200/40 dark:border-indigo-800/30 rounded-xl">
                            <Info className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                              <strong>ATS Tip:</strong> Include skills that match the job description you're targeting. Use the exact keywords from the job posting for better ATS scores.
                            </p>
                          </div>
                        </div>

                        {/* Skills Preview */}
                        {formData.skills && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Preview ({formData.skills.split(',').filter(s => s.trim()).length} skills):</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.skills.split(',').filter(s => s.trim()).map((skill, i) => (
                                <span key={i} className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ============================
                        STEP 5: Summary
                        ============================ */}
                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-pink-500" /> Professional Summary
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A brief overview of your career highlights.</p>
                          </div>
                          <Button
                            type="button"
                            onClick={generateAISummary}
                            disabled={aiGenerating}
                            className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-4 py-2.5 h-auto flex items-center gap-2 shadow-sm"
                          >
                            {aiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            {aiGenerating ? 'Generating...' : 'Generate with AI'}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="summary" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Professional Summary</Label>
                          <Textarea id="summary" {...register('summary')} placeholder="Write 2-4 sentences highlighting your experience, key achievements, and what you bring to the role..." rows={6} className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-indigo-500/20 focus:border-indigo-500" />
                          <p className="text-[11px] text-slate-400">
                            {formData.summary ? `${formData.summary.length} characters` : 'Aim for 150-300 characters for best results.'}
                          </p>
                        </div>

                        {/* AI Suggestion Box */}
                        <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-200/40 dark:border-indigo-800/30 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">AI Writing Assistant</p>
                              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 leading-relaxed">
                                Click "Generate with AI" to create a professional summary based on your job title and skills. You can edit the result to make it more personal.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ============================
                      NAVIGATION FOOTER
                      ============================ */}
                  <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-200/60 dark:border-slate-800/60">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goToStep(currentStep - 1)}
                      disabled={currentStep === 1}
                      className="text-xs font-semibold rounded-xl px-4 py-4 border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Back
                    </Button>

                    <div className="flex items-center gap-3">
                      {/* Save Button */}
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={saving}
                        className="text-xs font-semibold rounded-xl px-4 py-4 border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-slate-400" />}
                        Save
                      </Button>

                      {/* Next / Finish Button */}
                      {currentStep < 5 ? (
                        <Button
                          type="button"
                          onClick={() => goToStep(currentStep + 1)}
                          className="text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl px-5 py-4 flex items-center gap-1.5"
                        >
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={downloadPDF}
                          className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-5 py-4 flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                        >
                          <Download className="h-3.5 w-3.5" /> Download PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT: Preview + Score Panel */}
          <div className={`${showPreview ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-5 hidden lg:block`}>
            {/* Resume Health Score */}
            <ResumeHealthScore score={calculateScore()} sections={getSectionCompletion()} />

            {/* Live Preview */}
            <LivePreview data={formData} visible={showPreview} />
          </div>

          {/* Mobile Preview (below form) */}
          <div className="lg:hidden">
            {showPreview && (
              <>
                <ResumeHealthScore score={calculateScore()} sections={getSectionCompletion()} />
                <div className="mt-5">
                  <LivePreview data={formData} visible={showPreview} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
