import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
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
    create(userId: string, dto: CreateExpenseDto): Promise<{
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
    update(userId: string, id: string, dto: UpdateExpenseDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
