import type { RequestUser } from '../common/types/request-user.type';
import { UsersService } from '../users/users.service';
import { StorageService } from '../storage/storage.service';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly storageService;
    private readonly usersService;
    private readonly uploadsService;
    constructor(storageService: StorageService, usersService: UsersService, uploadsService: UploadsService);
    private uploadLocal;
    uploadReceipt(file?: Express.Multer.File): Promise<{
        success: boolean;
        url: string | undefined;
    }>;
    uploadAvatar(user: RequestUser, file?: Express.Multer.File): Promise<{
        success: boolean;
        url: string | undefined;
        user: {
            name: string;
            id: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
    }>;
}
