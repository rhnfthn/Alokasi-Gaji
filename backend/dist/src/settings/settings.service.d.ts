import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        defaultCurrency: string;
        darkMode: boolean;
        userId: string;
    }>;
    update(userId: string, dto: UpdateSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        defaultCurrency: string;
        darkMode: boolean;
        userId: string;
    }>;
}
