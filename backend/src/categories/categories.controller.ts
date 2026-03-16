import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getDefaultCategories(@Query('type') type?: string) {
    const where: Prisma.DefaultCategoryWhereInput = {
      isActive: true,
    };

    const normalizedType = (type ?? '').trim().toUpperCase();
    if (normalizedType === 'INCOME' || normalizedType === 'EXPENSE') {
      where.type = normalizedType;
    }

    return this.prisma.defaultCategory.findMany({
      where,
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
      },
    });
  }
}
