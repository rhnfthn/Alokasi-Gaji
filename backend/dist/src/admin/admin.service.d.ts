import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, CreateTicketReplyDto, TicketStatus } from './dto/support-ticket.dto';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from './dto/feature-flag.dto';
import { CreateDefaultCategoryDto, UpdateDefaultCategoryDto } from './dto/default-category.dto';
import { CreateAdminReportDto, ListAdminReportsQueryDto } from './dto/admin-report.dto';
import { CreateAdminNotificationBroadcastDto } from './dto/admin-notification.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    listAdminReports(query: ListAdminReportsQueryDto): Promise<{
        reports: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ReportType;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.ReportStatus;
            createdBy: {
                name: string;
                id: string;
                email: string;
            };
            dateFrom: Date | null;
            dateTo: Date | null;
            generatedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAdminReportById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import("@prisma/client/runtime/client").JsonValue;
        type: import("@prisma/client").$Enums.ReportType;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdBy: {
            name: string;
            id: string;
            email: string;
        };
        dateFrom: Date | null;
        dateTo: Date | null;
        generatedAt: Date | null;
    }>;
    createAdminReport(adminId: string, dto: CreateAdminReportDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ReportType;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ReportStatus;
        dateFrom: Date | null;
        dateTo: Date | null;
    }>;
    generateAdminReport(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: import("@prisma/client/runtime/client").JsonValue;
        type: import("@prisma/client").$Enums.ReportType;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ReportStatus;
        dateFrom: Date | null;
        dateTo: Date | null;
        generatedAt: Date | null;
    }>;
    private buildReportResult;
    getUserActivitySummary(userId: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
        stats: {
            totalTransactions: number;
            incomeCount: number;
            expenseCount: number;
            totalBudgets: number;
            totalGoals: number;
            walletCount: number;
            hasActivity: boolean;
        };
    }>;
    getAllUsersOverview(page?: number, limit?: number): Promise<{
        users: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            _count: {
                wallets: number;
                transactions: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
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
    getAllTickets(page?: number, limit?: number, status?: TicketStatus): Promise<{
        tickets: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
            _count: {
                replies: number;
            };
            assignee: {
                name: string;
                id: string;
                email: string;
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
    getTicketById(id: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        assignee: {
            name: string;
            id: string;
            email: string;
        } | null;
        replies: ({
            user: {
                name: string;
                id: string;
                email: string;
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
    updateTicket(id: string, adminId: string, dto: UpdateTicketDto): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        assignee: {
            name: string;
            id: string;
            email: string;
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
    }>;
    replyToTicket(ticketId: string, userId: string, dto: CreateTicketReplyDto, isAdmin: boolean): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isAdmin: boolean;
        ticketId: string;
    }>;
    getRecentChatMessages(limit?: number): Promise<{
        messages: {
            id: string;
            content: string;
            createdAt: Date;
            isAdminReply: boolean;
            user: {
                name: string;
                id: string;
                email: string;
            };
        }[];
    }>;
    logAdminAction(adminId: string, action: string, target: string, targetId?: string, details?: any, ipAddress?: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        target: string | null;
        targetId: string | null;
        details: string | null;
        ipAddress: string | null;
        adminId: string;
    }>;
    getAdminLogs(page?: number, limit?: number, adminId?: string): Promise<{
        logs: ({
            admin: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            target: string | null;
            targetId: string | null;
            details: string | null;
            ipAddress: string | null;
            adminId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createFeatureFlag(dto: CreateFeatureFlagDto, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    getAllFeatureFlags(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }[]>;
    updateFeatureFlag(id: string, dto: UpdateFeatureFlagDto, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    toggleFeatureFlag(id: string, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    deleteFeatureFlag(id: string, adminId: string): Promise<{
        message: string;
    }>;
    createDefaultCategory(dto: CreateDefaultCategoryDto, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    getAllDefaultCategories(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    getDefaultCategoryById(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    updateDefaultCategory(id: string, dto: UpdateDefaultCategoryDto, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    deleteDefaultCategory(id: string, adminId: string): Promise<{
        message: string;
    }>;
    listNotificationBroadcasts(page?: number, limit?: number): Promise<{
        broadcasts: {
            id: string;
            title: string;
            body: string;
            type: string;
            audience: string;
            status: string;
            createdAt: Date;
            createdBy: {
                name: string;
                id: string;
                email: string;
            };
            recipients: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    broadcastNotification(adminId: string, dto: CreateAdminNotificationBroadcastDto): Promise<{
        broadcast: {
            recipients: number;
            id: string;
            createdAt: Date;
            audience: string;
            type: string;
            title: string;
            body: string;
            status: string;
            createdBy: {
                name: string;
                id: string;
                email: string;
            };
        };
    }>;
    getAdminDashboardStats(): Promise<{
        users: {
            total: number;
            newToday: number;
        };
        tickets: {
            total: number;
            open: number;
        };
        featureFlags: {
            total: number;
            enabled: number;
        };
    }>;
}
