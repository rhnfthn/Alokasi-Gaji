import type { RequestUser } from '../common/types/request-user.type';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(user: RequestUser): Promise<import("./notifications.service").NotificationListItem[]>;
    get(user: RequestUser, id: string): Promise<import("./notifications.service").NotificationListItem>;
    markRead(user: RequestUser, id: string): Promise<import("./notifications.service").NotificationListItem>;
}
