import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session!.user as any).id;

    const {
      fullName,
      jobTitle,
      skills,
      summary,
    } = await req.json();

    const resume = await prisma.resume.create({
      data: {
        userId,
        fullName,
        jobTitle,
        skills,
        summary,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'CREATE_RESUME',
        details: JSON.stringify({
          resumeId: resume.id,
          title: fullName,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Save error:', error);

    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}