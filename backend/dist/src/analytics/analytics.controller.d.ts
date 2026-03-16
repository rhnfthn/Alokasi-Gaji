import type { RequestUser } from '../common/types/request-user.type';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    overview(user: RequestUser, year?: string, month?: string): Promise<{
        period: {
            year: number;
            month: number;
        };
        totalBalance: number;
        totalIncome: number;
        totalExpense: number;
        remainingBudget: number;
    }>;
    spendingCategory(user: RequestUser, year?: string, month?: string): Promise<{
        category: string;
        amount: number;
    }[]>;
    incomeExpense(user: RequestUser, monthsBack?: string): Promise<{
        year: number;
        month: number;
        income: number;
        expense: number;
    }[]>;
    monthlyTrend(user: RequestUser, monthsBack?: string): Promise<{
        year: number;
        month: number;
        expense: number;
    }[]>;
}
