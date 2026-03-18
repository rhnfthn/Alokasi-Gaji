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
exports.GoalContributionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GoalContributionsService = class GoalContributionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeUserId(userId) {
        if (typeof userId === 'string') {
            return userId;
        }
        if (userId && typeof userId === 'object') {
            const maybeSub = userId.sub;
            if (typeof maybeSub === 'string') {
                return maybeSub;
            }
        }
        throw new common_1.BadRequestException('Invalid user');
    }
    async list(userId) {
        const normalizedUserId = this.normalizeUserId(userId);
        return this.prisma.goalContribution.findMany({
            where: { userId: normalizedUserId },
            include: {
                goal: true,
                wallet: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async listByGoal(userId, goalId) {
        const normalizedUserId = this.normalizeUserId(userId);
        return this.prisma.goalContribution.findMany({
            where: { userId: normalizedUserId, goalId },
            include: {
                wallet: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async create(userId, dto) {
        const normalizedUserId = this.normalizeUserId(userId);
        const wallet = await this.prisma.wallet.findFirst({
            where: { id: dto.walletId, userId: normalizedUserId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        if (Number(wallet.balance) < dto.amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const goal = await this.prisma.goal.findFirst({
            where: { id: dto.goalId, userId: normalizedUserId },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        const date = new Date(dto.date);
        const [createdContribution] = await this.prisma.$transaction([
            this.prisma.goalContribution.create({
                data: {
                    userId: normalizedUserId,
                    goalId: dto.goalId,
                    walletId: dto.walletId,
                    amount: dto.amount,
                    date,
                    note: dto.note,
                },
            }),
            this.prisma.wallet.update({
                where: { id: dto.walletId },
                data: { balance: { decrement: dto.amount } },
            }),
            this.prisma.goal.update({
                where: { id: dto.goalId },
                data: { savedAmount: { increment: dto.amount } },
            }),
            this.prisma.transaction.create({
                data: {
                    userId: normalizedUserId,
                    walletId: dto.walletId,
                    type: 'GOAL_CONTRIBUTION',
                    amount: dto.amount,
                    date,
                    note: dto.note,
                },
            }),
        ]);
        return this.prisma.goalContribution.findUniqueOrThrow({
            where: { id: createdContribution.id },
            include: {
                goal: true,
                wallet: true,
            },
        });
    }
    async remove(userId, id) {
        const normalizedUserId = this.normalizeUserId(userId);
        const existing = await this.prisma.goalContribution.findFirst({
            where: { id, userId: normalizedUserId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Goal contribution not found');
        }
        const amount = Number(existing.amount);
        await this.prisma.$transaction([
            this.prisma.goalContribution.delete({ where: { id } }),
            this.prisma.wallet.update({
                where: { id: existing.walletId },
                data: { balance: { increment: amount } },
            }),
            this.prisma.goal.update({
                where: { id: existing.goalId },
                data: { savedAmount: { decrement: amount } },
            }),
        ]);
        return { success: true };
    }
};
exports.GoalContributionsService = GoalContributionsService;
exports.GoalContributionsService = GoalContributionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoalContributionsService);
//# sourceMappingURL=goal-contributions.service.js.map