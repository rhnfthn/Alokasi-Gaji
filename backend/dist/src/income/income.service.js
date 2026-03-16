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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IncomeService = class IncomeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        return this.prisma.income.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
    async create(userId, dto) {
        const wallet = await this.prisma.wallet.findFirst({
            where: { id: dto.walletId, userId },
            select: { id: true },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const date = new Date(dto.date);
        const [income] = await this.prisma.$transaction([
            this.prisma.income.create({
                data: {
                    userId,
                    walletId: dto.walletId,
                    category: dto.category,
                    amount: dto.amount,
                    date,
                    note: dto.note,
                },
            }),
            this.prisma.wallet.update({
                where: { id: dto.walletId },
                data: { balance: { increment: dto.amount } },
            }),
        ]);
        await this.prisma.transaction.create({
            data: {
                userId,
                walletId: dto.walletId,
                type: 'INCOME',
                category: dto.category,
                amount: dto.amount,
                date,
                note: dto.note,
                incomeId: income.id,
            },
        });
        return income;
    }
    async update(userId, id, dto) {
        const existing = await this.prisma.income.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Income not found');
        }
        const nextWalletId = dto.walletId ?? existing.walletId;
        const nextAmount = dto.amount ?? Number(existing.amount);
        const nextCategory = dto.category ?? existing.category;
        const nextDate = dto.date ? new Date(dto.date) : existing.date;
        const nextNote = dto.note ?? existing.note;
        const nextWallet = await this.prisma.wallet.findFirst({
            where: { id: nextWalletId, userId },
            select: { id: true },
        });
        if (!nextWallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const oldAmount = Number(existing.amount);
        const oldWalletId = existing.walletId;
        await this.prisma.$transaction(async (tx) => {
            await tx.income.update({
                where: { id },
                data: {
                    walletId: nextWalletId,
                    amount: nextAmount,
                    category: nextCategory,
                    date: nextDate,
                    note: nextNote,
                },
            });
            if (oldWalletId === nextWalletId) {
                const diff = nextAmount - oldAmount;
                if (diff !== 0) {
                    await tx.wallet.update({
                        where: { id: oldWalletId },
                        data: { balance: { increment: diff } },
                    });
                }
            }
            else {
                await tx.wallet.update({
                    where: { id: oldWalletId },
                    data: { balance: { decrement: oldAmount } },
                });
                await tx.wallet.update({
                    where: { id: nextWalletId },
                    data: { balance: { increment: nextAmount } },
                });
            }
            await tx.transaction.updateMany({
                where: { incomeId: id, userId },
                data: {
                    walletId: nextWalletId,
                    type: 'INCOME',
                    category: nextCategory,
                    amount: nextAmount,
                    date: nextDate,
                    note: nextNote,
                },
            });
        });
        return this.prisma.income.findUnique({ where: { id } });
    }
    async remove(userId, id) {
        const existing = await this.prisma.income.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Income not found');
        }
        const amount = Number(existing.amount);
        await this.prisma.$transaction([
            this.prisma.transaction.deleteMany({ where: { incomeId: id, userId } }),
            this.prisma.income.delete({ where: { id } }),
            this.prisma.wallet.update({
                where: { id: existing.walletId },
                data: { balance: { decrement: amount } },
            }),
        ]);
        return { success: true };
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomeService);
//# sourceMappingURL=income.service.js.map