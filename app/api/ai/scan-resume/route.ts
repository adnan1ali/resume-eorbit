import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ATSEngine } from '@/lib/ats-engine';
import mammoth from 'mammoth';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const PDFParser = require('pdf2json');

/**
 * POST /api/ai/scan-resume
 * 
 * Real ATS analysis engine. Accepts a resume file (PDF/DOCX) and an optional
 * job description, then returns a comprehensive ATS compatibility report.
 */

// Helper to extract text from PDF using pdf2json
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', (err: any) => reject(err));
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      let text = '';
      if (pdfData && pdfData.Pages) {
        for (const page of pdfData.Pages) {
          if (page.Texts) {
            for (const textObj of page.Texts) {
              const raw = textObj.R[0].T;
              let decoded = raw;
              try {
                decoded = decodeURIComponent(raw);
              } catch (e) {
                // keep raw if decoding fails
              }
              text += decoded + ' ';
            }
          }
          text += '\n\n'; // Page break
        }
      }
      resolve(text.trim());
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate (optional but recommended for rate limiting)
    const session = await getServerSession(authOptions);

    // Rate limiting: unauthenticated users get 3 scans, authenticated get unlimited
    // (In production, implement Redis-based rate limiting here)

    // 2. Parse the uploaded file
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please upload a PDF or DOCX resume.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }

    // 3. Extract text from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = '';

    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(buffer);
    } else if (fileExtension === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Unable to extract sufficient text from the file. Ensure the document contains readable text (not scanned images).' },
        { status: 400 }
      );
    }

    // 4. Run the ATS Engine
    const report = ATSEngine.analyze(extractedText, jobDescription || undefined);

    // 5. Return the comprehensive report
    return NextResponse.json({
      success: true,
      report: {
        overallScore: report.overallScore,
        breakdown: report.breakdown,
        matchedKeywords: report.matchedKeywords,
        missingKeywords: report.missingKeywords,
        detectedSections: report.detectedSections,
        recommendations: report.recommendations,
        recruiterConcerns: report.recruiterConcerns,
        experienceAnalysis: report.experienceAnalysis,
        contactValidation: report.contactValidation,
      },
      extractedText, // Return for potential import into builder
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        wordCount: extractedText.split(/\s+/).length,
        analyzedAt: new Date().toISOString(),
        userId: (session?.user as any)?.id || 'anonymous',
      },
    });
  } catch (error: any) {
    console.error('[API] ATS scan error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again or upload a different file.' },
      { status: 500 }
    );
  }
}
