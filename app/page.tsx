'use client';

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  type Variants
} from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Brain, BarChart3, FileSearch, Layers, Zap, BadgeCheck, Check,
  CheckCircle2, Sparkles, Target, TrendingUp, Users, Globe, Shield,
  FileText, Briefcase, GraduationCap, Award, Star, ChevronDown, ChevronRight,
  Upload, MousePointerClick, Cpu, LineChart, BookOpen, MessageSquare,
  ArrowUpRight, Play, Quote, Minus, Plus
} from 'lucide-react';

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};
// ============================================================
// REUSABLE SECTION WRAPPER WITH SCROLL ANIMATION
// ============================================================

function AnimatedSection({
  children,
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
// ============================================================
// ANIMATED COUNTER
// ============================================================

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ============================================================
// TYPING ANIMATION FOR HERO
// ============================================================

function TypingText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFullText) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentFullText.substring(0, displayText.length - 1)
            : currentFullText.substring(0, displayText.length + 1)
        );
      }, isDeleting ? 30 : 60);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className="text-indigo-500 dark:text-indigo-400">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ============================================================
// FAQ ACCORDION ITEM
// ============================================================

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200/70 dark:border-slate-800/70 rounded-2xl overflow-hidden transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {question}
        </span>
        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${open ? 'bg-indigo-500 text-white rotate-0' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Platform pillars data
  const platformPillars = [
    { icon: FileText, title: 'AI Resume Builder', description: 'Create ATS-optimized resumes with AI-powered content suggestions tailored to your industry and role.', color: 'from-blue-500 to-indigo-600' },
    { icon: BarChart3, title: 'ATS Scanner', description: 'Get instant scores, keyword analysis, and actionable fixes to beat applicant tracking systems.', color: 'from-emerald-500 to-teal-600' },
    { icon: Target, title: 'Job Matching', description: 'AI matches your profile to relevant openings across India, GCC, and global markets.', color: 'from-purple-500 to-pink-600' },
    { icon: MessageSquare, title: 'Interview Prep', description: 'Practice with AI-powered mock interviews customized to your target role and company.', color: 'from-amber-500 to-orange-600' },
    { icon: LineChart, title: 'Career Intelligence', description: 'Track your career growth, salary benchmarks, and skill gaps with data-driven insights.', color: 'from-rose-500 to-red-600' },
  ];

  // Feature cards data
  const features = [
    { icon: Brain, title: 'AI Content Generation', description: 'Generate professional summaries, bullet points, and skill descriptions powered by advanced AI models.', gradient: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200/50 dark:border-blue-800/30', iconColor: 'text-blue-500' },
    { icon: Upload, title: 'Smart Resume Import', description: 'Upload any PDF, DOCX, or text file. Our AI extracts and structures your information automatically.', gradient: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200/50 dark:border-emerald-800/30', iconColor: 'text-emerald-500' },
    { icon: Layers, title: '25+ Premium Templates', description: 'Professional templates designed for every industry — from tech to healthcare to government.', gradient: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-200/50 dark:border-purple-800/30', iconColor: 'text-purple-500' },
    { icon: Globe, title: 'Multi-Language Support', description: 'Create resumes in English, Arabic, Hindi, and Urdu with full RTL support for GCC markets.', gradient: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-200/50 dark:border-amber-800/30', iconColor: 'text-amber-500' },
    { icon: Shield, title: 'ATS Compliance Engine', description: 'Every resume is checked against 50+ ATS rules to ensure maximum compatibility with hiring systems.', gradient: 'from-rose-500/10 to-red-500/10', border: 'border-rose-200/50 dark:border-rose-800/30', iconColor: 'text-rose-500' },
    { icon: Zap, title: 'One-Click PDF Export', description: 'Generate pixel-perfect PDFs instantly. Consistent formatting across all devices and platforms.', gradient: 'from-teal-500/10 to-cyan-500/10', border: 'border-teal-200/50 dark:border-teal-800/30', iconColor: 'text-teal-500' },
  ];

  // Testimonials data
  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer', company: 'Infosys → Google', location: 'Bangalore, India', quote: 'I was getting zero callbacks. After optimizing my resume with eOrbit, I got 5 interview calls in one week. The ATS scanner showed me exactly what was wrong.', rating: 5 },
    { name: 'Mohammed Al-Qahtani', role: 'Project Manager', company: 'Saudi Aramco', location: 'Dhahran, KSA', quote: 'Finally a platform that understands the GCC job market. The Arabic resume support is excellent. I recommended it to my entire team.', rating: 5 },
    { name: 'Fatima Hassan', role: 'Marketing Manager', company: 'Emirates NBD', location: 'Dubai, UAE', quote: 'The AI suggestions were incredibly relevant to my industry. My resume score went from 45 to 92. Got promoted within 3 months of updating my CV.', rating: 5 },
    { name: 'Rahul Patel', role: 'Fresh Graduate', company: 'IIT Delhi → TCS', location: 'Delhi, India', quote: 'As a fresher, I had no idea how to write a professional resume. eOrbit guided me step by step. Landed my first job in 2 weeks.', rating: 5 },
    { name: 'Ahmed Khan', role: 'Data Analyst', company: 'Careem', location: 'Karachi → Dubai', quote: 'The job matching feature found opportunities I never would have discovered on my own. Relocated to Dubai within 2 months.', rating: 5 },
    { name: 'Maria Santos', role: 'Nurse', company: 'Philippine Heart Center → KSA', location: 'Manila → Riyadh', quote: 'The platform helped me format my CV for the Saudi healthcare market. The template was perfect for my nursing credentials.', rating: 5 },
  ];

  // FAQ data
  const faqs = [
    { question: 'Is Resume eOrbit really free to use?', answer: 'Yes! You can create up to 2 resumes, run 5 ATS scans per month, and access basic templates completely free. No credit card required. Upgrade to Pro when you need unlimited access.' },
    { question: 'How does the ATS Scanner work?', answer: 'Our ATS Scanner analyzes your resume against the same algorithms used by major applicant tracking systems like Taleo, Workday, and Greenhouse. It checks keyword density, formatting, section structure, and readability, then gives you a score out of 100 with specific fixes.' },
    { question: 'Can I create resumes in Arabic?', answer: 'Absolutely. Resume eOrbit fully supports Arabic with proper RTL (right-to-left) layout, Arabic fonts, and templates designed specifically for the GCC job market. You can also create bilingual resumes.' },
    { question: 'What makes eOrbit different from other resume builders?', answer: 'Three things: (1) We\'re purpose-built for India and GCC markets, not a generic Western tool. (2) Our AI understands regional job requirements and ATS systems used in these markets. (3) We\'re a complete career platform — not just a resume builder.' },
    { question: 'Will my resume pass ATS systems?', answer: 'Resumes built with eOrbit have a 94% ATS pass rate. Our scanner checks against 50+ ATS rules and our templates are specifically designed to be machine-readable while looking professional to human recruiters.' },
    { question: 'Can I use eOrbit for government job applications in India?', answer: 'Yes. We have templates and formatting guidelines specifically designed for Indian government job applications, including proper biodata formats, passport-size photo placement, and declaration sections.' },
    { question: 'How is my data protected?', answer: 'Your data is encrypted at rest and in transit. We never share your personal information with third parties. You can delete your account and all associated data at any time. We comply with GDPR and regional data protection regulations.' },
    { question: 'Do you offer team or enterprise plans?', answer: 'Yes. Our Team Hub plan supports up to 10 members with centralized admin controls, custom branding, and priority support. For larger organizations, contact our sales team for custom enterprise pricing.' },
  ];

  // Pricing data
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: ['2 resume slots', '5 ATS scans per month', 'Basic templates', 'PDF export', 'Email support'],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'For serious job seekers',
      features: ['Unlimited resumes', 'Unlimited ATS scans', 'All 25+ premium templates', 'AI writing assistant', 'Job match recommendations', 'Interview prep tools', 'Priority support'],
      cta: 'Start 7-Day Free Trial',
      popular: true,
    },
    {
      name: 'Team',
      price: '$29',
      period: 'per month',
      description: 'For teams and organizations',
      features: ['Everything in Pro', 'Up to 10 team members', 'Admin dashboard', 'Custom branding', 'Bulk resume review', 'Dedicated account manager'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  // Why eOrbit comparison data
  const comparisons = [
    { feature: 'GCC & India market focus', eorbit: true, others: false },
    { feature: 'Arabic RTL resume support', eorbit: true, others: false },
    { feature: 'AI-powered content generation', eorbit: true, others: true },
    { feature: 'Real-time ATS scoring', eorbit: true, others: false },
    { feature: 'Job matching engine', eorbit: true, others: false },
    { feature: 'Interview preparation', eorbit: true, others: false },
    { feature: 'Career growth tracking', eorbit: true, others: false },
    { feature: 'Government job formats (India)', eorbit: true, others: false },
    { feature: 'Free tier available', eorbit: true, others: true },
  ];

  return (
    <div className="relative overflow-hidden">

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-indigo-500/[0.07] dark:bg-indigo-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] bg-purple-500/[0.06] dark:bg-purple-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[40%] w-[500px] h-[500px] bg-pink-500/[0.05] dark:bg-pink-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Left — Copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Trusted by 120,000+ professionals across India & GCC</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white mb-6">
                Stop getting rejected.{' '}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Start getting hired.
                </span>
              </motion.h1>

              {/* Subheadline with typing effect */}
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                The AI career platform that helps you{' '}
                <TypingText texts={['build ATS-proof resumes', 'score 95+ on ATS scans', 'match with dream jobs', 'prepare for interviews', 'grow your career']} />
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button
                  onClick={() => router.push('/cv-builder')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center gap-2 group"
                >
                  Build My Resume Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push('/ats-scanner')}
                  variant="outline"
                  className="text-sm font-semibold border-slate-300 dark:border-slate-700 rounded-xl px-8 py-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 group"
                >
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Check My ATS Score
                </Button>
              </motion.div>

              {/* Social proof micro */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'].map((color, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full ${color} border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold`}>
                      {['P', 'M', 'F', 'R', 'A'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">4.9/5 from 2,400+ reviews</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right — Interactive Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Floating ATS Score Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 sm:top-2 sm:right-2 z-20 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl shadow-emerald-500/10 border border-emerald-200/60 dark:border-emerald-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-100 dark:text-slate-800" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="96, 100" className="text-emerald-500" strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-emerald-600 dark:text-emerald-400">96</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">ATS Score</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Excellent</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating AI Suggestion Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="absolute -bottom-2 -left-4 sm:bottom-8 sm:-left-8 z-20 bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-xl shadow-indigo-500/10 border border-indigo-200/60 dark:border-indigo-800/40 max-w-[220px]"
              >
                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white">AI Suggestion</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">Add "Kubernetes" to match 3 more job listings</p>
                  </div>
                </div>
              </motion.div>

              {/* Main Resume Card */}
              <div className="relative bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl shadow-slate-200/40 dark:shadow-slate-900/60 p-6 sm:p-8 overflow-hidden">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="space-y-5">
                  {/* Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mohammed Al-Rashidi</h3>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">Senior Software Engineer</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Riyadh, Saudi Arabia · mohammed@email.com</p>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Professional Summary</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Results-driven software engineer with 7+ years building scalable cloud applications. Led migration of payment infrastructure serving 2M+ users at STC Pay.
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL', 'Docker'].map((skill, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Experience</h4>
                    <div className="space-y-3">
                      {[
                        { role: 'Lead Engineer', company: 'STC Pay, Riyadh', period: '2021 – Present' },
                        { role: 'Senior Developer', company: 'Careem, Dubai', period: '2018 – 2021' },
                      ].map((exp, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{exp.role}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{exp.company}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{exp.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          SECTION 2: TRUST BAR
          ================================================================ */}
      <AnimatedSection className="border-y border-slate-200/60 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 py-8 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Professionals hired at
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {['Saudi Aramco', 'STC', 'Emirates NBD', 'Careem', 'ADNOC', 'Infosys', 'TCS', 'PwC'].map((name, i) => (
                <span key={i} className="text-sm font-bold text-slate-300 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-400 transition-colors duration-200 tracking-tight cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 3: PLATFORM SHOWCASE — 5 PILLARS
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
            <Cpu className="h-3 w-3" /> Complete Career Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Not just a resume builder.{' '}
            <span className="text-gradient">Your entire career, powered by AI.</span>
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            From your first resume to your next promotion — eOrbit supports every step of your career journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {platformPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-default"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <pillar.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 4: INTERACTIVE ATS DEMO
          ================================================================ */}
      <AnimatedSection className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/30 dark:to-transparent border-y border-slate-200/40 dark:border-slate-800/30 py-20 md:py-28 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full mb-4">
                <BarChart3 className="h-3 w-3" /> ATS Scanner
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                Know your ATS score{' '}
                <span className="text-emerald-600 dark:text-emerald-400">before you apply</span>
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                Most resumes are rejected by automated systems before a human ever sees them. Our scanner analyzes your resume against the exact algorithms used by top ATS platforms — and tells you exactly how to fix it.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Keyword gap analysis against job descriptions',
                  'Format compatibility check across 50+ ATS systems',
                  'Section structure and readability scoring',
                  'Actionable fix suggestions with one-click apply',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push('/ats-scanner')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-5 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 group"
              >
                Scan My Resume Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right — ATS Demo Card */}
            <div className="relative">
              <div className="bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">ATS Analysis Report</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">89</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">/100</span>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="space-y-5">
                  {[
                    { label: 'Keyword Match', value: 92, color: 'bg-blue-500' },
                    { label: 'Format Score', value: 95, color: 'bg-emerald-500' },
                    { label: 'Readability', value: 88, color: 'bg-purple-500' },
                    { label: 'Section Structure', value: 82, color: 'bg-amber-500' },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{bar.label}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{bar.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                          className={`h-full rounded-full ${bar.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Missing Keywords */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-2">Missing Keywords (3)</p>
                  <div className="flex flex-wrap gap-2">
                    {['Agile / Scrum', 'CI/CD Pipeline', 'Kubernetes'].map((tag, i) => (
                      <span key={i} className="text-[11px] font-medium bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-lg">
                        + {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 5: STATISTICS
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { value: 120000, suffix: '+', label: 'Resumes Created', sublabel: 'Across India & GCC', icon: FileText },
            { value: 94, suffix: '%', label: 'ATS Pass Rate', sublabel: 'Industry-leading accuracy', icon: Shield },
            { value: 32, suffix: '×', label: 'More Interviews', sublabel: 'Average improvement', icon: TrendingUp, prefix: '' },
            { value: 15, suffix: '+', label: 'Countries Served', sublabel: 'India, GCC & beyond', icon: Globe },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-800/40 transition-colors duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{stat.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 6: FEATURES GRID
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3 w-3" /> Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Everything you need to get hired
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Purpose-built for professionals in India and the GCC. Not a generic Western resume tool.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`group relative bg-gradient-to-br ${feat.gradient} border ${feat.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className={`h-11 w-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${feat.iconColor}`}>
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 7: RESUME BUILDER SHOWCASE
          ================================================================ */}
      <AnimatedSection className="bg-gradient-to-b from-white to-slate-50 dark:from-transparent dark:to-slate-900/20 border-y border-slate-200/40 dark:border-slate-800/30 py-20 md:py-28 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Steps Visual */}
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Import or start fresh', description: 'Upload your existing resume or start from scratch. Our AI extracts your information automatically.', icon: Upload, active: true },
                  { step: '02', title: 'AI enhances your content', description: 'Get intelligent suggestions for bullet points, summaries, and skill descriptions tailored to your target role.', icon: Brain, active: false },
                  { step: '03', title: 'Choose a template', description: 'Pick from 25+ ATS-optimized templates designed for your industry and career level.', icon: Layers, active: false },
                  { step: '04', title: 'Export & apply', description: 'Download a pixel-perfect PDF that passes ATS systems and impresses recruiters.', icon: Zap, active: false },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                      item.active
                        ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200/60 dark:border-indigo-800/40'
                        : 'bg-white dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-800/40'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.active
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{item.step}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Copy */}
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-full mb-4">
                <FileText className="h-3 w-3" /> Resume Builder
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                Build a resume that{' '}
                <span className="text-purple-600 dark:text-purple-400">gets you interviews</span>
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Our AI-powered builder guides you through every section, suggests improvements, and ensures your resume is optimized for both ATS systems and human recruiters.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Whether you're a fresh graduate in Delhi or a senior engineer in Riyadh, eOrbit adapts to your experience level and target market. Support for English, Arabic, Hindi, and Urdu.
              </p>
              <Button
                onClick={() => router.push('/cv-builder')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-5 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-2 group"
              >
                Start Building Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 8: TEMPLATE SHOWCASE
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10" id="templates">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full mb-4">
            <Layers className="h-3 w-3" /> Premium Templates
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            25+ templates designed for{' '}
            <span className="text-amber-600 dark:text-amber-400">your industry</span>
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Every template is ATS-tested, recruiter-approved, and designed for specific industries and career levels.
          </p>
        </div>

        {/* Template Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Technology', count: '8 templates', icon: Cpu, description: 'For developers, engineers, and IT professionals', color: 'from-blue-500 to-indigo-600' },
            { title: 'Business', count: '6 templates', icon: Briefcase, description: 'For managers, analysts, and consultants', color: 'from-emerald-500 to-teal-600' },
            { title: 'Healthcare', count: '5 templates', icon: Award, description: 'For doctors, nurses, and medical staff', color: 'from-rose-500 to-pink-600' },
            { title: 'Fresh Graduate', count: '6 templates', icon: GraduationCap, description: 'For students and entry-level candidates', color: 'from-amber-500 to-orange-600' },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => router.push('/templates')}
              className="group cursor-pointer bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-[11px] font-semibold text-indigo-500 mb-2">{cat.count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors">
                Browse templates <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 9: WHY eORBIT — COMPARISON TABLE
          ================================================================ */}
      <AnimatedSection className="bg-slate-50 dark:bg-slate-900/20 border-y border-slate-200/40 dark:border-slate-800/30 py-20 md:py-28 relative z-10">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
              <Target className="h-3 w-3" /> Why eOrbit
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Built different from generic tools
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
              Most resume builders are designed for Western markets. eOrbit is purpose-built for India, GCC, and South Asia.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Feature</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-center">eOrbit</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Others</span>
            </div>
            {/* Rows */}
            {comparisons.map((row, idx) => (
              <div key={idx} className={`grid grid-cols-3 gap-4 px-6 py-3.5 items-center ${idx !== comparisons.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/60' : ''}`}>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{row.feature}</span>
                <div className="flex justify-center">
                  {row.eorbit ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.others ? (
                    <CheckCircle2 className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 10: TESTIMONIALS
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
            <Users className="h-3 w-3" /> Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Real people. Real results.
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Join thousands of professionals who transformed their careers with eOrbit.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="bg-white dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800/40 hover:shadow-md transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5 line-clamp-4">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{testimonial.role} · {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 11: PRICING
          ================================================================ */}
      <AnimatedSection className="bg-gradient-to-b from-white to-slate-50 dark:from-transparent dark:to-slate-900/20 border-y border-slate-200/40 dark:border-slate-800/30 py-20 md:py-28 relative z-10" id="pricing">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3 w-3" /> Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
              Start free. Upgrade when you're ready to get serious about your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`relative bg-white dark:bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] z-10'
                    : 'border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-indigo-500 text-white rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                    <span className="text-sm text-slate-400 font-medium">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => router.push(plan.popular ? '/register' : plan.name === 'Team' ? '/contact' : '/register')}
                  className={`w-full text-sm font-semibold rounded-xl py-5 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 12: FAQ
          ================================================================ */}
      <AnimatedSection className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10" id="faq">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
            <BookOpen className="h-3 w-3" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to know about Resume eOrbit.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </AnimatedSection>

      {/* ================================================================
          SECTION 13: FINAL CTA
          ================================================================ */}
      <AnimatedSection className="relative z-10 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Your next job is one resume away
              </h2>
              <p className="text-base sm:text-lg text-white/80 font-medium max-w-xl mx-auto mb-8">
                Join 120,000+ professionals across India and the GCC who've transformed their careers with Resume eOrbit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/cv-builder')}
                  className="bg-white text-indigo-700 hover:bg-slate-100 font-semibold text-sm px-8 py-6 rounded-xl shadow-lg flex items-center gap-2 group"
                >
                  Build My Resume Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push('/ats-scanner')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold text-sm px-8 py-6 rounded-xl backdrop-blur-sm flex items-center gap-2"
                >
                  Check My ATS Score
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-6 font-medium">
                No credit card required · Free forever plan available · Takes 2 minutes
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
