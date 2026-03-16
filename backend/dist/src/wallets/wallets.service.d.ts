import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        userId: string;
    }[]>;
    create(userId: string, dto: CreateWalletDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        userId: string;
    }>;
    get(userId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        userId: string;
    }>;
    update(userId: string, id: string, dto: UpdateWalletDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        userId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
