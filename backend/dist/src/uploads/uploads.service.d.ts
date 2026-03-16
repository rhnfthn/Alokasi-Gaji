import { ConfigService } from '@nestjs/config';
export type UploadCategory = 'receipts' | 'avatars';
export declare class UploadsService {
    private readonly configService;
    constructor(configService: ConfigService);
    getUploadsRoot(): string;
    ensureDir(category: UploadCategory): string;
    makeFilename(originalName: string): string;
    publicUrl(category: UploadCategory, filename: string): string;
}
