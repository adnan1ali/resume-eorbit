'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  BarChart3, Loader2, Zap, Shield, Target, Brain, ArrowRight,
  ChevronRight, Sparkles, Eye, RefreshCw, Download, X, Check,
  AlertCircle, BookOpen, Lightbulb, Award, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Tooltip
} from 'recharts';

// ============================================================
// TYPES
// ============================================================

type ScanState = 'idle' | 'uploading' | 'scanning' | 'complete' | 'error';

type ScanResult = {
  atsScore: number;
  readability: number;
  keywordGap: string;
  recommendations: string[];
  extractedText?: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  sections?: { name: string; found: boolean }[];
};

// ============================================================
// ANIMATED SCORE GAUGE COMPONENT
// ============================================================

function ScoreGauge({ score, size = 180, label = 'ATS Score' }: { score: number; size?: number; label?: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = radius * Math.PI; // half circle
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Excellent' };
    if (s >= 60) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Good' };
    if (s >= 40) return { stroke: '#f97316', text: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', label: 'Needs Work' };
    return { stroke: '#ef4444', text: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', label: 'Poor' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M ${10} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Score arc */}
          <motion.path
            d={`M ${10} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            className={`text-4xl font-black ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">{label}</span>
        </div>
      </div>
      <Badge className={`${colors.bg} ${colors.text} border-0 text-xs font-bold px-3 py-1 mt-2`}>
        {colors.label}
      </Badge>
    </div>
  );
}

// ============================================================
// SCANNING ANIMATION COMPONENT
// ============================================================

function ScanningAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated scanner */}
      <div className="relative w-32 h-40 mb-8">
        {/* Document shape */}
        <div className="absolute inset-0 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          {/* Document lines */}
          <div className="p-4 space-y-2 mt-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
          </div>
        </div>
        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Glow effect */}
        <motion.div
          className="absolute left-0 right-0 h-8 bg-gradient-to-b from-indigo-500/20 to-transparent"
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Progress text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 justify-center mb-2">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analyzing your resume...</span>
        </div>
        <p className="text-xs text-slate-400">Checking ATS compatibility, keywords, and formatting</p>
      </motion.div>

      {/* Progress steps */}
      <div className="mt-8 space-y-3 w-full max-w-xs">
        {[
          { label: 'Extracting text content', delay: 0 },
          { label: 'Analyzing keyword density', delay: 0.8 },
          { label: 'Checking ATS formatting', delay: 1.6 },
          { label: 'Generating recommendations', delay: 2.4 },
        ].map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay, duration: 0.4 }}
            className="flex items-center gap-2.5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay + 0.5, duration: 0.3 }}
              className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
            <span className="text-xs text-slate-600 dark:text-slate-400">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// KEYWORD HEATMAP COMPONENT
// ============================================================

function KeywordHeatmap({ matched, missing }: { matched: string[]; missing: string[] }) {
  return (
    <div className="space-y-4">
      {/* Matched Keywords */}
      {matched.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Matched Keywords ({matched.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map((keyword, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1 rounded-lg"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {missing.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <XCircle className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Missing Keywords ({missing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((keyword, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 + 0.3, duration: 0.3 }}
                className="text-xs font-medium bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 px-2.5 py-1 rounded-lg"
              >
                + {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SECTION COMPLETENESS COMPONENT
// ============================================================

function SectionCompleteness({ sections }: { sections: { name: string; found: boolean }[] }) {
  return (
    <div className="space-y-2.5">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
            section.found
              ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-800/40'
              : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200/60 dark:border-rose-800/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {section.found ? (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500" />
            )}
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{section.name}</span>
          </div>
          <Badge className={`text-[9px] font-bold border px-2 py-0 ${
            section.found
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/40'
              : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/40'
          }`}>
            {section.found ? 'Found' : 'Missing'}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// RECOMMENDATIONS PANEL COMPONENT
// ============================================================

function RecommendationsPanel({ recommendations, score }: { recommendations: string[]; score: number }) {
  const getPriority = (idx: number) => {
    if (idx < 2) return { label: 'High', color: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/40' };
    if (idx < 4) return { label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/40' };
    return { label: 'Low', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800/40' };
  };

  return (
    <div className="space-y-3">
      {/* Summary card */}
      <div className={`p-4 rounded-xl border ${
        score >= 80
          ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-800/40'
          : score >= 60
          ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-800/40'
          : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200/60 dark:border-rose-800/40'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            score >= 80 ? 'bg-emerald-100 dark:bg-emerald-500/20' : score >= 60 ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-rose-100 dark:bg-rose-500/20'
          }`}>
            <Lightbulb className={`h-4 w-4 ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600'}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">
              {score >= 80 ? 'Great job! Minor improvements possible.' : score >= 60 ? 'Good foundation. Some improvements needed.' : 'Significant improvements needed for ATS compatibility.'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} to improve your score.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation list */}
      {recommendations.map((rec, idx) => {
        const priority = getPriority(idx);
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl"
          >
            <div className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</p>
            </div>
            <Badge className={`text-[9px] font-bold border px-1.5 py-0 flex-shrink-0 ${priority.color}`}>
              {priority.label}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN ATS SCANNER COMPONENT
// ============================================================

export default function ATSScannerPage() {
  const { status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [activeSection, setActiveSection] = useState<'overview' | 'keywords' | 'sections' | 'recommendations'>('overview');

 
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setScanResult(null);
      setScanState('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleScan = async () => {
    if (!file) return;
    setScanState('scanning');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/ai/scan-resume', { method: 'POST', body: formData });
      const data = await res.json();

      // Enrich scan result with derived data
      const report = data.report;

const enrichedResult: ScanResult = {
  atsScore: report?.overallScore || 0,

  readability:
    Math.round(
      (report?.breakdown?.readability?.score || 0) / 10
    ) || 0,

  keywordGap:
    report?.missingKeywords?.length
      ? report.missingKeywords.join(', ')
      : '',

  recommendations:
    report?.recommendations?.map(
      (r: any) => r.message
    ) || [],

  extractedText: data.extractedText || '',

  matchedKeywords:
    report?.matchedKeywords || [],

  missingKeywords:
    report?.missingKeywords || [],

  sections:
    report?.detectedSections || [],
};

      setScanResult(enrichedResult);
      setScanState('complete');
      setActiveSection('overview');
    } catch (error) {
      console.error(error);
      setScanState('error');
    }
  };

  const resetScan = () => {
    setFile(null);
    setScanResult(null);
    setScanState('idle');
  };

  // Helper functions for enriching scan results
  function generateMockMatchedKeywords(score: number): string[] {
    const allKeywords = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Git', 'SQL', 'REST API', 'Agile', 'CI/CD'];
    const count = Math.floor((score / 100) * allKeywords.length);
    return allKeywords.slice(0, count);
  }

  function generateMockMissingKeywords(gap: string): string[] {
    if (gap) {
      return gap.split(/[,;]/).map(k => k.trim()).filter(k => k.length > 0 && k.length < 30).slice(0, 6);
    }
    return ['Kubernetes', 'Terraform', 'GraphQL'];
  }

  function generateSectionAnalysis(text: string): { name: string; found: boolean }[] {
    const lower = text.toLowerCase();
    return [
      { name: 'Contact Information', found: lower.includes('email') || lower.includes('phone') || lower.includes('@') },
      { name: 'Professional Summary', found: lower.includes('summary') || lower.includes('objective') || lower.includes('profile') },
      { name: 'Work Experience', found: lower.includes('experience') || lower.includes('employment') },
      { name: 'Education', found: lower.includes('education') || lower.includes('degree') || lower.includes('university') },
      { name: 'Skills', found: lower.includes('skills') || lower.includes('competencies') || lower.includes('technologies') },
      { name: 'Certifications', found: lower.includes('certif') || lower.includes('license') },
    ];
  }

  // Radar chart data
  const radarData = scanResult ? [
    { subject: 'Keywords', A: scanResult.atsScore || 0, fullMark: 100 },
    { subject: 'Readability', A: scanResult.readability ? scanResult.readability * 10 : 0, fullMark: 100 },
    { subject: 'Formatting', A: scanResult.sections ? Math.round((scanResult.sections.filter(s => s.found).length / scanResult.sections.length) * 100) : 75, fullMark: 100 },
    { subject: 'Completeness', A: scanResult.sections ? Math.round((scanResult.sections.filter(s => s.found).length / scanResult.sections.length) * 100) : 78, fullMark: 100 },
    { subject: 'Impact', A: Math.min(100, (scanResult.atsScore || 0) + 8), fullMark: 100 },
  ] : [];

  // Score breakdown cards
  const scoreBreakdown = scanResult ? [
    { label: 'Keyword Match', value: scanResult.atsScore, icon: Target, color: 'from-blue-500 to-indigo-600' },
    { label: 'Readability', value: scanResult.readability * 10, icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { label: 'Formatting', value: radarData[2]?.A || 75, icon: FileText, color: 'from-purple-500 to-pink-600' },
    { label: 'ATS Ready', value: scanResult.atsScore >= 70 ? 95 : scanResult.atsScore + 15, icon: Shield, color: 'from-amber-500 to-orange-600' },
  ] : [];

  return (
    <div className="min-h-screen relative">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                ATS Scanner
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Check how well your resume performs with Applicant Tracking Systems
              </p>
            </div>
            {scanState === 'complete' && (
              <Button
                onClick={resetScan}
                variant="outline"
                className="text-xs font-semibold border-slate-200 dark:border-slate-700 rounded-xl px-4 py-5 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4 text-slate-400" /> Scan Another
              </Button>
            )}
          </div>
        </motion.div>

        {/* ============================================================
            UPLOAD STATE
            ============================================================ */}
        {scanState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6 sm:p-8">
              {/* Drop Zone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 group ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5'
                    : file
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                }`}
              >
                <input {...getInputProps()} />

                {/* Upload icon */}
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto mb-5"
                >
                  {file ? (
                    <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                      <Upload className="h-8 w-8 text-indigo-500" />
                    </div>
                  )}
                </motion.div>

                {isDragActive ? (
                  <div>
                    <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">Drop your resume here</p>
                    <p className="text-sm text-indigo-500/70 mt-1">Release to upload</p>
                  </div>
                ) : file ? (
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {Math.round(file.size / 1024)} KB · Click or drop to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                      Drop your resume here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                    </p>
                    <p className="text-sm text-slate-400 mt-1">Supports PDF and DOCX files</p>
                  </div>
                )}
              </div>

              {/* File info bar */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{Math.round(file.size / 1024)} KB</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}

              {/* Scan Button */}
              <Button
                onClick={handleScan}
                disabled={!file}
                className={`w-full mt-6 text-sm font-semibold rounded-xl py-6 flex items-center justify-center gap-2 transition-all ${
                  file
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="h-4 w-4" /> Scan My Resume
              </Button>

              {/* Info */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: 'ATS Compatible', sublabel: 'Score check' },
                  { icon: Target, label: 'Keyword Match', sublabel: 'Gap analysis' },
                  { icon: Brain, label: 'AI Insights', sublabel: 'Smart tips' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                    <item.icon className="h-4 w-4 text-indigo-500 mx-auto mb-1.5" />
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{item.label}</p>
                    <p className="text-[9px] text-slate-400">{item.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            SCANNING STATE
            ============================================================ */}
        {scanState === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl">
              <ScanningAnimation />
            </div>
          </motion.div>
        )}

        {/* ============================================================
            ERROR STATE
            ============================================================ */}
        {scanState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900/40 border border-rose-200/70 dark:border-rose-800/40 rounded-2xl p-8 text-center">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Scan Failed</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">We couldn't analyze your resume. Please try again or use a different file format.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetScan} variant="outline" className="text-xs font-semibold rounded-xl px-4 py-4">
                  Try Another File
                </Button>
                <Button onClick={handleScan} className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-4">
                  Retry Scan
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            RESULTS STATE
            ============================================================ */}
        {scanState === 'complete' && scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Score Overview Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {scoreBreakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Results Grid */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Score Gauge + Radar */}
              <div className="lg:col-span-5 space-y-6">
                {/* Score Gauge Card */}
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-500" /> Overall ATS Score
                  </h3>
                  <ScoreGauge score={scanResult.atsScore} />
                </div>

                {/* Radar Chart Card */}
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" /> Performance Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Quick Action */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Improve Your Score</h4>
                      <p className="text-xs text-white/70 leading-relaxed mb-3">
                        Use our AI Resume Builder to automatically fix the issues found in this scan.
                      </p>
                      <Button
                        onClick={() => router.push('/cv-builder')}
                        className="bg-white text-indigo-700 hover:bg-slate-100 text-xs font-semibold rounded-lg px-4 py-2 h-auto flex items-center gap-1.5"
                      >
                        Open Resume Builder <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Analysis */}
              <div className="lg:col-span-7 space-y-6">
                {/* Section Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'overview' as const, label: 'Overview', icon: Eye },
                    { id: 'keywords' as const, label: 'Keywords', icon: Target },
                    { id: 'sections' as const, label: 'Sections', icon: FileText },
                    { id: 'recommendations' as const, label: 'Tips', icon: Lightbulb },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        activeSection === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40'
                          : 'bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-800'
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Panel */}
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6">
                  <AnimatePresence mode="wait">
                    {/* OVERVIEW TAB */}
                    {activeSection === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Eye className="h-4 w-4 text-indigo-500" /> Scan Overview
                        </h3>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Keywords Found</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {scanResult.matchedKeywords?.length || 0}
                              <span className="text-xs font-medium text-slate-400 ml-1">/ {(scanResult.matchedKeywords?.length || 0) + (scanResult.missingKeywords?.length || 0)}</span>
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sections Complete</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {scanResult.sections?.filter(s => s.found).length || 0}
                              <span className="text-xs font-medium text-slate-400 ml-1">/ {scanResult.sections?.length || 6}</span>
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Readability</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {scanResult.readability}
                              <span className="text-xs font-medium text-slate-400 ml-1">/ 10</span>
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Improvements</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {scanResult.recommendations?.length || 0}
                              <span className="text-xs font-medium text-slate-400 ml-1">tips</span>
                            </p>
                          </div>
                        </div>

                        {/* Keyword Gap Warning */}
                        {scanResult.keywordGap && (
                          <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-800/40 rounded-xl">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Keyword Gap Detected</p>
                                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">{scanResult.keywordGap}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* File Info */}
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 rounded-xl flex items-center gap-3">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{file?.name}</p>
                            <p className="text-[10px] text-slate-400">{file ? Math.round(file.size / 1024) : 0} KB · Scanned just now</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* KEYWORDS TAB */}
                    {activeSection === 'keywords' && (
                      <motion.div
                        key="keywords"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Target className="h-4 w-4 text-indigo-500" /> Keyword Analysis
                        </h3>
                        <KeywordHeatmap
                          matched={scanResult.matchedKeywords || []}
                          missing={scanResult.missingKeywords || []}
                        />
                      </motion.div>
                    )}

                    {/* SECTIONS TAB */}
                    {activeSection === 'sections' && (
                      <motion.div
                        key="sections"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-500" /> Section Analysis
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ATS systems look for standard resume sections. Here's what we found:
                        </p>
                        <SectionCompleteness sections={scanResult.sections || []} />
                      </motion.div>
                    )}

                    {/* RECOMMENDATIONS TAB */}
                    {activeSection === 'recommendations' && (
                      <motion.div
                        key="recommendations"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" /> Recommendations
                        </h3>
                        <RecommendationsPanel
                          recommendations={scanResult.recommendations || []}
                          score={scanResult.atsScore}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
