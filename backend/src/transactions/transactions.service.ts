import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    userId: string,
    query?: { walletId?: string; type?: TransactionType },
  ) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(query?.walletId ? { walletId: query.walletId } : {}),
        ...(query?.type ? { type: query.type } : {}),
      },
      include: {
        wallet: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async get(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        wallet: { select: { id: true, name: true, currency: true } },
        income: true,
        expense: true,
      },
    });
    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    return tx;
  }

  async exportCsv(userId: string) {
    const rows = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const header = [
      'id',
      'type',
      'walletId',
      'category',
      'amount',
      'date',
      'note',
    ];
    const lines = [header.join(',')];
    for (const row of rows) {
      const values = [
        row.id,
        row.type,
        row.walletId,
        row.category ?? '',
        row.amount.toString(),
        row.date.toISOString(),
        (row.note ?? '').replaceAll('"', '""'),
      ].map((v) => `"${String(v)}"`);
      lines.push(values.join(','));
    }
    return lines.join('\n');
  }

  async importCsv(userId: string, csv: string) {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new BadRequestException(
        'CSV must include a header and at least 1 row',
      );
    }

    // Expected header: type,walletId,category,amount,date,note
    const header = lines[0].toLowerCase();
    if (!header.includes('type') || !header.includes('walletid')) {
      throw new BadRequestException(
        'CSV header must include type and walletId',
      );
    }

    const createdIds: string[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (let i = 1; i < lines.length; i++) {
        const raw = lines[i];
        const cols = raw.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

        const [type, walletId, category, amountStr, dateStr, note] = cols;

        if (!type || !walletId || !amountStr || !dateStr) {
          continue;
        }

        const wallet = await tx.wallet.findFirst({
          where: { id: walletId, userId },
          select: { id: true },
        });
        if (!wallet) {
          continue;
        }

        const amount = Number(amountStr);
        if (!Number.isFinite(amount)) {
          continue;
        }

        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) {
          continue;
        }

        if (!Object.values(TransactionType).includes(type as TransactionType)) {
          continue;
        }

        const txType = type as TransactionType;

        const createdTx = await tx.transaction.create({
          data: {
            userId,
            walletId,
            type: txType,
            category: category || null,
            amount,
            date,
            note: note || null,
          },
        });
        createdIds.push(createdTx.id);

        if (txType === TransactionType.INCOME) {
          await tx.wallet.update({
            where: { id: walletId },
            data: { balance: { increment: amount } },
          });
        } else if (txType === TransactionType.EXPENSE) {
          await tx.wallet.update({
            where: { id: walletId },
            data: { balance: { decrement: amount } },
          });
        }
      }
    });

    return { success: true, created: createdIds.length };
  }
}
