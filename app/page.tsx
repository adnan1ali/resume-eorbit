'use client';

/**
 * Resume eOrbit — Premium Landing Page
 * 
 * Design: White-dominant, professional, enterprise-grade
 * Inspired by: Enhancv, LinkedIn Premium, Stripe, Notion
 * 
 * Sections:
 * 1. Hero
 * 2. Template Showcase (horizontal scroll)
 * 3. ATS Section
 * 4. AI Section
 * 5. One Platform Section
 * 6. Statistics
 * 7. Testimonials
 * 8. Career Research
 * 9. Pricing Preview
 * 10. Final CTA
 */

import Link from 'next/link';
import { useRef } from 'react';
import {
  ArrowRight, BarChart3, FileText, Sparkles, Shield, CheckCircle,
  PenTool, Brain, Briefcase, Target, TrendingUp, Mic, Search,
  Layers, Star, ChevronLeft, ChevronRight, Globe, Users,
  BookOpen, DollarSign, MapPin, Zap, Award, Clock, Check
} from 'lucide-react';

// ============================================================
// HERO SECTION
// ============================================================

function HeroSection() {
  return (
    <section className="pt-20 pb-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-4 py-2 rounded-full mb-8">
          <Shield className="h-3.5 w-3.5 text-indigo-600" />
          Trusted by 50,000+ professionals across 150 countries
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
          Land More Interviews with{' '}
          <span className="text-indigo-600">AI-Powered Career Tools</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Build ATS-friendly resumes, create cover letters, prepare for interviews, and track your entire job search from one platform.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/resume-builder"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-7 py-3.5 rounded-lg transition-colors"
          >
            Build My Resume <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ats-scanner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-indigo-600" /> Get ATS Score
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Shield, label: 'ATS Optimized' },
            { icon: CheckCircle, label: 'Recruiter Approved' },
            { icon: Sparkles, label: 'AI Powered' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
              <item.icon className="h-4 w-4 text-emerald-500" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TEMPLATE SHOWCASE (Horizontal Scroll)
// ============================================================

const TEMPLATES = [
  { name: 'Cloud Engineer', category: 'Technology', ats: 96 },
  { name: 'IT Support', category: 'Technology', ats: 94 },
  { name: 'Project Manager', category: 'Management', ats: 97 },
  { name: 'Data Scientist', category: 'Analytics', ats: 95 },
  { name: 'DevOps', category: 'Technology', ats: 93 },
  { name: 'Healthcare', category: 'Medical', ats: 92 },
];

function TemplateShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Choose a Professional Resume Template
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Start with recruiter-approved designs built for modern hiring systems.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="h-10 w-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="h-10 w-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEMPLATES.map((template, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[280px] snap-start bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group"
            >
              {/* Preview Area */}
              <div className="h-[340px] bg-slate-100 relative flex items-center justify-center">
                <div className="w-[200px] h-[280px] bg-white shadow-sm border border-slate-200 rounded p-4">
                  <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-slate-100 rounded mb-4" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                  </div>
                  <div className="h-2 w-20 bg-slate-200 rounded mt-4 mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                  </div>
                </div>
                {/* ATS Badge */}
                <div className="absolute top-3 right-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
                  ATS {template.ats}%
                </div>
              </div>
              {/* Info */}
              <div className="p-4 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{template.category}</p>
                <Link
                  href={`/resume-builder?template=${template.name.toLowerCase().replace(/\s/g, '-')}`}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  Start With Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All Templates <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ATS SECTION
// ============================================================

function ATSSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <BarChart3 className="h-3.5 w-3.5" /> ATS Technology
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              Beat Applicant Tracking Systems with Confidence
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              93% of large companies use ATS to filter resumes before a human ever sees them. Our real ATS engine analyzes your resume the same way these systems do — giving you actionable fixes before you apply.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: 'ATS Compatibility', description: 'Check if your resume passes automated screening systems' },
                { title: 'Keyword Optimization', description: 'Match your resume keywords to job descriptions' },
                { title: 'Formatting Analysis', description: 'Ensure your formatting is machine-readable' },
                { title: 'Readability Score', description: 'Optimize for both ATS and human recruiters' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/ats-scanner"
              className="mt-8 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Scan My Resume <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="space-y-4">
              {/* Score */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-900">ATS Score</span>
                  <span className="text-2xl font-bold text-emerald-600">87/100</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[87%] bg-emerald-500 rounded-full" />
                </div>
              </div>
              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Keywords', score: 82, color: 'bg-indigo-500' },
                  { label: 'Formatting', score: 95, color: 'bg-emerald-500' },
                  { label: 'Sections', score: 90, color: 'bg-emerald-500' },
                  { label: 'Impact', score: 78, color: 'bg-amber-500' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-xs font-bold text-slate-700">{item.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Keywords */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Matched Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'CI/CD'].map((kw, idx) => (
                    <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// AI SECTION
// ============================================================

const AI_FEATURES = [
  { icon: PenTool, title: 'AI Resume Builder', description: 'Generate professional resumes tailored to your target role' },
  { icon: FileText, title: 'AI Resume Review', description: 'Get instant expert-level feedback on your resume' },
  { icon: Target, title: 'AI Resume Tailoring', description: 'Customize your resume for each job application' },
  { icon: Search, title: 'AI Skills Finder', description: 'Discover missing skills for your target positions' },
  { icon: Mic, title: 'AI Interview Coach', description: 'Practice with realistic AI-powered mock interviews' },
  { icon: Briefcase, title: 'AI Job Search', description: 'Find relevant opportunities matched to your profile' },
  { icon: Sparkles, title: 'AI Cover Letter Generator', description: 'Create compelling cover letters in seconds' },
];

function AISection() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Brain className="h-3.5 w-3.5" /> AI-Powered
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Fully Equipped for the AI Era
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
            Every tool is powered by advanced AI to give you an unfair advantage in your job search.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                <feature.icon className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ONE PLATFORM SECTION
// ============================================================

const PLATFORM_PRODUCTS = [
  { icon: PenTool, title: 'Resume Builder', description: 'Build professional, ATS-optimized resumes' },
  { icon: BarChart3, title: 'ATS Scanner', description: 'Check compatibility with hiring systems' },
  { icon: FileText, title: 'Cover Letter Builder', description: 'Create tailored cover letters' },
  { icon: Mic, title: 'Interview Coach', description: 'Practice with AI mock interviews' },
  { icon: Briefcase, title: 'Job Tracker', description: 'Track applications and progress' },
  { icon: Search, title: 'AI Job Search', description: 'Find matched opportunities' },
  { icon: TrendingUp, title: 'Career Roadmaps', description: 'Plan your career trajectory' },
  { icon: Target, title: 'Resume Tailoring', description: 'Customize for each application' },
];

function OnePlatformSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900">
            Everything You Need for Your Career in One Place
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
            Stop juggling multiple tools. Resume eOrbit brings your entire career toolkit into one unified platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_PRODUCTS.map((product, idx) => (
            <div
              key={idx}
              className="text-center p-6 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <product.icon className="h-5 w-5 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{product.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STATISTICS SECTION
// ============================================================

function StatisticsSection() {
  return (
    <section className="py-20 bg-slate-50/50 border-y border-slate-200/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '50,000+', label: 'Resumes Built' },
            { value: '120,000+', label: 'ATS Scans Completed' },
            { value: '3.2x', label: 'More Interview Calls' },
            { value: '35,000+', label: 'Career Professionals Helped' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================

const TESTIMONIALS = [
  {
    quote: 'Resume eOrbit helped me land my dream role at a Big 4 firm in Riyadh. The ATS scanner caught issues I never would have found.',
    name: 'Priya Sharma',
    role: 'Senior Consultant',
    company: 'PwC',
    country: 'Saudi Arabia',
  },
  {
    quote: 'After using the AI resume builder, I received 5 interview calls in my first week of applying. The difference was immediate.',
    name: 'Ahmed Al-Rashid',
    role: 'Cloud Architect',
    company: 'ADNOC',
    country: 'UAE',
  },
  {
    quote: 'The cover letter generator and interview coach gave me the confidence I needed. I went from 0 callbacks to 3 offers in a month.',
    name: 'Fatima Khan',
    role: 'Data Analyst',
    company: 'Careem',
    country: 'Pakistan',
  },
  {
    quote: 'As a career coach, I recommend Resume eOrbit to all my clients. The ATS analysis is the most accurate I have seen.',
    name: 'Rajesh Menon',
    role: 'Career Coach',
    company: 'Independent',
    country: 'India',
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900">
            Trusted by Professionals Worldwide
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Real results from real professionals across India, Saudi Arabia, UAE, and Pakistan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-5">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role} at {testimonial.company} &middot; {testimonial.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CAREER RESEARCH SECTION
// ============================================================

function CareerResearchSection() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900">
            Career Research & Insights
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Data-driven research to help you make better career decisions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'AI Hiring Trends 2025', category: 'Research', date: 'Dec 2024' },
            { title: 'ATS Systems: What Actually Works', category: 'ATS Trends', date: 'Nov 2024' },
            { title: 'GCC Salary Report: Tech Roles', category: 'Salary Reports', date: 'Oct 2024' },
            { title: 'Interview Success Patterns', category: 'Interview Reports', date: 'Sep 2024' },
            { title: 'Remote Work in the Middle East', category: 'Job Market', date: 'Aug 2024' },
            { title: 'Resume Keywords That Get Callbacks', category: 'Research', date: 'Jul 2024' },
          ].map((article, idx) => (
            <Link
              key={idx}
              href="/research"
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-[10px] text-slate-400">{article.date}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                Read more <ArrowRight className="h-3 w-3" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PRICING PREVIEW SECTION
// ============================================================

function PricingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Free */}
          <div className="border border-slate-200 rounded-xl p-6">
            <h3 className="text-base font-bold text-slate-900">Free</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">$0<span className="text-sm font-normal text-slate-400">/month</span></p>
            <p className="text-sm text-slate-500 mt-2">Get started with the basics.</p>
            <ul className="mt-6 space-y-3">
              {['Resume Builder', 'Basic ATS Scan', 'Limited AI Credits', 'Limited Templates'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-6 block text-center py-2.5 border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-indigo-600 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-base font-bold text-slate-900">Pro</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">$12<span className="text-sm font-normal text-slate-400">/month</span></p>
            <p className="text-sm text-slate-500 mt-2">Everything you need to land your next role.</p>
            <ul className="mt-6 space-y-3">
              {['Unlimited Resumes', 'Unlimited ATS Scans', 'AI Resume Tailoring', 'Cover Letter Builder', 'Interview Coach', 'Premium Templates', 'No Branding'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-indigo-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=pro"
              className="mt-6 block text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Business */}
          <div className="border border-slate-200 rounded-xl p-6">
            <h3 className="text-base font-bold text-slate-900">Business</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">Custom</p>
            <p className="text-sm text-slate-500 mt-2">For recruiters, universities, and career coaches.</p>
            <ul className="mt-6 space-y-3">
              {['Team Management', 'Bulk Resume Processing', 'White-Label Options', 'API Access', 'Priority Support'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-6 block text-center py-2.5 border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA
// ============================================================

function FinalCTA() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Ready to Land More Interviews?
        </h2>
        <p className="mt-4 text-base text-slate-500">
          Join 50,000+ professionals who have improved their career outcomes with Resume eOrbit.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/resume-builder"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-7 py-3.5 rounded-lg transition-colors"
          >
            Build My Resume <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ats-scanner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Free ATS Scan
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">No credit card required. Free plan available.</p>
      </div>
    </section>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <TemplateShowcase />
      <ATSSection />
      <AISection />
      <OnePlatformSection />
      <StatisticsSection />
      <TestimonialsSection />
      <CareerResearchSection />
      <PricingSection />
      <FinalCTA />
    </main>
  );
}
