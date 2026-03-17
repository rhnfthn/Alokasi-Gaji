import { ConfigService } from '@nestjs/config';
export type StorageBucket = 'receipts' | 'avatars';
export declare class StorageService {
    private readonly configService;
    private supabase;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    uploadFile(bucket: StorageBucket, file: Express.Multer.File): Promise<{
        success: boolean;
        url?: string;
        error?: string;
    }>;
    deleteFile(url: string): Promise<{
        success: boolean;
    }>;
}
