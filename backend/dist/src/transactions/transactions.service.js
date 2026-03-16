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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId, query) {
        return this.prisma.transaction.findMany({
            where: {
                userId,
                ...(query?.walletId ? { walletId: query.walletId } : {}),
                ...(query?.type ? { type: query.type } : {}),
            },
            include: {
                wallet: { select: { id: true, name: true, currency: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async get(userId, id) {
        const tx = await this.prisma.transaction.findFirst({
            where: { id, userId },
            include: {
                wallet: { select: { id: true, name: true, currency: true } },
                income: true,
                expense: true,
            },
        });
        if (!tx) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return tx;
    }
    async exportCsv(userId) {
        const rows = await this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
        const header = [
            'id',
            'type',
            'walletId',
            'category',
            'amount',
            'date',
            'note',
        ];
        const lines = [header.join(',')];
        for (const row of rows) {
            const values = [
                row.id,
                row.type,
                row.walletId,
                row.category ?? '',
                row.amount.toString(),
                row.date.toISOString(),
                (row.note ?? '').replaceAll('"', '""'),
            ].map((v) => `"${String(v)}"`);
            lines.push(values.join(','));
        }
        return lines.join('\n');
    }
    async importCsv(userId, csv) {
        const lines = csv
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        if (lines.length < 2) {
            throw new common_1.BadRequestException('CSV must include a header and at least 1 row');
        }
        const header = lines[0].toLowerCase();
        if (!header.includes('type') || !header.includes('walletid')) {
            throw new common_1.BadRequestException('CSV header must include type and walletId');
        }
        const createdIds = [];
        await this.prisma.$transaction(async (tx) => {
            for (let i = 1; i < lines.length; i++) {
                const raw = lines[i];
                const cols = raw.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
                const [type, walletId, category, amountStr, dateStr, note] = cols;
                if (!type || !walletId || !amountStr || !dateStr) {
                    continue;
                }
                const wallet = await tx.wallet.findFirst({
                    where: { id: walletId, userId },
                    select: { id: true },
                });
                if (!wallet) {
                    continue;
                }
                const amount = Number(amountStr);
                if (!Number.isFinite(amount)) {
                    continue;
                }
                const date = new Date(dateStr);
                if (Number.isNaN(date.getTime())) {
                    continue;
                }
                if (!Object.values(client_1.TransactionType).includes(type)) {
                    continue;
                }
                const txType = type;
                const createdTx = await tx.transaction.create({
                    data: {
                        userId,
                        walletId,
                        type: txType,
                        category: category || null,
                        amount,
                        date,
                        note: note || null,
                    },
                });
                createdIds.push(createdTx.id);
                if (txType === client_1.TransactionType.INCOME) {
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { increment: amount } },
                    });
                }
                else if (txType === client_1.TransactionType.EXPENSE) {
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { decrement: amount } },
                    });
                }
            }
        });
        return { success: true, created: createdIds.length };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map