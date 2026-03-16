import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId },
      select: { id: true },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const date = new Date(dto.date);
    const [expense] = await this.prisma.$transaction([
      this.prisma.expense.create({
        data: {
          userId,
          walletId: dto.walletId,
          title: dto.title,
          category: dto.category,
          amount: dto.amount,
          date,
          note: dto.note,
          receiptUrl: dto.receiptUrl,
        },
      }),
      this.prisma.wallet.update({
        where: { id: dto.walletId },
        data: { balance: { decrement: dto.amount } },
      }),
    ]);

    await this.prisma.transaction.create({
      data: {
        userId,
        walletId: dto.walletId,
        type: 'EXPENSE',
        category: dto.category,
        amount: dto.amount,
        date,
        note: dto.note,
        expenseId: expense.id,
      },
    });

    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    const existing = await this.prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Expense not found');
    }

    const nextWalletId = dto.walletId ?? existing.walletId;
    const nextTitle = dto.title ?? existing.title;
    const nextAmount = dto.amount ?? Number(existing.amount);
    const nextCategory = dto.category ?? existing.category;
    const nextDate = dto.date ? new Date(dto.date) : existing.date;
    const nextNote = dto.note ?? existing.note;
    const nextReceiptUrl = dto.receiptUrl ?? existing.receiptUrl;

    const nextWallet = await this.prisma.wallet.findFirst({
      where: { id: nextWalletId, userId },
      select: { id: true },
    });
    if (!nextWallet) {
      throw new NotFoundException('Wallet not found');
    }

    const oldAmount = Number(existing.amount);
    const oldWalletId = existing.walletId;

    await this.prisma.$transaction(async (tx) => {
      await tx.expense.update({
        where: { id },
        data: {
          walletId: nextWalletId,
          title: nextTitle,
          amount: nextAmount,
          category: nextCategory,
          date: nextDate,
          note: nextNote,
          receiptUrl: nextReceiptUrl,
        },
      });

      if (oldWalletId === nextWalletId) {
        const diff = nextAmount - oldAmount;
        if (diff !== 0) {
          // expense decreases balance
          await tx.wallet.update({
            where: { id: oldWalletId },
            data: { balance: { decrement: diff } },
          });
        }
      } else {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { increment: oldAmount } },
        });
        await tx.wallet.update({
          where: { id: nextWalletId },
          data: { balance: { decrement: nextAmount } },
        });
      }

      await tx.transaction.updateMany({
        where: { expenseId: id, userId },
        data: {
          walletId: nextWalletId,
          type: 'EXPENSE',
          category: nextCategory,
          amount: nextAmount,
          date: nextDate,
          note: nextNote,
        },
      });
    });

    return this.prisma.expense.findUnique({ where: { id } });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Expense not found');
    }

    const amount = Number(existing.amount);
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({ where: { expenseId: id, userId } }),
      this.prisma.expense.delete({ where: { id } }),
      this.prisma.wallet.update({
        where: { id: existing.walletId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return { success: true };
  }
}
