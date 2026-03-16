import type { RequestUser } from '../common/types/request-user.type';
import { SupportService } from './support.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(user: RequestUser, dto: CreateTicketDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
        priority: import("@prisma/client").$Enums.TicketPriority;
        resolvedAt: Date | null;
        assignedTo: string | null;
    }>;
    getMyTickets(user: RequestUser, page?: string, limit?: string): Promise<{
        tickets: ({
            _count: {
                replies: number;
            };
            assignee: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            subject: string;
            priority: import("@prisma/client").$Enums.TicketPriority;
            resolvedAt: Date | null;
            assignedTo: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTicket(user: RequestUser, id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        assignee: {
            id: string;
            name: string;
        } | null;
        replies: ({
            user: {
                id: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            isAdmin: boolean;
            ticketId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
        priority: import("@prisma/client").$Enums.TicketPriority;
        resolvedAt: Date | null;
        assignedTo: string | null;
    }>;
    addReply(user: RequestUser, ticketId: string, dto: CreateReplyDto): Promise<{
        user: {
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isAdmin: boolean;
        ticketId: string;
    }>;
    closeTicket(user: RequestUser, ticketId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
        priority: import("@prisma/client").$Enums.TicketPriority;
        resolvedAt: Date | null;
        assignedTo: string | null;
    }>;
}
