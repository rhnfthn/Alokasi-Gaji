import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { UsersService } from '../users/users.service';
import { StorageService } from '../storage/storage.service';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Controller('upload')
export class UploadsController {
  constructor(
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  private async uploadLocal(category: 'receipts' | 'avatars', file: Express.Multer.File) {
    const dir = this.uploadsService.ensureDir(category);
    const filename = this.uploadsService.makeFilename(file.originalname);
    const fullPath = join(dir, filename);
    await writeFile(fullPath, file.buffer);
    return this.uploadsService.publicUrl(category, filename);
  }

  @UseGuards(JwtAuthGuard)
  @Post('receipt')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadReceipt(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let url: string | undefined;
    if (this.storageService.isConfigured()) {
      const result = await this.storageService.uploadFile('receipts', file);
      if (!result.success) {
        throw new BadRequestException(result.error || 'Upload failed');
      }
      url = result.url;
    } else {
      url = await this.uploadLocal('receipts', file);
    }

    return {
      success: true,
      url,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let url: string | undefined;
    if (this.storageService.isConfigured()) {
      const result = await this.storageService.uploadFile('avatars', file);
      if (!result.success) {
        throw new BadRequestException(result.error || 'Upload failed');
      }
      url = result.url;
    } else {
      url = await this.uploadLocal('avatars', file);
    }

    const updatedUser = await this.usersService.setAvatar(
      user.sub,
      url!,
    );

    return {
      success: true,
      url,
      user: updatedUser,
    };
  }
}
