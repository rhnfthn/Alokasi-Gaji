import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { userId },
    });

    if (settings) {
      return settings;
    }

    return this.prisma.settings.create({
      data: { userId },
    });
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    await this.get(userId);
    return this.prisma.settings.update({
      where: { userId },
      data: {
        ...(dto.defaultCurrency !== undefined
          ? { defaultCurrency: dto.defaultCurrency }
          : {}),
        ...(dto.darkMode !== undefined ? { darkMode: dto.darkMode } : {}),
      },
    });
  }
}
