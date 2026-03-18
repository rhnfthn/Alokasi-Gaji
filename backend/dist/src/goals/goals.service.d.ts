import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<({
        contributions: ({
            wallet: {
                name: string;
                id: string;
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    })[]>;
    create(userId: string, dto: CreateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    }>;
    update(userId: string, id: string, dto: UpdateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
