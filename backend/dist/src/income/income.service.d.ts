import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
export declare class IncomeService {
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
    }[]>;
    create(userId: string, dto: CreateIncomeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateIncomeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        category: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
    } | null>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
