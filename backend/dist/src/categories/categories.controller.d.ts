import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesController {
    private prisma;
    constructor(prisma: PrismaService);
    getDefaultCategories(type?: string): Promise<{
        name: string;
        id: string;
        type: string;
        icon: string | null;
        color: string | null;
    }[]>;
}
