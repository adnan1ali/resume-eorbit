import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

/**
 * GET /api/resume/list
 *
 * SECURITY FIX: Scopes all queries to the authenticated user.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = (session!.user as any).id;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = { userId };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { skills: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'fullName',
      'jobTitle',
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const resumes = await prisma.resume.findMany({
      where,
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      select: {
        id: true,
        fullName: true,
        jobTitle: true,
        skills: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Fetch resumes error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}