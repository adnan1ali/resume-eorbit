'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex gap-2">
      <button onClick={() => setTheme('light')} className="px-3 py-1 bg-gray-200 rounded">Light</button>
      <button onClick={() => setTheme('dark')} className="px-3 py-1 bg-gray-800 text-white rounded">Dark</button>
    </div>
  )
}