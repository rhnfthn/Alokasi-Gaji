import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, query?: {
        walletId?: string;
        type?: TransactionType;
    }): Promise<({
        wallet: {
            name: string;
            id: string;
            currency: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        userId: string;
        walletId: string;
        category: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        incomeId: string | null;
        expenseId: string | null;
    })[]>;
    get(userId: string, id: string): Promise<{
        wallet: {
            name: string;
            id: string;
            currency: string;
        };
        income: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            walletId: string;
            category: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            date: Date;
            note: string | null;
        } | null;
        expense: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        userId: string;
        walletId: string;
        category: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        incomeId: string | null;
        expenseId: string | null;
    }>;
    exportCsv(userId: string): Promise<string>;
    importCsv(userId: string, csv: string): Promise<{
        success: boolean;
        created: number;
    }>;
}
