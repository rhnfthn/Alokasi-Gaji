import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { category: 'asc' }],
    });
  }

  async create(userId: string, dto: CreateBudgetDto) {
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
      throw new BadRequestException('Budget already exists for this period');
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

  async update(userId: string, id: string, dto: UpdateBudgetDto) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
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

  async remove(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    await this.prisma.budget.delete({ where: { id } });
    return { success: true };
  }

  async getAnalytics(userId: string, month: number, year: number) {
    // Get all budgets for this period
    const budgets = await this.prisma.budget.findMany({
      where: { userId, month, year },
      orderBy: { category: 'asc' },
    });

    // Get date range for this month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    // Get actual spending per category for this period
    const expenses = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Create expense map
    const expenseMap = new Map<string, number>();
    expenses.forEach((e) => {
      expenseMap.set(e.category, Number(e._sum.amount ?? 0));
    });

    // Combine budget with actual
    const analytics = budgets.map((budget) => {
      const budgetAmount = Number(budget.amount);
      const actualAmount = expenseMap.get(budget.category) ?? 0;
      const difference = budgetAmount - actualAmount;
      const percentage = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;

      let status: 'safe' | 'warning' | 'danger';
      if (percentage <= 75) {
        status = 'safe';
      } else if (percentage <= 100) {
        status = 'warning';
      } else {
        status = 'danger';
      }

      return {
        id: budget.id,
        category: budget.category,
        budgetAmount,
        actualAmount,
        difference,
        percentage: Math.min(percentage, 150), // Cap at 150% for display
        status,
      };
    });

    // Also find expenses without budget
    const budgetCategories = new Set(budgets.map((b) => b.category));
    const unbududgetedExpenses = expenses
      .filter((e) => !budgetCategories.has(e.category))
      .map((e) => ({
        category: e.category,
        actualAmount: Number(e._sum.amount ?? 0),
        budgetAmount: 0,
        difference: -Number(e._sum.amount ?? 0),
        percentage: 0,
        status: 'danger' as const,
      }));

    return {
      month,
      year,
      budgets: analytics,
      unbudgetedExpenses: unbududgetedExpenses,
    };
  }
}
