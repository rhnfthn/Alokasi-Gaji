"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const support_dto_1 = require("./dto/support.dto");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, dto) {
        return this.prisma.supportTicket.create({
            data: {
                subject: dto.subject,
                description: dto.message,
                priority: dto.priority || support_dto_1.TicketPriority.MEDIUM,
                userId,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async getUserTickets(userId, page = 1, limit = 10) {
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
    async getTicketById(ticketId, userId) {
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
    async addReply(ticketId, userId, dto) {
        const ticket = await this.prisma.supportTicket.findFirst({
            where: { id: ticketId, userId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
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
        if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            await this.prisma.supportTicket.update({
                where: { id: ticketId },
                data: { status: 'OPEN' },
            });
        }
        return reply;
    }
    async closeTicket(ticketId, userId) {
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
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map