import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
          take: 5, // Latest 5 contributions per goal
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        targetAmount: dto.targetAmount,
        savedAmount: dto.savedAmount ?? 0,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return this.prisma.goal.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.targetAmount !== undefined
          ? { targetAmount: dto.targetAmount }
          : {}),
        ...(dto.savedAmount !== undefined
          ? { savedAmount: dto.savedAmount }
          : {}),
        ...(dto.deadline !== undefined
          ? { deadline: dto.deadline ? new Date(dto.deadline) : null }
          : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    await this.prisma.goal.delete({ where: { id } });
    return { success: true };
  }
}
