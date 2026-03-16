import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTicketDto,
  CreateReplyDto,
  TicketPriority,
} from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data: {
        subject: dto.subject,
        description: dto.message,
        priority: dto.priority || TicketPriority.MEDIUM,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getUserTickets(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          assignee: {
            select: { id: true, name: true },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
      this.prisma.supportTicket.count({ where: { userId } }),
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

  async getTicketById(ticketId: string, userId: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id: ticketId, userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    return ticket;
  }

  async addReply(ticketId: string, userId: string, dto: CreateReplyDto) {
    // Verify ticket belongs to user
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id: ticketId, userId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Create the reply
    const reply = await this.prisma.ticketReply.create({
      data: {
        message: dto.message,
        ticketId,
        userId,
        isAdmin: false,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Reopen ticket if it was resolved/closed
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'OPEN' },
      });
    }

    return reply;
  }

  async closeTicket(ticketId: string, userId: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id: ticketId, userId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'CLOSED' },
    });
  }
}
