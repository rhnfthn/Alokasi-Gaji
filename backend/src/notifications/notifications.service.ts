import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type NotificationListItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  fromName: string;
  broadcastId: string | null;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<NotificationListItem[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
        broadcastId: true,
        broadcast: {
          select: {
            type: true,
            createdBy: { select: { name: true } },
          },
        },
      },
    });

    return rows.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      type: n.broadcast?.type ?? 'INFO',
      read: Boolean(n.readAt),
      createdAt: n.createdAt,
      fromName: n.broadcast?.createdBy?.name ?? 'Admin',
      broadcastId: n.broadcastId,
    }));
  }

  async get(userId: string, id: string): Promise<NotificationListItem> {
    const n = await this.prisma.notification.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
        broadcastId: true,
        broadcast: {
          select: {
            type: true,
            createdBy: { select: { name: true } },
          },
        },
      },
    });

    if (!n) throw new NotFoundException('Notification not found');

    return {
      id: n.id,
      title: n.title,
      message: n.body,
      type: n.broadcast?.type ?? 'INFO',
      read: Boolean(n.readAt),
      createdAt: n.createdAt,
      fromName: n.broadcast?.createdBy?.name ?? 'Admin',
      broadcastId: n.broadcastId,
    };
  }

  async markRead(userId: string, id: string) {
    await this.get(userId, id);
    await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return this.get(userId, id);
  }
}
