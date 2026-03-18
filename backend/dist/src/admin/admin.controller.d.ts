import type { RequestUser } from '../common/types/request-user.type';
import { AdminService } from './admin.service';
import { UpdateTicketDto, CreateTicketReplyDto, TicketStatus } from './dto/support-ticket.dto';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from './dto/feature-flag.dto';
import { CreateDefaultCategoryDto, UpdateDefaultCategoryDto } from './dto/default-category.dto';
import { CreateAdminReportDto, ListAdminReportsQueryDto } from './dto/admin-report.dto';
import { CreateAdminNotificationBroadcastDto, ListAdminNotificationBroadcastsQueryDto } from './dto/admin-notification.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
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
    getAllUsersOverview(page?: string, limit?: string): Promise<{
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
    getUserActivitySummary(id: string): Promise<{
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
    getRecentChatMessages(limit?: string): Promise<{
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
    getAllTickets(page?: string, limit?: string, status?: TicketStatus): Promise<{
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
    updateTicket(id: string, dto: UpdateTicketDto, user: RequestUser): Promise<{
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
    replyToTicket(ticketId: string, dto: CreateTicketReplyDto, user: RequestUser): Promise<{
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
    getAdminLogs(page?: string, limit?: string, adminId?: string): Promise<{
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
    listReports(query: ListAdminReportsQueryDto): Promise<{
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
    createReport(dto: CreateAdminReportDto, user: RequestUser): Promise<{
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
    getReportById(id: string): Promise<{
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
    generateReport(id: string, user: RequestUser): Promise<{
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
    getAllFeatureFlags(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }[]>;
    createFeatureFlag(dto: CreateFeatureFlagDto, user: RequestUser): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    updateFeatureFlag(id: string, dto: UpdateFeatureFlagDto, user: RequestUser): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    toggleFeatureFlag(id: string, user: RequestUser): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        enabled: boolean;
    }>;
    deleteFeatureFlag(id: string, user: RequestUser): Promise<{
        message: string;
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
    createDefaultCategory(dto: CreateDefaultCategoryDto, user: RequestUser): Promise<{
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
    updateDefaultCategory(id: string, dto: UpdateDefaultCategoryDto, user: RequestUser): Promise<{
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
    deleteDefaultCategory(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
    listNotificationBroadcasts(query: ListAdminNotificationBroadcastsQueryDto): Promise<{
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
    broadcastNotification(dto: CreateAdminNotificationBroadcastDto, user: RequestUser): Promise<{
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
}
