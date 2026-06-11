/**
 * Resume eOrbit — Real ATS Analysis Engine
 * 
 * This module provides comprehensive resume analysis including:
 * - Keyword matching against job descriptions
 * - ATS formatting validation
 * - Contact information validation
 * - Section completeness scoring
 * - Impact verb analysis
 * - Readability scoring
 * - Role-specific scoring
 * 
 * Architecture:
 *   ATSEngine.analyze(resumeText, jobDescription?) → ATSReport
 */

// ============================================================
// TYPES
// ============================================================

export interface ATSReport {
  overallScore: number;
  breakdown: {
    keywordMatch: ScoredSection;
    formatting: ScoredSection;
    contactInfo: ScoredSection;
    sections: ScoredSection;
    impactVerbs: ScoredSection;
    readability: ScoredSection;
    completeness: ScoredSection;
    roleSpecific: ScoredSection;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  detectedSections: { name: string; found: boolean }[];
  recommendations: Recommendation[];
  recruiterConcerns: string[];
  experienceAnalysis: ExperienceAnalysis;
  contactValidation: ContactValidation;
}

export interface ScoredSection {
  score: number; // 0-100
  label: string;
  details: string[];
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  message: string;
  fix?: string;
}

export interface ExperienceAnalysis {
  totalYears: number;
  hasQuantifiedAchievements: boolean;
  quantifiedCount: number;
  weakBullets: string[];
  strongBullets: string[];
}

export interface ContactValidation {
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasLocation: boolean;
  issues: string[];
}

// ============================================================
// CONSTANTS
// ============================================================

const REQUIRED_SECTIONS = [
  'Contact Information',
  'Professional Summary',
  'Work Experience',
  'Education',
  'Skills',
];

const OPTIONAL_SECTIONS = [
  'Certifications',
  'Projects',
  'Languages',
  'Awards',
  'References',
  'Volunteer Experience',
];

const SECTION_PATTERNS: Record<string, RegExp[]> = {
  'Contact Information': [/email|phone|mobile|address|linkedin|github/i],
  'Professional Summary': [/summary|objective|profile|about\s*me|professional\s*summary/i],
  'Work Experience': [/experience|employment|work\s*history|professional\s*experience/i],
  'Education': [/education|academic|qualification|degree/i],
  'Skills': [/skills|technical\s*skills|competencies|expertise|proficiencies/i],
  'Certifications': [/certif|accreditation|license/i],
  'Projects': [/project|portfolio/i],
  'Languages': [/language/i],
  'Awards': [/award|honor|achievement|recognition/i],
  'References': [/reference/i],
  'Volunteer Experience': [/volunteer|community/i],
};

const STRONG_ACTION_VERBS = [
  'achieved', 'accelerated', 'architected', 'automated', 'built', 'consolidated',
  'decreased', 'delivered', 'designed', 'developed', 'drove', 'eliminated',
  'engineered', 'established', 'exceeded', 'expanded', 'generated', 'grew',
  'implemented', 'improved', 'increased', 'initiated', 'launched', 'led',
  'managed', 'maximized', 'migrated', 'minimized', 'negotiated', 'optimized',
  'orchestrated', 'overhauled', 'pioneered', 'produced', 'reduced', 'redesigned',
  'resolved', 'revamped', 'scaled', 'secured', 'spearheaded', 'streamlined',
  'strengthened', 'surpassed', 'transformed', 'upgraded',
];

const WEAK_VERBS = [
  'helped', 'assisted', 'worked on', 'was responsible for', 'participated in',
  'involved in', 'handled', 'dealt with', 'did', 'made', 'got',
];

const ATS_BREAKING_PATTERNS = [
  { pattern: /[│┃┆┊║┇┋]/g, issue: 'Contains box-drawing characters that break ATS parsing' },
  { pattern: /[\u2022\u2023\u25E6\u2043\u2219]/g, issue: 'Uses non-standard bullet characters (use • or - only)' },
  { pattern: /\t{2,}/g, issue: 'Contains multiple tabs that may misalign in ATS systems' },
  { pattern: /(.)\1{4,}/g, issue: 'Contains repeated characters that may indicate formatting artifacts' },
];

// Cloud/Azure specific keywords for IT roles
const CLOUD_KEYWORDS = [
  'azure', 'aws', 'gcp', 'cloud', 'iaas', 'paas', 'saas',
  'virtual machine', 'vm', 'kubernetes', 'docker', 'terraform',
  'ansible', 'ci/cd', 'devops', 'microservices', 'serverless',
  'azure ad', 'active directory', 'entra id', 'intune', 'sccm',
  'office 365', 'microsoft 365', 'm365', 'exchange online',
  'sharepoint', 'teams', 'power automate', 'power bi',
  'azure monitor', 'log analytics', 'sentinel', 'defender',
  'networking', 'vnet', 'nsg', 'load balancer', 'vpn',
  'firewall', 'dns', 'dhcp', 'tcp/ip', 'subnetting',
  'itil', 'itsm', 'servicenow', 'jira', 'ticketing',
  'sla', 'incident management', 'change management',
  'backup', 'disaster recovery', 'high availability',
  'powershell', 'bash', 'python', 'automation',
  'windows server', 'linux', 'vmware', 'hyper-v',
];

// ============================================================
// MAIN ENGINE CLASS
// ============================================================

export class ATSEngine {
  /**
   * Analyze a resume against an optional job description.
   */
  static analyze(resumeText: string, jobDescription?: string): ATSReport {
    const normalizedResume = resumeText.trim();
    const normalizedJD = jobDescription?.trim() || '';

    // Run all analysis modules
    const keywordMatch = this.analyzeKeywords(normalizedResume, normalizedJD);
    const formatting = this.analyzeFormatting(normalizedResume);
    const contactInfo = this.analyzeContact(normalizedResume);
    const sections = this.analyzeSections(normalizedResume);
    const impactVerbs = this.analyzeImpactVerbs(normalizedResume);
    const readability = this.analyzeReadability(normalizedResume);
    const completeness = this.analyzeCompleteness(normalizedResume);
    const roleSpecific = this.analyzeRoleSpecific(normalizedResume, normalizedJD);
    const experienceAnalysis = this.analyzeExperience(normalizedResume);
    const contactValidation = this.validateContact(normalizedResume);

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      keywordMatch.score * 0.25 +
      formatting.score * 0.10 +
      contactInfo.score * 0.10 +
      sections.score * 0.15 +
      impactVerbs.score * 0.15 +
      readability.score * 0.05 +
      completeness.score * 0.10 +
      roleSpecific.score * 0.10
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      keywordMatch,
      formatting,
      contactInfo,
      sections,
      impactVerbs,
      readability,
      completeness,
      roleSpecific,
      experienceAnalysis,
    });

    // Generate recruiter concerns
    const recruiterConcerns = this.generateRecruiterConcerns(
      normalizedResume,
      experienceAnalysis,
      contactValidation,
      sections
    );

    return {
      overallScore,
      breakdown: {
        keywordMatch,
        formatting,
        contactInfo,
        sections,
        impactVerbs,
        readability,
        completeness,
        roleSpecific,
      },
      matchedKeywords: keywordMatch.details.filter(d => d.startsWith('✓')).map(d => d.replace('✓ ', '')),
      missingKeywords: keywordMatch.details.filter(d => d.startsWith('✗')).map(d => d.replace('✗ Missing: ', '')),
      detectedSections: [...REQUIRED_SECTIONS, ...OPTIONAL_SECTIONS].map(name => ({
        name,
        found: this.isSectionPresent(normalizedResume, name),
      })),
      recommendations,
      recruiterConcerns,
      experienceAnalysis,
      contactValidation,
    };
  }

  // ============================================================
  // KEYWORD ANALYSIS
  // ============================================================

  private static analyzeKeywords(resume: string, jobDescription: string): ScoredSection {
    const resumeLower = resume.toLowerCase();
    const details: string[] = [];

    // If no job description provided, use cloud/IT keywords as baseline
    let targetKeywords: string[];

    if (jobDescription) {
      targetKeywords = this.extractKeywordsFromJD(jobDescription);
    } else {
      // Detect role from resume and use appropriate keyword set
      targetKeywords = this.detectRoleKeywords(resumeLower);
    }

    let matched = 0;
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const keyword of targetKeywords) {
      if (resumeLower.includes(keyword.toLowerCase())) {
        matched++;
        matchedKeywords.push(keyword);
        details.push(`✓ ${keyword}`);
      } else {
        missingKeywords.push(keyword);
        details.push(`✗ Missing: ${keyword}`);
      }
    }

    const score = targetKeywords.length > 0
      ? Math.round((matched / targetKeywords.length) * 100)
      : 50;

    return {
      score: Math.min(100, score),
      label: 'Keyword Match',
      details: [
        ...details.filter(d => d.startsWith('✗')).slice(0, 10),
        ...details.filter(d => d.startsWith('✓')).slice(0, 10),
      ],
    };
  }

  private static extractKeywordsFromJD(jd: string): string[] {
    const jdLower = jd.toLowerCase();
    const words = jdLower.split(/[\s,;.()[\]{}|/\\]+/).filter(w => w.length > 2);

    // Extract multi-word phrases
    const phrases: string[] = [];
    const twoWordPattern = /\b([a-z]+\s[a-z]+)\b/gi;
    let match;
    while ((match = twoWordPattern.exec(jdLower)) !== null) {
      if (match[1].length > 5) phrases.push(match[1]);
    }

    // Combine with known technical terms
    const allKeywords = [...new Set([...CLOUD_KEYWORDS.filter(k => jdLower.includes(k)), ...phrases.slice(0, 20)])];
    return allKeywords.slice(0, 30);
  }

  private static detectRoleKeywords(resumeLower: string): string[] {
    // Detect if this is a cloud/IT resume
    const cloudIndicators = ['azure', 'aws', 'cloud', 'network', 'server', 'support engineer', 'noc', 'it support'];
    const isCloudIT = cloudIndicators.some(ind => resumeLower.includes(ind));

    if (isCloudIT) {
      return CLOUD_KEYWORDS.slice(0, 25);
    }

    // Generic professional keywords
    return [
      'leadership', 'management', 'strategy', 'communication', 'teamwork',
      'problem-solving', 'analytical', 'project management', 'stakeholder',
      'budget', 'deadline', 'cross-functional', 'data-driven', 'agile',
    ];
  }

  // ============================================================
  // FORMATTING ANALYSIS
  // ============================================================

  private static analyzeFormatting(resume: string): ScoredSection {
    let score = 100;
    const details: string[] = [];

    // Check for ATS-breaking patterns
    for (const { pattern, issue } of ATS_BREAKING_PATTERNS) {
      if (pattern.test(resume)) {
        score -= 15;
        details.push(`⚠ ${issue}`);
      }
    }

    // Check line length (ATS prefers lines under 80 chars for plain text)
    const lines = resume.split('\n');
    const longLines = lines.filter(l => l.length > 120).length;
    if (longLines > 5) {
      score -= 10;
      details.push(`⚠ ${longLines} lines exceed 120 characters — may wrap poorly in ATS`);
    }

    // Check for excessive whitespace
    const doubleBlankLines = (resume.match(/\n{3,}/g) || []).length;
    if (doubleBlankLines > 3) {
      score -= 5;
      details.push('⚠ Excessive blank lines detected — tighten spacing');
    }

    // Check word count (too short or too long)
    const wordCount = resume.split(/\s+/).length;
    if (wordCount < 200) {
      score -= 20;
      details.push('⚠ Resume is too short (under 200 words) — add more detail');
    } else if (wordCount > 1200) {
      score -= 10;
      details.push('⚠ Resume exceeds 1200 words — consider condensing for a 2-page max');
    }

    // Check for consistent date formatting
    const datePatterns = resume.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}\b/gi) || [];
    const isoPatterns = resume.match(/\b\d{4}\s*[-–]\s*\d{4}\b/g) || [];
    if (datePatterns.length > 0 && isoPatterns.length > 0) {
      score -= 5;
      details.push('⚠ Inconsistent date formats detected — use one format throughout');
    }

    if (details.length === 0) {
      details.push('✓ No ATS-breaking formatting issues detected');
    }

    return { score: Math.max(0, score), label: 'ATS Formatting', details };
  }

  // ============================================================
  // CONTACT INFORMATION ANALYSIS
  // ============================================================

  private static analyzeContact(resume: string): ScoredSection {
    let score = 0;
    const details: string[] = [];

    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resume);
    const hasPhone = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(resume);
    const hasLinkedIn = /linkedin\.com\/in\//i.test(resume);
    const hasLocation = /\b(city|state|country|dubai|riyadh|abu dhabi|mumbai|bangalore|delhi|hyderabad|chennai|pune|doha|muscat|kuwait|jeddah|sharjah)\b/i.test(resume);

    if (hasEmail) { score += 30; details.push('✓ Email address found'); }
    else { details.push('✗ No email address detected'); }

    if (hasPhone) { score += 25; details.push('✓ Phone number found'); }
    else { details.push('✗ No phone number detected'); }

    if (hasLinkedIn) { score += 25; details.push('✓ LinkedIn profile found'); }
    else { details.push('✗ No LinkedIn URL — strongly recommended'); }

    if (hasLocation) { score += 20; details.push('✓ Location/city detected'); }
    else { details.push('✗ No location detected — recruiters filter by location'); }

    return { score, label: 'Contact Information', details };
  }

  // ============================================================
  // SECTION ANALYSIS
  // ============================================================

  private static analyzeSections(resume: string): ScoredSection {
    let score = 0;
    const details: string[] = [];
    const totalRequired = REQUIRED_SECTIONS.length;
    let foundRequired = 0;

    for (const section of REQUIRED_SECTIONS) {
      if (this.isSectionPresent(resume, section)) {
        foundRequired++;
        details.push(`✓ ${section}`);
      } else {
        details.push(`✗ Missing: ${section}`);
      }
    }

    // Required sections are worth 80% of the score
    score = Math.round((foundRequired / totalRequired) * 80);

    // Optional sections add bonus points
    let foundOptional = 0;
    for (const section of OPTIONAL_SECTIONS) {
      if (this.isSectionPresent(resume, section)) {
        foundOptional++;
      }
    }
    score += Math.min(20, foundOptional * 5);

    return { score: Math.min(100, score), label: 'Resume Sections', details };
  }

  private static isSectionPresent(resume: string, sectionName: string): boolean {
    const patterns = SECTION_PATTERNS[sectionName];
    if (!patterns) return false;
    return patterns.some(p => p.test(resume));
  }

  // ============================================================
  // IMPACT VERB ANALYSIS
  // ============================================================

  private static analyzeImpactVerbs(resume: string): ScoredSection {
    const resumeLower = resume.toLowerCase();
    const details: string[] = [];

    // Count strong verbs
    const foundStrong = STRONG_ACTION_VERBS.filter(v => resumeLower.includes(v));
    // Count weak verbs
    const foundWeak = WEAK_VERBS.filter(v => resumeLower.includes(v));

    const strongCount = foundStrong.length;
    const weakCount = foundWeak.length;

    let score = Math.min(100, strongCount * 8);

    if (weakCount > 0) {
      score -= weakCount * 10;
      details.push(`⚠ Found ${weakCount} weak verbs: ${foundWeak.slice(0, 5).join(', ')}`);
      details.push('→ Replace with strong action verbs (achieved, implemented, optimized)');
    }

    if (strongCount > 0) {
      details.push(`✓ Found ${strongCount} strong action verbs: ${foundStrong.slice(0, 5).join(', ')}`);
    } else {
      details.push('✗ No strong action verbs detected — resume lacks impact');
    }

    return { score: Math.max(0, Math.min(100, score)), label: 'Impact Verbs', details };
  }

  // ============================================================
  // READABILITY ANALYSIS
  // ============================================================

  private static analyzeReadability(resume: string): ScoredSection {
    const sentences = resume.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = resume.split(/\s+/).filter(w => w.length > 0);
    const details: string[] = [];

    if (sentences.length === 0 || words.length === 0) {
      return { score: 0, label: 'Readability', details: ['✗ Unable to analyze — insufficient text'] };
    }

    const avgWordsPerSentence = words.length / sentences.length;
    let score = 80;

    // Optimal: 15-25 words per sentence
    if (avgWordsPerSentence > 30) {
      score -= 20;
      details.push('⚠ Sentences are too long (avg > 30 words) — break into shorter bullets');
    } else if (avgWordsPerSentence < 8) {
      score -= 10;
      details.push('⚠ Sentences are very short — add more context to achievements');
    } else {
      score += 20;
      details.push('✓ Good sentence length for ATS readability');
    }

    // Check for jargon density
    const jargonWords = words.filter(w => w.length > 15).length;
    if (jargonWords > 10) {
      score -= 10;
      details.push('⚠ High density of very long words — ensure readability for non-technical recruiters');
    }

    return { score: Math.max(0, Math.min(100, score)), label: 'Readability', details };
  }

  // ============================================================
  // COMPLETENESS ANALYSIS
  // ============================================================

  private static analyzeCompleteness(resume: string): ScoredSection {
    const wordCount = resume.split(/\s+/).length;
    const details: string[] = [];
    let score = 0;

    // Word count scoring
    if (wordCount >= 400 && wordCount <= 900) {
      score += 40;
      details.push('✓ Resume length is optimal (400-900 words)');
    } else if (wordCount >= 200) {
      score += 20;
      details.push('⚠ Resume could be more detailed');
    } else {
      details.push('✗ Resume is too short — add more content');
    }

    // Check for quantified achievements
    const numbers = resume.match(/\d+%|\$[\d,]+|\d+\+?\s*(years?|months?|clients?|projects?|team|people|users?)/gi) || [];
    if (numbers.length >= 5) {
      score += 30;
      details.push(`✓ ${numbers.length} quantified achievements found`);
    } else if (numbers.length >= 2) {
      score += 15;
      details.push(`⚠ Only ${numbers.length} quantified achievements — aim for 5+`);
    } else {
      details.push('✗ No quantified achievements — add metrics (%, $, numbers)');
    }

    // Check for bullet points (structured content)
    const bullets = (resume.match(/^[\s]*[•\-\*▪]/gm) || []).length;
    if (bullets >= 8) {
      score += 30;
      details.push('✓ Well-structured with bullet points');
    } else if (bullets >= 3) {
      score += 15;
      details.push('⚠ Add more bullet points for better scannability');
    } else {
      details.push('✗ Lacks bullet point structure — use bullets for experience');
    }

    return { score: Math.min(100, score), label: 'Completeness', details };
  }

  // ============================================================
  // ROLE-SPECIFIC ANALYSIS
  // ============================================================

  private static analyzeRoleSpecific(resume: string, jobDescription: string): ScoredSection {
    const resumeLower = resume.toLowerCase();
    const details: string[] = [];
    let score = 70; // Base score

    // Detect IT/Cloud roles
    const isCloudRole = ['azure', 'aws', 'cloud', 'devops', 'sre', 'infrastructure'].some(k => resumeLower.includes(k));
    const isITSupport = ['it support', 'helpdesk', 'service desk', 'noc', 'technical support'].some(k => resumeLower.includes(k));

    if (isCloudRole || isITSupport) {
      // Check for certifications
      const hasCerts = /\b(az-\d{3}|aws\s*(certified|solutions)|ccna|ccnp|comptia|itil|mcsa|mcse)\b/i.test(resume);
      if (hasCerts) {
        score += 15;
        details.push('✓ Relevant certifications detected');
      } else {
        score -= 10;
        details.push('✗ No cloud/IT certifications found — AZ-900, AZ-104, AWS SAA strongly recommended');
      }

      // Check for tools
      const tools = ['powershell', 'terraform', 'ansible', 'docker', 'kubernetes', 'git'];
      const foundTools = tools.filter(t => resumeLower.includes(t));
      if (foundTools.length >= 3) {
        score += 10;
        details.push(`✓ Technical tools mentioned: ${foundTools.join(', ')}`);
      } else {
        details.push(`⚠ Only ${foundTools.length} technical tools mentioned — add more`);
      }

      // Check for SLA/metrics
      const hasSLA = /sla|uptime|99\.\d+%|mttr|mttf/i.test(resume);
      if (hasSLA) {
        score += 5;
        details.push('✓ SLA/uptime metrics mentioned');
      } else {
        details.push('⚠ No SLA or uptime metrics — quantify your reliability impact');
      }
    }

    if (details.length === 0) {
      details.push('✓ General role analysis complete');
    }

    return { score: Math.max(0, Math.min(100, score)), label: 'Role-Specific', details };
  }

  // ============================================================
  // EXPERIENCE ANALYSIS
  // ============================================================

  private static analyzeExperience(resume: string): ExperienceAnalysis {
    const yearPattern = /\b(20\d{2}|19\d{2})\b/g;
    const years = [...resume.matchAll(yearPattern)].map(m => parseInt(m[0]));
    const totalYears = years.length >= 2 ? Math.max(...years) - Math.min(...years) : 0;

    // Find quantified achievements
    const quantifiedPattern = /\d+%|\$[\d,]+|\d+x|\d+\+?\s*(years?|months?|clients?|projects?|team|people|users?|tickets?|incidents?)/gi;
    const quantified = resume.match(quantifiedPattern) || [];

    // Find bullet points
    const bullets = resume.split(/\n/).filter(l => /^[\s]*[•\-\*▪]/.test(l));

    // Categorize bullets
    const weakBullets: string[] = [];
    const strongBullets: string[] = [];

    for (const bullet of bullets.slice(0, 20)) {
      const bulletLower = bullet.toLowerCase().trim();
      const hasWeakVerb = WEAK_VERBS.some(v => bulletLower.includes(v));
      const hasStrongVerb = STRONG_ACTION_VERBS.some(v => bulletLower.includes(v));
      const hasNumber = /\d/.test(bullet);

      if (hasWeakVerb && !hasNumber) {
        weakBullets.push(bullet.trim().substring(0, 80));
      } else if (hasStrongVerb && hasNumber) {
        strongBullets.push(bullet.trim().substring(0, 80));
      }
    }

    return {
      totalYears,
      hasQuantifiedAchievements: quantified.length > 0,
      quantifiedCount: quantified.length,
      weakBullets: weakBullets.slice(0, 5),
      strongBullets: strongBullets.slice(0, 5),
    };
  }

  // ============================================================
  // CONTACT VALIDATION
  // ============================================================

  private static validateContact(resume: string): ContactValidation {
    const issues: string[] = [];

    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resume);
    const hasPhone = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(resume);
    const hasLinkedIn = /linkedin\.com\/in\//i.test(resume);
    const hasLocation = /\b(city|state|country|dubai|riyadh|abu dhabi|mumbai|bangalore|delhi|hyderabad|chennai|pune|doha|muscat|kuwait|jeddah|sharjah|india|uae|saudi|qatar|oman|bahrain)\b/i.test(resume);

    if (!hasEmail) issues.push('Email address is missing — this is critical for recruiter contact');
    if (!hasPhone) issues.push('Phone number is missing — add with country code for GCC applications');
    if (!hasLinkedIn) issues.push('LinkedIn URL is missing — 87% of recruiters check LinkedIn profiles');
    if (!hasLocation) issues.push('Location/city is missing — many roles require location-based filtering');

    return { hasEmail, hasPhone, hasLinkedIn, hasLocation, issues };
  }

  // ============================================================
  // RECOMMENDATION GENERATOR
  // ============================================================

  private static generateRecommendations(analysis: any): Recommendation[] {
    const recs: Recommendation[] = [];

    // Critical recommendations
    if (analysis.contactInfo.score < 50) {
      recs.push({
        priority: 'critical',
        category: 'Contact',
        message: 'Your contact information is incomplete. Recruiters cannot reach you.',
        fix: 'Add email, phone (with country code), LinkedIn URL, and city/country.',
      });
    }

    if (analysis.sections.score < 60) {
      recs.push({
        priority: 'critical',
        category: 'Structure',
        message: 'Missing essential resume sections. ATS systems may reject your resume.',
        fix: 'Ensure you have: Professional Summary, Work Experience, Education, and Skills sections with clear headings.',
      });
    }

    // High priority
    if (analysis.keywordMatch.score < 50) {
      recs.push({
        priority: 'high',
        category: 'Keywords',
        message: 'Your resume has a low keyword match rate. ATS systems filter based on keywords.',
        fix: 'Review the missing keywords list and naturally incorporate them into your experience bullets.',
      });
    }

    if (analysis.impactVerbs.score < 50) {
      recs.push({
        priority: 'high',
        category: 'Impact',
        message: 'Your resume uses weak language that fails to convey impact.',
        fix: 'Replace "helped", "worked on", "responsible for" with "implemented", "delivered", "optimized".',
      });
    }

    if (!analysis.experienceAnalysis.hasQuantifiedAchievements) {
      recs.push({
        priority: 'high',
        category: 'Achievements',
        message: 'No quantified achievements found. Recruiters prioritize measurable impact.',
        fix: 'Add numbers: "Reduced ticket resolution time by 40%", "Managed 500+ endpoints", "Achieved 99.9% uptime".',
      });
    }

    // Medium priority
    if (analysis.formatting.score < 80) {
      recs.push({
        priority: 'medium',
        category: 'Formatting',
        message: 'Formatting issues detected that may cause ATS parsing errors.',
        fix: 'Use standard characters, consistent date formats, and avoid tables or columns.',
      });
    }

    if (analysis.readability.score < 60) {
      recs.push({
        priority: 'medium',
        category: 'Readability',
        message: 'Resume readability needs improvement for both ATS and human reviewers.',
        fix: 'Keep bullet points to 1-2 lines. Use clear, concise language.',
      });
    }

    // Low priority
    if (analysis.completeness.score < 70) {
      recs.push({
        priority: 'low',
        category: 'Completeness',
        message: 'Resume could benefit from additional detail and structure.',
        fix: 'Add certifications, projects, or volunteer work to strengthen your profile.',
      });
    }

    return recs;
  }

  // ============================================================
  // RECRUITER CONCERNS GENERATOR
  // ============================================================

  private static generateRecruiterConcerns(
    resume: string,
    experience: ExperienceAnalysis,
    contact: ContactValidation,
    sections: ScoredSection
  ): string[] {
    const concerns: string[] = [];

    if (experience.totalYears < 2) {
      concerns.push('Limited professional experience detected — may not meet minimum requirements for mid-level roles.');
    }

    if (experience.weakBullets.length > 3) {
      concerns.push('Multiple bullet points describe duties rather than achievements — fails to demonstrate value.');
    }

    if (!contact.hasLinkedIn) {
      concerns.push('No LinkedIn profile — recruiter may question online presence and professional network.');
    }

    if (experience.quantifiedCount < 3) {
      concerns.push('Lack of measurable achievements — difficult to assess candidate impact in previous roles.');
    }

    const wordCount = resume.split(/\s+/).length;
    if (wordCount > 1000) {
      concerns.push('Resume is excessively long — suggests inability to communicate concisely.');
    }

    // Check for employment gaps (simplified)
    const yearPattern = /\b(20\d{2})\b/g;
    const years = [...new Set([...resume.matchAll(yearPattern)].map(m => parseInt(m[0])))].sort();
    for (let i = 1; i < years.length; i++) {
      if (years[i] - years[i - 1] > 2) {
        concerns.push(`Potential employment gap detected between ${years[i - 1]} and ${years[i]}.`);
        break;
      }
    }

    return concerns;
  }
}

export default ATSEngine;
