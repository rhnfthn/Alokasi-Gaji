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
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<NotificationListItem[]>;
    get(userId: string, id: string): Promise<NotificationListItem>;
    markRead(userId: string, id: string): Promise<NotificationListItem>;
}
