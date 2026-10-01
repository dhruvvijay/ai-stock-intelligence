// ═══ NOTIFICATIONS API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationId } = body;

    if (action === 'read') {
      await prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
      return NextResponse.json({ success: true });
    }
    if (action === 'read-all') {
      await prisma.notification.updateMany({ where: { userId: USER_ID, read: false }, data: { read: true } });
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      await prisma.notification.delete({ where: { id: notificationId } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Notifications POST error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
