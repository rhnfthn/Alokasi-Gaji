import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';

@Injectable()
export class GoalContributionsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeUserId(userId: unknown): string {
    if (typeof userId === 'string') {
      return userId;
    }

    if (userId && typeof userId === 'object') {
      const maybeSub = (userId as { sub?: unknown }).sub;
      if (typeof maybeSub === 'string') {
        return maybeSub;
      }
    }

    throw new BadRequestException('Invalid user');
  }

  async list(userId: string) {
    const normalizedUserId = this.normalizeUserId(userId);
    return this.prisma.goalContribution.findMany({
      where: { userId: normalizedUserId },
      include: {
        goal: true,
        wallet: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async listByGoal(userId: string, goalId: string) {
    const normalizedUserId = this.normalizeUserId(userId);
    return this.prisma.goalContribution.findMany({
      where: { userId: normalizedUserId, goalId },
      include: {
        wallet: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateGoalContributionDto) {
    const normalizedUserId = this.normalizeUserId(userId);
    // Validate wallet
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId: normalizedUserId },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if wallet has enough balance
    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Validate goal
    const goal = await this.prisma.goal.findFirst({
      where: { id: dto.goalId, userId: normalizedUserId },
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const date = new Date(dto.date);

    const [createdContribution] = await this.prisma.$transaction([
      this.prisma.goalContribution.create({
        data: {
          userId: normalizedUserId,
          goalId: dto.goalId,
          walletId: dto.walletId,
          amount: dto.amount,
          date,
          note: dto.note,
        },
      }),
      this.prisma.wallet.update({
        where: { id: dto.walletId },
        data: { balance: { decrement: dto.amount } },
      }),

      this.prisma.goal.update({
        where: { id: dto.goalId },
        data: { savedAmount: { increment: dto.amount } },
      }),

      this.prisma.transaction.create({
        data: {
          userId: normalizedUserId,
          walletId: dto.walletId,
          type: 'GOAL_CONTRIBUTION',
          amount: dto.amount,
          date,
          note: dto.note,
        },
      }),
    ]);

    return this.prisma.goalContribution.findUniqueOrThrow({
      where: { id: createdContribution.id },
      include: {
        goal: true,
        wallet: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const normalizedUserId = this.normalizeUserId(userId);
    const existing = await this.prisma.goalContribution.findFirst({
      where: { id, userId: normalizedUserId },
    });
    if (!existing) {
      throw new NotFoundException('Goal contribution not found');
    }

    const amount = Number(existing.amount);

    await this.prisma.$transaction([
      this.prisma.goalContribution.delete({ where: { id } }),
      this.prisma.wallet.update({
        where: { id: existing.walletId },
        data: { balance: { increment: amount } },
      }),

      this.prisma.goal.update({
        where: { id: existing.goalId },
        data: { savedAmount: { decrement: amount } },
      }),
    ]);

    return { success: true };
  }
}
