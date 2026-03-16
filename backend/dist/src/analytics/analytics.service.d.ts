import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getMonthRange;
    overview(userId: string, year?: number, month?: number): Promise<{
        period: {
            year: number;
            month: number;
        };
        totalBalance: number;
        totalIncome: number;
        totalExpense: number;
        remainingBudget: number;
    }>;
    spendingByCategory(userId: string, year?: number, month?: number): Promise<{
        category: string;
        amount: number;
    }[]>;
    incomeVsExpense(userId: string, monthsBack?: number): Promise<{
        year: number;
        month: number;
        income: number;
        expense: number;
    }[]>;
    monthlyTrend(userId: string, monthsBack?: number): Promise<{
        year: number;
        month: number;
        expense: number;
    }[]>;
}
