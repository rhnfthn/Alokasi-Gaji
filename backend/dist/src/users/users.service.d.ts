import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    findForAuthByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.UserRole;
    } | null>;
    findPublicById(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    updateMe(userId: string, dto: UpdateMeDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    changePassword(params: {
        userId: string;
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
    }>;
    setAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    setResetPasswordToken(params: {
        email: string;
        tokenHash: string;
        expiresAt: Date;
    }): Promise<void>;
    resetPasswordWithToken(params: {
        tokenHash: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
    }>;
}
