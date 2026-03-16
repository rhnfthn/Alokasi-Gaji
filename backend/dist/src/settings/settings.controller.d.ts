import type { RequestUser } from '../common/types/request-user.type';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        defaultCurrency: string;
        darkMode: boolean;
        userId: string;
    }>;
    update(user: RequestUser, dto: UpdateSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        defaultCurrency: string;
        darkMode: boolean;
        userId: string;
    }>;
}
