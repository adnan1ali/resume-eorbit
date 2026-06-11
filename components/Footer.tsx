import Link from 'next/link';
import { FileText } from 'lucide-react';

/**
 * Resume eOrbit — Professional Footer
 * 
 * Multi-column layout with all product areas, resources, and support links.
 * White-dominant, clean, enterprise-grade.
 */

const FOOTER_LINKS = {
  resume: {
    title: 'Resume',
    links: [
      { label: 'AI Resume Builder', href: '/resume-builder' },
      { label: 'Resume Templates', href: '/templates' },
      { label: 'Resume Examples', href: '/examples' },
      { label: 'ATS Scanner', href: '/ats-scanner' },
      { label: 'Resume Checker', href: '/resume-checker' },
    ],
  },
  coverLetter: {
    title: 'Cover Letter',
    links: [
      { label: 'Cover Letter Builder', href: '/cover-letter-builder' },
      { label: 'Cover Letter Generator', href: '/cover-letter-generator' },
      { label: 'Cover Letter Templates', href: '/cover-letter-templates' },
      { label: 'Cover Letter Examples', href: '/cover-letter-examples' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Career Guides', href: '/guides' },
      { label: 'Interview Guides', href: '/resources/interview' },
      { label: 'Salary Insights', href: '/salary-insights' },
      { label: 'Job Market Trends', href: '/job-market' },
      { label: 'Research Center', href: '/research' },
    ],
  },
  career: {
    title: 'Career Tools',
    links: [
      { label: 'Interview Coach', href: '/interview-coach' },
      { label: 'Job Tracker', href: '/workspace/tracker' },
      { label: 'Career Roadmaps', href: '/career-roadmaps' },
      { label: 'Skills Assessment', href: '/skills-assessment' },
      { label: 'AI Job Search', href: '/jobs' },
    ],
  },
  organizations: {
    title: 'Organizations',
    links: [
      { label: 'For Recruiters', href: '/organizations/recruitment' },
      { label: 'For Universities', href: '/organizations/universities' },
      { label: 'For Career Coaches', href: '/organizations/coaches' },
      { label: 'Enterprise', href: '/organizations/corporate' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo + Copyright */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-slate-400">
                &copy; {new Date().getFullYear()} Resume eOrbit. All rights reserved.
              </span>
            </div>

            {/* Languages / Region */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">English</span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs text-slate-400">العربية</span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs text-slate-400">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
