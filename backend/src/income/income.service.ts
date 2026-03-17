import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateIncomeDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId },
      select: { id: true },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Validate goal if goalId provided
    if (dto.goalId) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: dto.goalId, userId },
        select: { id: true },
      });
      if (!goal) {
        throw new NotFoundException('Goal not found');
      }
    }

    const date = new Date(dto.date);

    const [income] = await this.prisma.$transaction(async (tx) => {
      const createdIncome = await tx.income.create({
        data: {
          userId,
          walletId: dto.walletId,
          goalId: dto.goalId,
          category: dto.category,
          amount: dto.amount,
          date,
          note: dto.note,
        },
      });

      await tx.wallet.update({
        where: { id: dto.walletId },
        data: { balance: { increment: dto.amount } },
      });

      // Update goal if goalId provided
      if (dto.goalId) {
        await tx.goal.update({
          where: { id: dto.goalId },
          data: { savedAmount: { increment: dto.amount } },
        });
      }

      return [createdIncome];
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        walletId: dto.walletId,
        type: dto.goalId ? 'GOAL_CONTRIBUTION' : 'INCOME',
        category: dto.category,
        amount: dto.amount,
        date,
        note: dto.note,
        incomeId: income.id,
      },
    });

    return income;
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    const existing = await this.prisma.income.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Income not found');
    }

    const nextWalletId = dto.walletId ?? existing.walletId;
    const nextGoalId = dto.goalId !== undefined ? dto.goalId : existing.goalId;
    const nextAmount = dto.amount ?? Number(existing.amount);
    const nextCategory = dto.category ?? existing.category;
    const nextDate = dto.date ? new Date(dto.date) : existing.date;
    const nextNote = dto.note ?? existing.note;

    const nextWallet = await this.prisma.wallet.findFirst({
      where: { id: nextWalletId, userId },
      select: { id: true },
    });
    if (!nextWallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Validate new goal if provided
    if (nextGoalId) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: nextGoalId, userId },
        select: { id: true },
      });
      if (!goal) {
        throw new NotFoundException('Goal not found');
      }
    }

    const oldAmount = Number(existing.amount);
    const oldWalletId = existing.walletId;
    const oldGoalId = existing.goalId;

    await this.prisma.$transaction(async (tx) => {
      await tx.income.update({
        where: { id },
        data: {
          walletId: nextWalletId,
          goalId: nextGoalId,
          amount: nextAmount,
          category: nextCategory,
          date: nextDate,
          note: nextNote,
        },
      });

      // Handle wallet balance changes
      if (oldWalletId === nextWalletId) {
        const diff = nextAmount - oldAmount;
        if (diff !== 0) {
          await tx.wallet.update({
            where: { id: oldWalletId },
            data: { balance: { increment: diff } },
          });
        }
      } else {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { decrement: oldAmount } },
        });
        await tx.wallet.update({
          where: { id: nextWalletId },
          data: { balance: { increment: nextAmount } },
        });
      }

      // Handle goal savedAmount changes
      if (oldGoalId !== nextGoalId) {
        // Remove from old goal
        if (oldGoalId) {
          await tx.goal.update({
            where: { id: oldGoalId },
            data: { savedAmount: { decrement: oldAmount } },
          });
        }
        // Add to new goal
        if (nextGoalId) {
          await tx.goal.update({
            where: { id: nextGoalId },
            data: { savedAmount: { increment: nextAmount } },
          });
        }
      } else if (oldGoalId && nextGoalId) {
        // Same goal, but amount changed
        const diff = nextAmount - oldAmount;
        if (diff !== 0) {
          await tx.goal.update({
            where: { id: nextGoalId },
            data: { savedAmount: { increment: diff } },
          });
        }
      }

      await tx.transaction.updateMany({
        where: { incomeId: id, userId },
        data: {
          walletId: nextWalletId,
          type: nextGoalId ? 'GOAL_CONTRIBUTION' : 'INCOME',
          category: nextCategory,
          amount: nextAmount,
          date: nextDate,
          note: nextNote,
        },
      });
    });

    return this.prisma.income.findUnique({ where: { id } });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.income.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Income not found');
    }

    const amount = Number(existing.amount);
    await this.prisma.$transaction(async (tx) => {
      await tx.transaction.deleteMany({ where: { incomeId: id, userId } });
      await tx.income.delete({ where: { id } });
      await tx.wallet.update({
        where: { id: existing.walletId },
        data: { balance: { decrement: amount } },
      });

      // Decrement goal savedAmount if linked to a goal
      if (existing.goalId) {
        await tx.goal.update({
          where: { id: existing.goalId },
          data: { savedAmount: { decrement: amount } },
        });
      }
    });

    return { success: true };
  }
}
