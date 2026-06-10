import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const PDFParser = require('pdf2json');

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
        }
      }
      resolve(text);
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = '';

    if (file.name.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'No readable text found' }, { status: 400 });
    }

    // --- MOCK analysis based on extracted text ---
    const wordCount = extractedText.split(/\s+/).length;
    const atsScore = Math.min(95, Math.max(60, Math.floor(wordCount / 10) + 50));
    const readability = Math.min(9, Math.floor(atsScore / 10) + 1);
    const keywordGap = wordCount > 500
      ? 'Good keyword density, but missing "Cloud", "Automation"'
      : 'Text too short – add more details and keywords';
    const recommendations = [
      'Add more action verbs (e.g., "implemented", "optimized")',
      'Include a "Skills" section with technical keywords',
      'Use standard section headings: "Work Experience", "Education"',
      'Quantify achievements (e.g., "reduced response time by 30%")',
    ];

    // Return both analysis AND the extracted text for import
    return NextResponse.json({
      atsScore,
      keywordGap,
      readability,
      recommendations,
      extractedText   // <-- ADDED: raw text for auto‑fill
    });
  } catch (error: any) {
    console.error('ATS scan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze resume' }, { status: 500 });
  }
}