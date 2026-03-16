import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }[]>;
    create(userId: string, dto: CreateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }>;
    update(userId: string, id: string, dto: UpdateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        userId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        month: number;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
