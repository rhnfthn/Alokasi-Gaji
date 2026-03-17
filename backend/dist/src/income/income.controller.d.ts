import type { RequestUser } from '../common/types/request-user.type';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeService } from './income.service';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    list(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        goalId: string | null;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
    }[]>;
    create(user: RequestUser, dto: CreateIncomeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        goalId: string | null;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
    }>;
    update(user: RequestUser, id: string, dto: UpdateIncomeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        goalId: string | null;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
    } | null>;
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
