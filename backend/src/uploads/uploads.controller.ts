import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { UsersService } from '../users/users.service';
import { UploadsService } from './uploads.service';

function safeName(originalName: string) {
  return originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

@Controller('upload')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('receipt')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(
            process.cwd(),
            process.env.UPLOADS_DIR ?? 'uploads',
            'receipts',
          );
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `${Date.now()}-${safeName(file.originalname)}`);
        },
      }),
    }),
  )
  uploadReceipt(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { success: false };
    }
    const filename = file.filename;
    return {
      success: true,
      url: this.uploadsService.publicUrl('receipts', filename),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(
            process.cwd(),
            process.env.UPLOADS_DIR ?? 'uploads',
            'avatars',
          );
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `${Date.now()}-${safeName(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      return { success: false };
    }

    const url = this.uploadsService.publicUrl('avatars', file.filename);
    const updatedUser = await this.usersService.setAvatar(user.sub, url);
    return { success: true, url, user: updatedUser };
  }
}
