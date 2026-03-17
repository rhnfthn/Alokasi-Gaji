import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private signToken;
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        token?: undefined;
    } | {
        success: boolean;
        token: string;
    }>;
    resetPassword(data: {
        token: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
}
