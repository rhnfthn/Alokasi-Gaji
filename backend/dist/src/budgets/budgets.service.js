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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BudgetsService = class BudgetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        return this.prisma.budget.findMany({
            where: { userId },
            orderBy: [{ year: 'desc' }, { month: 'desc' }, { category: 'asc' }],
        });
    }
    async create(userId, dto) {
        const existing = await this.prisma.budget.findFirst({
            where: {
                userId,
                category: dto.category,
                month: dto.month,
                year: dto.year,
            },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.BadRequestException('Budget already exists for this period');
        }
        return this.prisma.budget.create({
            data: {
                userId,
                category: dto.category,
                amount: dto.amount,
                month: dto.month,
                year: dto.year,
            },
        });
    }
    async update(userId, id, dto) {
        const budget = await this.prisma.budget.findFirst({
            where: { id, userId },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return this.prisma.budget.update({
            where: { id },
            data: {
                ...(dto.category !== undefined ? { category: dto.category } : {}),
                ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
                ...(dto.month !== undefined ? { month: dto.month } : {}),
                ...(dto.year !== undefined ? { year: dto.year } : {}),
            },
        });
    }
    async remove(userId, id) {
        const budget = await this.prisma.budget.findFirst({
            where: { id, userId },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        await this.prisma.budget.delete({ where: { id } });
        return { success: true };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map