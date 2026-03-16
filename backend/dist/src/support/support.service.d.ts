import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string, dto: CreateTicketDto): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
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
    getUserTickets(userId: string, page?: number, limit?: number): Promise<{
        tickets: ({
            _count: {
                replies: number;
            };
            assignee: {
                name: string;
                id: string;
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
    getTicketById(ticketId: string, userId: string): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        assignee: {
            name: string;
            id: string;
        } | null;
        replies: ({
            user: {
                name: string;
                id: string;
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
    }) | null>;
    addReply(ticketId: string, userId: string, dto: CreateReplyDto): Promise<{
        user: {
            name: string;
            id: string;
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
    closeTicket(ticketId: string, userId: string): Promise<{
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
