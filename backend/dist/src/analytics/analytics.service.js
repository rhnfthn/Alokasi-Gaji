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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMonthRange(year, month) {
        const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
        return { start, end };
    }
    async overview(userId, year, month) {
        const now = new Date();
        const y = year ?? now.getUTCFullYear();
        const m = month ?? now.getUTCMonth() + 1;
        const { start, end } = this.getMonthRange(y, m);
        const [walletAgg, incomeAgg, expenseAgg, budgetAgg] = await Promise.all([
            this.prisma.wallet.aggregate({
                where: { userId },
                _sum: { balance: true },
            }),
            this.prisma.income.aggregate({
                where: { userId, date: { gte: start, lt: end } },
                _sum: { amount: true },
            }),
            this.prisma.expense.aggregate({
                where: { userId, date: { gte: start, lt: end } },
                _sum: { amount: true },
            }),
            this.prisma.budget.aggregate({
                where: { userId, year: y, month: m },
                _sum: { amount: true },
            }),
        ]);
        const totalBalance = Number(walletAgg._sum.balance ?? 0);
        const totalIncome = Number(incomeAgg._sum.amount ?? 0);
        const totalExpense = Number(expenseAgg._sum.amount ?? 0);
        const totalBudget = Number(budgetAgg._sum.amount ?? 0);
        return {
            period: { year: y, month: m },
            totalBalance,
            totalIncome,
            totalExpense,
            remainingBudget: totalBudget - totalExpense,
        };
    }
    async spendingByCategory(userId, year, month) {
        const now = new Date();
        const y = year ?? now.getUTCFullYear();
        const m = month ?? now.getUTCMonth() + 1;
        const { start, end } = this.getMonthRange(y, m);
        const groups = await this.prisma.expense.groupBy({
            by: ['category'],
            where: { userId, date: { gte: start, lt: end } },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
        });
        return groups.map((g) => ({
            category: g.category,
            amount: Number(g._sum.amount ?? 0),
        }));
    }
    async incomeVsExpense(userId, monthsBack = 6) {
        const now = new Date();
        const points = [];
        for (let i = monthsBack - 1; i >= 0; i--) {
            const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
            const y = dt.getUTCFullYear();
            const m = dt.getUTCMonth() + 1;
            const { start, end } = this.getMonthRange(y, m);
            const [incomeAgg, expenseAgg] = await Promise.all([
                this.prisma.income.aggregate({
                    where: { userId, date: { gte: start, lt: end } },
                    _sum: { amount: true },
                }),
                this.prisma.expense.aggregate({
                    where: { userId, date: { gte: start, lt: end } },
                    _sum: { amount: true },
                }),
            ]);
            points.push({
                year: y,
                month: m,
                income: Number(incomeAgg._sum.amount ?? 0),
                expense: Number(expenseAgg._sum.amount ?? 0),
            });
        }
        return points;
    }
    async monthlyTrend(userId, monthsBack = 6) {
        const now = new Date();
        const points = [];
        for (let i = monthsBack - 1; i >= 0; i--) {
            const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
            const y = dt.getUTCFullYear();
            const m = dt.getUTCMonth() + 1;
            const { start, end } = this.getMonthRange(y, m);
            const expenseAgg = await this.prisma.expense.aggregate({
                where: { userId, date: { gte: start, lt: end } },
                _sum: { amount: true },
            });
            points.push({
                year: y,
                month: m,
                expense: Number(expenseAgg._sum.amount ?? 0),
            });
        }
        return points;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map