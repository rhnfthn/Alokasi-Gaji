import type { RequestUser } from '../common/types/request-user.type';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    list(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    }[]>;
    create(user: RequestUser, dto: CreateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    }>;
    update(user: RequestUser, id: string, dto: UpdateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        targetAmount: import("@prisma/client-runtime-utils").Decimal;
        savedAmount: import("@prisma/client-runtime-utils").Decimal;
        deadline: Date | null;
    }>;
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
