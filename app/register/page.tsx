'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User,
  Shield, Sparkles, CheckCircle, AlertCircle, Zap,
  Users, FileText, Target, Check, X
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
      } else {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password strength
  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(password) },
    { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
  ];
  const passwordStrength = passwordChecks.filter(c => c.valid).length;
  const getStrengthColor = () => {
    if (passwordStrength === 3) return 'bg-emerald-500';
    if (passwordStrength === 2) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  const getStrengthLabel = () => {
    if (passwordStrength === 3) return 'Strong';
    if (passwordStrength === 2) return 'Medium';
    if (password.length > 0) return 'Weak';
    return '';
  };

  return (
    <div className="min-h-screen flex">
      {/* ============================================================
          LEFT PANEL — Branding & Trust Signals (hidden on mobile)
          ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">Resume eOrbit</span>
            </Link>
          </div>

          {/* Main message */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Start building resumes<br />that actually work.
              </h2>
              <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-md">
                Join thousands of professionals who've landed their dream jobs with AI-powered, ATS-optimized resumes.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: FileText, text: 'Create unlimited resumes with AI assistance' },
                { icon: Shield, text: 'ATS-optimized templates that pass screening' },
                { icon: Target, text: 'Real-time feedback to improve your chances' },
                { icon: Zap, text: 'Build your first resume in under 5 minutes' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.12, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 flex-shrink-0">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/80">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/40">
            Free to start. No credit card required.
          </p>
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL — Register Form
          ============================================================ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Resume eOrbit</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Create your free account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Get started in seconds. No credit card needed.
            </p>
          </div>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl flex items-start gap-2.5"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{success}</p>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-800/40 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === 'name'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                  focused === 'name' ? 'text-indigo-500' : 'text-slate-400'
                }`} />
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Mohammed Al-Rashidi"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-10 pr-4 py-3 text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none rounded-xl"
                  required
                />
                {name.length >= 2 && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === 'email'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : !isEmailValid
                  ? 'border-rose-300 dark:border-rose-800'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                  focused === 'email' ? 'text-indigo-500' : 'text-slate-400'
                }`} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-10 pr-4 py-3 text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none rounded-xl"
                  required
                />
                {email && isEmailValid && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {!isEmailValid && (
                <p className="text-[10px] text-rose-500 font-medium pl-1">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === 'password'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                  focused === 'password' ? 'text-indigo-500' : 'text-slate-400'
                }`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-10 pr-11 py-3 text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-2"
                >
                  {/* Strength bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            i < passwordStrength ? getStrengthColor() : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${
                      passwordStrength === 3 ? 'text-emerald-500' : passwordStrength === 2 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {getStrengthLabel()}
                    </span>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1">
                    {passwordChecks.map((check, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        {check.valid ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <X className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                        )}
                        <span className={`text-[10px] font-medium ${
                          check.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                        }`}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !name || !email || !password || !isEmailValid}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                loading || !name || !email || !password || !isEmailValid
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-indigo-500 hover:text-indigo-600">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600">Privacy Policy</Link>.
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 font-medium">or</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>

          {/* Trust footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Free Plan</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 50K+ Users</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
