import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

export type UploadCategory = 'receipts' | 'avatars';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  getUploadsRoot() {
    return join(
      process.cwd(),
      this.configService.get('UPLOADS_DIR') ?? 'uploads',
    );
  }

  ensureDir(category: UploadCategory) {
    const dir = join(this.getUploadsRoot(), category);
    mkdirSync(dir, { recursive: true });
    return dir;
  }

  makeFilename(originalName: string) {
    const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${randomUUID()}-${safe}`;
  }

  publicUrl(category: UploadCategory, filename: string) {
    return `/uploads/${category}/${filename}`;
  }
}
