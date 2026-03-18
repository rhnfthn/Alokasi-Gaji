import type { RequestUser } from '../common/types/request-user.type';
import { GoalContributionsService } from './goal-contributions.service';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';
export declare class GoalContributionsController {
    private readonly goalContributionsService;
    constructor(goalContributionsService: GoalContributionsService);
    list(user: RequestUser): Promise<({
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
    listByGoal(user: RequestUser, goalId: string): Promise<({
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
    create(user: RequestUser, dto: CreateGoalContributionDto): Promise<{
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
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
