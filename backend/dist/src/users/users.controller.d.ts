import type { RequestUser } from '../common/types/request-user.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: RequestUser): Promise<{
        name: string;
        id: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    updateMe(user: RequestUser, dto: UpdateMeDto): Promise<{
        name: string;
        id: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    changePassword(user: RequestUser, dto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
}
