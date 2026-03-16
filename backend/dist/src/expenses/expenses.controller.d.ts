import type { RequestUser } from '../common/types/request-user.type';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    list(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        title: string;
        receiptUrl: string | null;
    }[]>;
    create(user: RequestUser, dto: CreateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        title: string;
        receiptUrl: string | null;
    }>;
    update(user: RequestUser, id: string, dto: UpdateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        title: string;
        receiptUrl: string | null;
    } | null>;
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
