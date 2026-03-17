import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [ConfigModule, UsersModule, StorageModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
