'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'light' && <Sun className="h-4 w-4" />}
      {theme === 'system' && <Monitor className="h-4 w-4" />}
    </button>
  );
}
