import type { TransactionType } from '@prisma/client';
import type { RequestUser } from '../common/types/request-user.type';
import { ImportTransactionsDto } from './dto/import-transactions.dto';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    list(user: RequestUser, walletId?: string, type?: TransactionType): Promise<({
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
    exportCsv(user: RequestUser): Promise<string>;
    importCsv(user: RequestUser, dto: ImportTransactionsDto): Promise<{
        success: boolean;
        created: number;
    }>;
    get(user: RequestUser, id: string): Promise<{
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
}
