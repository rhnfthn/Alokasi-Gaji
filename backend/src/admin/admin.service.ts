import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTicketDto,
  UpdateTicketDto,
  CreateTicketReplyDto,
  TicketStatus,
} from './dto/support-ticket.dto';
import {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
} from './dto/feature-flag.dto';
import {
  CreateDefaultCategoryDto,
  UpdateDefaultCategoryDto,
} from './dto/default-category.dto';
import {
  CreateAdminReportDto,
  ListAdminReportsQueryDto,
  ReportStatus,
  ReportType,
} from './dto/admin-report.dto';
import { CreateAdminNotificationBroadcastDto } from './dto/admin-notification.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ==================== ADMIN REPORTS ====================

  async listAdminReports(query: ListAdminReportsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: {
      status?: ReportStatus;
      type?: ReportType;
    } = {};

    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [reports, total] = await Promise.all([
      this.prisma.adminReport.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          status: true,
          dateFrom: true,
          dateTo: true,
          generatedAt: true,
          createdAt: true,
          updatedAt: true,
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.adminReport.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminReportById(id: string) {
    const report = await this.prisma.adminReport.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        dateFrom: true,
        dateTo: true,
        result: true,
        generatedAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async createAdminReport(adminId: string, dto: CreateAdminReportDto) {
    const dateFrom = dto.dateFrom ? new Date(dto.dateFrom) : null;
    const dateTo = dto.dateTo ? new Date(dto.dateTo) : null;

    if (dateFrom && dateTo && dateFrom > dateTo) {
      throw new BadRequestException('dateFrom must be <= dateTo');
    }

    const report = await this.prisma.adminReport.create({
      data: {
        createdById: adminId,
        title: dto.title,
        description: dto.description ?? null,
        type: dto.type,
        status: 'DRAFT',
        dateFrom,
        dateTo,
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        dateFrom: true,
        dateTo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.logAdminAction(
      adminId,
      'CREATE_REPORT',
      'AdminReport',
      report.id,
      {
        type: dto.type,
        dateFrom,
        dateTo,
      },
    );

    return report;
  }

  async generateAdminReport(id: string, adminId: string) {
    const report = await this.prisma.adminReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    const range: {
      gte?: Date;
      lte?: Date;
    } = {};
    if (report.dateFrom) range.gte = report.dateFrom;
    if (report.dateTo) range.lte = report.dateTo;

    try {
      const result = await this.buildReportResult(report.type, range);

      const updated = await this.prisma.adminReport.update({
        where: { id },
        data: {
          status: 'GENERATED',
          result,
          generatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          status: true,
          dateFrom: true,
          dateTo: true,
          result: true,
          generatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await this.logAdminAction(adminId, 'GENERATE_REPORT', 'AdminReport', id, {
        type: report.type,
      });

      return updated;
    } catch (error) {
      await this.prisma.adminReport.update({
        where: { id },
        data: {
          status: 'FAILED',
          result: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          generatedAt: null,
        },
      });

      throw error;
    }
  }

  private async buildReportResult(
    type: ReportType,
    dateRange: { gte?: Date; lte?: Date },
  ) {
    // Privacy requirement: aggregated metrics only. No user transaction lists or per-transaction details.

    const hasDateRange = Object.keys(dateRange).length > 0;
    const transactionWhere = hasDateRange ? { date: dateRange } : {};
    const incomeWhere = hasDateRange ? { date: dateRange } : {};
    const expenseWhere = hasDateRange ? { date: dateRange } : {};
    const ticketWhere = hasDateRange ? { createdAt: dateRange } : {};

    if (type === 'SYSTEM_OVERVIEW') {
      const [
        totalUsers,
        totalWallets,
        totalTransactions,
        totalIncome,
        totalExpenses,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.wallet.count(),
        this.prisma.transaction.count({ where: transactionWhere }),
        this.prisma.income.aggregate({
          where: incomeWhere,
          _sum: { amount: true },
          _count: true,
        }),
        this.prisma.expense.aggregate({
          where: expenseWhere,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      return {
        kind: 'SYSTEM_OVERVIEW',
        totals: {
          users: totalUsers,
          wallets: totalWallets,
          transactions: totalTransactions,
          incomeCount: totalIncome._count,
          expenseCount: totalExpenses._count,
          incomeSum: totalIncome._sum.amount?.toString() ?? '0',
          expenseSum: totalExpenses._sum.amount?.toString() ?? '0',
        },
      };
    }

    if (type === 'SUPPORT_OVERVIEW') {
      const [totalTickets, openTickets, inProgressTickets, resolvedTickets] =
        await Promise.all([
          this.prisma.supportTicket.count({ where: ticketWhere }),
          this.prisma.supportTicket.count({
            where: { ...ticketWhere, status: 'OPEN' },
          }),
          this.prisma.supportTicket.count({
            where: { ...ticketWhere, status: 'IN_PROGRESS' },
          }),
          this.prisma.supportTicket.count({
            where: {
              ...ticketWhere,
              status: { in: ['RESOLVED', 'CLOSED'] },
            },
          }),
        ]);

      return {
        kind: 'SUPPORT_OVERVIEW',
        totals: {
          tickets: totalTickets,
          open: openTickets,
          inProgress: inProgressTickets,
          resolvedOrClosed: resolvedTickets,
        },
      };
    }

    if (type === 'FINANCE_OVERVIEW') {
      const [income, expenses] = await Promise.all([
        this.prisma.income.aggregate({
          where: incomeWhere,
          _sum: { amount: true },
          _count: true,
        }),
        this.prisma.expense.aggregate({
          where: expenseWhere,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      return {
        kind: 'FINANCE_OVERVIEW',
        totals: {
          incomeCount: income._count,
          expenseCount: expenses._count,
          incomeSum: income._sum.amount?.toString() ?? '0',
          expenseSum: expenses._sum.amount?.toString() ?? '0',
        },
      };
    }

    throw new BadRequestException('Unsupported report type');
  }

  // ==================== USER ACTIVITY OVERVIEW ====================

  async getUserActivitySummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get aggregated stats only, no transaction details
    const [
      totalTransactions,
      totalIncome,
      totalExpenses,
      totalBudgets,
      totalGoals,
      walletCount,
    ] = await Promise.all([
      this.prisma.transaction.count({ where: { userId } }),
      this.prisma.income.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.budget.count({ where: { userId } }),
      this.prisma.goal.count({ where: { userId } }),
      this.prisma.wallet.count({ where: { userId } }),
    ]);

    return {
      user,
      stats: {
        totalTransactions,
        incomeCount: totalIncome._count,
        expenseCount: totalExpenses._count,
        totalBudgets,
        totalGoals,
        walletCount,
        // Only totals, no breakdown or individual amounts
        hasActivity: totalTransactions > 0,
      },
    };
  }

  async getAllUsersOverview(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              transactions: true,
              wallets: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== SUPPORT TICKETS ====================

  async createTicket(userId: string, dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority || 'MEDIUM',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getAllTickets(page = 1, limit = 10, status?: TicketStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTicketById(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async updateTicket(id: string, adminId: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const updateData: {
      status?: TicketStatus;
      priority?: import('@prisma/client').TicketPriority;
      assignedTo?: string | null;
      resolvedAt?: Date | null;
    } = {};

    if (dto.status) {
      updateData.status = dto.status;
      if (
        dto.status === TicketStatus.RESOLVED ||
        dto.status === TicketStatus.CLOSED
      ) {
        updateData.resolvedAt = new Date();
      }
    }

    if (dto.priority) {
      updateData.priority = dto.priority;
    }

    if (dto.assignedToId) {
      updateData.assignedTo = dto.assignedToId;
    }

    const updated = await this.prisma.supportTicket.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log admin action
    await this.logAdminAction(
      adminId,
      'UPDATE_TICKET',
      'SupportTicket',
      id,
      updateData,
    );

    return updated;
  }

  async replyToTicket(
    ticketId: string,
    userId: string,
    dto: CreateTicketReplyDto,
    isAdmin: boolean,
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const reply = await this.prisma.ticketReply.create({
      data: {
        ticketId,
        userId,
        message: dto.message,
        isAdmin,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Update ticket status to IN_PROGRESS if it was OPEN
    if (ticket.status === 'OPEN' && isAdmin) {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return reply;
  }

  async getRecentChatMessages(limit = 5) {
    const take = Number.isFinite(limit) ? Math.max(1, Math.min(50, limit)) : 5;

    const [replies, tickets] = await Promise.all([
      this.prisma.ticketReply.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          message: true,
          isAdmin: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.supportTicket.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          description: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const replyMessages = replies.map((r) => ({
      id: r.id,
      content: r.message,
      createdAt: r.createdAt,
      isAdminReply: r.isAdmin,
      user: r.user,
    }));

    const ticketMessages = tickets.map((t) => ({
      id: `ticket-${t.id}`,
      content: t.description,
      createdAt: t.createdAt,
      isAdminReply: false,
      user: t.user,
    }));

    const messages = [...replyMessages, ...ticketMessages]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, take);

    return { messages };
  }

  // ==================== ADMIN LOGS ====================

  async logAdminAction(
    adminId: string,
    action: string,
    target: string,
    targetId?: string,
    details?: any,
    ipAddress?: string,
  ) {
    return this.prisma.adminLog.create({
      data: {
        adminId,
        action,
        target,
        targetId,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
      },
    });
  }

  async getAdminLogs(page = 1, limit = 20, adminId?: string) {
    const skip = (page - 1) * limit;
    const where = adminId ? { adminId } : {};

    const [logs, total] = await Promise.all([
      this.prisma.adminLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.adminLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== FEATURE FLAGS ====================

  async createFeatureFlag(dto: CreateFeatureFlagDto, adminId: string) {
    // Check if key already exists
    const existing = await this.prisma.featureFlag.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new BadRequestException(
        'Feature flag with this key already exists',
      );
    }

    const flag = await this.prisma.featureFlag.create({
      data: dto,
    });

    await this.logAdminAction(
      adminId,
      'CREATE_FEATURE_FLAG',
      'FeatureFlag',
      flag.id,
      dto,
    );

    return flag;
  }

  async getAllFeatureFlags() {
    return this.prisma.featureFlag.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateFeatureFlag(
    id: string,
    dto: UpdateFeatureFlagDto,
    adminId: string,
  ) {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    const updated = await this.prisma.featureFlag.update({
      where: { id },
      data: dto,
    });

    await this.logAdminAction(
      adminId,
      'UPDATE_FEATURE_FLAG',
      'FeatureFlag',
      id,
      dto,
    );

    return updated;
  }

  async toggleFeatureFlag(id: string, adminId: string) {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    const updated = await this.prisma.featureFlag.update({
      where: { id },
      data: { enabled: !flag.enabled },
    });

    await this.logAdminAction(
      adminId,
      'TOGGLE_FEATURE_FLAG',
      'FeatureFlag',
      id,
      {
        previousState: flag.enabled,
        newState: updated.enabled,
      },
    );

    return updated;
  }

  async deleteFeatureFlag(id: string, adminId: string) {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    await this.prisma.featureFlag.delete({
      where: { id },
    });

    await this.logAdminAction(
      adminId,
      'DELETE_FEATURE_FLAG',
      'FeatureFlag',
      id,
      { key: flag.key },
    );

    return { message: 'Feature flag deleted successfully' };
  }

  // ==================== DEFAULT CATEGORIES (TEMPLATES) ====================

  async createDefaultCategory(dto: CreateDefaultCategoryDto, adminId: string) {
    const category = await this.prisma.defaultCategory.create({
      data: dto,
    });

    await this.logAdminAction(
      adminId,
      'CREATE_DEFAULT_CATEGORY',
      'DefaultCategory',
      category.id,
      dto,
    );

    return category;
  }

  async getAllDefaultCategories() {
    return this.prisma.defaultCategory.findMany({
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getDefaultCategoryById(id: string) {
    const category = await this.prisma.defaultCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Default category not found');
    }

    return category;
  }

  async updateDefaultCategory(
    id: string,
    dto: UpdateDefaultCategoryDto,
    adminId: string,
  ) {
    const category = await this.prisma.defaultCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Default category not found');
    }

    const updated = await this.prisma.defaultCategory.update({
      where: { id },
      data: dto,
    });

    await this.logAdminAction(
      adminId,
      'UPDATE_DEFAULT_CATEGORY',
      'DefaultCategory',
      id,
      dto,
    );

    return updated;
  }

  async deleteDefaultCategory(id: string, adminId: string) {
    const category = await this.prisma.defaultCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Default category not found');
    }

    await this.prisma.defaultCategory.delete({
      where: { id },
    });

    await this.logAdminAction(
      adminId,
      'DELETE_DEFAULT_CATEGORY',
      'DefaultCategory',
      id,
      { name: category.name },
    );

    return { message: 'Default category deleted successfully' };
  }
  // ==================== NOTIFICATIONS ====================

  async listNotificationBroadcasts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [broadcasts, total] = await Promise.all([
      this.prisma.notificationBroadcast.findMany({
        skip,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { notifications: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notificationBroadcast.count(),
    ]);

    return {
      broadcasts: broadcasts.map((b) => ({
        id: b.id,
        title: b.title,
        body: b.body,
        type: b.type,
        audience: b.audience,
        status: b.status,
        createdAt: b.createdAt,
        createdBy: b.createdBy,
        recipients: b._count.notifications,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async broadcastNotification(
    adminId: string,
    dto: CreateAdminNotificationBroadcastDto,
  ) {
    const broadcast = await this.prisma.notificationBroadcast.create({
      data: {
        createdById: adminId,
        title: dto.title,
        body: dto.body,
        type: dto.type ?? 'announcement',
        audience: 'ALL',
        status: 'SENT',
      },
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        audience: true,
        status: true,
        createdAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    const users = await this.prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true },
    });

    const data = users.map((u) => ({
      userId: u.id,
      broadcastId: broadcast.id,
      title: broadcast.title,
      body: broadcast.body,
    }));

    const chunkSize = 1000;
    let createdCount = 0;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const res = await this.prisma.notification.createMany({ data: chunk });
      createdCount += res.count;
    }

    await this.logAdminAction(
      adminId,
      'BROADCAST_NOTIFICATION',
      'NotificationBroadcast',
      broadcast.id,
      { title: broadcast.title, recipients: createdCount },
    );

    return {
      broadcast: {
        ...broadcast,
        recipients: createdCount,
      },
    };
  }

  // ==================== DASHBOARD STATS ====================

  async getAdminDashboardStats() {
    const [
      totalUsers,
      newUsersToday,
      totalTickets,
      openTickets,
      totalFeatureFlags,
      enabledFlags,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.supportTicket.count(),
      this.prisma.supportTicket.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      this.prisma.featureFlag.count(),
      this.prisma.featureFlag.count({ where: { enabled: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        newToday: newUsersToday,
      },
      tickets: {
        total: totalTickets,
        open: openTickets,
      },
      featureFlags: {
        total: totalFeatureFlags,
        enabled: enabledFlags,
      },
    };
  }
}
