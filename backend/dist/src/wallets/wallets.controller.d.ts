import type { RequestUser } from '../common/types/request-user.type';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletsService } from './wallets.service';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    list(user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }[]>;
    create(user: RequestUser, dto: CreateWalletDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }>;
    get(user: RequestUser, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }>;
    update(user: RequestUser, id: string, dto: UpdateWalletDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }>;
    remove(user: RequestUser, id: string): Promise<{
        success: boolean;
    }>;
}
