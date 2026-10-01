// ═══ LEARNING CENTER API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const lessonId = searchParams.get('lessonId');

    // Single lesson with quiz
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          quizQuestions: { orderBy: { sortOrder: 'asc' } },
          module: { select: { title: true, id: true } },
          progress: { where: { userId: USER_ID } },
        },
      });
      if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

      return NextResponse.json({
        lesson: {
          ...lesson,
          quizQuestions: lesson.quizQuestions.map(q => ({
            ...q, options: JSON.parse(q.options),
          })),
          isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
          score: lesson.progress[0]?.score,
        },
      });
    }

    // Single module with all lessons
    if (moduleId) {
      const module = await prisma.learningModule.findUnique({
        where: { id: moduleId },
        include: {
          lessons: {
            orderBy: { sortOrder: 'asc' },
            include: {
              progress: { where: { userId: USER_ID } },
              _count: { select: { quizQuestions: true } },
            },
          },
        },
      });
      if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

      const completedCount = module.lessons.filter(l => l.progress.some(p => p.completed)).length;
      return NextResponse.json({
        module: {
          ...module,
          lessons: module.lessons.map(l => ({
            id: l.id, title: l.title, type: l.type, estimatedTime: l.estimatedTime,
            sortOrder: l.sortOrder, quizCount: l._count.quizQuestions,
            isCompleted: l.progress.some(p => p.completed),
            score: l.progress[0]?.score,
          })),
          progress: {
            completed: completedCount,
            total: module.lessons.length,
            percentage: module.lessons.length > 0 ? Math.round((completedCount / module.lessons.length) * 100) : 0,
          },
        },
      });
    }

    // All modules overview
    const modules = await prisma.learningModule.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        lessons: {
          include: { progress: { where: { userId: USER_ID } } },
        },
      },
    });

    return NextResponse.json({
      modules: modules.map(m => {
        const completedLessons = m.lessons.filter(l => l.progress.some(p => p.completed)).length;
        return {
          id: m.id, title: m.title, description: m.description, icon: m.icon,
          difficulty: m.difficulty, category: m.category, estimatedTime: m.estimatedTime,
          lessonsCount: m.lessons.length,
          progress: {
            completed: completedLessons,
            total: m.lessons.length,
            percentage: m.lessons.length > 0 ? Math.round((completedLessons / m.lessons.length) * 100) : 0,
          },
        };
      }),
    });
  } catch (error) {
    console.error('Learning API error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning data' }, { status: 500 });
  }
}

// Mark lesson as complete / submit quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, lessonId, score } = body;

    if (action === 'complete') {
      await prisma.learningProgress.upsert({
        where: { userId_lessonId: { userId: USER_ID, lessonId } },
        create: { userId: USER_ID, lessonId, completed: true, score, completedAt: new Date() },
        update: { completed: true, score, completedAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Learning POST error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
