import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';
export declare class GoalContributionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private normalizeUserId;
    list(userId: string): Promise<({
        wallet: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletType;
            balance: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            userId: string;
        };
        goal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            targetAmount: import("@prisma/client-runtime-utils").Decimal;
            savedAmount: import("@prisma/client-runtime-utils").Decimal;
            deadline: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        goalId: string;
    })[]>;
    listByGoal(userId: string, goalId: string): Promise<({
        wallet: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletType;
            balance: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        goalId: string;
    })[]>;
    create(userId: string, dto: CreateGoalContributionDto): Promise<{
        wallet: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletType;
            balance: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            userId: string;
        };
        goal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            targetAmount: import("@prisma/client-runtime-utils").Decimal;
            savedAmount: import("@prisma/client-runtime-utils").Decimal;
            deadline: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        note: string | null;
        goalId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
