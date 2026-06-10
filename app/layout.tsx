import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './providers/session-provider';
import { ThemeProvider } from './providers/theme-provider';
import { Header } from '@/components/Header';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Resume eOrbit — AI Career Platform | ATS-Optimized Resumes',
  description: 'Build ATS-optimized resumes, scan your CV score, and land your dream job faster. Purpose-built for India, GCC, and South Asia professionals.',
  keywords: ['resume builder', 'ATS scanner', 'career platform', 'GCC jobs', 'AI resume', 'CV builder'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-50 transition-colors duration-300 selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200`}
      >
        <SessionProvider>
          <ThemeProvider>
            {/* Ambient Background Gradient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
              <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] rounded-full blur-[100px]" />
              <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] bg-purple-500/[0.04] dark:bg-purple-500/[0.02] rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-pink-500/[0.03] dark:bg-pink-500/[0.02] rounded-full blur-[100px]" />
            </div>

            {/* Global Header */}
            <Header />

            {/* Main Content Area */}
            <main className="relative min-h-[calc(100vh-4rem)] z-10">
              {children}
            </main>

            {/* Global Footer */}
            <footer className="relative z-10 border-t border-slate-200/60 dark:border-slate-800/40 bg-white/50 dark:bg-[#030712]/50 backdrop-blur-xl">
              <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">E</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      &copy; {new Date().getFullYear()} Resume eOrbit. Built for professionals.
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-medium text-slate-400 dark:text-slate-500">
                    <a href="/privacy" className="hover:text-indigo-500 transition-colors duration-200">Privacy</a>
                    <a href="/terms" className="hover:text-indigo-500 transition-colors duration-200">Terms</a>
                    <a href="/support" className="hover:text-indigo-500 transition-colors duration-200">Support</a>
                  </div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
