import type { RequestUser } from '../common/types/request-user.type';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    list(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }[]>;
    create(user: RequestUser, dto: CreateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }>;
    update(user: RequestUser, id: string, dto: UpdateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }>;
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
