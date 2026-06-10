import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resume = await prisma.resume.findUnique({ where: { id: params.id } });
    if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (resume.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    await prisma.resume.delete({ where: { id: params.id } });
    await prisma.activityLog.create({ 
      data: { userId: session.user.id, action: 'DELETE_RESUME', details: params.id } 
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const resume = await prisma.resume.findUnique({ where: { id: params.id } });
    if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (resume.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const updated = await prisma.resume.update({
      where: { id: params.id },
      data: { 
        fullName: body.fullName, 
        jobTitle: body.jobTitle, 
        skills: body.skills, 
        summary: body.summary 
      },
    });
    await prisma.activityLog.create({ 
      data: { userId: session.user.id, action: 'UPDATE_RESUME', details: params.id } 
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}