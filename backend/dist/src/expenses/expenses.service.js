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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        return this.prisma.expense.findMany({
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
        const [expense] = await this.prisma.$transaction([
            this.prisma.expense.create({
                data: {
                    userId,
                    walletId: dto.walletId,
                    title: dto.title,
                    category: dto.category,
                    amount: dto.amount,
                    date,
                    note: dto.note,
                    receiptUrl: dto.receiptUrl,
                },
            }),
            this.prisma.wallet.update({
                where: { id: dto.walletId },
                data: { balance: { decrement: dto.amount } },
            }),
        ]);
        await this.prisma.transaction.create({
            data: {
                userId,
                walletId: dto.walletId,
                type: 'EXPENSE',
                category: dto.category,
                amount: dto.amount,
                date,
                note: dto.note,
                expenseId: expense.id,
            },
        });
        return expense;
    }
    async update(userId, id, dto) {
        const existing = await this.prisma.expense.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const nextWalletId = dto.walletId ?? existing.walletId;
        const nextTitle = dto.title ?? existing.title;
        const nextAmount = dto.amount ?? Number(existing.amount);
        const nextCategory = dto.category ?? existing.category;
        const nextDate = dto.date ? new Date(dto.date) : existing.date;
        const nextNote = dto.note ?? existing.note;
        const nextReceiptUrl = dto.receiptUrl ?? existing.receiptUrl;
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
            await tx.expense.update({
                where: { id },
                data: {
                    walletId: nextWalletId,
                    title: nextTitle,
                    amount: nextAmount,
                    category: nextCategory,
                    date: nextDate,
                    note: nextNote,
                    receiptUrl: nextReceiptUrl,
                },
            });
            if (oldWalletId === nextWalletId) {
                const diff = nextAmount - oldAmount;
                if (diff !== 0) {
                    await tx.wallet.update({
                        where: { id: oldWalletId },
                        data: { balance: { decrement: diff } },
                    });
                }
            }
            else {
                await tx.wallet.update({
                    where: { id: oldWalletId },
                    data: { balance: { increment: oldAmount } },
                });
                await tx.wallet.update({
                    where: { id: nextWalletId },
                    data: { balance: { decrement: nextAmount } },
                });
            }
            await tx.transaction.updateMany({
                where: { expenseId: id, userId },
                data: {
                    walletId: nextWalletId,
                    type: 'EXPENSE',
                    category: nextCategory,
                    amount: nextAmount,
                    date: nextDate,
                    note: nextNote,
                },
            });
        });
        return this.prisma.expense.findUnique({ where: { id } });
    }
    async remove(userId, id) {
        const existing = await this.prisma.expense.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const amount = Number(existing.amount);
        await this.prisma.$transaction([
            this.prisma.transaction.deleteMany({ where: { expenseId: id, userId } }),
            this.prisma.expense.delete({ where: { id } }),
            this.prisma.wallet.update({
                where: { id: existing.walletId },
                data: { balance: { increment: amount } },
            }),
        ]);
        return { success: true };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map