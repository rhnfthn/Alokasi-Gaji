import type { RequestUser } from '../common/types/request-user.type';
import { UsersService } from '../users/users.service';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    private readonly usersService;
    constructor(uploadsService: UploadsService, usersService: UsersService);
    uploadReceipt(file?: Express.Multer.File): {
        success: boolean;
        url?: undefined;
    } | {
        success: boolean;
        url: string;
    };
    uploadAvatar(user: RequestUser, file?: Express.Multer.File): Promise<{
        success: boolean;
        url?: undefined;
        user?: undefined;
    } | {
        success: boolean;
        url: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
    }>;
}
