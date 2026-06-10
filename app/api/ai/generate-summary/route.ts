import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { jobTitle, skills } = await req.json();
  // Mock summary – no API key needed
  const summary = `Experienced ${jobTitle} with expertise in ${skills}. Proven track record of delivering high-impact results.`;
  return NextResponse.json({ summary });
}